import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = () => {
    // Navigate to tours page; state is passed so Tours page could use it in the future
    navigate('/tours', { state: { location, date, guests } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
      className="max-w-5xl mx-auto relative z-40 -mt-16 md:-mt-20 px-4 xl:px-0"
    >
      <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/60 p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-stretch gap-3">

          {/* Location */}
          <div className="flex-1 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group cursor-text">
            <MapPin size={18} className="text-blue-500 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</label>
              <input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors cursor-pointer">
            <Calendar size={18} className="text-blue-500 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Travel Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors">
            <Users size={18} className="text-blue-500 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                placeholder="1"
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-gray-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 md:self-stretch"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>
    </motion.div>
  );
};
