// ─────────────────────────────────────────────────────────────────────────────
//  AppError.js — Custom Error Class
//
//  Use this to create errors with a specific HTTP status code.
//  Example:
//    throw new AppError('Tour not found', 404);
//    throw new AppError('Please fill all fields', 400);
// ─────────────────────────────────────────────────────────────────────────────

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);              // Set the error message
    this.statusCode = statusCode; // e.g. 400, 401, 404, 500
    this.isOperational = true;   // Mark as a known/expected error

    // Keeps the stack trace clean (removes AppError constructor from it)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
