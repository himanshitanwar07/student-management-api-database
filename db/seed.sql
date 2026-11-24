-- Sample data (first 3 students are the same as the old in-memory array)
INSERT INTO programs (program_name, duration_years) VALUES
  ('BCA', 3), ('BTech', 4), ('MCA', 2), ('MTech', 2);

INSERT INTO students (name, email, program_id) VALUES
  ('Rahul', 'rahul@example.com', 1),
  ('Priya', 'priya@example.com', 2),
  ('Amit',  'amit@example.com',  1),
  ('Neha',  'neha@example.com',  1),
  ('Karan', 'karan@example.com', 2);

INSERT INTO subjects (subject_name, credits, program_id) VALUES
  ('DBMS',             4, 1),
  ('Web Development',  4, 1),
  ('Data Structures',  4, 1),
  ('Operating Systems',4, 2),
  ('Computer Networks',3, 2),
  ('Data Structures',  4, 2),
  ('Advanced Java',    4, 3),
  ('Machine Learning', 4, 4);

INSERT INTO enrollments (student_id, subject_id, marks) VALUES
  (1, 1, 88), (1, 2, 92), (1, 3, 79),
  (2, 4, 85), (2, 5, 74), (2, 6, 91),
  (3, 1, 67), (3, 2, 58),
  (4, 1, 95), (4, 3, 81),
  (5, 4, 35), (5, 6, NULL);
