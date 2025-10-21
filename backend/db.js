const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// --- MySQL connection ---
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'fitness-app.mysql.database.azure.com',
  user: process.env.DB_USER || 'Taheer@fitness-app',
  password: process.env.DB_PASSWORD || 'mohamed@123',
  database: process.env.DB_NAME || 'fitness_management',
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) console.error('DB connection failed:', err.message);
  else console.log('✅ Connected to Azure MySQL');
});

// --- Register route ---
app.post('/api/register', (req, res) => {
  const { u_name, email, password, gender, age } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    db.query('INSERT INTO User (u_name, email, password, gender, age) VALUES (?, ?, ?, ?, ?)',
      [u_name, email, password, gender, age],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'DB insert error' });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// --- Serve frontend ---
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
