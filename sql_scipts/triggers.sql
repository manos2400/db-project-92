-- Triggers
CREATE TRIGGER `new_loan` AFTER INSERT ON `loans` 
FOR EACH ROW 
BEGIN 
UPDATE school_books 
SET available = available - 1 
WHERE book_id = NEW.book_id and school_id = NEW.school_id; 
END 

CREATE TRIGGER `wait_reservations` AFTER UPDATE ON `school_books` 
FOR EACH ROW 
BEGIN 
IF NEW.available = 0 THEN UPDATE reservations 
SET waited = TRUE
WHERE book_id = NEW.book_id AND school_id = NEW.school_id; END IF; 
END

CREATE TRIGGER `unwait_reservations` AFTER UPDATE ON `school_books` 
FOR EACH ROW 
BEGIN 
IF NEW.available > 0 THEN UPDATE reservations 
SET waited = FALSE, date = CURRENT_DATE(), date_due = DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY) 
WHERE book_id = NEW.book_id AND school_id = NEW.school_id; 
END IF; 
END

CREATE TRIGGER `check_availability` BEFORE INSERT ON `reservations` 
FOR EACH ROW 
BEGIN 
  DECLARE copies INT; 

  SELECT available INTO copies FROM school_books 
  WHERE book_id = NEW.book_id AND school_id = NEW.school_id; 

  IF copies = 0 THEN 
    SET NEW.waited = TRUE; 
  END IF; 
END; 

CREATE TRIGGER `safe_user_delete` BEFORE DELETE ON `users` 
FOR EACH ROW 
BEGIN 
DELETE FROM reservations WHERE user_id = old.id; 
DELETE FROM school_users WHERE user_id = old.id; 
DELETE FROM loans WHERE user_id = old.id; 
DELETE FROM reviews WHERE user_id = old.id; 
END

CREATE TRIGGER `returned_loan` AFTER UPDATE ON `loans` 
FOR EACH ROW BEGIN 
UPDATE school_books 
SET available = available + 1 
WHERE book_id = NEW.book_id AND school_id = NEW.school_id; 
END 