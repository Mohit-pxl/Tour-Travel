import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { useTours } from '../context/ToursContext';

const StackedCard = ({ tour, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <div 
      ref={cardRef}
      className="sticky flex flex-col justify-center w-full"
      style={{ 
        top: `calc(10vh + ${index * 40}px)`,
        height: '60vh',
        marginBottom: '40vh',
        zIndex: index
      }}
    >
      <motion.div 
        style={{ scale }}
        className="w-full h-full relative rounded-[3rem] overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] group cursor-pointer border border-white/10"
        onClick={() => navigate(`/tours/${tour._id}`)}
      >
        <div className="absolute inset-0">
           <img 
             src={tour.image} 
             alt={tour.title} 
             className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000 ease-[0.2,0.65,0.3,0.9]" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
        
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            <div className="flex flex-wrap items-center gap-4 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
               <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/30 text-white">
                 {tour.tourType}
               </span>
               <span className="flex items-center gap-2 text-sm text-gray-200 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                 <Clock size={16} /> {tour.duration}
               </span>
               <span className="flex items-center gap-2 text-sm text-gray-200 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                 <Star size={16} className="text-yellow-400 fill-current" /> {tour.rating}
               </span>
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-none tracking-tight">{tour.title}</h3>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-white/20 pt-8 mt-8">
              <p className="text-lg text-gray-300 max-w-xl font-light leading-relaxed">
                {tour.description}
              </p>
              
              <div className="flex items-center gap-8 shrink-0">
                <div className="text-white text-right">
                  <span className="block text-sm text-gray-400 uppercase tracking-widest mb-1">Starting From</span>
                  <span className="text-4xl font-bold font-serif">₹{tour.price.toLocaleString()}</span>
                </div>
                
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl group-hover:rotate-[-45deg]">
                  <ArrowRight size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const PopularPackages = () => {
  const { tours, loading } = useTours();

  if (loading || tours.length === 0) return null;

  return (
    <section className="py-20 bg-[#111111] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 md:mb-24">
           <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-400 font-semibold tracking-widest uppercase text-xs md:text-sm mb-4 inline-block"
          >
            Exclusive Collections
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight"
          >
            Signature Journeys
          </motion.h2>
        </div>

        <div className="relative pb-[10vh]">
          {tours.slice(0, 4).map((tour, index) => (
            <StackedCard 
              key={tour._id} 
              tour={tour} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
