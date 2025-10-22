const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Configuration - Use createPool for production
const db = mysql.createPool({
  host: process.env.DB_HOST || 'fitness-app.mysql.database.azure.com',
  user: process.env.DB_USER || 'Taheer@fitness-app',
  password: process.env.DB_PASSWORD || 'mohamed@123',
  database: process.env.DB_NAME || 'fitness_management',
  port: 3306,
  ssl: { 
    rejectUnauthorized: false  // Required for Azure MySQL
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database successfully!');
  connection.release();
});

// ==================== API ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fitness Management API is running!',
    database: 'Connected'
  });
});

// ==================== USER ROUTES ====================

app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM User';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  const query = 'SELECT * FROM User WHERE user_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/users', (req, res) => {
  const { u_name, gender, email, age } = req.body;
  
  // Check if email already exists
  const checkQuery = 'SELECT * FROM User WHERE email = ?';
  db.query(checkQuery, [email], (err, existing) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Insert new user
    const query = 'INSERT INTO User (u_name, gender, email, age) VALUES (?, ?, ?, ?)';
    db.query(query, [u_name, gender, email, age], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ 
        message: 'User created successfully', 
        user_id: result.insertId 
      });
    });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { u_name, gender, email, age } = req.body;
  const query = 'UPDATE User SET u_name = ?, gender = ?, email = ?, age = ? WHERE user_id = ?';
  
  db.query(query, [u_name, gender, email, age, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const query = 'DELETE FROM User WHERE user_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// ==================== COACH ROUTES ====================

app.get('/api/coaches', (req, res) => {
  const query = 'SELECT * FROM Coach';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching coaches:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/coaches/:id', (req, res) => {
  const query = 'SELECT * FROM Coach WHERE coach_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching coach:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/coaches', (req, res) => {
  const { c_name, specialization, schedule, contact } = req.body;
  const query = 'INSERT INTO Coach (c_name, specialization, schedule, contact) VALUES (?, ?, ?, ?)';
  
  db.query(query, [c_name, specialization, schedule, contact], (err, result) => {
    if (err) {
      console.error('Error creating coach:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Coach created successfully', 
      coach_id: result.insertId 
    });
  });
});

app.put('/api/coaches/:id', (req, res) => {
  const { c_name, specialization, schedule, contact } = req.body;
  const query = 'UPDATE Coach SET c_name = ?, specialization = ?, schedule = ?, contact = ? WHERE coach_id = ?';
  
  db.query(query, [c_name, specialization, schedule, contact, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating coach:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json({ message: 'Coach updated successfully' });
  });
});

app.delete('/api/coaches/:id', (req, res) => {
  const query = 'DELETE FROM Coach WHERE coach_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting coach:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json({ message: 'Coach deleted successfully' });
  });
});

// ==================== FACILITY ROUTES ====================

app.get('/api/facilities', (req, res) => {
  const query = 'SELECT * FROM Facility';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching facilities:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/facilities/:id', (req, res) => {
  const query = 'SELECT * FROM Facility WHERE facility_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching facility:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/facilities', (req, res) => {
  const { name, type, availability, location } = req.body;
  const query = 'INSERT INTO Facility (name, type, availability, location) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, type, availability, location], (err, result) => {
    if (err) {
      console.error('Error creating facility:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Facility created successfully', 
      facility_id: result.insertId 
    });
  });
});

app.put('/api/facilities/:id', (req, res) => {
  const { name, type, availability, location } = req.body;
  const query = 'UPDATE Facility SET name = ?, type = ?, availability = ?, location = ? WHERE facility_id = ?';
  
  db.query(query, [name, type, availability, location, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating facility:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json({ message: 'Facility updated successfully' });
  });
});

app.delete('/api/facilities/:id', (req, res) => {
  const query = 'DELETE FROM Facility WHERE facility_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting facility:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json({ message: 'Facility deleted successfully' });
  });
});

// ==================== BOOKING ROUTES ====================

app.get('/api/bookings', (req, res) => {
  const query = 'SELECT * FROM Booking';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/bookings/:id', (req, res) => {
  const query = 'SELECT * FROM Booking WHERE booking_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching booking:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/bookings', (req, res) => {
  const { user_id, facility_id, datetime, status } = req.body;
  const query = 'INSERT INTO Booking (user_id, facility_id, datetime, status) VALUES (?, ?, ?, ?)';
  
  db.query(query, [user_id, facility_id, datetime, status], (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking_id: result.insertId 
    });
  });
});

app.put('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  const query = 'UPDATE Booking SET status = ? WHERE booking_id = ?';
  
  db.query(query, [status, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating booking:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking updated successfully' });
  });
});

