// ─────────────────────────────────────────────────────────────────────────────
//  contactRoutes.js
//  Protected route — user must be logged in to send a message.
// ─────────────────────────────────────────────────────────────────────────────

const express             = require('express');
const router              = express.Router();
const { requireAuth, getAuth } = require('@clerk/express');
const Contact             = require('../models/Contact');
const logger              = require('../config/logger');

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Save a contact form message. Requires login.
router.post('/', requireAuth(), async (req, res) => {
  try {
    // Get the logged-in user's ID from Clerk
    const { userId } = getAuth(req);

    const { firstName, lastName, email, message } = req.body;

    // Check all fields are provided
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        status:  'error',
        message: 'Please fill in all fields',
      });
    }

    // Save to MongoDB
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
      clerkUserId: userId,
    });

    logger.info(`New contact message from: ${email} | User: ${userId}`);

    res.status(201).json({
      status:  'success',
      message: 'Message sent! We will get back to you soon. 📬',
      data:    { contact },
    });
  } catch (error) {
    logger.error('Error saving contact message: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not send message' });
  }
});

module.exports = router;
