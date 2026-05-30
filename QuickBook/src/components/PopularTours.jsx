import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTours } from '../context/ToursContext';

export const PopularTours = () => {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { tours, loading } = useTours();
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  if (loading || tours.length === 0) return null;

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#FAF9F6]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Exclusive Journeys</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-serif tracking-tight">
              Featured Tours
            </h2>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="pl-4 sm:pl-6 lg:pl-8 xl:pl-[calc((100vw-1280px)/2+2rem)] w-full">
          <motion.div style={{ x }} className="flex gap-8 w-max pr-8">
            {tours.map((tour) => (
              <motion.div 
                key={tour._id} 
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group w-[350px] md:w-[450px] bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-shadow duration-500 overflow-hidden flex flex-col flex-shrink-0"
              >
                <div className="relative h-[300px] overflow-hidden rounded-t-[2rem]">
                  <motion.img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[0.2,0.65,0.3,0.9]"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold text-gray-900 shadow-sm">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {tour.rating}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold uppercase tracking-wider mb-3">
                    <MapPin size={16} />
                    <span>{tour.location}</span>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 font-serif leading-snug line-clamp-2">{tour.title}</h4>
                  
                  <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 font-medium">
                    <Clock size={16} className="text-gray-400" />
                    <span>{tour.duration}</span>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-1">From</span>
                      <span className="text-3xl font-bold text-gray-900">₹{tour.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/tours/${tour._id}`)}
                      className="bg-gray-100 hover:bg-gray-900 text-gray-900 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