app.delete('/api/bookings/:id', (req, res) => {
  const query = 'DELETE FROM Booking WHERE booking_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  });
});

// ==================== EVENT ROUTES ====================

app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM Event';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/events/:id', (req, res) => {
  const query = 'SELECT * FROM Event WHERE event_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/events', (req, res) => {
  const { e_name, sports, date, coach_id } = req.body;
  const query = 'INSERT INTO Event (e_name, sports, date, coach_id) VALUES (?, ?, ?, ?)';
  
  db.query(query, [e_name, sports, date, coach_id], (err, result) => {
    if (err) {
      console.error('Error creating event:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Event created successfully', 
      event_id: result.insertId 
    });
  });
});

app.put('/api/events/:id', (req, res) => {
  const { e_name, sports, date, coach_id } = req.body;
  const query = 'UPDATE Event SET e_name = ?, sports = ?, date = ?, coach_id = ? WHERE event_id = ?';
  
  db.query(query, [e_name, sports, date, coach_id, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  });
});

app.delete('/api/events/:id', (req, res) => {
  const query = 'DELETE FROM Event WHERE event_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

// ==================== PARTICIPANTS ROUTES ====================

app.get('/api/participants', (req, res) => {
  const query = 'SELECT * FROM Participants';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching participants:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/participants/:id', (req, res) => {
  const query = 'SELECT * FROM Participants WHERE participant_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching participant:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/participants', (req, res) => {
  const { event_id, user_id, result, score } = req.body;
  const query = 'INSERT INTO Participants (event_id, user_id, result, score) VALUES (?, ?, ?, ?)';
  
  db.query(query, [event_id, user_id, result, score], (err, result) => {
    if (err) {
      console.error('Error creating participant:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Participant registered successfully', 
      participant_id: result.insertId 
    });
  });
});

app.put('/api/participants/:id', (req, res) => {
  const { event_id, user_id, result, score } = req.body;
  const query = 'UPDATE Participants SET event_id = ?, user_id = ?, result = ?, score = ? WHERE participant_id = ?';
  
  db.query(query, [event_id, user_id, result, score, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating participant:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json({ message: 'Participant updated successfully' });
  });
});

app.delete('/api/participants/:id', (req, res) => {
  const query = 'DELETE FROM Participants WHERE participant_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting participant:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json({ message: 'Participant deleted successfully' });
  });
});

// ==================== ATTENDANCE ROUTES ====================

app.get('/api/attendance', (req, res) => {
  const query = 'SELECT * FROM Attendance';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/attendance/:id', (req, res) => {
  const query = 'SELECT * FROM Attendance WHERE attendance_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/attendance', (req, res) => {
  const { user_id, coach_id, date, status } = req.body;
  const query = 'INSERT INTO Attendance (user_id, coach_id, date, status) VALUES (?, ?, ?, ?)';
  
  db.query(query, [user_id, coach_id, date, status], (err, result) => {
    if (err) {
      console.error('Error creating attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Attendance marked successfully', 
      attendance_id: result.insertId 
    });
  });
});

app.put('/api/attendance/:id', (req, res) => {
  const { user_id, coach_id, date, status } = req.body;
  const query = 'UPDATE Attendance SET user_id = ?, coach_id = ?, date = ?, status = ? WHERE attendance_id = ?';
  
  db.query(query, [user_id, coach_id, date, status, req.params.id], (err, result) => {
    if (err) {
      console.error('Error updating attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance updated successfully' });
  });
});

app.delete('/api/attendance/:id', (req, res) => {
  const query = 'DELETE FROM Attendance WHERE attendance_id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance deleted successfully' });
  });
});

// ==================== FITNESS PROGRESS ROUTES ====================

app.get('/api/fitness-progress/:userId', (req, res) => {
  const query = 'SELECT * FROM FitnessProgress WHERE user_id = ? ORDER BY date DESC';
  db.query(query, [req.params.userId], (err, results) => {
    if (err) {
      console.error('Error fetching fitness progress:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/fitness-progress', (req, res) => {
  const { user_id, date, weight, height, bmi, workout_type, duration, notes } = req.body;
  const query = 'INSERT INTO FitnessProgress (user_id, date, weight, height, bmi, workout_type, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [user_id, date, weight, height, bmi, workout_type, duration, notes], (err, result) => {
    if (err) {
      console.error('Error adding fitness progress:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ 
      message: 'Fitness progress added successfully', 
      progress_id: result.insertId 
    });
  });
});

// ==================== SERVE REACT BUILD ====================

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React Router - MUST BE LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base: ${process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:' + PORT + '/api'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

module.exports = app;