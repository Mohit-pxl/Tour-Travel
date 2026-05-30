import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTours } from '../context/ToursContext';

const DestinationRow = ({ destination, index, navigate }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24 min-h-[70vh] py-16`}
    >
      <div className="w-full md:w-1/2 h-[40vh] md:h-[55vh] rounded-3xl overflow-hidden relative shadow-2xl group cursor-pointer" onClick={() => navigate('/tours')}>
        <motion.img 
          style={{ y }}
          src={destination.image} 
          alt={destination.title} 
          className="absolute inset-0 w-full h-[130%] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out origin-center"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-blue-100">
              {destination.reviews}+ Reviews
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
              <MapPin size={16} className="text-blue-500" /> {destination.location.split(',')[1] || 'India'}
            </span>
          </div>
          
          <h3 className="text-5xl md:text-6xl font-bold text-gray-900 font-serif leading-[1.05] mb-8 tracking-tight">
            {destination.location.split(',')[0]}
          </h3>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg font-light">
            {destination.description}
          </p>

          <button 
            onClick={() => navigate(`/tours/${destination._id}`)}
            className="flex items-center gap-4 text-lg font-medium text-gray-900 group"
          >
            <span className="border-b-2 border-gray-900 pb-1 group-hover:text-blue-600 group-hover:border-blue-600 transition-colors duration-300">Explore Collection</span>
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-2 duration-300">
              <ArrowRight size={20} />
            </div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const FeaturedDestinations = () => {
  const navigate = useNavigate();
  const { tours, loading } = useTours();

  // Use the first 4 tours as featured destinations
  const featured = tours.slice(0, 4);

  if (loading) return null;

  return (
    <section className="py-20 bg-transparent overflow-hidden relative">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-semibold tracking-widest uppercase text-xs md:text-sm mb-4"
          >
            The Magazine
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight"
          >
            Curated Stories
          </motion.h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-32">
          {featured.map((tour, index) => (
            <DestinationRow 
              key={tour._id} 
              destination={tour}
              index={index} 
              navigate={navigate} 
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 flex justify-center"
        >
          <button 
            onClick={() => navigate('/tours')}
            className="bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-black transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-300 flex items-center gap-3"
          >
            Explore All Destinations
            <ArrowRight size={20} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
