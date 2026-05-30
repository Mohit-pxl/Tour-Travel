import { motion } from 'framer-motion';
import { featuredDestinations } from '../data/mockData';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Destinations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-24 font-sans relative overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
          >
            Explore <span className="text-blue-600 italic">Global Destinations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover our hand-picked selection of the most beautiful and culturally rich locations around the world.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[800px]">
          {featuredDestinations.map((destination, idx) => {
            // Create a bento grid layout
            let spanClasses = "";
            if (idx === 0) spanClasses = "md:col-span-2 md:row-span-2";
            else if (idx === 1) spanClasses = "md:col-span-2 md:row-span-1";
            else if (idx === 2) spanClasses = "md:col-span-1 md:row-span-1";
            else if (idx === 3) spanClasses = "md:col-span-1 md:row-span-1";
            else spanClasses = "hidden"; // limit to 4 for a perfect bento or adjust logic

            if (spanClasses === "hidden") return null;

            return (
              <motion.div 
                key={destination.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className={`group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 min-h-[300px] ${spanClasses}`}
                onClick={() => navigate('/tours')}
              >
                <motion.div 
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img 
                    src={destination.image} 
                    alt={destination.title} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-blue-300 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <MapPin size={18} />
                      <span className="text-sm font-semibold tracking-wider uppercase">{destination.title.split(',')[1]}</span>
                    </div>
                    <h3 className={`font-serif font-bold text-white mb-2 ${idx === 0 ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
                      {destination.title.split(',')[0]}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        {destination.tours}
                      </span>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
