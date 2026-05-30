import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { FeaturedDestinations } from '../components/FeaturedDestinations';
import { PopularPackages } from '../components/PopularPackages';
import { Testimonials } from '../components/Testimonials';

export const Home = () => {
  return (
    <main className="w-full bg-transparent selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      <Hero />
      <SearchBar />
      <FeaturedDestinations />
      <PopularPackages />
      <Testimonials />
    </main>
  );
};
