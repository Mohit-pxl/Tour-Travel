import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Plane, Home, Compass } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | TripQuick</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {/* Flying plane animation */}
        <motion.div
          animate={{ x: ['-10%', '10%', '-10%'], y: ['0%', '-5%', '0%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Plane size={48} className="text-blue-500 rotate-45" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-[8rem] font-bold text-gray-100 leading-none select-none">404</h1>
          <h2 className="-mt-6 text-2xl font-serif font-bold text-gray-900 mb-3">
            Lost in the Clouds!
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-base">
            Looks like this page took off without us. The destination you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            to="/tours"
            className="flex items-center gap-2 bg-white text-gray-800 border border-gray-200 px-8 py-3 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
          >
            <Compass size={18} /> Explore Tours
          </Link>
        </motion.div>
      </div>
    </>
  );
};
