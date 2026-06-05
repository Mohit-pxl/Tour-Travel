const Wishlist = require('../models/Wishlist');
const logger = require('../config/logger');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    let wishlist = await Wishlist.findOne({ clerkUserId });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ clerkUserId, tours: [] });
    }

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: wishlist.tours
      }
    });
  } catch (error) {
    logger.error("Error in getWishlist:", error);
    next(error);
  }
};

// @desc    Toggle tour in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlistItem = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    const { tourId } = req.body;
    logger.info(`Toggling wishlist for user ${clerkUserId}, tourId ${tourId}`);

    if (!clerkUserId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!tourId) {
      return res.status(400).json({ status: 'error', message: 'Please provide a tour ID' });
    }

    let wishlist = await Wishlist.findOne({ clerkUserId });

    if (!wishlist) {
      logger.info('Wishlist not found, creating new one');
      wishlist = await Wishlist.create({ clerkUserId, tours: [tourId] });
      return res.status(200).json({
        status: 'success',
        message: 'Added to wishlist',
        data: { wishlist: wishlist.tours }
      });
    }

    const index = wishlist.tours.findIndex(id => id.toString() === tourId.toString());
    logger.info(`Tour found at index ${index}`);
    
    if (index > -1) {
      wishlist.tours.splice(index, 1);
      await wishlist.save();
      logger.info('Removed from wishlist successfully');
      return res.status(200).json({
        status: 'success',
        message: 'Removed from wishlist',
        data: { wishlist: wishlist.tours }
      });
    } else {
      wishlist.tours.push(tourId);
      await wishlist.save();
      logger.info('Added to wishlist successfully');
      return res.status(200).json({
        status: 'success',
        message: 'Added to wishlist',
        data: { wishlist: wishlist.tours }
      });
    }
  } catch (error) {
    logger.error("Error in toggleWishlistItem:", error);
    next(error);
  }
};

// @desc    Sync local wishlist with DB on login
// @route   POST /api/wishlist/sync
// @access  Private
exports.syncWishlist = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;
    const { localWishlist } = req.body;
    logger.info(`Syncing wishlist for user ${clerkUserId} with local: ${JSON.stringify(localWishlist)}`);

    if (!clerkUserId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    let wishlist = await Wishlist.findOne({ clerkUserId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ clerkUserId, tours: localWishlist || [] });
    } else if (localWishlist && Array.isArray(localWishlist) && localWishlist.length > 0) {
      // Merge local wishlist with DB, removing duplicates
      const mergedTours = [...new Set([...wishlist.tours.map(t => t.toString()), ...localWishlist])];
      wishlist.tours = mergedTours;
      await wishlist.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: wishlist.tours
      }
    });
  } catch (error) {
    logger.error("Error in syncWishlist:", error);
    next(error);
  }
};
