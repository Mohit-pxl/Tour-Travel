// ─────────────────────────────────────────────────────────────────────────────
//  Tour.js — Mongoose Model
//  This defines the shape of a Tour document in MongoDB.
//  It matches the mockData.js structure exactly so we can seed it easily.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    duration: {
      type: String,   // e.g., "5 Days"
      required: true,
    },
    tourType: {
      type: String,
      enum: ['Cultural', 'Relaxation', 'Adventure', 'Wildlife'],
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    image: {
      type: String,  // Main cover image URL
      required: true,
    },
    images: [String],  // Array of additional image URLs
    description: {
      type: String,
      required: true,
    },
    facilities: [String],  // e.g., ["Free Wi-Fi", "Daily Breakfast"]
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Tour', tourSchema);
