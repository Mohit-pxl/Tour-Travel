import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Target, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export const About = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-transparent font-sans overflow-hidden">
      
      {/* Hero Parallax Section */}
      <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yBackground }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2821&auto=format&fit=crop" 
            alt="Travel Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.div 
          style={{ opacity: opacityText }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-blue-300 font-medium tracking-[0.2em] uppercase text-sm mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              We Craft <br /><span className="italic font-light">Unforgettable</span> Memories
            </h1>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[600px] rounded-[2.5rem] overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
              alt="Team" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
            className="space-y-8"
          >
            <motion.h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              The Journey Began With a Single <span className="text-blue-600 italic">Step</span>
            </motion.h2>
            <motion.p className="text-gray-600 text-lg leading-relaxed">
              Founded in 2020 by a group of passionate globetrotters, Dolanan started as a small blog sharing hidden gems. Today, we've grown into a premier luxury travel agency, curating bespoke experiences for thousands of discerning travelers.
            </motion.p>
            <motion.p className="text-gray-600 text-lg leading-relaxed">
              We don't just book flights and hotels. We meticulously design end-to-end journeys that connect you with the soul of a destination.
            </motion.p>
          </motion.div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Users, title: "Expert Local Guides", desc: "Our guides aren't just locals; they are storytellers who share their intimate passion for their home." },
            { icon: Target, title: "Curated Experiences", desc: "Every itinerary is a masterpiece, balancing thrilling adventure with restorative relaxation." },
            { icon: Award, title: "Award-Winning Service", desc: "Recognized globally for our unwavering commitment to excellence and personalized care." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-gray-50 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-gray-900 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
