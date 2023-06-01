-- Triggers
CREATE TRIGGER `new_reservation` AFTER INSERT ON `school_books` 
FOR EACH ROW 
BEGIN 
UPDATE school_books 
SET available = available - 1 
WHERE book_id = NEW.book_id; 
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
SET waited = FALSE, date = NOW(), date_due = DATE_ADD(NOW(), INTERVAL 7 DAY) 
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