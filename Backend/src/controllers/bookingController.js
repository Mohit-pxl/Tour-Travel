// ─────────────────────────────────────────────────────────────────────────────
//  bookingController.js
//  Handles booking creation, retrieval, and cancellation.
// ─────────────────────────────────────────────────────────────────────────────

const { getAuth } = require('@clerk/express');
const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const logger = require('../config/logger');

// ── POST /api/bookings ────────────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { userId } = getAuth(req);
    const { tourId, userName, userEmail, guests, date } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ status: 'error', message: 'Tour not found' });

    const baseTotal  = tour.price * Number(guests);
    const totalPrice = Math.round(baseTotal * 1.05);

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

    res.status(201).json({ status: 'success', message: 'Booking confirmed! 🎉', data: { booking } });
  } catch (error) {
    logger.error('Error creating booking: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not create booking' });
  }
};

// ── GET /api/bookings/mine ────────────────────────────────────────────────────
exports.getMyBookings = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const bookings = await Booking.find({ clerkUserId: userId }).sort({ createdAt: -1 });
    res.json({ status: 'success', results: bookings.length, data: { bookings } });
  } catch (error) {
    logger.error('Error fetching bookings: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch bookings' });
  }
};

// ── PATCH /api/bookings/:id/cancel ────────────────────────────────────────────
exports.cancelBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking not found' });
    if (booking.clerkUserId !== userId) return res.status(403).json({ status: 'error', message: 'Not authorized' });
    if (booking.status === 'cancelled') return res.status(400).json({ status: 'error', message: 'Already cancelled' });

    booking.status = 'cancelled';
    await booking.save();

    logger.info(`Booking cancelled: ${booking._id} by User: ${userId}`);
    res.json({ status: 'success', message: 'Booking cancelled successfully', data: { booking } });
  } catch (error) {
    logger.error('Error cancelling booking: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not cancel booking' });
  }
};
