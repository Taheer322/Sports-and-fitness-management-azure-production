# Fitness & Gym Management System

A full-stack web application for managing gym operations including user management, coach assignments, facility bookings, events, and attendance tracking.

## 🏗️ Architecture

This is a **full-stack application** deployed on Azure with:
- **Frontend**: React.js (Single Page Application)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: Azure MySQL Database
- **Deployment**: Azure Web App (Frontend + Backend together)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
fitness-gym-management/
├── public/                 # React public files
├── src/                    # React source code
│   ├── components/        # React components
│   ├── pages/            # React pages
│   ├── config.js         # ⚠️ API configuration (IMPORTANT)
│   └── App.js
├── routes/                # Backend API routes
│   ├── auth.js
│   ├── users.js
│   ├── coaches.js
│   ├── facilities.js
│   ├── bookings.js
│   ├── events.js
│   └── attendance.js
├── models/               # Database models
├── middleware/           # Express middleware
├── server.js            # ⚠️ Backend entry point (IMPORTANT)
├── package.json
├── .env                 # Local environment variables
└── .github/
    └── workflows/
        └── azure-deploy.yml  # CI/CD pipeline
```

## 🔧 Required Changes for Azure Deployment

### 1. **Update API Configuration** ⚠️ CRITICAL

**File**: `src/config.js` or wherever your API base URL is defined

```javascript
// Change from:
const API_URL = 'https://Fitness-and-Gym-management.azurewebsites.net/api';

// To (use relative path since frontend and backend are together):
const API_URL = '/api';

export default API_URL;
```

### 2. **Update server.js** ⚠️ CRITICAL

**File**: `server.js`

```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'fitness-app.mysql.database.azure.com',
  user: process.env.DB_USER,  // Format: username@fitness-app
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: {
    rejectUnauthorized: false  // Required for Azure MySQL
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// API Routes (MUST come BEFORE static files)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/events', require('./routes/events'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/attendance', require('./routes/attendance'));

// Serve React static files (AFTER API routes)
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React Router (MUST be LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
```

### 3. **Update package.json**

Ensure you have all required dependencies:

```json
{
  "name": "fitness-gym-management",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "react-scripts build",
    "client": "react-scripts start"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "mysql2": "^3.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "react-scripts": "5.0.1"
  }
}
```

### 4. **Configure Azure Application Settings** ⚠️ CRITICAL

Go to **Azure Portal** → Your Web App → **Configuration** → **Application Settings**

Add these settings:

| Name | Value | Example |
|------|-------|---------|
| `DB_HOST` | `fitness-app.mysql.database.azure.com` | Your MySQL server |
| `DB_USER` | `admin@fitness-app` | ⚠️ Must include @servername |
| `DB_PASSWORD` | `YourPassword123!` | Your MySQL password |
| `DB_NAME` | `gym_management` | Your database name |
| `NODE_ENV` | `production` | Environment |
| `JWT_SECRET` | `your-secret-key-here` | For authentication |

**Important**: Click **Save** and **Restart** the app after adding settings!

### 5. **Azure MySQL Firewall Settings**

Go to **Azure Portal** → Your MySQL Server → **Networking**

Add firewall rule:
- **Rule name**: `AllowAzureServices`
- **Start IP**: `0.0.0.0`
- **End IP**: `0.0.0.0`

This allows your Azure Web App to connect to the database.

### 6. **Azure Web App General Settings**

Go to **Azure Portal** → Your Web App → **Configuration** → **General Settings**

- **Stack**: Node
- **Node version**: 20 LTS
- **Startup Command**: `node server.js`

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

1. Make your changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```
3. GitHub Actions will automatically:
   - Install dependencies
   - Build React frontend
   - Deploy to Azure
   - Takes ~5-7 minutes

### Monitor Deployment

- **GitHub**: Go to your repo → **Actions** tab
- **Azure**: Go to your Web App → **Deployment Center**

## 📊 Database Setup

### Create Tables

Connect to your Azure MySQL database and run:

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member') DEFAULT 'member',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coaches table
CREATE TABLE coaches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facilities table
CREATE TABLE facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  capacity INT,
  status ENUM('available', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  facility_id INT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- Events table
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  coach_id INT,
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

-- Attendance table
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  event_id INT,
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('present', 'absent') DEFAULT 'present',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## 🧪 Testing

### Test Locally

1. Create `.env` file:
   ```env
   DB_HOST=fitness-app.mysql.database.azure.com
   DB_USER=admin@fitness-app
   DB_PASSWORD=your_password
   DB_NAME=gym_management
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

2. Run backend:
   ```bash
   npm start
   ```

3. Run frontend (in another terminal):
   ```bash
   npm run client
   ```

### Test on Azure

- **URL**: `https://fitness-and-gym-management-agepa2dycfbccge5.canadacentral-01.azurewebsites.net`
- **Test login** with admin credentials
- **Test registration** for new users
- **Check browser console** (F12) for any errors

## 🐛 Troubleshooting

### Registration Failed Error

1. **Check browser console** (F12 → Console tab)
2. **Check network tab** for API errors
3. **Check Azure logs**: Web App → Log Stream
4. Common causes:
   - Database connection issue (check credentials)
   - CORS error (check server.js has cors middleware)
   - API URL wrong (should be `/api`)

### Database Connection Failed

1. Verify Azure Application Settings have correct DB credentials
2. Check MySQL firewall allows Azure services (0.0.0.0)
3. Username must be in format: `username@servername`
4. SSL must be enabled in connection config

### Deployment Failed

1. Check GitHub Actions logs for errors
2. Ensure `npm run build` works locally
3. Check Azure deployment logs in Deployment Center

### 404 on Page Refresh

Make sure `server.js` has the catch-all route for React Router (see server.js example above).

## 📝 Environment Variables

### Local (.env file)
```env
DB_HOST=fitness-app.mysql.database.azure.com
DB_USER=admin@fitness-app
DB_PASSWORD=your_password
DB_NAME=gym_management
JWT_SECRET=your_secret_key
PORT=5000
```

### Azure (Application Settings)
Configure in Azure Portal as shown in section 4 above.

## 🔐 Security Checklist

- ✅ Never commit `.env` file to GitHub
- ✅ Use environment variables for all sensitive data
- ✅ JWT_SECRET should be strong and unique
- ✅ Database passwords should be complex
- ✅ Enable SSL for MySQL connection
- ✅ Use HTTPS only (Azure provides this automatically)

## 📞 Support

If you encounter issues:
1. Check Azure Log Stream for backend errors
2. Check browser console for frontend errors
3. Review GitHub Actions logs for deployment issues

## 🎉 Success Checklist

Before considering deployment complete:

- [ ] Updated API_URL to `/api` in frontend config
- [ ] Updated server.js with correct structure
- [ ] Added all Azure Application Settings
- [ ] Configured MySQL firewall rules
- [ ] Tables created in database
- [ ] Can login as admin
- [ ] Can register new users
- [ ] All features working (coaches, facilities, bookings, etc.)

---

**Live URL**: https://fitness-and-gym-management-agepa2dycfbccge5.canadacentral-01.azurewebsites.net

**GitHub Repository**: [Your Repository Link]

**Azure Resources**:
- Web App: `Fitness-and-Gym-management`
- MySQL Server: `fitness-app.mysql.database.azure.com`