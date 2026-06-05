// ─────────────────────────────────────────────────────────────────────────────
//  Review.js — Mongoose Model
//  Stores user reviews for tours. One review per user per tour.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
      index: true,
    },
    clerkUserId: {
      type: String,
      required: [true, 'Review must belong to a user'],
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// One review per user per tour
reviewSchema.index({ tourId: 1, clerkUserId: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tourId: tourId }
    },
    {
      $group: {
        _id: '$tourId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      reviews: stats[0].nRating,
      rating: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      reviews: 0,
      rating: 0
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tourId);
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calcAverageRatings(this.tourId);
});

module.exports = mongoose.model('Review', reviewSchema);
