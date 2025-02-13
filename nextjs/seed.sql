CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT NOT NULL, from_user INTEGER NOT NULL, to_user INTEGER NOT NULL, FOREIGN KEY (from_user) REFERENCES users(id), FOREIGN KEY (to_user) REFERENCES users(id));
INSERT INTO users (name, password) VALUES ('brian', 'password');
INSERT INTO users (name, password) VALUES ('tanner', 'password');
INSERT INTO notes (note, from_user, to_user) VALUES ('sup', 1, 2);
INSERT INTO notes (note, from_user, to_user) VALUES ('shut up brian', 2, 1);