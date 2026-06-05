import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
  MapPin, Calendar, Users, Clock, CheckCircle2,
  XCircle, AlertCircle, Loader2, Package, ArrowRight,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { apiGet, apiFetch } from '../services/api';

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'text-green-700 bg-green-100 border-green-200', icon: CheckCircle2 },
  pending:   { label: 'Pending',   color: 'text-yellow-700 bg-yellow-100 border-yellow-200', icon: AlertCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-100 border-red-200', icon: XCircle },
};

const BookingCard = ({ booking, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await onCancel(booking._id);
    } finally {
      setCancelling(false);
    }
  };

  const travelDate = new Date(booking.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const bookedOn = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Tour Image */}
        <div className="w-full sm:w-52 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100">
          <img
            src={booking.tourImage || 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400'}
            alt={booking.tourTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r pointer-events-none" />
        </div>

        {/* Booking Info */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-base font-bold text-gray-900 mb-1 break-words">{booking.tourTitle}</h3>
              <p className="text-xs text-gray-400 truncate">Booking ID: #{String(booking._id).slice(-8).toUpperCase()}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border whitespace-nowrap shrink-0 ${status.color}`}>
              <StatusIcon size={12} className="sm:w-[13px] sm:h-[13px]" /> {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
              <Calendar size={15} className="text-blue-500 flex-shrink-0" />
              <span className="truncate">{travelDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
              <Users size={15} className="text-blue-500 flex-shrink-0" />
              <span className="truncate">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 truncate col-span-2 sm:col-span-1">
              <span className="truncate">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-center sm:flex-row justify-between mt-4 pt-3 border-t border-gray-100 gap-3 sm:gap-0">
            <p className="text-[10px] sm:text-xs text-gray-400">Booked on {bookedOn}</p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {booking.status === 'confirmed' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  {cancelling ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                  Cancel
                </button>
              )}
              <button
                onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-3 py-1.5 rounded-lg ml-auto"
              >
                {expanded ? 'Hide' : 'Details'}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5">Price per person</p>
                    <p className="font-semibold truncate">₹{booking.pricePerPerson?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5">Service fee (5%)</p>
                    <p className="font-semibold truncate">₹{Math.round(booking.pricePerPerson * booking.guests * 0.05).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5">Guest name</p>
                    <p className="font-semibold truncate">{booking.userName}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5">Contact email</p>
                    <p className="font-semibold truncate" title={booking.userEmail}>{booking.userEmail}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiGet('/bookings/mine', getToken);
        setBookings(data.data.bookings);
      } catch (err) {
        toast.error('Failed to load bookings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getToken]);

  const handleCancel = async (bookingId) => {
    try {
      await apiFetch(`/bookings/${bookingId}/cancel`, getToken, { method: 'POST' });
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.message || 'Could not cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    spent:     bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0),
  };

  return (
    <>
      <Helmet>
        <title>My Bookings — TripQuick</title>
        <meta name="description" content="View and manage all your tour bookings on TripQuick." />
      </Helmet>

      <div className="min-h-screen bg-transparent pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Welcome back, <span className="text-blue-600 italic">{user?.firstName || 'Traveler'}</span> 👋
            </h1>
            <p className="text-gray-500 mt-1">Here are all your travel adventures.</p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Trips', value: stats.total, color: 'blue' },
              { label: 'Confirmed', value: stats.confirmed, color: 'green' },
              { label: 'Cancelled', value: stats.cancelled, color: 'red' },
              { label: 'Total Spent', value: `₹${stats.spent.toLocaleString('en-IN')}`, color: 'purple' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 text-${s.color}-600`}>{s.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {['all', 'confirmed', 'cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'all' && ` (${stats.total})`}
                {f === 'confirmed' && ` (${stats.confirmed})`}
                {f === 'cancelled' && ` (${stats.cancelled})`}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-gray-100"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={36} className="text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h3>
              <p className="text-gray-500 text-sm mb-6">Your travel adventures will appear here.</p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Tours <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {filteredBookings.map(booking => (
                  <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};
