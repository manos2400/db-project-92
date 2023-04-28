-- Last Edited: Manos - 28/04
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
  total_books INT
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

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(90) NOT NULL,
  isbn VARCHAR(13) NOT NULL,
  pages INT NOT NULL,
  description TEXT,
  picture VARCHAR(255),
  language VARCHAR(45),
  keywords VARCHAR(255),
  loans INT
);

CREATE TABLE authors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(90) NOT NULL
);

CREATE TABLE categories (
  name VARCHAR(45) PRIMARY KEY NOT NULL
);

CREATE TABLE book_categories (
  book_id INT NOT NULL,
  category VARCHAR(45) NOT NULL,
  PRIMARY KEY (book_id, category),
  CONSTRAINT bc_books FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT bc_category FOREIGN KEY (category) REFERENCES categories(name)
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