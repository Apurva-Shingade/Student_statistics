CREATE TABLE student_records (
    id SERIAL PRIMARY KEY,
    student_name TEXT,
    standard INT, -- 1 to 10
    math FLOAT,
    science FLOAT,
    vocabulary FLOAT,
    sports FLOAT,
    passion FLOAT,
    certifications INT,

);