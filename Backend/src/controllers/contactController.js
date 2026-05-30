// ─────────────────────────────────────────────────────────────────────────────
//  contactController.js
//  Saves contact form submissions to MongoDB. Requires login.
// ─────────────────────────────────────────────────────────────────────────────

const Contact = require('../models/Contact');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { getAuth } = require('@clerk/express');
const logger = require('../config/logger');

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Saves a contact message from the logged-in user
const sendMessage = catchAsync(async (req, res, next) => {
  // Get the Clerk user ID of the logged-in user
  const { userId } = getAuth(req);

  const { firstName, lastName, email, message } = req.body;

  // --- Basic validation ---
  if (!firstName || !lastName || !email || !message) {
    return next(new AppError('Please fill in all fields', 400));
  }

  if (message.length < 10) {
    return next(new AppError('Message must be at least 10 characters', 400));
  }

  // --- Save to database ---
  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    message,
    clerkUserId: userId,
  });

  logger.info(`New contact message received`, {
    contactId: contact._id,
    email,
    userId,
  });

  res.status(201).json({
    status: 'success',
    message: 'Your message has been sent! We will get back to you soon. 📬',
    data: { contact },
  });
});

module.exports = { sendMessage };
