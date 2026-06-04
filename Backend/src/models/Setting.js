// ─────────────────────────────────────────────────────────────────────────────
//  Setting.js — Mongoose Model
//  This stores dynamic site configurations like hero images, colors, etc.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
