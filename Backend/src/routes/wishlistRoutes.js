const express = require('express');
const { requireAuth } = require('@clerk/express');
const {
  getWishlist,
  toggleWishlistItem,
  syncWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

// Apply Clerk's requireAuth middleware to protect all wishlist routes
router.use(requireAuth());

router.route('/')
  .get(getWishlist);

router.route('/toggle')
  .post(toggleWishlistItem);

router.route('/sync')
  .post(syncWishlist);

module.exports = router;
