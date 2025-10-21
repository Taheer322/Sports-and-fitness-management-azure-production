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

// MySQL Connection Configuration
 const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? { rejectUnauthorized: false } : undefined
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database successfully!');
});



// ==================== USER ROUTES ====================

// Get all users
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

// Get user by ID
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

// Create new user
app.post('/api/users', (req, res) => {
  const { u_name, gender, email, age } = req.body;
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

// Update user - FIXED VERSION
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

// Delete user
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

// Get all coaches
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

// Get coach by ID
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

// Create new coach
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

// Update coach
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

// Delete coach
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

// Get all facilities
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

// Get facility by ID
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

// Create new facility
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

// Update facility
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

// Delete facility
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

// ==================== BOOKING ROUTES - FIXED ====================

// Get all bookings
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

// Get booking by ID
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

// Create new booking
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

// Update booking - FIXED TO ONLY UPDATE STATUS
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

// Delete booking
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

// Get all events
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

// Get event by ID
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

// Create new event
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

// Update event
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

// Delete event
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

// Get all participants
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

// Get participant by ID
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

// Create new participant
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

// Update participant
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

// Delete participant
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

// Get all attendance records
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

// Get attendance by ID
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

// Create new attendance record
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

// Update attendance
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

// Delete attendance
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

// ==================== FITNESS PROGRESS ROUTES (NEW) ====================

// Get fitness progress for a user
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

// Add fitness progress
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





// Serve React build folder if present (works locally and in Azure with build step)
const reactBuildPath = path.join(__dirname, 'build');
app.use(express.static(reactBuildPath));

// For any unknown route (non-API), serve React app if it exists
app.get(/^(?!\/(api|health)).*/, (req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(reactBuildPath, 'index.html'), (err) => {
    if (err) next();
  });
});
// ==================== SERVER START ====================

// Health check endpoint for Azure
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});

