// ─────────────────────────────────────────────────────────────────────────────
//  tourController.js
//  Handles tour-related logic.
// ─────────────────────────────────────────────────────────────────────────────

const Tour = require('../models/Tour');
const logger = require('../config/logger');

// ── GET /api/tours ────────────────────────────────────────────────────────────
exports.getAllTours = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.tourType && req.query.tourType !== 'All') {
      filter.tourType = req.query.tourType;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const tours = await Tour.find(filter).sort({ rating: -1 });
    logger.info(`Fetched ${tours.length} tours`);

    res.json({ status: 'success', results: tours.length, data: { tours } });
  } catch (error) {
    logger.error('Error fetching tours: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch tours' });
  }
};

// ── GET /api/tours/:id ────────────────────────────────────────────────────────
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ status: 'error', message: 'Tour not found' });
    }

    res.json({ status: 'success', data: { tour } });
  } catch (error) {
    logger.error('Error fetching tour: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch tour' });
  }
};
