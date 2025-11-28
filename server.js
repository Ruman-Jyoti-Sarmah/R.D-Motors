// ============================================
// R.D Motors - Secure Backend Server
// ============================================

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const inquiriesRoutes = require('./routes/inquiries');

// Import database
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Security Middleware
// ============================================

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);

// ============================================
// Body Parsing & Session
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  }
}));

// ============================================
// Static Files
// ============================================

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve main website files
app.use(express.static(__dirname));

// ============================================
// API Routes
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// ============================================
// Page Routes
// ============================================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ============================================
// Error Handling
// ============================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({ error: message });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     R.D Motors Server Started             ║
  ╠═══════════════════════════════════════════╣
  ║  🚗 Server:  http://localhost:${PORT}         ║
  ║  🔧 Admin:   http://localhost:${PORT}/admin   ║
  ║  📡 API:     http://localhost:${PORT}/api     ║
  ║  🌍 Mode:    ${process.env.NODE_ENV || 'development'}                  ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
