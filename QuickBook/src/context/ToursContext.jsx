// ─────────────────────────────────────────────────────────────────────────────
//  ToursContext.jsx
//
//  Fetches ALL tours from the backend ONCE when the app loads,
//  then shares them with every component that needs them.
//
//  This avoids each component making its own separate API call.
//
//  How to use in any component:
//    import { useTours } from '../context/ToursContext';
//    const { tours, loading } = useTours();
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ToursContext = createContext(null);

// Provider component — wrap your app with this
export const ToursProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res  = await fetch(`${API_URL}/tours`);
        const data = await res.json();
        setTours(data.data?.tours || []);
      } catch (err) {
        console.error('Failed to load tours:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <ToursContext.Provider value={{ tours, loading }}>
      {children}
    </ToursContext.Provider>
  );
};

// Custom hook — use this in any component to get tour data
export const useTours = () => useContext(ToursContext);
