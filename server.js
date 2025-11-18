/**
 * Express Server - Peer Learning Session Manager
 * MERN Stack Backend
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Session middleware - SECURE configuration to prevent session sharing
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // CSRF protection
  },
  name: 'sessionId' // Custom session cookie name
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

// Debug middleware - log authenticated user for each request
app.use((req, res, next) => {
  if (req.user) {
    console.log(`[${new Date().toISOString()}] User: ${req.user.name} (${req.user.userId}) - ${req.method} ${req.path}`);
  }
  next();
});

// ==================== Database Connection ====================
const connectDB = async () => {
  try {
    // Support both MONGODB_URI and MONGODB_ATLAS environment variable names
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS || 'mongodb://localhost:27017/navpeerlearning';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('Make sure MongoDB is running: sudo systemctl start mongod');
    process.exit(1);
  }
};

connectDB();

// ==================== Import Routes ====================
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const badgeRoutes = require('./routes/badges');

// ==================== Routes ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route - useful for platforms like Render which expect a response at '/'
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Peer Learning Backend</title></head>
      <body style="font-family: Arial, sans-serif; background:#0f172a; color:#e6edf3; display:flex; align-items:center; justify-content:center; height:100vh;">
        <div style="max-width:720px; text-align:center;">
          <h1 style="color:#a78bfa;">Peer Learning Backend</h1>
          <p>API is available under <a href="/api" style="color:#60a5fa;">/api</a></p>
          <p>Health check: <a href="/api/health" style="color:#60a5fa;">/api/health</a></p>
          <p style="margin-top:16px; color:#93c5fd; font-size:0.9rem;">If you see this page on Render, the server is running.</p>
        </div>
      </body>
    </html>
  `);
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/auth', authRoutes);

// ==================== Start Server ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Peer Learning Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
