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
INSERT INTO books (title, publisher, isbn, pages, description, picture, language, keywords,loans)
VALUES
  ('To Kill a Mockingbird', 'HarperCollins', '9780061120084', 336, 'A classic novel depicting racial inequality and justice in the American South.', 'to_kill_a_mockingbird.jpg', 'English', 'racial inequality, justice'),
  ('1984', 'Penguin Books', '9780451524935', 328, 'A dystopian novel set in a totalitarian society where independent thinking is suppressed.', '1984.jpg', 'English', 'dystopia, surveillance'),
  ('The Great Gatsby', 'Scribner', '9780743273565', 180, 'A tale of wealth, love, and the pursuit of the American Dream set in the Jazz Age.', 'the_great_gatsby.jpg', 'English', 'wealth, love, American Dream'),
  ('Moby-Dick', 'Penguin Classics', '9780142437247', 720, 'A story of Captain Ahab's obsessive quest for revenge against a giant white whale.', 'moby_dick.jpg', 'English', 'whale, revenge, obsession'),
  ('Pride and Prejudice', 'Penguin Classics', '9780141439518', 432, 'A romantic novel exploring the themes of love, social class, and overcoming prejudice.', 'pride_and_prejudice.jpg', 'English', 'romance, social class, prejudice'),
  ('The Catcher in the Rye', 'Little, Brown and Company', '9780316769488', 224, 'A coming-of-age story of a disillusioned teenager navigating the complexities of adulthood.', 'the_catcher_in_the_rye.jpg', 'English', 'coming-of-age, disillusionment'),
  ('Brave New World', 'Harper Perennial', '9780060850524', 288, 'A dystopian novel that envisions a future society where human reproduction and social order are controlled.', 'brave_new_world.jpg', 'English', 'dystopia, social control'),
  ('The Hobbit', 'Mariner Books', '9780547928227', 300, 'An adventurous tale of Bilbo Baggins as he embarks on a quest to reclaim a treasure guarded by a dragon.', 'the_hobbit.jpg', 'English', 'fantasy, adventure'),
  ('Lord of the Flies', 'Penguin Books', '9780143129400', 224, 'A gripping story of a group of boys stranded on an uninhabited island and their descent into savagery.', 'lord_of_the_flies.jpg', 'English', 'isolation, savagery'),
  ('To the Lighthouse', 'Harvest Books', '9780156907392', 209, 'A novel that explores the shifting relationships and inner lives of a family during a summer vacation.', 'to_the_lighthouse.jpg', 'English', 'family dynamics, introspection'),
  ('The Lord of the Rings', 'Mariner Books', '9780544003415', 1178, 'An epic fantasy trilogy set in the fictional world of Middle-earth, featuring a quest to destroy a powerful ring.', 'the_lord_of_the_rings.jpg', 'English', 'fantasy, adventure, quest'),
  ('Crime and Punishment', 'Vintage Classics', '9780679734505', 545, 'A psychological novel following the story of a young man who commits a murder and grapples with his guilt.', 'crime_and_punishment'),
  ('The Chronicles of Narnia', 'HarperCollins', '9780064405379', 768, 'A series of fantasy novels that transport readers to the magical world of Narnia.', '/path/to/chronicles_of_narnia.jpg', 'English', 'fantasy, adventure'),
  ('The Da Vinci Code', 'Anchor Books', '9780307474278', 592, 'A gripping thriller that combines art, history, and religion in a quest for a hidden secret.', '/path/to/da_vinci_code.jpg', 'English', 'mystery, thriller, art, religion'),
  ('Harry Potter and the Sorcerer''s Stone', 'Scholastic', '9780590353427', 320, 'The first installment in the beloved Harry Potter series, introducing readers to the magical world of Hogwarts.', '/path/to/harry_potter_sorcerers_stone.jpg', 'English', 'fantasy, magic, adventure'),
  ('The Hobbit', 'Mariner Books', '9780547928227', 300, 'An adventurous tale of Bilbo Baggins as he embarks on a quest to reclaim a treasure guarded by a dragon.', '/path/to/the_hobbit.jpg', 'English', 'fantasy, adventure'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Del Rey Books', '9780345391803', 208, 'A hilarious science fiction series that follows the misadventures of an ordinary human in a vast, unpredictable universe.', '/path/to/hitchhikers_guide_to_the_galaxy.jpg', 'English', 'science fiction, humor'),
  ('Gone Girl', 'Broadway Books', '9780307588371', 432, 'A psychological thriller about a missing wife and the dark secrets that unravel during the investigation.', '/path/to/gone_girl.jpg', 'English', 'mystery, thriller, suspense'),
  ('The Book Thief', 'Alfred A. Knopf', '9780375842207', 576, 'Set during World War II, this poignant story follows a young girl who finds solace in books amidst the horrors of Nazi Germany.', '/path/to/the_book_thief.jpg', 'English', 'historical fiction, war'),
  ('Sapiens: A Brief History of Humankind', 'Harper Perennial', '9780062316097', 464, 'A thought-provoking exploration of the history and impact of Homo sapiens, covering topics from biology to culture and beyond.', '/path/to/sapiens.jpg', 'English', 'history, anthropology, philosophy'),
  ('The Girl with the Dragon Tattoo', 'Vintage Crime/Black Lizard', '9780307949486', 672, 'A gripping mystery novel that follows a journalist and a computer hacker as they uncover dark secrets and solve a decades-old murder.', '/path/to/girl_with_dragon_tattoo.jpg', 'English', 'mystery, thriller, crime'),
  ('The Picture of Dorian Gray', 'Penguin Classics', '9780141439570', 272, 'A philosophical novel about a man who remains eternally youthful while a portrait of him ages and bears the weight of his sins.', '/path/to/picture_of_dorian_gray.jpg', 'English', 'philosophy, morality, corruption'),
  ('The Secret Life of Bees', 'Penguin Books', '9780142001745', 336, 'A coming-of-age story set in the 1960s South, following a young girl who seeks answers about her mother and finds solace in beekeeping.', '/path/to/secret_life_of_bees.jpg', 'English', 'coming-of-age, family, beekeeping'),
  ('The Kite Runner', 'Riverhead Books', '9781594480003', 400, 'A powerful tale of friendship and redemption set against the backdrop of war-torn Afghanistan.', '/path/to/kite_runner.jpg', 'English', 'friendship, redemption, Afghanistan'),
  ('The Hunger Games', 'Scholastic Press', '9780439023481', 374, 'In a dystopian future, a young girl volunteers to participate in a televised fight to the death as a means of survival.', '/path/to/hunger_games.jpg', 'English', 'dystopia, survival, adventure'),
  ('The Fault in Our Stars', 'Dutton Books', '9780525478812', 336, 'A heart-wrenching story of two teenagers with cancer who fall in love and embark on a journey of love, hope, and acceptance.', '/path/to/fault_in_our_stars.jpg', 'English', 'young adult, romance, cancer'),
  ('The Lord of the Rings', 'Mariner Books', '9780544003415', 1178, 'An epic fantasy trilogy set in the fictional world of Middle-earth, featuring a quest to destroy a powerful ring.', '/path/to/the_lord_of_the_rings.jpg', 'English', 'fantasy, adventure, quest'),
  ('The Girl on the Train', 'Riverhead Books', '9781594634024', 336, 'A gripping psychological thriller that follows a woman who becomes entangled in a missing person investigation.', '/path/to/girl_on_the_train.jpg', 'English', 'psychological thriller, suspense, mystery'),
  ('The Name of the Wind', 'DAW Books', '9780756404741', 662, 'An epic fantasy novel that chronicles the early life and adventures of the legendary wizard Kvothe.', '/path/to/name_of_the_wind.jpg', 'English', 'fantasy, magic, adventure'),
  ('The Help', 'Berkley Books', '9780425232200', 544, 'Set in 1960s Mississippi, this novel explores the lives of African American maids and their relationships with their white employers.', '/path/to/the_help.jpg', 'English', 'historical fiction, race, civil rights'),
  ('The Road', 'Vintage Books', '9780307387899', 287, 'A post-apocalyptic novel following a father and son as they journey across a desolate landscape in search of hope and survival.', '/path/to/the_road.jpg', 'English', 'post-apocalyptic, survival, father-son relationship'),
  ('The Giver', 'HMH Books for Young Readers', '9780544336261', 240, 'In a seemingly perfect society, a young boy discovers the dark truth behind his community and embarks on a journey to reclaim humanity.', '/path/to/the_giver.jpg', 'English', 'dystopia, coming-of-age, society'),
  ('The Alchemist', 'HarperOne', '9780062315007', 208, 'A philosophical novel about a young shepherd boy who embarks on a journey to find his personal legend and discover the true meaning of life.', '/path/to/the_alchemist.jpg', 'English', 'philosophy, self-discovery, personal legend'),
  ('The Color Purple', 'Mariner Books', '9780156028356', 300, 'A powerful story of resilience and empowerment, following the life of Celie, an African American woman living in the early 20th century.', '/path/to/the_color_purple.jpg', 'English', 'resilience, empowerment, African American'),
  ('A Game of Thrones', 'Bantam Books', '9780553573404', 848, 'The first book in the epic fantasy series "A Song of Ice and Fire," filled with political intrigue, complex characters, and a battle for power.', '/path/to/a_game_of_thrones.jpg', 'English', 'fantasy, politics, power struggle'),
  ('The Handmaid''s Tale', 'Anchor Books', '9780385490818', 311, 'A dystopian novel set in a totalitarian society where women are subjugated and one woman's fight for freedom and independence.', '/path/to/the_handmaids_tale.jpg', 'English', 'dystopia, feminism, oppression'),
  ('The Picture of Dorian Gray', 'Penguin Classics', '9780141439570', 272, 'A philosophical novel about a man who remains eternally youthful while a portrait of him ages and bears the weight of his sins.', '/path/to/picture_of_dorian_gray.jpg', 'English', 'philosophy, morality, corruption'),
  ('The Book Thief', 'Alfred A. Knopf', '9780375842207', 576, 'Set during World War II, this poignant story follows a young girl who finds solace in books amidst the horrors of Nazi Germany.', '/path/to/the_book_thief.jpg', 'English', 'historical fiction, war'),
  ('The Sun Also Rises', 'Scribner', '9780743297332', 251, 'A novel that captures the disillusionment and aimlessness of the post-World War I generation, known as the Lost Generation.', '/path/to/the_sun_also_rises.jpg', 'English', 'Lost Generation, post-war, disillusionment'),
  ('The Power of Now', 'New World Library', '9781577314806', 236, 'A spiritual guide that explores the concept of living in the present moment and finding inner peace and enlightenment.', '/path/to/the_power_of_now.jpg', 'English', 'spirituality, mindfulness, present moment'),
  ('A Brief History of Time', 'Bantam Books', '9780553380163', 212, 'A popular science book that explains complex concepts about the universe, time, and space-time to a non-scientific audience.', '/path/to/a_brief_history_of_time.jpg', 'English', 'science, cosmology, universe'),
  ('The Catcher in the Rye', 'Little, Brown and Company', '9780316769174', 224, 'A classic novel narrated by a disillusioned teenager, exploring themes of teenage angst, identity, and societal hypocrisy.', '/path/to/the_catcher_in_the_rye.jpg', 'English', 'coming-of-age, teenage angst, identity'),
  ('Pride and Prejudice', 'Penguin Classics', '9780141439518', 432, 'A timeless romance novel that follows the spirited Elizabeth Bennet as she navigates love, societal expectations, and personal growth.', '/path/to/pride_and_prejudice.jpg', 'English', 'romance, social class, family'),
  ('Moby-Dick', 'Penguin Classics', '9780142437247', 704, 'An epic tale of Captain Ahab's relentless pursuit of the great white whale, exploring themes of obsession, fate, and the human condition.', '/path/to/moby_dick.jpg', 'English', 'adventure, obsession, human condition'),
  ('Brave New World', 'Harper Perennial Modern Classics', '9780060850524', 288, 'A dystopian novel that depicts a futuristic society where individuals are engineered and conditioned for a rigidly controlled existence.', '/path/to/brave_new_world.jpg', 'English', 'dystopia, society, control'),
  ('To the Lighthouse', 'Harvest Books', '9780156907392', 209, 'A modernist novel that explores the inner lives and thoughts of its characters as they navigate personal relationships and the passage of time.', '/path/to/to_the_lighthouse.jpg', 'English', 'modernism, introspection, relationships'),
  ('The Great Gatsby', 'Scribner', '9780743273565', 180, 'A jazz-age novel set in the 1920s, delving into themes of wealth, love, and the American Dream through the enigmatic millionaire Jay Gatsby.', '/path/to/the_great_gatsby.jpg', 'English', '1920s, wealth, American Dream'),
  ('The Odyssey', 'Penguin Classics', '9780140268867', 541, 'An ancient Greek epic poem attributed to Homer, following the hero Odysseus as he journeys home after the Trojan War.', '/path/to/the_odyssey.jpg', 'English', 'epic, mythology, adventure'),
  ('Wuthering Heights', 'Penguin Classics', '9780141439556', 464, 'A Gothic romance novel set on the Yorkshire moors, exploring themes of love, revenge, and the destructive power of passion.', '/path/to/wuthering_heights.jpg', 'English', 'romance, Gothic, revenge'),
  ('The Count of Monte Cristo', 'Penguin Classics', '9780140449266', 1276, 'A tale of betrayal, revenge, and redemption, following Edmond Dantès as he seeks justice after being wrongfully imprisoned.', '/path/to/the_count_of_monte_cristo.jpg', 'English', 'revenge, betrayal, redemption'),
  ('Harry Potter and the Sorcerer\'s Stone', 'Bloomsbury Publishing', '978-0747532743', 223, 'The first book in the Harry Potter series.', 'harry_potter_sorcerers_stone.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Chamber of Secrets', 'Bloomsbury Publishing', '978-0747538493', 251, 'The second book in the Harry Potter series.', 'harry_potter_chamber_of_secrets.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Prisoner of Azkaban', 'Bloomsbury Publishing', '978-0747542155', 317, 'The third book in the Harry Potter series.', 'harry_potter_prisoner_of_azkaban.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Goblet of Fire', 'Bloomsbury Publishing', '978-0747546245', 636, 'The fourth book in the Harry Potter series.', 'harry_potter_goblet_of_fire.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Order of the Phoenix', 'Bloomsbury Publishing', '978-0747551003', 766, 'The fifth book in the Harry Potter series.', 'harry_potter_order_of_the_phoenix.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Half-Blood Prince', 'Bloomsbury Publishing', '978-0747581086', 607, 'The sixth book in the Harry Potter series.', 'harry_potter_half_blood_prince.jpg', 'English', 'Fantasy, Magic, Adventure'),
  ('Harry Potter and the Deathly Hallows', 'Bloomsbury Publishing', '978-0545010221', 607, 'The seventh and final book in the Harry Potter series.', 'harry_potter_deathly_hallows.jpg', 'English', 'Fantasy, Magic, Adventure');

-- TODO: Insert Authors
INSERT INTO Authors (title, author)
VALUES
('To Kill a Mockingbird,'Harper Lee),
('1984,'George Orwell),
('The Great Gatsby,'F. Scott Fitzgerald),
('Moby-Dick,'Herman Melville),
('Pride and Prejudice,'Jane Austen),
('The Catcher in the Rye,'J.D. Salinger),
('Brave New World,'Aldous Huxley),
('The Hobbit,'J.R.R. Tolkien),
('Lord of the Flies,'William Golding),
('To the Lighthouse,'Virginia Woolf),
('The Lord of the Rings,'J.R.R. Tolkien),
('Crime and Punishment,'Fyodor Dostoevsky),
('The Chronicles of Narnia,'C.S. Lewis),
('The Da Vinci Code,'Dan Brown),
('The Hobbit,'J.R.R. Tolkien),
('The Hitchhiker's Guide to the Galaxy,'Douglas Adams),
('Gone Girl,'Gillian Flynn),
('The Book Thief,'Markus Zusak),
('Sapiens: A Brief History of Humankind,'Yuval Noah Harari),
('The Girl with the Dragon Tattoo,'Stieg Larsson),
('The Picture of Dorian Gray,'Oscar Wilde),
('The Secret Life of Bees,'Sue Monk Kidd),
('The Kite Runner,'Khaled Hosseini),
('The Hunger Games,'Suzanne Collins),
('The Fault in Our Stars,'John Green),
('The Lord of the Rings,'J.R.R. Tolkien),
('The Girl on the Train,'Paula Hawkins),
('The Name of the Wind,'Patrick Rothfuss),
('The Help,'Kathryn Stockett),
('The Road,'Cormac McCarthy),
('The Giver,'Lois Lowry),
('The Alchemist,'Paulo Coelho),
('The Color Purple,'Alice Walker),
('A Game of Thrones,'George R.R. Martin),
('The Handmaid's Tale,'Margaret Atwood),
('The Picture of Dorian Gray,'Oscar Wilde),
('The Book Thief,'Markus Zusak),
('The Sun Also Rises,'Ernest Hemingway),
('The Power of Now,'Eckhart Tolle),
('A Brief History of Time,'Stephen Hawking),
('The Catcher in the Rye,'J.D. Salinger),
('Pride and Prejudice,'Jane Austen),
('Moby-Dick,'Herman Melville),
('Brave New World,'Aldous Huxley),
('To the Lighthouse,'Virginia Woolf),
('The Great Gatsby,'F. Scott Fitzgerald),
('The Odyssey,'Homer),
('Harry Potter and the Sorcerer\'s Stone,'J.K. Rowling),
('Harry Potter and the Chamber of Secrets,'J.K. Rowling),
('Harry Potter and the Prisoner of Azkaban,'J.K. Rowling),
('Harry Potter and the Goblet of Fire,'J.K. Rowling),
('Harry Potter and the Order of the Phoenix,'J.K. Rowling),
('Harry Potter and the Half-Blood Prince,'J.K. Rowling),
('Harry Potter and the Deathly Hallows,'J.K. Rowling);

-- TODO: Insert categories
