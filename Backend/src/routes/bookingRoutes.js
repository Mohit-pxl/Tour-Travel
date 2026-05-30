// ─────────────────────────────────────────────────────────────────────────────
//  bookingRoutes.js
//  Protected routes — user must be logged in via Clerk to book.
//  requireAuth() checks the Clerk token sent from the frontend.
// ─────────────────────────────────────────────────────────────────────────────

const express             = require('express');
const router              = express.Router();
const { requireAuth, getAuth } = require('@clerk/express');
const Booking             = require('../models/Booking');
const Tour                = require('../models/Tour');
const logger              = require('../config/logger');

// ── POST /api/bookings ────────────────────────────────────────────────────────
// Create a new booking. Requires login.
router.post('/', requireAuth(), async (req, res) => {
  try {
    // Get the logged-in user's ID from Clerk
    const { userId } = getAuth(req);

    const { tourId, userName, userEmail, guests, date } = req.body;

    // Check all fields are provided
    if (!tourId || !userName || !userEmail || !guests || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Please fill in all booking fields',
      });
    }

    // Check the tour exists in the database
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ status: 'error', message: 'Tour not found' });
    }

    // Calculate total price (price × guests + 5% service fee)
    const baseTotal  = tour.price * Number(guests);
    const totalPrice = Math.round(baseTotal * 1.05);

    // Save the booking to MongoDB
    const booking = await Booking.create({
      tourId:        tour._id,
      tourTitle:     tour.title,
      tourImage:     tour.image,
      userName,
      userEmail,
      guests:        Number(guests),
      date:          new Date(date),
      pricePerPerson: tour.price,
      totalPrice,
      clerkUserId:   userId,
      status:        'confirmed',
    });

    logger.info(`New booking: ${booking._id} | Tour: ${tour.title} | User: ${userId}`);

    res.status(201).json({
      status:  'success',
      message: 'Booking confirmed! 🎉',
      data:    { booking },
    });
  } catch (error) {
    logger.error('Error creating booking: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not create booking' });
  }
});

// ── GET /api/bookings/mine ────────────────────────────────────────────────────
// Get all bookings for the logged-in user. Requires login.
router.get('/mine', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const bookings = await Booking.find({ clerkUserId: userId }).sort({ createdAt: -1 });

    res.json({
      status:  'success',
      results: bookings.length,
      data:    { bookings },
    });
  } catch (error) {
    logger.error('Error fetching bookings: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch bookings' });
  }
});

module.exports = router;
