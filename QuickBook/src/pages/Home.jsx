import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { FeaturedDestinations } from '../components/FeaturedDestinations';
import { PopularPackages } from '../components/PopularPackages';
import { Testimonials } from '../components/Testimonials';

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>TripQuick — Explore India's Best Tours & Travel Packages</title>
        <meta name="description" content="Discover hand-picked tours across India. Book adventure, cultural, wildlife & relaxation packages at the best prices. Start your journey with TripQuick today." />
        <meta property="og:title" content="TripQuick — Explore India's Best Tours" />
        <meta property="og:description" content="Book curated tour packages across India — adventure, culture, wildlife & relaxation." />
      </Helmet>
      <main className="w-full bg-transparent selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
        <Hero />
        <SearchBar />
        <FeaturedDestinations />
        <PopularPackages />
        <Testimonials />
      </main>
    </>
  );
};
