import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
    })
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: 1 + (custom * 0.2), duration: 0.8, type: "spring" }
    }),
    hover: { y: -5, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ 
          y, opacity,
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10" />
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop" 
          alt="Incredible India" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 max-w-6xl mx-auto pt-20">
        <motion.div
          custom={1} initial="hidden" animate="visible" variants={textVariants}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-xl text-white text-xs font-semibold tracking-widest uppercase mb-8 border border-white/20">
            A Premium Travel Experience
          </span>
        </motion.div>
        
        <div className="overflow-hidden mb-6">
          <motion.h1 
            custom={2} initial="hidden" animate="visible" variants={textVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl font-serif"
          >
            Discover The
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1 
            custom={3} initial="hidden" animate="visible" variants={textVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-gray-400 leading-[1.1] tracking-tight drop-shadow-2xl font-serif"
          >
            Extraordinary
          </motion.h1>
        </div>
        
        <motion.p 
          custom={4} initial="hidden" animate="visible" variants={textVariants}
          className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl drop-shadow-lg font-light"
        >
          Explore the soul of Incredible India. From royal Rajasthan to serene Kerala — curated journeys for the modern traveller.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
      >
        <span className="text-white/60 text-xs tracking-widest uppercase mb-3">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </div>
  );
};
