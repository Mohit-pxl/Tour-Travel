// ─────────────────────────────────────────────────────────────────────────────
//  db.js — MongoDB Atlas Connection
//
//  Call connectDB() once at server startup.
//  It reads MONGO_URI from your .env file and connects to MongoDB Atlas.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Stop the server if DB can't connect
  }
};

module.exports = connectDB;
