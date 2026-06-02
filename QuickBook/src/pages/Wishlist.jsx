import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Heart, ArrowRight, Trash2, Package } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTours } from '../context/ToursContext';
import { useWishlist } from '../context/WishlistContext';
import { TourCard } from '../components/TourCard';

export const Wishlist = () => {
  const { tours, loading } = useTours();
  const { wishlist, toggleWishlist } = useWishlist();

  const wishlistedTours = tours.filter(t => wishlist.includes(t._id || t.id));

  return (
    <>
      <Helmet>
        <title>My Wishlist — TripQuick</title>
        <meta name="description" content="Your saved tours and dream destinations on TripQuick." />
      </Helmet>

      <div className="min-h-screen bg-transparent pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart size={20} className="text-red-500 fill-red-500" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-500">
              {wishlistedTours.length === 0
                ? 'You have no saved tours yet.'
                : `You have ${wishlistedTours.length} saved tour${wishlistedTours.length > 1 ? 's' : ''}.`}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : wishlistedTours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-2xl border border-gray-100"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={44} className="text-red-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Browse our tours and click the ❤️ heart icon to save your favourite destinations.
              </p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Tours <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (window.confirm('Clear all saved tours?')) {
                      wishlistedTours.forEach(t => toggleWishlist(t._id || t.id));
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  <Trash2 size={15} /> Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedTours.map((tour, idx) => (
                  <motion.div
                    key={tour._id || tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
