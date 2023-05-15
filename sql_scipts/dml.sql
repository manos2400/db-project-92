-- Insert managers and admins
INSERT INTO users (username, password, real_name, date_of_birth, email, address, phone_number, type, total_books)
VALUES
("manager1", "password1", "John Smith", "1985-05-10", "manager1@school.edu", "123 Main St", "555-1234", "manager", NULL),
("manager2", "password2", "Jane Johnson", "1978-08-12", "manager2@school.edu", "456 Oak St", "555-5678", "manager", NULL),
("manager3", "password3", "Mark Miller", "1990-03-21", "manager3@school.edu", "789 Maple Ave", "555-9012", "manager", NULL),
("admin1", "password4", "Sarah Lee", "1987-11-05", "admin1@school.edu", "111 Elm St", "555-1111", "admin", NULL),
("admin2", "password5", "David Chen", "1975-02-28", "admin2@school.edu", "222 Pine St", "555-2222", "admin", NULL);

INSERT INTO users (username, password, real_name, date_of_birth, email, address, phone_number, type, total_books)
VALUES
("student1", "password6", "Emily Davis", "2007-09-01", "student1@school.edu", "123 Main St", "555-1234", "student", 3),
("student2", "password7", "Jacob Rodriguez", "2006-10-12", "student2@school.edu", "456 Oak St", "555-5678", "student", 0),
("student3", "password8", "Madison Martinez", "2008-03-21", "student3@school.edu", "789 Maple Ave", "555-9012", "student", 2),
("student4", "password9", "Ethan Johnson", "2006-05-30", "student4@school.edu", "111 Elm St", "555-1111", "student", 1),
("student5", "password10", "Isabella Martinez", "2007-01-02", "student5@school.edu", "222 Pine St", "555-2222", "student", 4),
("student6", "password11", "Michael Lee", "2006-08-14", "student6@school.edu", "333 Maple St", "555-3333", "student", 2),
("student7", "password12", "Sophia Chen", "2007-03-27", "student7@school.edu", "444 Cedar St", "555-4444", "student", 0),
("student8", "password13", "Daniel Brown", "2008-04-15", "student8@school.edu", "555 Oak St", "555-5555", "student", 3),
("student9", "password14", "Mia Taylor", "2007-06-08", "student9@school.edu", "666 Maple St", "555-6666", "student", 1),
("student10", "password15", "William Rodriguez", "2006-02-09", "student10@school.edu", "777 Elm St", "555-7777", "student", 0),
("student11", "password16", "Chloe Garcia", "2007-09-17", "student11@school.edu", "888 Pine St", "555-8888", "student", 2),
("student12", "password17", "Andrew Perez", "2006-11-20", "student12@school.edu", "999 Maple St", "555-9999", "student", 4),
("student13", "password18", "Abigail Hernandez", "2008-01-01", "student13@school.edu", "1010 Cedar St", "555-1010", "student", 0),
("student14", "password19", "Joshua Smith", "2006-07-07", "student14@school.edu", "1111 Oak St", "555-1112", "student", 1),
("student15", "password20", "Emma Nguyen", "2007-02-14", "student15@school.edu", "1212 Maple St", "555-1212", "student", 3),
("student16", "password21", "Christopher Wilson", "2006-09-23", "student16@school.edu", "1313 Elm St", "555-1313", "student", 0),
("student17", "password22", "Olivia Davis", "2007-05-06", "student17@school.edu", "1414 Pine St", "555-1414", "student", 2),
("student18", "password23", "David Rodriguez", "2006-12-15", "student18@school.edu", "1515 Maple St", "555-1515", "student", 1),
("student19", "password24", "Ava Martinez", "2008-02-22", "student19@school.edu", "1616 Cedar St", "555-1616", "student", 2),
("student20", "password25", "Elijah Thompson", "2007-10-03", "student20@school.edu", "1717 Oak St", "555-1717", "student", 0),
("student21", "password26", "Emily Perez", "2006-04-07", "student21@school.edu", "1818 Maple St", "555-1818", "student", 1),
("student22", "password27", "Aiden Garcia", "2007-11-11", "student22@school.edu", "1919 Elm St", "555-1919", "student", 3),
("student23", "password28", "Madison Hernandez", "2006-09-14", "student23@school.edu", "2020 Pine St", "555-2020", "student", 2),
("student24", "password29", "Jackson Davis", "2007-06-17", "student24@school.edu", "2121 Maple St", "555-2121", "student", 0),
("student25", "password30", "Avery Wilson", "2006-02-20", "student25@school.edu", "2222 Cedar St", "555-2222", "student", 1),
("student26", "password31", "Caleb Brown", "2008-03-23", "student26@school.edu", "2323 Oak St", "555-2323", "student", 4),
("student27", "password32", "Ella Lee", "2007-01-26", "student27@school.edu", "2424 Maple St", "555-2424", "student", 1),
("student28", "password33", "Lucas Chen", "2006-08-29", "student28@school.edu", "2525 Elm St", "555-2525", "student", 0),
("student29", "password34", "Natalie Taylor", "2007-04-02", "student29@school.edu", "2626 Pine St", "555-2626", "student", 2),
("student30", "password35", "Mason Martinez", "2006-12-05", "student30@school.edu", "2727 Maple St", "555-2727", "student", 3);

-- Insert Teachers
INSERT INTO users (username, password, real_name, date_of_birth, email, address, phone_number, type, total_books)
VALUES
("teacher1", "password36", "Maria Garcia", "1985-09-03", "teacher1@school.edu", "1010 Oak St", "555-1010", "teacher", 0),
("teacher2", "password37", "David Brown", "1983-05-07", "teacher2@school.edu", "1111 Maple St", "555-1111", "teacher", 2),
("teacher3", "password38", "Angela Rodriguez", "1984-11-11", "teacher3@school.edu", "1212 Elm St", "555-1212", "teacher", 1),
("teacher4", "password39", "James Wilson", "1982-09-14", "teacher4@school.edu", "1313 Pine St", "555-1313", "teacher", 0),
("teacher5", "password40", "Sarah Smith", "1985-06-17", "teacher5@school.edu", "1414 Maple St", "555-1414", "teacher", 3),
("teacher6", "password41", "Juan Hernandez", "1983-02-20", "teacher6@school.edu", "1515 Cedar St", "555-1515", "teacher", 0),
("teacher7", "password42", "Emily Davis", "1986-03-23", "teacher7@school.edu", "1616 Oak St", "555-1616", "teacher", 1),
("teacher8", "password43", "Anthony Lee", "1984-01-26", "teacher8@school.edu", "1717 Maple St", "555-1717", "teacher", 2),
("teacher9", "password44", "Jessica Chen", "1983-08-29", "teacher9@school.edu", "1818 Elm St", "555-1818", "teacher", 1),
("teacher10", "password45", "Ryan Taylor", "1985-04-02", "teacher10@school.edu", "1919 Pine St", "555-1919", "teacher", 3);

-- Insert schools
INSERT INTO schools (name, address, city, phone_number, email, principal_name, library_manager_id)
VALUES
("Smith Elementary School", "123 Main St", "Anytown", "555-1234", "smith@elementary.edu", "John Smith", 1),
("Johnson Middle School", "456 Oak St", "Anytown", "555-5678", "johnson@middle.edu", "Jane Johnson", 2),
("Miller High School", "789 Maple Ave", "Anytown", "555-9012", "miller@high.edu", "Mark Miller", 3);

-- TODO: Insert Books
-- TODO: Insert Authors
-- TODO: Insert categories