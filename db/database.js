// Database connection (SQLite via better-sqlite3)
// If the .db file is missing / empty, it is created automatically from schema.sql + seed.sql
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "students.db");
const db = new Database(DB_PATH);

db.pragma("foreign_keys = ON"); // SQLite needs this on every connection

function initialise() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
  db.exec(schema);
  db.exec(seed);
  db.pragma("foreign_keys = ON");
}

const hasTables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students'")
  .get();
if (!hasTables) {
  initialise();
  console.log("Database created and seeded:", DB_PATH);
}

module.exports = db;
module.exports.initialise = initialise;
