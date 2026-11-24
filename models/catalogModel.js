const db = require("../db/database");

function getPrograms() {
  return db
    .prepare(
      `SELECT p.program_id AS id, p.program_name AS name, p.duration_years,
              COUNT(s.student_id) AS total_students
       FROM programs p LEFT JOIN students s ON s.program_id = p.program_id
       GROUP BY p.program_id ORDER BY p.program_id`
    )
    .all();
}

function getSubjects(program) {
  const sql = `SELECT sub.subject_id AS id, sub.subject_name AS name, sub.credits, p.program_name AS program
               FROM subjects sub JOIN programs p ON p.program_id = sub.program_id`;
  if (program) return db.prepare(`${sql} WHERE p.program_name = ? COLLATE NOCASE ORDER BY sub.subject_id`).all(program);
  return db.prepare(`${sql} ORDER BY sub.subject_id`).all();
}

module.exports = { getPrograms, getSubjects };
