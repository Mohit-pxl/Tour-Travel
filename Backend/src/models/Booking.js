// ─────────────────────────────────────────────────────────────────────────────
//  Booking.js — Mongoose Model
//  Stores tour booking information submitted from the BookingForm.
//  We store the clerkUserId so we can fetch each user's own bookings.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Which tour was booked (links to the Tour collection)
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },

    // Copy the title so we still have it even if the tour is deleted
    tourTitle: {
      type: String,
      required: true,
    },

    tourImage: {
      type: String,
    },

    // Guest details submitted in the BookingForm
    userName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },

    // Booking options
    guests: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest required'],
      max: [20, 'Maximum 20 guests allowed'],
    },
    date: {
      type: Date,
      required: [true, 'Travel date is required'],
    },

    // Price breakdown
    pricePerPerson: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    // Clerk user ID — identifies WHO made the booking
    clerkUserId: {
      type: String,
      required: true,
      index: true,  // Index for fast lookups like "get MY bookings"
    },

    // Booking status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
