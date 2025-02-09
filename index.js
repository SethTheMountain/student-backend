require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5010;

app.use(express.json());

// ✅ MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ✅ CORS Configuration (Allow frontend requests)
const allowedOrigins = [
  "https://student-frontend-l0iv3tst8-seththemountains-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, DELETE",
    allowedHeaders: "Content-Type",
  })
);

// ✅ Root Route (Health Check)
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});

// ✅ Get All Students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ✅ Register a New Student
app.post("/students", (req, res) => {
  const { name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone } = req.body;
  
  if (!name || !email || !idNumber) {
    return res.status(400).json({ error: "Name, Email, and ID Number are required" });
  }

  const query = `
    INSERT INTO students (name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone], (err, result) => {
    if (err) {
      console.error("Error registering student:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Student registered successfully", studentId: result.insertId });
  });
});

// ✅ Delete a Student by ID
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  
  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
