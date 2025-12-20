import dotenv from "dotenv";
dotenv.config();

import { exec } from "child_process";
import fs from "fs";
import path from "path";

const BACKUP_DIR = "backups";

const runBackup = () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in .env");
        process.exit(1);
    }

    const date = new Date().toISOString().split("T")[0];
    const outputPath = path.join(BACKUP_DIR, `backup-${date}`);

    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR);
    }

    const command = `mongodump --uri="${process.env.MONGO_URI}" --out="${outputPath}"`;

    exec(command, (error) => {
        if (error) {
            console.error(" Backup failed:", error.message);
            return;
        }
        console.log(" Backup completed:", outputPath);
    });
};

runBackup();
