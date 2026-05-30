import { Heart, MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { useWishlist } from '../context/WishlistContext';

export const TourCard = ({ tour }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  // Use MongoDB _id if available, fall back to numeric id from mockData
  const tourId = tour._id || tour.id;
  const isFavorite = isInWishlist(tourId);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(tourId);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm z-10"
        >
          <Heart
            size={18}
            className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {tour.tourType}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug pr-2">
            {tour.title}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-lg shrink-0">
            <Star size={13} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-900">{tour.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {tour.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {tour.duration}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-xl font-bold text-gray-900">₹{tour.price.toLocaleString()}</p>
          </div>
          <Link
            to={`/tours/${tourId}`}
            className="bg-gray-900 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
