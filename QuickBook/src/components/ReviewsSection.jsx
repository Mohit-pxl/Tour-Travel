import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type={readonly ? 'button' : 'button'}
        onClick={readonly ? undefined : () => onChange?.(s)}
        className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
      >
        <Star
          size={readonly ? 14 : 20}
          className={s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      </button>
    ))}
  </div>
);

export const ReviewsSection = ({ tourId }) => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/${tourId}`);
      const data = await res.json();
      setReviews(data.data?.reviews || []);
    } catch (_) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [tourId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }
    if (comment.trim().length > 500) {
      toast.error('Comment must be less than 500 characters');
      return;
    }
    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/reviews/${tourId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          rating, comment,
          userName:   user?.fullName || 'Anonymous',
          userAvatar: user?.imageUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Review submitted! Thank you 🙏');
      setComment('');
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      const token = await getToken();
      await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Review deleted');
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (_) {
      toast.error('Could not delete review');
    }
  };

  const userHasReviewed = reviews.some(r => r.clerkUserId === user?.id);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(Number(avgRating))} readonly />
              <span className="font-bold text-gray-900">{avgRating}</span>
              <span className="text-sm text-gray-400">avg rating</span>
            </div>
          )}
        </div>
        {isSignedIn && !userHasReviewed && (
          <button
            onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors font-medium"
          >
            <Star size={14} /> Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden mb-5 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                required
                placeholder="Share your experience... (at least 10 characters)"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Submit Review
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-blue-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare size={32} className="text-gray-200 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <img
                src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=3b82f6&color=fff&size=36`}
                alt={review.userName}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={review.rating} readonly />
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {review.clerkUserId === user?.id && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
