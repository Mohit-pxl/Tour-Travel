import { Routes, Route } from 'react-router';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Tours } from './pages/Tours';
import { TourDetails } from './pages/TourDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/Dashboard';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { WishlistProvider } from './context/WishlistContext';
import { ToursProvider } from './context/ToursContext';

function App() {
  return (
    <ToursProvider>
    <WishlistProvider>
      <div className="min-h-screen flex flex-col font-sans relative bg-gradient-to-br from-sky-100 via-white to-sky-50 transition-colors duration-700 overflow-x-hidden text-[0.95rem]">

        {/* Default SEO */}
        <Helmet>
          <title>TripQuick — Explore India's Best Tours</title>
          <meta name="description" content="Discover and book hand-picked tour packages across India. Adventure, culture, wildlife, and relaxation — all in one place." />
        </Helmet>

        {/* Subtle World Map Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover fixed"
        />

        {/* Blurred Gradient Blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-sky-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none" />
        <div className="fixed top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[10%] w-[50vw] h-[50vw] bg-sky-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none" />

        <Routes>
          {/* ── Clerk Auth Pages ─────────────────────────────────────────── */}
          <Route
            path="/sign-in/*"
            element={
              <div className="min-h-screen flex items-center justify-center relative z-10">
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="min-h-screen flex items-center justify-center relative z-10">
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
              </div>
            }
          />

          {/* ── Protected App Routes ─────────────────────────────────────── */}
          <Route
            path="/*"
            element={
              <>
                <SignedIn>
                  <Navbar />
                  <div className="flex-1 relative z-10">
                    <Routes>
                      <Route path="/"            element={<Home />} />
                      <Route path="/tours"        element={<Tours />} />
                      <Route path="/tours/:id"    element={<TourDetails />} />
                      <Route path="/about"        element={<About />} />
                      <Route path="/contact"      element={<Contact />} />
                      <Route path="/dashboard"    element={<Dashboard />} />
                      <Route path="/wishlist"     element={<Wishlist />} />
                      <Route path="/profile"      element={<Profile />} />
                      <Route path="/admin"        element={<Admin />} />
                      <Route path="*"             element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer />
                </SignedIn>

                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </div>
    </WishlistProvider>
    </ToursProvider>
  );
}

export default App;
