-- ============================================================
--  Practical SQL queries for the viva / practical file
--  Run them in DB Browser for SQLite  or:  sqlite3 db/students.db < db/queries.sql
-- ============================================================

-- Q1. All students with their program (INNER JOIN)
SELECT s.student_id, s.name, p.program_name
FROM students s JOIN programs p ON p.program_id = s.program_id;

-- Q2. Number of students in every program, including programs with 0 students (LEFT JOIN + GROUP BY)
SELECT p.program_name, COUNT(s.student_id) AS total_students
FROM programs p LEFT JOIN students s ON s.program_id = p.program_id
GROUP BY p.program_id;

-- Q3. Result sheet of one student (uses the VIEW)
SELECT subject_name, credits, marks, grade FROM vw_student_results WHERE student_name = 'Rahul';

-- Q4. Average marks per subject, only subjects with average above 70 (GROUP BY + HAVING)
SELECT subject_name, ROUND(AVG(marks), 2) AS avg_marks
FROM vw_student_results
GROUP BY subject_id
HAVING AVG(marks) > 70;

-- Q5. Student with the highest average marks (subquery)
SELECT name, avg_marks FROM (
    SELECT student_name AS name, AVG(marks) AS avg_marks
    FROM vw_student_results GROUP BY student_id
) ORDER BY avg_marks DESC LIMIT 1;

-- Q6. Students who are not enrolled in any subject (NOT EXISTS) - empty result if everyone is enrolled
SELECT name FROM students s
WHERE NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.student_id);

-- Q7. Students who failed at least one subject (marks < 40, IN subquery)
SELECT name FROM students
WHERE student_id IN (SELECT student_id FROM enrollments WHERE marks < 40);

-- Q8. Total credits taken by each student
SELECT s.name, SUM(sub.credits) AS total_credits
FROM students s
JOIN enrollments e  ON e.student_id = s.student_id
JOIN subjects sub   ON sub.subject_id = e.subject_id
GROUP BY s.student_id
ORDER BY total_credits DESC;

-- Q9. Subjects where marks are still pending (NULL)
SELECT student_name, subject_name FROM vw_student_results WHERE marks IS NULL;

-- Q10. Grade distribution
SELECT grade, COUNT(*) AS students FROM vw_student_results GROUP BY grade ORDER BY grade;

-- Q11. INSERT / UPDATE / DELETE examples
-- INSERT INTO students (name, email, program_id) VALUES ('Sneha', 'sneha@example.com', 3);
-- UPDATE enrollments SET marks = 90 WHERE student_id = 5 AND subject_id = 6;
-- DELETE FROM students WHERE student_id = 5;   -- his enrollments are removed too (ON DELETE CASCADE)

-- Q12. Trigger demo: this FAILS because subject 7 (Advanced Java) belongs to MCA, student 1 is in BCA
-- INSERT INTO enrollments (student_id, subject_id) VALUES (1, 7);
