// ─────────────────────────────────────────────────────────────────────────────
//  tourController.js
//  Handles tour-related requests. Tours are PUBLIC — no login needed to view them.
// ─────────────────────────────────────────────────────────────────────────────

const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// ── GET /api/tours ────────────────────────────────────────────────────────────
// Returns all active tours. Supports optional query filters:
//   ?tourType=Adventure   → filter by type
//   ?search=goa           → search title or location
const getAllTours = catchAsync(async (req, res) => {
  // Build a filter object from query parameters
  const filter = { isActive: true };

  if (req.query.tourType && req.query.tourType !== 'All') {
    filter.tourType = req.query.tourType;
  }

  if (req.query.search) {
    // Case-insensitive search in title and location
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { location: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const tours = await Tour.find(filter).sort({ rating: -1 });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// ── GET /api/tours/:id ────────────────────────────────────────────────────────
// Returns a single tour by its MongoDB ID
const getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  // If no tour found, pass a 404 error to the global error handler
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

module.exports = { getAllTours, getTourById };
