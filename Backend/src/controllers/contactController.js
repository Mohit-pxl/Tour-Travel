// ─────────────────────────────────────────────────────────────────────────────
//  contactController.js
//  Handles contact form submissions.
// ─────────────────────────────────────────────────────────────────────────────

const { getAuth } = require('@clerk/express');
const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const logger = require('../config/logger');

// ── POST /api/contact ─────────────────────────────────────────────────────────
exports.submitContactMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { userId } = getAuth(req);
    const { firstName, lastName, email, message } = req.body;

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
};
