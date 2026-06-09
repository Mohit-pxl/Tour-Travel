import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews?limit=4`);
        const data = await res.json();
        if (data.data?.reviews) {
          const mappedReviews = data.data.reviews.map(review => ({
            id: review._id,
            content: review.comment,
            name: review.userName,
            avatar: review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=3b82f6&color=fff&size=64`,
            role: 'Traveler'
          }));
          setTestimonials(mappedReviews);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[500px]">
         <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Map Background (Abstract Representation) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
          alt="World Map" 
          className="w-[150%] md:w-[120%] h-auto object-cover max-w-none" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-semibold tracking-widest uppercase text-xs md:text-sm mb-4 inline-block"
          >
            Traveler Stories
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-serif text-gray-900 tracking-tight"
          >
            Words from the World
          </motion.h2>
        </div>

        <div className="relative md:h-[800px] w-full flex flex-col md:block gap-8">
          {testimonials.map((testimonial, index) => {
            const mdPositions = [
              { top: '0%', left: '0%', delay: 0.1, y: [0, 15, 0] },
              { top: '15%', right: '0%', delay: 0.3, y: [0, -15, 0] },
              { bottom: '15%', left: '10%', delay: 0.5, y: [0, 20, 0] },
              { bottom: '0%', right: '10%', delay: 0.7, y: [0, -20, 0] }
            ];
            
            const pos = mdPositions[index];

            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: pos.delay, type: "spring" }}
                className={`
                  w-full md:absolute md:w-[420px]
                  ${index === 0 ? 'md:top-0 md:left-0' : ''}
                  ${index === 1 ? 'md:top-[15%] md:right-0' : ''}
                  ${index === 2 ? 'md:bottom-[15%] md:left-[10%]' : ''}
                  ${index === 3 ? 'md:bottom-0 md:right-[10%]' : ''}
                `}
              >
                <motion.div 
                  animate={{ y: pos.y }}
                  transition={{ repeat: Infinity, duration: 4 + index, ease: "easeInOut", delay: pos.delay }}
                  className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <Quote size={48} className="text-blue-50 absolute top-8 right-8 transform group-hover:rotate-12 transition-transform duration-500 z-0" />
                  
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 relative z-10 font-medium">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 font-serif text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
          
          {/* Central Glow Element */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full items-center justify-center opacity-10 blur-[100px] pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};
