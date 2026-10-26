#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_USER="novalab"
readonly APP_HOME="/home/novalab"
readonly APP_DIR="${APP_HOME}/app"
readonly DATA_DIR="/var/lib/novalab"
readonly ARCHIVE="/tmp/novalab-deploy-fix.tar.gz"
readonly SITE_URL="https://spectrum-peak.uz"
readonly SITE_HOST="${SITE_URL#https://}"
readonly RELEASE_ID="$(date -u +%Y%m%d%H%M%S)"
readonly STAGE_DIR="${APP_HOME}/app.next-${RELEASE_ID}"
readonly BACKUP_DIR="${APP_HOME}/app.backup-${RELEASE_ID}"
readonly FAILED_DIR="${APP_HOME}/app.failed-${RELEASE_ID}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this updater as root: bash /tmp/update-droplet.sh" >&2
  exit 1
fi

if [[ ! -s "${ARCHIVE}" || ! -s /etc/novalab.env || ! -d "${APP_DIR}" ]]; then
  echo "Expected the uploaded archive, production environment, and current app to exist." >&2
  exit 1
fi

if [[ ! -s "${DATA_DIR}/spectrum.db" ]] || ! grep -qx "NOVALAB_DATA_DIR=${DATA_DIR}" /etc/novalab.env; then
  echo "Persistent production database or expected data-directory setting is missing." >&2
  exit 1
fi

if [[ ! -d "${DATA_DIR}/uploads" ]]; then
  install -d -m 0750 -o "${APP_USER}" -g "${APP_USER}" "${DATA_DIR}/uploads"
fi

install -d -m 0750 -o "${APP_USER}" -g "${APP_USER}" "${STAGE_DIR}"
tar -xzf "${ARCHIVE}" -C "${STAGE_DIR}"
chown -R "${APP_USER}:${APP_USER}" "${STAGE_DIR}"

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NODE_ENV=production \
  NODE_OPTIONS=--max-old-space-size=1024 \
  NOVALAB_DATA_DIR="${DATA_DIR}" \
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  npm --prefix "${STAGE_DIR}" ci --include=dev

runuser -u "${APP_USER}" -- env \
  HOME="${APP_HOME}" \
  NODE_ENV=production \
  NODE_OPTIONS=--max-old-space-size=1024 \
  NOVALAB_DATA_DIR="${DATA_DIR}" \
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  npm --prefix "${STAGE_DIR}" run build

if ! grep -R -Fq '.flex{display:flex}' "${STAGE_DIR}/.next/static/css" || \
   ! grep -R -Fq '.grid{display:grid}' "${STAGE_DIR}/.next/static/css"; then
  echo "Production CSS is missing generated Tailwind layout utilities; current app is untouched." >&2
  exit 1
fi

systemctl stop novalab.service
mv "${APP_DIR}" "${BACKUP_DIR}"
if ! mv "${STAGE_DIR}" "${APP_DIR}"; then
  mv "${BACKUP_DIR}" "${APP_DIR}"
  systemctl start novalab.service
  echo "Could not activate the new release; restored the previous app." >&2
  exit 1
fi

systemctl start novalab.service

HEALTHY=0
for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3000/api/health >/dev/null && \
     curl -fsS --resolve "${SITE_HOST}:443:127.0.0.1" "${SITE_URL}/api/health" >/dev/null; then
    HEALTHY=1
    break
  fi
  sleep 2
done

if [[ "${HEALTHY}" -ne 1 ]]; then
  echo "The new release did not pass the health check; restoring the previous release." >&2
  systemctl stop novalab.service || true
  mv "${APP_DIR}" "${FAILED_DIR}"
  mv "${BACKUP_DIR}" "${APP_DIR}"
  systemctl start novalab.service
  journalctl -u novalab.service -n 60 --no-pager >&2
  exit 1
fi

echo "NovaLab updated successfully at ${SITE_URL}"
echo "Health checks passed through the app and Nginx."
echo "Persistent database and uploads remain in ${DATA_DIR}."
echo "Previous application release kept at ${BACKUP_DIR}."
