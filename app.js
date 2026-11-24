const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const db = require("./db/database"); // connects to the SQLite database on start-up

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom logger middleware (logs method, url, time for every request)
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Student Management REST API is running.",
    endpoints: [
      "GET /students",
      "GET /students/:id",
      "POST /students",
      "PUT /students/:id",
      "DELETE /students/:id",
      "GET /students/:id/results",
      "GET /programs",
      "GET /subjects",
      "GET /enrollments",
      "POST /enrollments",
      "PUT /enrollments/:id",
      "DELETE /enrollments/:id",
      "GET /reports/program-summary",
      "GET /reports/toppers"
    ]
  });
});

// Modular student routes
app.use("/students", studentRoutes);
app.use("/", catalogRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/reports", reportRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  // Database errors -> proper HTTP codes
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    status = 409;
    message = "Duplicate value: this email / enrollment already exists.";
  } else if (typeof err.code === "string" && err.code.startsWith("SQLITE_CONSTRAINT")) {
    status = 400;
  }

  if (status >= 500) {
    console.error(err.stack);
    message = "Internal Server Error";
  }
  res.status(status).json({ success: false, message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Connected to database:", db.name);
  });
}

module.exports = app;
