const express = require("express");
const router = express.Router();
const Student = require("../models/studentModel");
const { HttpError, parseId } = require("../utils/httpError");

// Wrap handlers so that thrown errors reach the central error handler
const wrap = (fn) => (req, res, next) => {
  try {
    fn(req, res);
  } catch (err) {
    next(err);
  }
};

// GET /students            -> all students (optional ?course=BCA)
router.get("/", wrap((req, res) => {
  const data = Student.getAll(req.query.course);
  res.status(200).json({ success: true, count: data.length, data });
}));

// GET /students/:id        -> one student
router.get("/:id", wrap((req, res) => {
  const id = parseId(req.params.id, "student id");
  const student = Student.getById(id);
  if (!student) throw new HttpError(404, `Student with id ${id} not found.`);
  res.status(200).json({ success: true, data: student });
}));

// GET /students/:id/results -> marks & grades of a student (uses the SQL view)
router.get("/:id/results", wrap((req, res) => {
  const id = parseId(req.params.id, "student id");
  const student = Student.getById(id);
  if (!student) throw new HttpError(404, `Student with id ${id} not found.`);
  res.status(200).json({ success: true, student, results: Student.getResults(id) });
}));

// POST /students          -> create
router.post("/", wrap((req, res) => {
  const { name, course, email } = req.body || {};
  if (!name || !course) throw new HttpError(400, "Both 'name' and 'course' fields are required.");
  const data = Student.create({ name, course, email });
  res.status(201).json({ success: true, message: "Student created successfully.", data });
}));

// PUT /students/:id       -> update
router.put("/:id", wrap((req, res) => {
  const id = parseId(req.params.id, "student id");
  const { name, course, email } = req.body || {};
  if (!name && !course && email === undefined)
    throw new HttpError(400, "Provide at least 'name', 'course' or 'email' to update.");
  const data = Student.update(id, { name, course, email });
  if (!data) throw new HttpError(404, `Student with id ${id} not found.`);
  res.status(200).json({ success: true, message: "Student updated successfully.", data });
}));

// DELETE /students/:id    -> delete (his enrollments are deleted automatically: ON DELETE CASCADE)
router.delete("/:id", wrap((req, res) => {
  const id = parseId(req.params.id, "student id");
  const data = Student.remove(id);
  if (!data) throw new HttpError(404, `Student with id ${id} not found.`);
  res.status(200).json({ success: true, message: "Student deleted successfully.", data });
}));

module.exports = router;
