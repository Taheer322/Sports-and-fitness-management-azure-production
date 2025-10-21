import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [fitnessProgress, setFitnessProgress] = useState([]);

  const ADMIN_EMAIL = 'mohammedtaheer303@gmail.com';
  const API_URL = 'https://fitness-and-gym-management-agepa2dycfbccge5.canadacentral-01.azurewebsites.net/api';

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await fetch(`${API_URL}/coaches`);
      const data = await response.json();
      setCoaches(data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await fetch(`${API_URL}/facilities`);
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`${API_URL}/participants`);
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance`);
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchFitnessProgress = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/fitness-progress/${userId}`);
      const data = await response.json();
      setFitnessProgress(data);
    } catch (error) {
      console.error('Error fetching fitness progress:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCoaches();
    fetchFacilities();
    fetchBookings();
    fetchEvents();
    fetchParticipants();
    fetchAttendance();
  }, []);

  const handleLogin = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    if (role === 'student' && user.user_id) {
      fetchFitnessProgress(user.user_id);
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setFitnessProgress([]);
    setActiveTab('login');
  };

  const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('student');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regGender, setRegGender] = useState('Male');
    const [regAge, setRegAge] = useState('');

    const handleLoginSubmit = async (e) => {
      e.preventDefault();

      if (selectedRole === 'admin') {
        if (loginEmail === ADMIN_EMAIL) {
          handleLogin('admin', { name: 'Administrator', email: loginEmail });
        } else {
          alert('Access Denied! Only authorized administrators can login.');
        }
        return;
      }

      if (selectedRole === 'student') {
        const user = users.find(u => u.email === loginEmail);
        if (user) {
          handleLogin('student', user);
        } else {
          alert('User not found! Please register first.');
        }
      } else if (selectedRole === 'coach') {
        const coach = coaches.find(c => c.contact && c.contact.includes(loginEmail));
        if (coach) {
          handleLogin('coach', { ...coach, name: coach.c_name });
        } else {
          alert('Coach not found! Please contact administrator.');
        }
      }
    };

    const handleRegisterSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            u_name: regName,
            email: regEmail,
            gender: regGender,
            age: parseInt(regAge, 10)
          })
        });

        if (response.ok) {
          alert('Registration successful! Please login now.');
          await fetchUsers();
          setIsLogin(true);
          setRegName('');
          setRegEmail('');
          setRegAge('');
        } else {
          alert('Registration failed! Email might already exist.');
        }
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Registration failed! Please try again.');
      }
    };

    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-image-section">
            <div className="image-overlay">
              <h1>Sports & Fitness Management System</h1>
              <p>Manage your fitness journey, book facilities, and participate in sports events</p>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-box">
              <div className="tab-buttons">
                <button className={isLogin ? 'tab-active' : ''} onClick={() => setIsLogin(true)}>Login</button>
                <button className={!isLogin ? 'tab-active' : ''} onClick={() => setIsLogin(false)}>Register</button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLoginSubmit}>
                  <h2>Welcome Back!</h2>
                  <div className="form-group">
                    <label>Select Role</label>
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="coach">Coach</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Enter your email" required />
                  </div>
                  <button type="submit" className="btn-primary">Login</button>
                  <p className="switch-text">
                    Don't have an account? <span onClick={() => setIsLogin(false)}>Register here</span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <h2>Create Account</h2>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Enter your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Enter your email" required />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={regGender} onChange={(e) => setRegGender(e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" value={regAge} onChange={(e) => setRegAge(e.target.value)} placeholder="Enter your age" min="1" max="100" required />
                  </div>
                  <button type="submit" className="btn-primary">Register</button>
                  <p className="switch-text">
                    Already have an account? <span onClick={() => setIsLogin(true)}>Login here</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StudentDashboard = () => {
    const [currentView, setCurrentView] = useState('profile');
    const [bookingForm, setBookingForm] = useState({ facility_id: '', datetime: '' });
    const [eventRegistration, setEventRegistration] = useState('');
    const [profileForm, setProfileForm] = useState({
      u_name: currentUser?.u_name || '',
      email: currentUser?.email || '',
      gender: currentUser?.gender || 'Male',
      age: currentUser?.age || ''
    });
    const [fitnessForm, setFitnessForm] = useState({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      workout_type: '',
      duration: '',
      notes: ''
    });

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/users/${currentUser.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            u_name: profileForm.u_name,
            email: profileForm.email,
            gender: profileForm.gender,
            age: parseInt(profileForm.age, 10)
          })
        });

        if (response.ok) {
          alert('Profile updated successfully!');
          await fetchUsers();
          const updatedUser = users.find(u => u.user_id === currentUser.user_id);
          if (updatedUser) {
            setCurrentUser(updatedUser);
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };

    const handleAddFitnessProgress = async (e) => {
      e.preventDefault();
      try {
        const bmi = fitnessForm.weight && fitnessForm.height ? 
          (parseFloat(fitnessForm.weight) / Math.pow(parseFloat(fitnessForm.height) / 100, 2)).toFixed(2) : null;

        const response = await fetch(`${API_URL}/fitness-progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.user_id,
            date: fitnessForm.date,
            weight: fitnessForm.weight ? parseFloat(fitnessForm.weight) : null,
            height: fitnessForm.height ? parseFloat(fitnessForm.height) : null,
            bmi: bmi,
            workout_type: fitnessForm.workout_type,
            duration: fitnessForm.duration ? parseInt(fitnessForm.duration) : null,
            notes: fitnessForm.notes
          })
        });

        if (response.ok) {
          alert('Fitness progress added!');
          fetchFitnessProgress(currentUser.user_id);
          setFitnessForm({
            date: new Date().toISOString().split('T')[0],
            weight: '',
            height: '',
            workout_type: '',
            duration: '',
            notes: ''
          });
        }
      } catch (error) {
        console.error('Error adding fitness progress:', error);
      }
    };

    const handleBooking = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.user_id,
            ...bookingForm,
            status: 'pending'
          })
        });
        if (response.ok) {
          alert('Booking request submitted successfully!');
          fetchBookings();
          setBookingForm({ facility_id: '', datetime: '' });
        }
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    };

    const handleEventRegistration = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/participants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventRegistration,
            user_id: currentUser.user_id,
            result: 'Pending',
            score: 0
          })
        });
        if (response.ok) {
          alert('Event registration successful!');
          fetchParticipants();
          setEventRegistration('');
        }
      } catch (error) {
        console.error('Error registering for event:', error);
      }
    };

    const myBookings = bookings.filter(b => b.user_id === currentUser?.user_id);
    const myEvents = participants.filter(p => p.user_id === currentUser?.user_id);
    const myAttendance = attendance.filter(a => a.user_id === currentUser?.user_id);

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Welcome, {currentUser?.u_name}!</h2>
          <div className="nav-tabs">
            <button className={currentView === 'profile' ? 'active' : ''} onClick={() => setCurrentView('profile')}>My Profile</button>
            <button className={currentView === 'fitness' ? 'active' : ''} onClick={() => setCurrentView('fitness')}>Fitness Tracker</button>
            <button className={currentView === 'book-facility' ? 'active' : ''} onClick={() => setCurrentView('book-facility')}>Book Facility</button>
            <button className={currentView === 'my-bookings' ? 'active' : ''} onClick={() => setCurrentView('my-bookings')}>My Bookings</button>
            <button className={currentView === 'events' ? 'active' : ''} onClick={() => setCurrentView('events')}>Events</button>
            <button className={currentView === 'attendance' ? 'active' : ''} onClick={() => setCurrentView('attendance')}>Attendance</button>
          </div>
        </div>

        {currentView === 'profile' && (
          <div className="section">
            <h3>My Profile</h3>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={profileForm.u_name} onChange={(e) => setProfileForm({ ...profileForm, u_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn-primary">Update Profile</button>
            </form>
          </div>
        )}

        {currentView === 'fitness' && (
          <>
            <div className="section">
              <h3>Add Fitness Progress</h3>
              <form onSubmit={handleAddFitnessProgress} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={fitnessForm.date} onChange={(e) => setFitnessForm({ ...fitnessForm, date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" step="0.01" value={fitnessForm.weight} onChange={(e) => setFitnessForm({ ...fitnessForm, weight: e.target.value })} placeholder="e.g., 70.5" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input type="number" step="0.01" value={fitnessForm.height} onChange={(e) => setFitnessForm({ ...fitnessForm, height: e.target.value })} placeholder="e.g., 175" />
                  </div>
                  <div className="form-group">
                    <label>Workout Type</label>
                    <input type="text" value={fitnessForm.workout_type} onChange={(e) => setFitnessForm({ ...fitnessForm, workout_type: e.target.value })} placeholder="e.g., Running, Gym" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" value={fitnessForm.duration} onChange={(e) => setFitnessForm({ ...fitnessForm, duration: e.target.value })} placeholder="e.g., 45" />
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <input type="text" value={fitnessForm.notes} onChange={(e) => setFitnessForm({ ...fitnessForm, notes: e.target.value })} placeholder="Any additional notes" />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Progress</button>
              </form>
            </div>
            <div className="section">
              <h3>My Fitness Progress</h3>
              {fitnessProgress.length === 0 ? (
                <p className="no-data">No fitness progress recorded yet. Start tracking your journey!</p>
              ) : (
                <table>
                  <thead>
                    <tr><th>Date</th><th>Weight (kg)</th><th>Height (cm)</th><th>BMI</th><th>Workout</th><th>Duration (min)</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {fitnessProgress.map(fp => (
                      <tr key={fp.progress_id}>
                        <td>{new Date(fp.date).toLocaleDateString()}</td>
                        <td>{fp.weight || '-'}</td>
                        <td>{fp.height || '-'}</td>
                        <td>{fp.bmi || '-'}</td>
                        <td>{fp.workout_type || '-'}</td>
                        <td>{fp.duration || '-'}</td>
                        <td>{fp.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {currentView === 'book-facility' && (
          <>
            <div className="section">
              <h3>Available Facilities</h3>
              <div className="facilities-grid">
                {facilities.filter(f => f.availability === 'available').map(facility => (
                  <div key={facility.facility_id} className="facility-card">
                    <div className="facility-icon">{facility.type === 'Indoor' ? '🏢' : '🏟️'}</div>
                    <h4>{facility.name}</h4>
                    <p><strong>Type:</strong> {facility.type}</p>
                    <p><strong>Location:</strong> {facility.location}</p>
                    <span className="availability-badge available">Available</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <h3>Book a Facility</h3>
              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Facility</label>
                    <select value={bookingForm.facility_id} onChange={(e) => setBookingForm({ ...bookingForm, facility_id: e.target.value })} required>
                      <option value="">Choose a facility</option>
                      {facilities.filter(f => f.availability === 'available').map(f => (
                        <option key={f.facility_id} value={f.facility_id}>{f.name} - {f.location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" value={bookingForm.datetime} onChange={(e) => setBookingForm({ ...bookingForm, datetime: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Submit Booking Request</button>
              </form>
            </div>
          </>
        )}

        {currentView === 'my-bookings' && (
          <div className="section">
            <h3>My Bookings</h3>
            {myBookings.length === 0 ? (
              <p className="no-data">No bookings yet</p>
            ) : (
              <table>
                <thead>
                  <tr><th>ID</th><th>Facility</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {myBookings.map(booking => {
                    const facility = facilities.find(f => f.facility_id === booking.facility_id);
                    return (
                      <tr key={booking.booking_id}>
                        <td>#{booking.booking_id}</td>
                        <td>{facility?.name}</td>
                        <td>{new Date(booking.datetime).toLocaleString()}</td>
                        <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {currentView === 'events' && (
          <>
            <div className="section">
              <h3>Register for Events</h3>
              <form onSubmit={handleEventRegistration} className="form">
                <div className="form-group">
                  <label>Select Event</label>
                  <select value={eventRegistration} onChange={(e) => setEventRegistration(e.target.value)} required>
                    <option value="">Choose an event</option>
                    {events.map(event => (
                      <option key={event.event_id} value={event.event_id}>{event.e_name} - {event.sports}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary">Register</button>
              </form>
            </div>
            <div className="section">
              <h3>My Events</h3>
              {myEvents.length === 0 ? <p className="no-data">No events yet</p> : (
                <table>
                  <thead><tr><th>Event</th><th>Sport</th><th>Result</th><th>Score</th></tr></thead>
                  <tbody>
                    {myEvents.map(p => {
                      const event = events.find(e => e.event_id === p.event_id);
                      return <tr key={p.participant_id}><td>{event?.e_name}</td><td>{event?.sports}</td><td>{p.result}</td><td>{p.score}</td></tr>;
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {currentView === 'attendance' && (
          <div className="section">
            <h3>My Attendance</h3>
            {myAttendance.length === 0 ? <p className="no-data">No attendance records</p> : (
              <table>
                <thead><tr><th>Coach</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {myAttendance.map(att => {
                    const coach = coaches.find(c => c.coach_id === att.coach_id);
                    return <tr key={att.attendance_id}><td>{coach?.c_name}</td><td>{new Date(att.date).toLocaleDateString()}</td><td><span className={`status ${att.status}`}>{att.status}</span></td></tr>;
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  const CoachDashboard = () => {
    const [attendanceForm, setAttendanceForm] = useState({ user_id: '', date: new Date().toISOString().split('T')[0], status: 'present' });

    const handleMarkAttendance = async (e) => {
      e.preventDefault();
      try {
        const coach = coaches[0];
        const response = await fetch(`${API_URL}/attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...attendanceForm, coach_id: coach?.coach_id })
        });
        if (response.ok) {
          alert('Attendance marked!');
          fetchAttendance();
          setAttendanceForm({ user_id: '', date: new Date().toISOString().split('T')[0], status: 'present' });
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    };

    return (
      <div className="dashboard">
        <h2>Coach Dashboard</h2>
        <div className="section">
          <h3>Mark Attendance</h3>
          <form onSubmit={handleMarkAttendance} className="form">
            <div className="form-group">
              <label>Student</label>
              <select value={attendanceForm.user_id} onChange={(e) => setAttendanceForm({ ...attendanceForm, user_id: e.target.value })} required>
                <option value="">Choose</option>
                {users.map(u => <option key={u.user_id} value={u.user_id}>{u.u_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Mark Attendance</button>
          </form>
        </div>
        <div className="section">
          <h3>All Attendance Records</h3>
          {attendance.length === 0 ? <p className="no-data">No attendance records</p> : (
            <table>
              <thead><tr><th>Student</th><th>Coach</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {attendance.map(att => {
                  const user = users.find(u => u.user_id === att.user_id);
                  const coach = coaches.find(c => c.coach_id === att.coach_id);
                  return <tr key={att.attendance_id}><td>{user?.u_name}</td><td>{coach?.c_name}</td><td>{new Date(att.date).toLocaleDateString()}</td><td><span className={`status ${att.status}`}>{att.status}</span></td></tr>;
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const [facilityForm, setFacilityForm] = useState({ name: '', type: 'Indoor', location: '', availability: 'available' });
    const [eventForm, setEventForm] = useState({ e_name: '', sports: '', date: '', coach_id: '' });
    const [coachForm, setCoachForm] = useState({ c_name: '', specialization: '', schedule: '', contact: '' });

    const handleAddFacility = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/facilities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(facilityForm)
        });
        if (response.ok) {
          alert('Facility added!');
          fetchFacilities();
          setFacilityForm({ name: '', type: 'Indoor', location: '', availability: 'available' });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleCreateEvent = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm)
        });
        if (response.ok) {
          alert('Event created!');
          fetchEvents();
          setEventForm({ e_name: '', sports: '', date: '', coach_id: '' });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleAddCoach = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/coaches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coachForm)
        });
        if (response.ok) {
          alert('Coach added!');
          fetchCoaches();
          setCoachForm({ c_name: '', specialization: '', schedule: '', contact: '' });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleDeleteCoach = async (coachId) => {
      if (window.confirm('Delete this coach?')) {
        try {
          await fetch(`${API_URL}/coaches/${coachId}`, { method: 'DELETE' });
          alert('Coach deleted!');
          fetchCoaches();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    const handleApproveBooking = async (bookingId) => {
      try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        });
        if (response.ok) {
          alert('Booking approved successfully!');
          await fetchBookings();
        } else {
          alert('Failed to approve booking!');
        }
      } catch (error) {
        console.error('Error approving booking:', error);
        alert('Error approving booking!');
      }
    };

    const handleRejectBooking = async (bookingId) => {
      try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' })
        });
        if (response.ok) {
          alert('Booking rejected successfully!');
          await fetchBookings();
        } else {
          alert('Failed to reject booking!');
        }
      } catch (error) {
        console.error('Error rejecting booking:', error);
        alert('Error rejecting booking!');
      }
    };

    return (
      <div className="dashboard">
        <h2>Admin Dashboard</h2>
        <div className="section">
          <h3>System Overview</h3>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon">👥</div><h4>{users.length}</h4><p>Users</p></div>
            <div className="stat-card"><div className="stat-icon">🏋️</div><h4>{coaches.length}</h4><p>Coaches</p></div>
            <div className="stat-card"><div className="stat-icon">🏢</div><h4>{facilities.length}</h4><p>Facilities</p></div>
            <div className="stat-card"><div className="stat-icon">🏆</div><h4>{events.length}</h4><p>Events</p></div>
          </div>
        </div>
        <div className="section">
          <h3>Manage Bookings</h3>
          {bookings.length === 0 ? (
            <p className="no-data">No bookings yet</p>
          ) : (
            <table>
              <thead><tr><th>ID</th><th>User</th><th>Facility</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(booking => {
                  const user = users.find(u => u.user_id === booking.user_id);
                  const facility = facilities.find(f => f.facility_id === booking.facility_id);
                  return (
                    <tr key={booking.booking_id}>
                      <td>#{booking.booking_id}</td>
                      <td>{user?.u_name}</td>
                      <td>{facility?.name}</td>
                      <td>{new Date(booking.datetime).toLocaleString()}</td>
                      <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
                      <td>
                        {booking.status === 'pending' && (
                          <div className="action-buttons">
                            <button onClick={() => handleApproveBooking(booking.booking_id)} className="btn-success">Approve</button>
                            <button onClick={() => handleRejectBooking(booking.booking_id)} className="btn-danger">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="section">
          <h3>Add Coach</h3>
          <form onSubmit={handleAddCoach} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={coachForm.c_name} onChange={(e) => setCoachForm({ ...coachForm, c_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input type="text" value={coachForm.specialization} onChange={(e) => setCoachForm({ ...coachForm, specialization: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Schedule</label>
                <input type="text" value={coachForm.schedule} onChange={(e) => setCoachForm({ ...coachForm, schedule: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input type="text" value={coachForm.contact} onChange={(e) => setCoachForm({ ...coachForm, contact: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn-primary">Add Coach</button>
          </form>
        </div>
        <div className="section">
          <h3>Manage Coaches</h3>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Schedule</th><th>Contact</th><th>Actions</th></tr></thead>
            <tbody>
              {coaches.map(coach => (
                <tr key={coach.coach_id}>
                  <td>{coach.coach_id}</td>
                  <td>{coach.c_name}</td>
                  <td>{coach.specialization}</td>
                  <td>{coach.schedule}</td>
                  <td>{coach.contact}</td>
                  <td><button onClick={() => handleDeleteCoach(coach.coach_id)} className="btn-danger">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section">
          <h3>Add Facility</h3>
          <form onSubmit={handleAddFacility} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={facilityForm.name} onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={facilityForm.type} onChange={(e) => setFacilityForm({ ...facilityForm, type: e.target.value })}>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={facilityForm.location} onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary">Add Facility</button>
          </form>
        </div>
        <div className="section">
          <h3>Create Event</h3>
          <form onSubmit={handleCreateEvent} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Event Name</label>
                <input type="text" value={eventForm.e_name} onChange={(e) => setEventForm({ ...eventForm, e_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Sport</label>
                <input type="text" value={eventForm.sports} onChange={(e) => setEventForm({ ...eventForm, sports: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Coach</label>
                <select value={eventForm.coach_id} onChange={(e) => setEventForm({ ...eventForm, coach_id: e.target.value })} required>
                  <option value="">Choose</option>
                  {coaches.map(c => <option key={c.coach_id} value={c.coach_id}>{c.c_name}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Event</button>
          </form>
        </div>
        <div className="section">
          <h3>All Users</h3>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>Email</th><th>Age</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.u_name}</td>
                  <td>{user.gender}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section">
          <h3>All Facilities</h3>
          <div className="facilities-grid">
            {facilities.map(facility => (
              <div key={facility.facility_id} className="facility-card">
                <div className="facility-icon">{facility.type === 'Indoor' ? '🏢' : '🏟️'}</div>
                <h4>{facility.name}</h4>
                <p><strong>Type:</strong> {facility.type}</p>
                <p><strong>Location:</strong> {facility.location}</p>
                <span className={`availability-badge ${facility.availability}`}>{facility.availability}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {!userRole ? (
        <LoginRegister />
      ) : (
        <>
          <header className="header">
            <h1>🏋️ Sports & Fitness Management</h1>
            <div className="header-right">
              <span className="welcome-text">👋 {currentUser?.u_name || currentUser?.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </header>
          <main className="main-content">
            {userRole === 'student' && <StudentDashboard />}
            {userRole === 'coach' && <CoachDashboard />}
            {userRole === 'admin' && <AdminDashboard />}
          </main>
        </>
      )}
    </div>
  );
};

export default App;