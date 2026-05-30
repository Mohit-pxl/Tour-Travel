// ─────────────────────────────────────────────────────────────────────────────
//  notFound.js — 404 Handler
//  Catches any request that doesn't match a defined route
// ─────────────────────────────────────────────────────────────────────────────

const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFound;
