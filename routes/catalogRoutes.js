const express = require("express");
const router = express.Router();
const Catalog = require("../models/catalogModel");

// GET /programs
router.get("/programs", (req, res, next) => {
  try {
    const data = Catalog.getPrograms();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
});

// GET /subjects  (optional ?program=BCA)
router.get("/subjects", (req, res, next) => {
  try {
    const data = Catalog.getSubjects(req.query.program);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
});

module.exports = router;
