const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollmentModel");
const { HttpError, parseId } = require("../utils/httpError");

const wrap = (fn) => (req, res, next) => {
  try { fn(req, res); } catch (err) { next(err); }
};

function parseMarks(value) {
  const m = Number(value);
  if (value === null || value === "" || !Number.isInteger(m) || m < 0 || m > 100)
    throw new HttpError(400, "'marks' must be a whole number between 0 and 100.");
  return m;
}

// GET /enrollments
router.get("/", wrap((req, res) => {
  const data = Enrollment.getAll();
  res.status(200).json({ success: true, count: data.length, data });
}));

// POST /enrollments  { student_id, subject_id, marks? }
router.post("/", wrap((req, res) => {
  const { student_id, subject_id, marks } = req.body || {};
  if (!student_id || !subject_id)
    throw new HttpError(400, "Both 'student_id' and 'subject_id' are required.");
  const data = Enrollment.create(
    parseId(student_id, "student_id"),
    parseId(subject_id, "subject_id"),
    marks === undefined ? null : parseMarks(marks)
  );
  res.status(201).json({ success: true, message: "Enrollment created successfully.", data });
}));

// PUT /enrollments/:id  { marks }
router.put("/:id", wrap((req, res) => {
  const id = parseId(req.params.id, "enrollment id");
  const data = Enrollment.updateMarks(id, parseMarks((req.body || {}).marks));
  if (!data) throw new HttpError(404, `Enrollment with id ${id} not found.`);
  res.status(200).json({ success: true, message: "Marks updated successfully.", data });
}));

// DELETE /enrollments/:id
router.delete("/:id", wrap((req, res) => {
  const id = parseId(req.params.id, "enrollment id");
  const data = Enrollment.remove(id);
  if (!data) throw new HttpError(404, `Enrollment with id ${id} not found.`);
  res.status(200).json({ success: true, message: "Enrollment deleted successfully.", data });
}));

module.exports = router;
