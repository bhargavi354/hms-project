import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database file
const dbPath = path.join(__dirname, "hms.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.log("DB Error:", err);
    else console.log("SQLite DB Connected");
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS homeVisits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient TEXT,
            staff TEXT,
            visitType TEXT,
            date TEXT,
            time TEXT,
            notes TEXT,
            status TEXT
        )
    `);
});

export default db;
