import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { whyTravelData, statisticsData } from '../data/mockData';
import { Compass, Building, Plane, Headphones, Award, Users, Map, Clock, ArrowUpRight } from 'lucide-react';

const icons = {
  compass: Compass,
  hotel: Building,
  plane: Plane,
  headphones: Headphones
};

const statIcons = {
  "Happy Customers": Users,
  "Tour Destinations": Map,
  "Travel Awards": Award,
  "Years Experience": Clock
};

const AnimatedCounter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end)) return;
    
    const duration = 2000;
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <span ref={ref} className="font-bold tabular-nums">
      {count}{suffix}
    </span>
  );
};

export const WhyChooseUs = () => {
  return (
    <section className="py-32 bg-transparent overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-4 inline-block"
          >
            The Advantage
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-serif text-gray-900 tracking-tight"
          >
            Why Travel With Us
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[250px]">
          
          {/* Main Card (Span 2x2) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 bg-blue-600 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-end"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                <Plane size={32} className="text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">Elevating Every Aspect of Your Journey</h3>
              <p className="text-blue-100 text-lg max-w-md font-light leading-relaxed">
                We believe travel should be an effortless extension of your lifestyle. From private jet charters to exclusive villa access, we handle the extraordinary.
              </p>
            </div>
            <ArrowUpRight size={120} className="absolute top-8 right-8 text-white/10 transform group-hover:scale-110 group-hover:text-white/20 transition-all duration-700" />
          </motion.div>

          {/* Stat 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col justify-between group shadow-xl"
          >
            <div className="flex justify-between items-start">
              <Users size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <div className="text-5xl font-bold font-serif mb-2">
                <AnimatedCounter value={statisticsData[0].value} suffix={statisticsData[0].suffix} />
              </div>
              <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">{statisticsData[0].label}</p>
            </div>
          </motion.div>

          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-serif">{whyTravelData[0].title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{whyTravelData[0].description}</p>
            </div>
          </motion.div>

          {/* Feature 2 (Wide) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 md:row-span-1 bg-white rounded-[2rem] p-8 shadow-xl flex items-center gap-8 group overflow-hidden relative"
          >
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 z-10 group-hover:rotate-12 transition-transform duration-500">
              <Building size={32} className="text-white" />
            </div>
            <div className="z-10">
              <h4 className="text-2xl font-bold text-gray-900 mb-2 font-serif">{whyTravelData[1].title}</h4>
              <p className="text-gray-500 leading-relaxed max-w-sm">{whyTravelData[1].description}</p>
            </div>
          </motion.div>

          {/* Stat 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-between group border border-gray-100"
          >
            <Map size={24} className="text-blue-600 group-hover:scale-110 transition-transform origin-left" />
            <div>
              <div className="text-5xl font-bold font-serif mb-2 text-gray-900">
                <AnimatedCounter value={statisticsData[1].value} suffix={statisticsData[1].suffix} />
              </div>
              <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{statisticsData[1].label}</p>
            </div>
          </motion.div>

          {/* Stat 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-between group border border-gray-100"
          >
            <Award size={24} className="text-blue-600 group-hover:scale-110 transition-transform origin-left" />
            <div>
              <div className="text-5xl font-bold font-serif mb-2 text-gray-900">
                <AnimatedCounter value={statisticsData[2].value} suffix={statisticsData[2].suffix} />
              </div>
              <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{statisticsData[2].label}</p>
            </div>
          </motion.div>

          {/* Feature 3 (Wide) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-2 md:row-span-1 bg-gray-900 text-white rounded-[2rem] p-8 shadow-xl flex items-center gap-8 group overflow-hidden relative"
          >
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="z-10">
              <h4 className="text-2xl font-bold mb-2 font-serif">{whyTravelData[3].title}</h4>
              <p className="text-gray-400 leading-relaxed max-w-sm">{whyTravelData[3].description}</p>
            </div>
            <div className="ml-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 z-10 border border-white/10 group-hover:-rotate-12 transition-transform duration-500">
              <Headphones size={32} className="text-white" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
