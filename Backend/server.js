// ─────────────────────────────────────────────────────────────────────────────
//  server.js — Main Entry Point
//  This file starts the Express server and connects everything together.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config(); // Load .env file variables

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const { clerkMiddleware } = require('@clerk/express');

const connectDB      = require('./src/config/db');
const logger         = require('./src/config/logger');
const tourRoutes     = require('./src/routes/tourRoutes');
const bookingRoutes  = require('./src/routes/bookingRoutes');
const contactRoutes  = require('./src/routes/contactRoutes');

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());                                           // Security headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow frontend
app.use(express.json());                                     // Read JSON request body
app.use(morgan('dev'));                                       // Log HTTP requests
app.use(clerkMiddleware());                                  // Enable Clerk auth on all routes

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running! 🚀' });
});

app.use('/api/tours',    tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact',  contactRoutes);

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
