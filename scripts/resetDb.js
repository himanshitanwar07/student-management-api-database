// npm run db:reset  -> drops all tables and re-creates them with sample data
const db = require("../db/database");
db.initialise();
console.log("Database reset done.");
console.log("Students:", db.prepare("SELECT COUNT(*) c FROM students").get().c);
