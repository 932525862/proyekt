import "server-only";
import { join, resolve } from "node:path";

/**
 * Persistent local data root. On a Droplet, set NOVALAB_DATA_DIR=/var/lib/novalab
 * so deploys can replace the application directory without replacing its data.
 */
export const dataDir = resolve(process.env.NOVALAB_DATA_DIR?.trim() || join(process.cwd(), ".data"));

/** Local uploads live beside the SQLite database unless explicitly overridden. */
export const uploadsDir = resolve(process.env.UPLOADS_DIR?.trim() || join(dataDir, "uploads"));
