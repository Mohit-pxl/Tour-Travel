import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router';

export const CTA = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Parallax effect for the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] overflow-hidden bg-black flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" 
          alt="Cinematic landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white/80 font-semibold tracking-widest uppercase text-sm mb-6 inline-block border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
            Your Next Chapter Begins
          </span>
        </motion.div>

        <div className="overflow-hidden mb-2">
          <motion.h2 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-white leading-[1.1] tracking-tight drop-shadow-2xl"
          >
            Ready for the
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-gray-400 leading-[1.1] tracking-tight drop-shadow-2xl pb-4"
          >
            Extraordinary?
          </motion.h2>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            onClick={() => navigate('/tours')}
            className="bg-white text-gray-900 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-2 transform duration-300"
          >
            Start Planning
          </button>
        </motion.div>
      </div>
    </section>
  );
};
