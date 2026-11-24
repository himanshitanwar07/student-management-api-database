const db = require("../db/database");
const { HttpError } = require("../utils/httpError");

// "course" in the API = program_name in the DB (kept for backward compatibility)
const BASE = `
  SELECT s.student_id AS id, s.name, s.email, p.program_name AS course
  FROM students s
  JOIN programs p ON p.program_id = s.program_id`;

function findProgramId(course) {
  const row = db
    .prepare("SELECT program_id FROM programs WHERE program_name = ? COLLATE NOCASE")
    .get(String(course).trim());
  if (!row) {
    const all = db.prepare("SELECT program_name FROM programs").all().map((p) => p.program_name);
    throw new HttpError(400, `Unknown course '${course}'. Available: ${all.join(", ")}`);
  }
  return row.program_id;
}

function getAll(course) {
  if (course) return db.prepare(`${BASE} WHERE p.program_name = ? COLLATE NOCASE ORDER BY s.student_id`).all(course);
  return db.prepare(`${BASE} ORDER BY s.student_id`).all();
}

function getById(id) {
  return db.prepare(`${BASE} WHERE s.student_id = ?`).get(id);
}

function create({ name, course, email }) {
  const programId = findProgramId(course);
  const info = db
    .prepare("INSERT INTO students (name, email, program_id) VALUES (?, ?, ?)")
    .run(String(name).trim(), email || null, programId);
  return getById(info.lastInsertRowid);
}

function update(id, { name, course, email }) {
  const current = db.prepare("SELECT * FROM students WHERE student_id = ?").get(id);
  if (!current) return null;
  const programId = course ? findProgramId(course) : current.program_id;
  db.prepare("UPDATE students SET name = ?, email = ?, program_id = ? WHERE student_id = ?").run(
    name ? String(name).trim() : current.name,
    email !== undefined ? email || null : current.email,
    programId,
    id
  );
  return getById(id);
}

function remove(id) {
  const student = getById(id);
  if (!student) return null;
  db.prepare("DELETE FROM students WHERE student_id = ?").run(id); // enrollments cascade
  return student;
}

function getResults(id) {
  return db
    .prepare(
      `SELECT enrollment_id, subject_name, credits, marks, grade
       FROM vw_student_results WHERE student_id = ? ORDER BY subject_name`
    )
    .all(id);
}

module.exports = { getAll, getById, create, update, remove, getResults };
