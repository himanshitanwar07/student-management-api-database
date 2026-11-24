const db = require("../db/database");
const { HttpError } = require("../utils/httpError");

const BASE = "SELECT * FROM vw_student_results";

function getAll() {
  return db.prepare(`${BASE} ORDER BY enrollment_id`).all();
}

function getById(id) {
  return db.prepare(`${BASE} WHERE enrollment_id = ?`).get(id);
}

function create(studentId, subjectId, marks) {
  if (!db.prepare("SELECT 1 FROM students WHERE student_id = ?").get(studentId))
    throw new HttpError(404, `Student with id ${studentId} not found.`);
  if (!db.prepare("SELECT 1 FROM subjects WHERE subject_id = ?").get(subjectId))
    throw new HttpError(404, `Subject with id ${subjectId} not found.`);

  // The trigger in schema.sql rejects a subject from a different program
  const info = db
    .prepare("INSERT INTO enrollments (student_id, subject_id, marks) VALUES (?, ?, ?)")
    .run(studentId, subjectId, marks ?? null);
  return getById(info.lastInsertRowid);
}

function updateMarks(id, marks) {
  const info = db.prepare("UPDATE enrollments SET marks = ? WHERE enrollment_id = ?").run(marks, id);
  return info.changes ? getById(id) : null;
}

function remove(id) {
  const row = getById(id);
  if (!row) return null;
  db.prepare("DELETE FROM enrollments WHERE enrollment_id = ?").run(id);
  return row;
}

module.exports = { getAll, getById, create, updateMarks, remove };
