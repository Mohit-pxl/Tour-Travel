const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
