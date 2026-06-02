// ─────────────────────────────────────────────────────────────────────────────
//  bookingRoutes.js
//  Protected routes — user must be logged in via Clerk to book.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const { requireAuth } = require('@clerk/express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');

// ── Validation Middlewares ────────────────────────────────────────────────────
const validateBooking = [
  body('tourId').isMongoId().withMessage('Invalid Tour ID'),
  body('userName').trim().notEmpty().withMessage('Name is required'),
  body('userEmail').isEmail().withMessage('Valid email is required'),
  body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
  body('date').isISO8601().toDate().withMessage('Valid date is required'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/bookings (Create a booking)
router.post('/', requireAuth(), validateBooking, bookingController.createBooking);

// GET /api/bookings/mine (Get user's bookings)
router.get('/mine', requireAuth(), bookingController.getMyBookings);

// POST /api/bookings/:id/cancel (Cancel a booking)
router.post('/:id/cancel', requireAuth(), bookingController.cancelBooking);

module.exports = router;
