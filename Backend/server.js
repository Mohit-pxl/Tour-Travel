// ─────────────────────────────────────────────────────────────────────────────
//  server.js — Main Entry Point
//  This file starts the Express server and connects everything together.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const { clerkMiddleware } = require('@clerk/express');

const connectDB       = require('./src/config/db');
const logger          = require('./src/config/logger');
const tourRoutes      = require('./src/routes/tourRoutes');
const bookingRoutes   = require('./src/routes/bookingRoutes');
const contactRoutes   = require('./src/routes/contactRoutes');
const reviewRoutes    = require('./src/routes/reviewRoutes');
const adminRoutes     = require('./src/routes/adminRoutes');

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // limit each IP to 200 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter for auth-sensitive endpoints
  message: { status: 'error', message: 'Too many requests, please slow down.' },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = { 
  origin: process.env.CLIENT_URL, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(clerkMiddleware());
app.use('/api/', limiter); // Apply rate limit to all API routes

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running! 🚀', env: process.env.NODE_ENV });
});

app.use('/api/tours',    tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong',
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`✅ Server running on http://localhost:${PORT}`);
  logger.info(`📋 Health: http://localhost:${PORT}/api/health`);
});
