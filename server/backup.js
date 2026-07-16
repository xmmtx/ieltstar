// MongoDB backup script - run with: node backup.js
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const DB_NAME = process.env.DB_NAME || "ieltstar";
const BACKUP_DIR = path.resolve("./backups");
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const OUTPUT_FILE = path.join(BACKUP_DIR, `${DB_NAME}-${TIMESTAMP}.json`);

try {
  mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`Backing up ${DB_NAME}...`);
  execSync(`mongodump --db=${DB_NAME} --out="${BACKUP_DIR}/${TIMESTAMP}" --gzip`, { stdio: "inherit" });
  console.log(`Backup saved to ${BACKUP_DIR}/${TIMESTAMP}`);
} catch (e) {
  console.log("mongodump failed, trying mongoexport...");
  try {
    execSync(`mongoexport --db=${DB_NAME} --collection=exams --out="${OUTPUT_FILE}" --jsonArray`, { stdio: "inherit" });
    console.log(`Exported to ${OUTPUT_FILE}`);
  } catch (e2) {
    console.log("Ensure mongodump/mongoexport are in PATH or adjust for your setup.");
    console.log("Manual backup: copy the MongoDB data directory.");
  }
}
