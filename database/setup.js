const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./database/university.db');
console.log('Connected to the university.db database.');

db.run(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT,
        title TEXT,
        credits INTEGER,
        description TEXT,
        semester TEXT
)
`, (err) => {
        if (err) {
                console.error('Error creating courses table:', err.message);
        } else {
                console.log('Courses table created successfully.');
        }
});

db.close((err) => {
        if (err) {
                console.error('Error closing database:', err.message);
        } else {
                console.log('Database connection closed.');
        }
});