import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Users, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { apiPost } from '../services/api';

export const BookingForm = ({ tour }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || '');
  const [totalPrice, setTotalPrice] = useState(tour?.price || 0);

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const tourPrice = tour?.price || 0;

  useEffect(() => {
    setTotalPrice(tourPrice * guests);
  }, [guests, tourPrice]);

  // Pre-fill name/email from Clerk user
  useEffect(() => {
    if (user) {
      if (!name) setName(user.fullName || '');
      if (!email) setEmail(user.emailAddresses?.[0]?.emailAddress || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validation
    if (!name.trim() || name.trim().length < 2) return setError('Name must be at least 2 characters');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('Valid email is required');
    if (!date) return setError('Date is required');
    if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) return setError('Cannot book in the past');
    if (guests < 1 || guests > 20) return setError('Guests must be between 1 and 20');

    setLoading(true);
    try {
      // 1. Save Booking via API
      const response = await apiPost('/bookings', getToken, {
        tourId:    tour._id,
        userName:  name,
        userEmail: email,
        guests,
        date,
      });

      // 2. Send Email via EmailJS
      if (
        import.meta.env.VITE_EMAILJS_SERVICE_ID && 
        import.meta.env.VITE_EMAILJS_SERVICE_ID !== 'your_service_id_here'
      ) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              to_name: name,
              to_email: email,
              tour_title: tour.title,
              guests: guests,
              date: date,
              total_price: Math.round(totalPrice * 1.05),
              booking_id: response.data.booking._id
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
        } catch (emailErr) {
          console.error("EmailJS error:", emailErr);
          toast.error("Booking saved, but confirmation email failed to send.");
        }
      }

      toast.success('Booking confirmed! 🎉');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <p className="text-gray-400 text-xs mb-6">A confirmation email has been sent to {email}</p>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            View My Bookings
          </button>
          <button
            onClick={() => { setSuccess(false); setDate(''); setGuests(1); }}
            className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
      <div className="flex items-end gap-1 mb-6">
        <span className="text-3xl font-bold text-gray-900">₹{tourPrice.toLocaleString()}</span>
        <span className="text-gray-500 mb-1">/ person</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email" required value={email}
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
              type="date" required value={date}
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
              type="number" min="1" max="20" required value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-4 rounded-xl mt-2">
          <div className="flex justify-between text-gray-600 mb-2 text-sm">
            <span>₹{tourPrice.toLocaleString()} × {guests} guest(s)</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2 text-sm">
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Processing...</>
          ) : (
            <><CheckCircle size={20} /> Confirm Booking</>
          )}
        </button>
      </form>
    </div>
  );
};
