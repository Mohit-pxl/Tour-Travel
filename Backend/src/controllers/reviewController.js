// ─────────────────────────────────────────────────────────────────────────────
//  reviewController.js
//  Handles tour reviews.
// ─────────────────────────────────────────────────────────────────────────────

const { getAuth } = require('@clerk/express');
const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Tour = require('../models/Tour');
const logger = require('../config/logger');

// ── GET /api/reviews/:tourId ──────────────────────────────────────────────────
exports.getReviewsByTour = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId }).sort({ createdAt: -1 });
    res.json({ status: 'success', results: reviews.length, data: { reviews } });
  } catch (error) {
    logger.error('Error fetching reviews: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch reviews' });
  }
};

// ── POST /api/reviews/:tourId ─────────────────────────────────────────────────
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { userId } = getAuth(req);
    const { rating, comment, userName, userAvatar } = req.body;

    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ status: 'error', message: 'Tour not found' });

    // Ensure user hasn't already reviewed this tour
    const existingReview = await Review.findOne({ tourId: tour._id, clerkUserId: userId });
    if (existingReview) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this tour' });
    }

    const review = await Review.create({
      tourId: tour._id,
      clerkUserId: userId,
      userName,
      userAvatar,
      rating,
      comment,
    });

    logger.info(`New review for ${tour.title} by ${userName}`);
    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) {
    logger.error('Error creating review: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not submit review' });
  }
};

// ── DELETE /api/reviews/:id ───────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    if (review.clerkUserId !== userId) return res.status(403).json({ status: 'error', message: 'Not authorized' });

    await review.deleteOne();
    
    logger.info(`Review deleted: ${review._id} by User: ${userId}`);
    res.json({ status: 'success', message: 'Review deleted successfully' });
  } catch (error) {
    logger.error('Error deleting review: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not delete review' });
  }
};
