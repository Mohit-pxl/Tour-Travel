// ─────────────────────────────────────────────────────────────────────────────
//  isAdmin.js — Middleware
//  Checks if the Clerk-authenticated user has the 'admin' role
//  in their publicMetadata. Returns 403 if not.
//
//  To make a user admin, go to Clerk Dashboard →
//  Users → select user → Metadata → Add: { "role": "admin" }
// ─────────────────────────────────────────────────────────────────────────────

const { clerkClient, getAuth } = require('@clerk/express');
const logger = require('../config/logger');

const isAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== 'admin') {
      logger.warn(`Unauthorized admin access attempt by user: ${userId}`);
      return res.status(403).json({ status: 'error', message: 'Admin access required' });
    }

    next();
  } catch (error) {
    logger.error('isAdmin middleware error: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Authorization check failed' });
  }
};

module.exports = isAdmin;
