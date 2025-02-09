const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5010;

app.use(express.json());

// ✅ FIX: Allow your frontend URL in CORS
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

// ✅ API Test Route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// ✅ Main API Route
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
