import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Users, Calendar, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiPost } from '../services/api';

export const BookingForm = ({ tour }) => {
  const { getToken } = useAuth(); // Clerk hook — gives us the auth token
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [totalPrice, setTotalPrice] = useState(tour?.price || 0);

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const tourPrice = tour?.price || 0;

  useEffect(() => {
    setTotalPrice(tourPrice * guests);
  }, [guests, tourPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the backend API — apiPost automatically attaches the Clerk token
      await apiPost('/bookings', getToken, {
        tourId: tour._id,          // MongoDB ID from the backend
        userName: name,
        userEmail: email,
        guests,
        date,
      });

      setSuccess(true); // Show success message
    } catch (err) {
      setError(err.message); // Show error message from backend
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h3>
        <p className="text-gray-500 text-sm mb-2">
          Your booking for <strong>{tour?.title}</strong> has been saved.
        </p>
        <p className="text-gray-400 text-xs">We'll contact you at {email} with details.</p>
        <button
          onClick={() => { setSuccess(false); setName(''); setEmail(''); setDate(''); setGuests(1); }}
          className="mt-6 w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Book Another
        </button>
      </div>
    );
  }

  // ── Booking Form ──────────────────────────────────────────────────────────
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
      <div className="flex items-end gap-1 mb-6">
        <span className="text-3xl font-bold text-gray-900">₹{tourPrice.toLocaleString()}</span>
        <span className="text-gray-500 mb-1">/ person</span>
      </div>

      {/* Error message from backend */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={16} /> Date
            </label>
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Users size={16} /> Guests
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-4 rounded-xl mt-6">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>₹{tourPrice.toLocaleString()} × {guests} guest(s)</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Service Fee (5%)</span>
            <span>₹{(totalPrice * 0.05).toFixed(0)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span>₹{Math.round(totalPrice * 1.05).toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Processing...</>
          ) : (
            <><CreditCard size={20} /> Confirm Booking</>
          )}
        </button>
      </form>
    </div>
  );
};
