// ─────────────────────────────────────────────────────────────────────────────
//  seedTours.js — Database Seeder
//  Run this once to populate your MongoDB with tour data:
//    npm run seed
//
//  It reads MONGO_URI from your .env file and inserts 5 tours.
//  Safe to run multiple times — it clears old data first.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('../models/Tour');

// ── Tour Data (same as frontend mockData.js) ──────────────────────────────────
const tourData = [
  {
    title: 'Goa Beach Holiday & Heritage',
    location: 'Goa, India',
    duration: '5 Days',
    tourType: 'Relaxation',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560179406-1c6c60e0dcb6?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Experience the ultimate Goan getaway. Discover pristine beaches, vibrant nightlife, and Portuguese heritage. This package includes stays in premium beach resorts and guided tours of Goa\'s most iconic landmarks.',
    facilities: ['Free Wi-Fi', 'Daily Breakfast', 'Airport Transfer', 'English Speaking Guide', 'AC Transport'],
  },
  {
    title: 'Royal Rajasthan Heritage Tour',
    location: 'Rajasthan, India',
    duration: '7 Days',
    tourType: 'Cultural',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615836245337-f839dff0a153?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'A 7-day journey through the heart of royal India. Start in the Pink City of Jaipur, travel through the lakes of Udaipur, and end in the majestic forts of Jodhpur.',
    facilities: ['4-Star Heritage Hotels', 'Monument Passes', 'Guided City Tours', 'Traditional Dinner', 'Private Vehicle'],
  },
  {
    title: 'Kerala Backwaters Retreat',
    location: 'Kerala, India',
    duration: '4 Days',
    tourType: 'Relaxation',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593693397690-362bb9a11566?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605640840428-2d2f70371bc4?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Relax in the serene backwaters of Alleppey and explore the tea gardens of Munnar. This 4-day retreat offers luxurious houseboats, ayurvedic massages, and traditional Kerala cuisine.',
    facilities: ['Houseboat Stay', 'Ayurvedic Massage', 'All Meals Included', 'Spice Plantation Tour', 'AC Transport'],
  },
  {
    title: 'Himalayan Adventure Trek',
    location: 'Himachal Pradesh, India',
    duration: '8 Days',
    tourType: 'Adventure',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605640840428-2d2f70371bc4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Discover the perfect blend of thrilling adventures and serene mountain views. From trekking in Manali to camping under the stars in Spiti Valley, this tour captures the essence of the Himalayas.',
    facilities: ['Trekking Guide', 'Camping Gear', 'Bonfire Meals', 'First Aid Support', 'Permits Included'],
  },
  {
    title: 'Golden Triangle Tour',
    location: 'Delhi, Agra, Jaipur, India',
    duration: '6 Days',
    tourType: 'Cultural',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1564507592208-027f1cce86c4?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564507592208-027f1cce86c4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      "Embark on India's most famous circuit. Witness the bustling streets of Old Delhi, the magnificent Taj Mahal in Agra, and the vibrant culture of Jaipur.",
    facilities: ['Premium Hotels', 'Taj Mahal Sunrise Visit', 'Daily Breakfast', 'Monument Fees', 'AC Vehicle'],
  },
];

// ── Seed Function ─────────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    // Clear existing tours
    await Tour.deleteMany({});
    console.log('🗑️  Cleared existing tours');

    // Insert new tours
    const inserted = await Tour.insertMany(tourData);
    console.log(`✅ Inserted ${inserted.length} tours successfully!`);

    // Print inserted IDs (useful for testing API calls)
    inserted.forEach((t) => console.log(`   📍 ${t.title} → ID: ${t._id}`));

    console.log('\n🎉 Database seeded! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
