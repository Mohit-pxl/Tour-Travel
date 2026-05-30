// ─────────────────────────────────────────────────────────────────────────────
//  Contact.js — Mongoose Model
//  Stores messages submitted through the Contact page form.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
    // Clerk user ID of the logged-in user who sent the message
    clerkUserId: {
      type: String,
      required: true,
    },
    // Whether the support team has read/responded to this message
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);
