-- ============================================================
--  Student Management System  |  DBMS Project  |  Schema (3NF)
-- ============================================================
PRAGMA foreign_keys = ON;

DROP VIEW  IF EXISTS vw_student_results;
DROP TRIGGER IF EXISTS trg_enrollment_same_program;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS programs;

-- 1) PROGRAMS (BCA, BTech, MCA ...)
CREATE TABLE programs (
    program_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    program_name    TEXT    NOT NULL UNIQUE,
    duration_years  INTEGER NOT NULL CHECK (duration_years BETWEEN 1 AND 6)
);

-- 2) STUDENTS  (each student belongs to exactly one program)
CREATE TABLE students (
    student_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL CHECK (length(trim(name)) > 0),
    email       TEXT    UNIQUE,
    program_id  INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (program_id) REFERENCES programs(program_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_students_program ON students(program_id);

-- 3) SUBJECTS  (each subject is taught in one program)
CREATE TABLE subjects (
    subject_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name  TEXT    NOT NULL,
    credits       INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 6),
    program_id    INTEGER NOT NULL,
    UNIQUE (subject_name, program_id),
    FOREIGN KEY (program_id) REFERENCES programs(program_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4) ENROLLMENTS  (junction table: Students M:N Subjects)
CREATE TABLE enrollments (
    enrollment_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id     INTEGER NOT NULL,
    subject_id     INTEGER NOT NULL,
    marks          INTEGER CHECK (marks IS NULL OR marks BETWEEN 0 AND 100),
    enrolled_on    TEXT    NOT NULL DEFAULT (date('now')),
    UNIQUE (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_subject ON enrollments(subject_id);

-- TRIGGER: a student can enrol only in subjects of his/her own program
CREATE TRIGGER trg_enrollment_same_program
BEFORE INSERT ON enrollments
FOR EACH ROW
WHEN (SELECT program_id FROM students WHERE student_id = NEW.student_id)
  <> (SELECT program_id FROM subjects WHERE subject_id = NEW.subject_id)
BEGIN
    SELECT RAISE(ABORT, 'Student can enrol only in subjects of their own program.');
END;

-- VIEW: result sheet (joins 4 tables + grade calculation)
CREATE VIEW vw_student_results AS
SELECT  e.enrollment_id,
        s.student_id,
        s.name          AS student_name,
        p.program_name  AS program,
        sub.subject_id,
        sub.subject_name,
        sub.credits,
        e.marks,
        CASE
            WHEN e.marks IS NULL THEN 'N/A'
            WHEN e.marks >= 90   THEN 'A+'
            WHEN e.marks >= 80   THEN 'A'
            WHEN e.marks >= 70   THEN 'B'
            WHEN e.marks >= 60   THEN 'C'
            WHEN e.marks >= 40   THEN 'D'
            ELSE 'F'
        END AS grade
FROM enrollments e
JOIN students s   ON s.student_id  = e.student_id
JOIN subjects sub ON sub.subject_id = e.subject_id
JOIN programs p   ON p.program_id  = s.program_id;
