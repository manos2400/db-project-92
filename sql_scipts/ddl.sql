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
  type ENUM ('admin', 'manager', 'student', 'teacher') NOT NULL,
);

CREATE TABLE schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(90) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(90) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(90) NOT NULL,
  principal_name VARCHAR(90) NOT NULL,
  library_manager_id INT NOT NULL,
  CONSTRAINT lib_manager FOREIGN KEY (library_manager_id) REFERENCES users(id)
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
  keywords VARCHAR(255),
  loans INT
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
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  school_id INT NOT NULL,
  date_out DATE NOT NULL,
  date_due DATE NOT NULL,
  date_in DATE,
  PRIMARY KEY (user_id, book_id, school_id),
  CONSTRAINT lo_users FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT lo_books FOREIGN KEY (book_id) REFERENCES books(id)
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
  CONSTRAINT res_books FOREIGN KEY (book_id) REFERENCES books(id)
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