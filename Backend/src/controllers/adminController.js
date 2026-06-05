// ─────────────────────────────────────────────────────────────────────────────
//  adminController.js
//  Handles admin operations.
// ─────────────────────────────────────────────────────────────────────────────

const { validationResult } = require('express-validator');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Setting = require('../models/Setting');
const logger = require('../config/logger');

// ── POST /api/admin/upload ────────────────────────────────────────────────────
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ status: 'success', data: { url } });
  } catch (error) {
    logger.error('Upload error: ' + error.message);
    res.status(500).json({ status: 'error', message: 'File upload failed' });
  }
};

// ── PUT /api/admin/settings/:key ──────────────────────────────────────────────
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ status: 'error', message: 'Value is required' });
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    logger.info(`Admin updated setting: ${key}`);
    res.json({ status: 'success', data: { setting } });
  } catch (error) {
    logger.error('Update setting error: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not update setting' });
  }
};

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalTours, totalBookings, totalRevenue, recentBookings] = await Promise.all([
      Tour.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      status: 'success',
      data: {
        totalTours,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentBookings,
      },
    });
  } catch (error) {
    logger.error('Admin stats error: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch stats' });
  }
};

// ── GET /api/admin/tours ──────────────────────────────────────────────────────
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json({ status: 'success', results: tours.length, data: { tours } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not fetch tours' });
  }
};

// ── POST /api/admin/tours ─────────────────────────────────────────────────────
exports.createTour = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const tour = await Tour.create(req.body);
    logger.info(`Admin created new tour: ${tour.title}`);
    res.status(201).json({ status: 'success', data: { tour } });
  } catch (error) {
    logger.error('Admin create tour error: ' + error.message);
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ── PATCH /api/admin/tours/:id ────────────────────────────────────────────────
exports.updateTour = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!tour) return res.status(404).json({ status: 'error', message: 'Tour not found' });
    logger.info(`Admin updated tour: ${tour.title}`);
    res.json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ── DELETE /api/admin/tours/:id ───────────────────────────────────────────────
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!tour) return res.status(404).json({ status: 'error', message: 'Tour not found' });
    logger.info(`Admin soft-deleted tour: ${tour.title}`);
    res.json({ status: 'success', message: 'Tour deactivated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not delete tour' });
  }
};

// ── GET /api/admin/bookings ───────────────────────────────────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    const page  = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(),
    ]);

    res.json({
      status: 'success',
      results: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Could not fetch bookings' });
  }
};
