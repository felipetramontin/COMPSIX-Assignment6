const express = require("express"); 
const sqlite3 = require("sqlite3").verbose(); 
const app = express(); 
const port = 3000; 

// Middleware 
app.use(express.json());

// Connect to database 
const db = new sqlite3.Database('./database/university.db');

// API endpoint to get all courses
app.get("/api/courses", (req, res) => {
    db.all("SELECT * FROM courses", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API endpoint to get a course by ID
app.get("/api/courses/:id", (req, res) => {
    const courseId = req.params.id;
    db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: "Course not found" });
        }
    });
});

// API endpoint to add a new course
app.post("/api/courses", (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        "INSERT INTO courses (courseCode, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)",
        [courseCode, title, credits, description, semester],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// API endpoint to update a course by ID
app.put("/api/courses/:id", (req, res) => {
    const courseId = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        "UPDATE courses SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ?",
        [courseCode, title, credits, description, semester, courseId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Course not found" });
            } else {
                res.json({ message: "Course updated successfully" });
            }
        }
    );
});

// API endpoint to delete a course by ID
app.delete("/api/courses/:id", (req, res) => {
    const courseId = req.params.id;
    db.run("DELETE FROM courses WHERE id = ?", [courseId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Course not found" });
        } else {
            res.json({ message: "Course deleted successfully" });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});