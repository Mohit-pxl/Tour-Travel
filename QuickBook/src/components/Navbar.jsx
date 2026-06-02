import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { Menu, X, Plane, ChevronDown, Heart, LayoutDashboard, User as UserIcon, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useTours } from '../context/ToursContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tours } = useTours();
  const { wishlist } = useWishlist();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDest, setHoveredDest] = useState(false);
  
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Use first 4 tours as mega menu destinations
  const featuredDestinations = tours.slice(0, 4);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/tours', hasMegaMenu: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
      isScrolled ? 'bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-white/40 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group z-50 relative">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg">
              <Plane size={24} />
            </div>
            <span className={`text-2xl font-bold font-serif ${isScrolled ? 'text-gray-900' : 'text-white'} transition-colors duration-300`}>
              TripQuick
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative px-3 py-2"
                onMouseEnter={() => link.hasMegaMenu && setHoveredDest(true)}
                onMouseLeave={() => link.hasMegaMenu && setHoveredDest(false)}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `relative z-10 flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
                      isActive ? (isScrolled ? 'text-blue-600' : 'text-blue-400') : (isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white')
                    }`
                  }
                >
                  {link.name}
                  {link.hasMegaMenu && <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredDest ? 'rotate-180' : ''}`} />}
                </NavLink>
                
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute inset-0 rounded-full z-0 ${isScrolled ? 'bg-gray-100' : 'bg-white/10'}`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Mega Menu for Destinations */}
                {link.hasMegaMenu && (
                  <AnimatePresence>
                    {hoveredDest && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[600px] z-50 cursor-default"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-6 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                           <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-serif font-semibold text-gray-900">Featured Destinations</h3>
                             <NavLink to="/tours" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View All &rarr;</NavLink>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                             {featuredDestinations.slice(0,4).map((tour) => (
                               <NavLink to={`/tours/${tour._id}`} key={tour._id} className="group relative overflow-hidden rounded-xl aspect-[2/1]">
                                 <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                 <div className="absolute bottom-3 left-3 right-3 text-white">
                                   <div className="font-semibold text-sm">{tour.title}</div>
                                   <div className="text-xs text-gray-300">{tour.tourType}</div>
                                 </div>
                               </NavLink>
                             ))}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            
            <div className={`pl-4 ml-2 border-l ${isScrolled ? 'border-gray-200' : 'border-white/20'} transition-colors duration-300 flex items-center gap-3`}>
              {/* Wishlist Heart Button */}
              <NavLink
                to="/wishlist"
                className="relative p-2 rounded-full transition-colors hover:bg-white/10"
                title="My Wishlist"
              >
                <Heart size={20} className={isScrolled ? 'text-gray-600' : 'text-white'} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </NavLink>

              {/* Dashboard Link */}
              <NavLink
                to="/dashboard"
                title="My Bookings"
                className="p-2 rounded-full transition-colors hover:bg-white/10"
              >
                <LayoutDashboard size={20} className={isScrolled ? 'text-gray-600' : 'text-white'} />
              </NavLink>

              {/* Admin Panel Link */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  title="Admin Panel"
                  className="p-2 rounded-full transition-colors hover:bg-white/10"
                >
                  <ShieldAlert size={20} className={isScrolled ? 'text-blue-600' : 'text-blue-300'} />
                </NavLink>
              )}

              {/* Clerk UserButton */}
              <UserButton
                appearance={{ elements: { avatarBox: 'w-9 h-9' } }}
                userProfileUrl="/profile"
              />
              <button onClick={() => navigate('/tours')} className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isScrolled ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                Plan a Trip
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50 relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${isScrolled ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/10'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-white z-40 flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="flex-1 space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-3xl font-serif font-light transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <div className="pb-12 space-y-4">
               <div className="flex items-center gap-3 px-2 py-3 bg-gray-50 rounded-xl">
                 <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10' } }} />
                 <span className="text-sm text-gray-600 font-medium">My Account</span>
               </div>
               <NavLink
                 to="/dashboard"
                 onClick={() => setMobileMenuOpen(false)}
                 className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
               >
                 <LayoutDashboard size={18} className="text-blue-600" />
                 <span className="text-sm font-medium text-gray-700">My Bookings</span>
               </NavLink>
               
               {isAdmin && (
                 <NavLink
                   to="/admin"
                   onClick={() => setMobileMenuOpen(false)}
                   className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
                 >
                   <ShieldAlert size={18} className="text-blue-600" />
                   <span className="text-sm font-medium text-blue-700">Admin Panel</span>
                 </NavLink>
               )}

               <NavLink
                 to="/wishlist"
                 onClick={() => setMobileMenuOpen(false)}
                 className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
               >
                 <Heart size={18} className="text-red-500 fill-red-500" />
                 <span className="text-sm font-medium text-gray-700">Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</span>
               </NavLink>
               <button onClick={() => { setMobileMenuOpen(false); navigate('/tours'); }} className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-medium text-lg shadow-xl hover:bg-black transition-colors">
                 Plan Your Journey
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
