// ─────────────────────────────────────────────────────────────────────────────
//  bookingController.js
//  Handles booking creation and retrieval. ALL routes require login (Clerk).
// ─────────────────────────────────────────────────────────────────────────────

const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { getAuth } = require('@clerk/express');
const logger = require('../config/logger');

// ── POST /api/bookings ────────────────────────────────────────────────────────
// Creates a new booking for the logged-in user
const createBooking = catchAsync(async (req, res, next) => {
  // Get the logged-in user's Clerk ID from the verified token
  const { userId } = getAuth(req);

  const { tourId, userName, userEmail, guests, date } = req.body;

  // --- Basic validation ---
  if (!tourId || !userName || !userEmail || !guests || !date) {
    return next(new AppError('Please provide all required booking details', 400));
  }

  // --- Check that the tour exists ---
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // --- Calculate price ---
  const serviceFeeRate = 0.05; // 5%
  const baseTotal = tour.price * guests;
  const totalPrice = baseTotal + baseTotal * serviceFeeRate;

  // --- Create the booking ---
  const booking = await Booking.create({
    tourId: tour._id,
    tourTitle: tour.title,
    tourImage: tour.image,
    userName,
    userEmail,
    guests,
    date: new Date(date),
    pricePerPerson: tour.price,
    totalPrice: Math.round(totalPrice),
    clerkUserId: userId,
    status: 'confirmed',
  });

  logger.info(`New booking created`, {
    bookingId: booking._id,
    tourTitle: tour.title,
    userId,
  });

  res.status(201).json({
    status: 'success',
    message: 'Booking confirmed! 🎉',
    data: { booking },
  });
});

// ── GET /api/bookings/mine ────────────────────────────────────────────────────
// Returns all bookings for the currently logged-in user
const getMyBookings = catchAsync(async (req, res) => {
  const { userId } = getAuth(req);

  const bookings = await Booking.find({ clerkUserId: userId })
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

module.exports = { createBooking, getMyBookings };
