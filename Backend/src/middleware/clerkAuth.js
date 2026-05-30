// ─────────────────────────────────────────────────────────────────────────────
//  clerkAuth.js — Clerk Authentication Middleware
//
//  How it works:
//  1. The frontend (React) gets a JWT token from Clerk after login
//  2. It sends that token in the Authorization header: "Bearer <token>"
//  3. This middleware verifies the token using Clerk's SDK
//  4. If valid → req.auth.userId is set and the request continues
//  5. If invalid → a 401 Unauthorized error is returned
// ─────────────────────────────────────────────────────────────────────────────

const { requireAuth } = require('@clerk/express');

// Simply re-export Clerk's requireAuth middleware.
// Usage in routes:  router.post('/', requireAuth(), yourController)
module.exports = { requireAuth };
