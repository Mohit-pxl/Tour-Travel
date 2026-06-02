import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Mail, User, Calendar, Package, TrendingUp, Heart, ArrowRight, Edit3, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { apiGet } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

export const Profile = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { wishlist } = useWishlist();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiGet('/bookings/mine', getToken);
        setBookings(data.data.bookings);
      } catch (_) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [getToken]);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalSpent = confirmedBookings.reduce((s, b) => s + b.totalPrice, 0);
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const upcomingBookings = confirmedBookings.filter(b => new Date(b.date) >= new Date());

  return (
    <>
      <Helmet>
        <title>My Profile — TripQuick</title>
        <meta name="description" content="Manage your TripQuick profile and view your travel stats." />
      </Helmet>

      <div className="min-h-screen bg-transparent pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="relative">
                  <img
                    src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=3b82f6&color=fff&size=80`}
                    alt={user?.fullName}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <a
                  href="https://accounts.clerk.com/user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <Edit3 size={14} /> Edit Profile <ExternalLink size={12} />
                </a>
              </div>

              <h1 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Traveler'}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail size={15} className="text-blue-500" />
                  {user?.emailAddresses?.[0]?.emailAddress || '—'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-blue-500" />
                  Member since {joinDate}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: Package, label: 'Total Trips',    value: bookings.length,            color: 'blue' },
              { icon: TrendingUp, label: 'Upcoming',    value: upcomingBookings.length,    color: 'green' },
              { icon: Heart, label: 'Wishlist',         value: wishlist.length,            color: 'red' },
              { icon: TrendingUp, label: 'Total Spent', value: `₹${(totalSpent/1000).toFixed(0)}K`, color: 'purple' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={20} className={`text-${color}-500`} />
                </div>
                <p className="text-xl font-bold text-gray-900">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link
              to="/dashboard"
              className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">My Bookings</p>
                  <p className="text-xs text-gray-400">{bookings.length} total bookings</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">My Wishlist</p>
                  <p className="text-xs text-gray-400">{wishlist.length} saved tours</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-red-400 transition-colors" />
            </Link>
          </motion.div>

          {/* Recent Bookings Preview */}
          {bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Trips</h2>
                <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all →</Link>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map(b => (
                  <div key={b._id} className="flex items-center gap-3">
                    <img src={b.tourImage} alt={b.tourTitle} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{b.tourTitle}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}₹{b.totalPrice?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};
