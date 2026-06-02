// ─────────────────────────────────────────────────────────────────────────────
//  reviewRoutes.js
//  Reviews operations
// ─────────────────────────────────────────────────────────────────────────────

const express    = require('express');
const router     = express.Router();
const { requireAuth } = require('@clerk/express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');

// ── Validation Middlewares ────────────────────────────────────────────────────
const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters'),
  body('userName').trim().notEmpty().withMessage('User name is required'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/reviews/:tourId
router.get('/:tourId', reviewController.getReviewsByTour);

// POST /api/reviews/:tourId
router.post('/:tourId', requireAuth(), validateReview, reviewController.createReview);

// DELETE /api/reviews/:id
router.delete('/:id', requireAuth(), reviewController.deleteReview);

module.exports = router;
