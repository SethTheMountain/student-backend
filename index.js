require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5010;

app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post('/students', (req, res) => {
  const { name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone } = req.body;
  db.query(
    'INSERT INTO students (name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, address, courses, idNumber, emergencyContactEmail, emergencyContactPhone],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'Student registered successfully' });
      }
    }
  );
});

app.delete('/students/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
