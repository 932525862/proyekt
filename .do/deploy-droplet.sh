#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_USER="novalab"
readonly APP_HOME="/home/novalab"
readonly APP_DIR="/home/novalab/app"
readonly DATA_DIR="/var/lib/novalab"
readonly ARCHIVE="/tmp/novalab-deploy.tar.gz"
readonly DB_SOURCE="/tmp/spectrum.db"
readonly SITE_URL="https://spectrum-peak.uz"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root: bash /tmp/deploy-droplet.sh" >&2
  exit 1
fi

if [[ ! -s "${ARCHIVE}" || ! -s "${DB_SOURCE}" ]]; then
  echo "Upload ${ARCHIVE} and ${DB_SOURCE} before running this script." >&2
  exit 1
fi

if [[ -e /etc/novalab.env ]]; then
  echo "/etc/novalab.env already exists. Refusing to overwrite production credentials." >&2
  exit 1
fi

. /etc/os-release
if [[ "${ID}" != "ubuntu" || "${VERSION_ID}" != "24.04" ]]; then
  echo "This setup expects Ubuntu 24.04; found ${PRETTY_NAME}." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg nginx ufw build-essential openssl

# A 2 GiB swap file gives Next.js build enough headroom on the 1 GiB Droplet.
if ! swapon --noheadings --show=NAME | grep -Fxq /swapfile; then
  if [[ ! -e /swapfile ]]; then
    if ! fallocate -l 2G /swapfile; then
      dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    fi
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Install the Node.js 22.x runtime required by package.json.
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/novalab-nodesource-setup.sh
bash /tmp/novalab-nodesource-setup.sh
apt-get install -y nodejs
rm -f /tmp/novalab-nodesource-setup.sh
node --version
npm --version

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --user-group --create-home --home-dir "${APP_HOME}" --shell /usr/sbin/nologin "${APP_USER}"
fi

install -d -m 0750 -o "${APP_USER}" -g "${APP_USER}" "${APP_DIR}" "${DATA_DIR}"
tar -xzf "${ARCHIVE}" -C "${APP_DIR}"

# Keep an existing production database intact; seed from the uploaded snapshot only on first setup.
if [[ ! -e "${DATA_DIR}/spectrum.db" ]]; then
  install -m 0640 -o "${APP_USER}" -g "${APP_USER}" "${DB_SOURCE}" "${DATA_DIR}/spectrum.db"
else
  echo "Found ${DATA_DIR}/spectrum.db; preserving the existing production database."
fi
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}" "${DATA_DIR}"

runuser -u "${APP_USER}" -- env HOME="${APP_HOME}" npm --prefix "${APP_DIR}" ci
runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NODE_ENV=production \
  NODE_OPTIONS=--max-old-space-size=1024 \
  NOVALAB_DATA_DIR="${DATA_DIR}" \
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  npm --prefix "${APP_DIR}" run build

read -r -p "Admin login [admin]: " ADMIN_LOGIN
ADMIN_LOGIN="${ADMIN_LOGIN:-admin}"
if [[ ! "${ADMIN_LOGIN}" =~ ^[A-Za-z0-9._-]{3,64}$ ]]; then
  echo "Use 3-64 letters, digits, dots, underscores, or hyphens for the login." >&2
  exit 1
fi

while true; do
  read -r -s -p "Choose admin password (16+ letters, digits, . _ -): " ADMIN_PASSWORD
  echo
  read -r -s -p "Repeat admin password: " ADMIN_PASSWORD_CONFIRM
  echo
  if [[ "${ADMIN_PASSWORD}" =~ ^[A-Za-z0-9._-]{16,128}$ && "${ADMIN_PASSWORD}" == "${ADMIN_PASSWORD_CONFIRM}" ]]; then
    break
  fi
  echo "Passwords must match and use at least 16 letters, digits, dots, underscores, or hyphens." >&2
done

AUTH_SECRET="$(openssl rand -hex 32)"
install -m 0640 -o root -g "${APP_USER}" /dev/null /etc/novalab.env
{
  printf 'NODE_ENV=production\n'
  printf 'PORT=3000\n'
  printf 'NOVALAB_DATA_DIR=%s\n' "${DATA_DIR}"
  printf 'NEXT_PUBLIC_SITE_URL=%s\n' "${SITE_URL}"
  printf 'ADMIN_LOGIN=%s\n' "${ADMIN_LOGIN}"
  printf 'ADMIN_PASSWORD=%s\n' "${ADMIN_PASSWORD}"
  printf 'AUTH_SECRET=%s\n' "${AUTH_SECRET}"
} > /etc/novalab.env
unset ADMIN_PASSWORD ADMIN_PASSWORD_CONFIRM AUTH_SECRET

cat > /etc/systemd/system/novalab.service <<'UNIT'
[Unit]
Description=NovaLab Next.js application
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=novalab
Group=novalab
WorkingDirectory=/home/novalab/app
EnvironmentFile=/etc/novalab.env
ExecStart=/usr/bin/node /home/novalab/app/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
UMask=0027

[Install]
WantedBy=multi-user.target
UNIT

cat > /etc/nginx/sites-available/novalab <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name spectrum-peak.uz www.spectrum-peak.uz;
    server_tokens off;
    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX

if [[ -e /etc/nginx/sites-enabled/default ]]; then
  unlink /etc/nginx/sites-enabled/default
fi
ln -sfn /etc/nginx/sites-available/novalab /etc/nginx/sites-enabled/novalab
nginx -t

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl daemon-reload
systemctl enable --now novalab.service
systemctl enable --now nginx.service
systemctl reload nginx.service

for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1/api/health; then
    echo
    echo "NovaLab is running at ${SITE_URL}"
    echo "Persistent database and uploads: ${DATA_DIR}"
    exit 0
  fi
  sleep 2
done

echo "Health check failed; recent application logs follow:" >&2
journalctl -u novalab.service -n 80 --no-pager >&2
exit 1
