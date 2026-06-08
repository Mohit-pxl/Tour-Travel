import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiPost } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync wishlist from backend when auth state changes to signed in
  useEffect(() => {
    const syncWishlistWithServer = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          const response = await apiPost('/wishlist/sync', getToken, { localWishlist });
          if (response.status === 'success') {
            setWishlist(response.data.wishlist);
            localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist));
          }
        } catch (error) {
          console.error("Error syncing wishlist:", error);
        }
      }
    };
    syncWishlistWithServer();
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (tourId) => {
    // Optimistic update
    setWishlist((prev) => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );

    // Sync with server if logged in
    if (isSignedIn) {
      try {
        await apiPost('/wishlist/toggle', getToken, { tourId });
      } catch (error) {
        console.error("Error toggling wishlist on server:", error);
        // Revert optimistic update on failure
        setWishlist((prev) => 
          prev.includes(tourId) 
            ? prev.filter(id => id !== tourId)
            : [...prev, tourId]
        );
      }
    }
  };

  const isInWishlist = (tourId) => wishlist.includes(tourId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
