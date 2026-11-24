const express = require("express");
const router = express.Router();
const Report = require("../models/reportModel");

// GET /reports/program-summary
router.get("/program-summary", (req, res, next) => {
  try { res.status(200).json({ success: true, data: Report.programSummary() }); }
  catch (err) { next(err); }
});

// GET /reports/toppers
router.get("/toppers", (req, res, next) => {
  try { res.status(200).json({ success: true, data: Report.toppers(3) }); }
  catch (err) { next(err); }
});

module.exports = router;
