import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Star, MapPin } from 'lucide-react';
import { useTours } from '../context/ToursContext';

export const Experiences = () => {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const { tours, loading } = useTours();
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]); 

  if (loading || tours.length === 0) return null;

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Title pinned to the left */}
        <div className="absolute top-32 left-4 md:left-24 z-10 pointer-events-none">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-white tracking-tight leading-none drop-shadow-2xl"
          >
            Extraordinary <br />
            <span className="text-gray-400">Experiences</span>
          </motion.h2>
        </div>

        {/* Scrolling Cards */}
        <motion.div style={{ x }} className="flex gap-8 px-4 md:px-24 pt-64 md:pt-40 pb-20 mt-10 md:mt-0">
          {tours.map((tour) => (
            <div 
              key={tour._id} 
              onClick={() => navigate(`/tours/${tour._id}`)}
              className="w-[85vw] md:w-[600px] h-[55vh] md:h-[65vh] shrink-0 relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
            >
              <motion.img 
                src={tour.image} 
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/30">
                    {tour.tourType}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-200">
                    <Star size={14} className="text-yellow-400 fill-current" /> {tour.rating}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">{tour.title}</h3>
                
                <div className="flex items-center gap-2 text-gray-300 mb-6">
                  <MapPin size={16} />
                  <span>{tour.location}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/20 pt-6">
                  <span className="text-2xl font-bold">₹{tour.price.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ person</span></span>
                  <span className="text-sm font-medium uppercase tracking-widest border-b border-transparent group-hover:border-white transition-colors pb-1">
                    Discover 
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
