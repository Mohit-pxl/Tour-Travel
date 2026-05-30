import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TourCard } from '../components/TourCard';
import { useTours } from '../context/ToursContext';

export const Tours = () => {
  const { tours, loading } = useTours(); // Get tours from shared context
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);


  const tourTypes = ['All', 'Cultural', 'Relaxation', 'Adventure', 'Wildlife'];
  const destinationsList = ['All', 'Goa', 'Rajasthan', 'Kerala', 'Himachal Pradesh', 'Delhi'];

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'All' || tour.tourType === typeFilter;

      const matchesDest =
        destinationFilter === 'All' ||
        tour.location.toLowerCase().includes(destinationFilter.toLowerCase());

      let matchesPrice = true;
      if (priceFilter === 'under15k') matchesPrice = tour.price < 15000;
      else if (priceFilter === '15k-20k') matchesPrice = tour.price >= 15000 && tour.price <= 20000;
      else if (priceFilter === 'over20k') matchesPrice = tour.price > 20000;

      let matchesRating = true;
      if (ratingFilter === '4+') matchesRating = tour.rating >= 4;
      else if (ratingFilter === '4.5+') matchesRating = tour.rating >= 4.5;
      else if (ratingFilter === '5') matchesRating = tour.rating === 5;

      return matchesSearch && matchesType && matchesDest && matchesPrice && matchesRating;
    });
  }, [tours, searchTerm, typeFilter, destinationFilter, priceFilter, ratingFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setPriceFilter('All');
    setRatingFilter('All');
    setDestinationFilter('All');
  };

  const activeFiltersCount = [
    typeFilter !== 'All',
    priceFilter !== 'All',
    ratingFilter !== 'All',
    destinationFilter !== 'All',
    searchTerm !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3"
          >
            Explore <span className="text-blue-600 italic">Destinations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-base max-w-xl mx-auto"
          >
            Discover our hand-picked selection of India's most extraordinary experiences.
          </motion.p>
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-8">
          {/* Search Row */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations or packages..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all shadow-sm ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdowns — shown/hidden on mobile, always visible on md+ when open */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">Destination</label>
                    <select
                      value={destinationFilter}
                      onChange={(e) => setDestinationFilter(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                    >
                      {destinationsList.map(dest => (
                        <option key={dest} value={dest}>{dest === 'All' ? 'All Destinations' : dest}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">Tour Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                    >
                      {tourTypes.map(type => (
                        <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">Price Range</label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                    >
                      <option value="All">Any Price</option>
                      <option value="under15k">Under ₹15,000</option>
                      <option value="15k-20k">₹15,000 – ₹20,000</option>
                      <option value="over20k">Over ₹20,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">Rating</label>
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                    >
                      <option value="All">Any Rating</option>
                      <option value="4+">4+ Stars</option>
                      <option value="4.5+">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    <X size={14} /> Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-gray-500 mt-3">
              Showing <span className="font-semibold text-gray-800">{filteredTours.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{tours.length}</span> packages
            </p>
          )}
        </div>

        {/* Tour Cards Grid */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredTours.map((tour, idx) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No packages found</h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search term.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
