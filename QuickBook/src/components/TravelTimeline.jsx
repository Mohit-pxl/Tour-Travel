import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useTours } from '../context/ToursContext';

export const TravelTimeline = () => {
  const containerRef = useRef(null);
  const { tours, loading } = useTours();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  // Use first 4 tours as timeline destinations
  const destinations = tours.slice(0, 4);

  if (loading || destinations.length === 0) return null;

  return (
    <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-semibold tracking-widest uppercase text-xs md:text-sm mb-4 inline-block"
          >
            The Roadmap
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-serif text-gray-900 tracking-tight"
          >
            Your Epic Journey
          </motion.h2>
        </div>

        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-100 transform md:-translate-x-1/2">
            <motion.div 
              style={{ scaleY: pathLength, originY: 0 }}
              className="absolute top-0 left-0 right-0 bottom-0 bg-blue-600 rounded-full"
            />
          </div>

          <div className="flex flex-col gap-24 md:gap-32">
            {destinations.map((tour, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={tour._id} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                    className="absolute left-[30px] md:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-blue-600 rounded-full z-10 flex items-center justify-center shadow-xl"
                  >
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  </motion.div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'}`}
                    >
                      <div className="flex items-center gap-2 text-blue-600 font-medium mb-4 bg-blue-50 px-4 py-1.5 rounded-full">
                        <MapPin size={16} />
                        <span className="text-sm font-bold uppercase tracking-wider">Step 0{index + 1}</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{tour.location.split(',')[0]}</h3>
                      <p className="text-lg text-gray-600 max-w-md font-light leading-relaxed">
                        {tour.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                     <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] group relative"
                     >
                       <img src={tour.image} alt={tour.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                     </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
