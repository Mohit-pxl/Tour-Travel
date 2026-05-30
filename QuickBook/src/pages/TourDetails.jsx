import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Clock, Star, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingForm } from '../components/BookingForm';

/* ─── Small inline image carousel ─── */
const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden group">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Tour image ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main TourDetails page ─── */
export const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch the tour from the backend by MongoDB _id
    const fetchTour = async () => {
      try {
        const res = await fetch(`${API_URL}/tours/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Tour not found');
        setTour(data.data.tour);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Tour Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "This tour doesn't exist or has been removed."}</p>
        <button onClick={() => navigate('/tours')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Browse All Tours
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <button
          onClick={() => navigate('/tours')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back to Destinations
        </button>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Main Content ── */}
          <div className="lg:w-2/3 space-y-6">

            {/* Title & Tags */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {tour.tourType}
                </span>
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-yellow-900">{tour.rating}</span>
                  <span className="text-xs text-yellow-700">({tour.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-blue-500" /> {tour.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-blue-500" /> {tour.duration}
                </span>
              </div>
            </motion.div>

            {/* Image Carousel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <ImageCarousel images={tour.images || [tour.image]} />
            </motion.div>

            {/* Price highlight (mobile only) */}
            <div className="lg:hidden bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                <p className="text-2xl font-bold text-gray-900">₹{tour.price.toLocaleString()}<span className="text-sm font-normal text-gray-400"> /person</span></p>
              </div>
              <a href="#booking-form" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Book Now
              </a>
            </div>

            {/* Tour Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3">Tour Overview</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{tour.description}</p>
            </motion.div>

            {/* Tour Details Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { label: 'Duration', value: tour.duration, icon: Clock },
                { label: 'Tour Type', value: tour.tourType, icon: MapPin },
                { label: 'Rating', value: `${tour.rating} / 5`, icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <Icon size={18} className="text-blue-500 mb-2" />
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </motion.div>

            {/* Facilities Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.facilities?.map((facility, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Booking Sidebar ── */}
          <div id="booking-form" className="lg:w-1/3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {/* Pass full tour object so BookingForm can send tourId to the backend */}
              <BookingForm tour={tour} />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};
