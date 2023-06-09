CREATE DATABASE IF NOT EXISTS school_library_92;

USE school_library_92;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(45) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(90) NOT NULL,
  address VARCHAR(90) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  type ENUM ('admin', 'manager', 'student', 'teacher') NOT NULL
);

CREATE TABLE schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(90) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(90) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(90) NOT NULL,
  principal_name VARCHAR(90) NOT NULL
);

CREATE TABLE pending_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(45) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(90) NOT NULL,
  address VARCHAR(90) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  type ENUM ('admin', 'manager', 'student', 'teacher') NOT NULL,
  school_id INT NOT NULL,
  CONSTRAINT pu_school FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL UNIQUE,
  publisher VARCHAR(90) NOT NULL,
  isbn VARCHAR(13) NOT NULL,
  pages INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  language VARCHAR(45),
  keywords VARCHAR(255)
  );

CREATE TABLE authors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(90) NOT NULL UNIQUE
);

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE book_categories (
  book_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (book_id, category_id),
  CONSTRAINT bc_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT bc_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE book_authors (
  book_id INT NOT NULL,
  author_id INT NOT NULL,
  PRIMARY KEY (book_id, author_id),
  CONSTRAINT ba_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT ba_authors FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE school_books (
  book_id INT NOT NULL,
  school_id INT NOT NULL,
  quantity INT NOT NULL,
  available INT NOT NULL,
  PRIMARY KEY (book_id, school_id),
  CONSTRAINT sb_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT sb_schools FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE school_users (
  school_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (user_id, school_id),
  CONSTRAINT su_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT su_schools FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE loans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  school_id INT NOT NULL,
  date_out DATE NOT NULL,
  date_due DATE NOT NULL,
  date_in DATE,
  CONSTRAINT lo_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT lo_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT lo_schools FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE reservations (
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  school_id INT NOT NULL,
  waited BOOLEAN,
  date DATE NOT NULL,
  date_due DATE NOT NULL,
  PRIMARY KEY (user_id, book_id, school_id),
  CONSTRAINT res_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT res_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT res_schools FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE reviews (
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  date DATE NOT NULL,
  rating INT NOT NULL,
  review TEXT,
  PRIMARY KEY (user_id, book_id),
  CONSTRAINT rev_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT rev_books FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Indexes
CREATE INDEX rev_users ON reviews (user_id);
CREATE INDEX sb_books ON school_books (book_id);
CREATE INDEX users_name ON users (id, real_name);

-- Views
CREATE VIEW reservations_view AS
SELECT u.real_name, books.title, r.date, r.waited, r.date_due, r.user_id, r.book_id, r.school_id
FROM books
INNER JOIN reservations r ON books.id = r.book_id
INNER JOIN users u on r.user_id = u.id;

CREATE VIEW loans_view AS
SELECT u.real_name, books.title , l.date_out, l.date_due, l.date_in, l.user_id, l.book_id, l.school_id
FROM books
INNER JOIN loans l ON books.id = l.book_id
INNER JOIN users u on l.user_id = u.id;

CREATE VIEW books_view AS
SELECT books.*, GROUP_CONCAT(DISTINCT authors.name) AS authors, GROUP_CONCAT(DISTINCT c.name) AS categories
FROM books
INNER JOIN book_authors ON books.id = book_authors.book_id
INNER JOIN authors ON book_authors.author_id = authors.id
INNER JOIN book_categories bc on books.id = bc.book_id
INNER JOIN categories c on bc.category_id = c.id
GROUP BY books.id;

CREATE VIEW school_books_view AS
SELECT books.*, sb.school_id, sb.quantity, sb.available
FROM books_view books
INNER JOIN school_books sb on books.id = sb.book_id;

CREATE VIEW school_loan_view AS
SELECT s.name AS school_name, u.real_name AS manager_name, COUNT(l.school_id) AS total_loans
FROM schools s
JOIN school_users su ON s.id = su.school_id
JOIN users u ON su.user_id = u.id
JOIN loans l ON s.id = l.school_id
WHERE u.type = 'manager' AND YEAR(l.date_out) = YEAR(CURDATE())
GROUP BY s.name, u.real_name;

-- Procs
DELIMITER //
CREATE PROCEDURE `GetUserStats`(IN `userId` INT, OUT `reservationCount` INT, OUT `loanCount` INT, OUT `activeLoanCount` INT, OUT `reviewCount` INT)
BEGIN
    SELECT COUNT(*) INTO reservationCount
    FROM reservations
    WHERE user_id = userId;
    
    SELECT COUNT(*) INTO loanCount
    FROM loans
    WHERE user_id = userId;
    
    SELECT COUNT(*) INTO activeLoanCount
    FROM loans
    WHERE user_id = userId AND date_in IS NULL;

    SELECT COUNT(*) INTO reviewCount
    FROM reviews
    WHERE user_id = userId;
END //
DELIMITER ;

-- Triggers
DELIMITER //
CREATE TRIGGER `new_loan` AFTER INSERT ON `loans` 
FOR EACH ROW 
BEGIN 
IF NEW.date_in IS NULL THEN
UPDATE school_books 
SET available = available - 1 
WHERE book_id = NEW.book_id AND school_id = NEW.school_id;
END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `wait_reservations` AFTER UPDATE ON `school_books` 
FOR EACH ROW 
BEGIN 
IF NEW.available = 0 THEN UPDATE reservations 
SET waited = TRUE
WHERE book_id = NEW.book_id AND school_id = NEW.school_id; END IF; 
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `unwait_reservations` AFTER UPDATE ON `school_books` 
FOR EACH ROW 
BEGIN 
IF NEW.available > 0 THEN UPDATE reservations 
SET waited = FALSE, date = CURRENT_DATE(), date_due = DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY) 
WHERE book_id = NEW.book_id AND school_id = NEW.school_id; 
END IF; 
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `check_availability` BEFORE INSERT ON `reservations` 
FOR EACH ROW 
BEGIN 
  DECLARE copies INT; 

  SELECT available INTO copies FROM school_books 
  WHERE book_id = NEW.book_id AND school_id = NEW.school_id; 

  IF copies = 0 THEN 
    SET NEW.waited = TRUE; 
  END IF; 
END //
DELIMITER ; 

DELIMITER //
CREATE TRIGGER `safe_user_delete` BEFORE DELETE ON `users` 
FOR EACH ROW 
BEGIN 
DELETE FROM reservations WHERE user_id = old.id; 
DELETE FROM school_users WHERE user_id = old.id; 
DELETE FROM loans WHERE user_id = old.id; 
DELETE FROM reviews WHERE user_id = old.id; 
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `returned_loan` AFTER UPDATE ON `loans` 
FOR EACH ROW 
BEGIN
IF NEW.date_in IS NOT NULL THEN 
UPDATE school_books 
SET available = available + 1 
WHERE book_id = NEW.book_id AND school_id = NEW.school_id;
END IF;
END //
DELIMITER ;

CREATE EVENT past_due_reservations
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM reservations WHERE date_due < CURRENT_DATE() AND waited != 1;