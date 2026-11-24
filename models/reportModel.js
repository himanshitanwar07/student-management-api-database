const db = require("../db/database");

// GROUP BY + aggregate functions + LEFT JOIN
function programSummary() {
  return db
    .prepare(
      `SELECT p.program_name AS program,
              COUNT(DISTINCT s.student_id) AS total_students,
              ROUND(AVG(e.marks), 2)       AS avg_marks
       FROM programs p
       LEFT JOIN students s    ON s.program_id = p.program_id
       LEFT JOIN enrollments e ON e.student_id = s.student_id
       GROUP BY p.program_id
       ORDER BY p.program_id`
    )
    .all();
}

// Top students by average marks
function toppers(limit = 3) {
  return db
    .prepare(
      `SELECT s.student_id AS id, s.name, p.program_name AS course,
              ROUND(AVG(e.marks), 2) AS avg_marks, COUNT(e.marks) AS subjects_graded
       FROM students s
       JOIN programs p    ON p.program_id = s.program_id
       JOIN enrollments e ON e.student_id = s.student_id
       WHERE e.marks IS NOT NULL
       GROUP BY s.student_id
       ORDER BY avg_marks DESC
       LIMIT ?`
    )
    .all(limit);
}

module.exports = { programSummary, toppers };
