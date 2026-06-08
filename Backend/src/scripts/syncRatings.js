require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const Review = require('../models/Review');

const syncRatings = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const tours = await Tour.find();
    console.log(`Found ${tours.length} tours. Syncing ratings...`);

    for (const tour of tours) {
      await Review.calcAverageRatings(tour._id);
    }

    console.log('Done syncing all ratings!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

syncRatings();
