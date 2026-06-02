// ─────────────────────────────────────────────────────────────────────────────
//  logger.js — Winston Logger (Simple Version)
//
//  Creates a logger that writes to:
//   1. Console (colorful, easy to read during development)
//   2. logs/app.log   (all log messages)
//   3. logs/error.log (only error messages)
//
//  How to use it in any file:
//    const logger = require('../config/logger');
//    logger.info('Server started');
//    logger.error('Something broke', error);
//    logger.warn('Watch out');
// ─────────────────────────────────────────────────────────────────────────────

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Create the logs directory if it doesn't exist yet
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ── Format for Console: timestamp + color + readable message ─────────────────
const consoleFormat = format.combine(
  format.colorize(),                              // e.g. green for info, red for error
  format.timestamp({ format: 'HH:mm:ss' }),       // short time like 16:05:23
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// ── Format for Files: timestamp + level + message as plain text ───────────────
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),   // includes stack trace for errors
  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

const transportsList = [
  new transports.Console({ format: consoleFormat })
];

if (process.env.NODE_ENV === 'production') {
  transportsList.push(
    new transports.File({
      filename: path.join(logsDir, 'app.log'),
      format: fileFormat,
    }),
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    })
  );
}

// ── Create the logger ─────────────────────────────────────────────────────────
const logger = createLogger({
  level: 'info',
  transports: transportsList,
});

// ── Morgan stream — lets Morgan HTTP logs go through Winston ──────────────────
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
