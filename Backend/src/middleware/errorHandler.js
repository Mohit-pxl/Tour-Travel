// ─────────────────────────────────────────────────────────────────────────────
//  errorHandler.js — Global Error Handler
//
//  This runs whenever you call next(error) or throw inside catchAsync().
//  It logs the error using Winston and sends a clean JSON response to the client.
//
//  Express requires EXACTLY 4 parameters (err, req, res, next) to treat
//  a middleware as an error handler.
// ─────────────────────────────────────────────────────────────────────────────

const logger = require('../config/logger');

const globalErrorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Default to 500 Internal Server Error if no status code is set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong. Please try again.';

  // Log the error with Winston (stack trace included for 500 errors)
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} → ${statusCode}: ${message}\n${err.stack}`);
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} → ${statusCode}: ${message}`);
  }

  // Handle Mongoose: invalid MongoDB ID (e.g., /tours/abc instead of a real ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: `Invalid ID: "${err.value}" is not a valid ID format.`,
    });
  }

  // Handle Mongoose: duplicate key (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      status: 'error',
      message: `A record with this ${field} already exists.`,
    });
  }

  // Handle Mongoose: validation error (schema rules failed)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      status: 'error',
      message: messages.join(', '),
    });
  }

  // For known/operational errors (thrown with new AppError), send the message
  // For unknown errors (bugs), hide the real message in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(statusCode).json({
    status: 'error',
    message: err.isOperational || !isProduction ? message : 'Something went wrong. Please try again.',
  });
};

module.exports = globalErrorHandler;
