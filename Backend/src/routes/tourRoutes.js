// ─────────────────────────────────────────────────────────────────────────────
//  tourRoutes.js
//  Public routes — anyone can view tours without logging in.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const tourController = require('../controllers/tourController');

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/tours (Get all tours with optional filters)
router.get('/', tourController.getAllTours);

// GET /api/tours/:id (Get one tour)
router.get('/:id', tourController.getTourById);

module.exports = router;
