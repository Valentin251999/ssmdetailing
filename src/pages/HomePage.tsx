import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Reels from '../components/Reels';
import ReelsCTA from '../components/ReelsCTA';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import TestimonialSubmission from '../components/TestimonialSubmission';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

interface HomePageProps {
  onNavigateToPortfolio: () => void;
  onNavigateToReels: () => void;
}

export default function HomePage({ onNavigateToPortfolio, onNavigateToReels }: HomePageProps) {
  return (
    <>
      <Hero />
      <Services />
      <Gallery onNavigateToPortfolio={onNavigateToPortfolio} />
      <Reels />
      <ReelsCTA onNavigateToReels={onNavigateToReels} />
      <About />
      <Testimonials />
      <TestimonialSubmission />
      <FAQ />
      <Contact />
    </>
  );
}
