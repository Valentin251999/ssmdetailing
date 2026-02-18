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
import SEOHelmet from '../components/SEOHelmet';
import SchemaMarkup from '../components/SchemaMarkup';

interface HomePageProps {
  onNavigateToPortfolio: () => void;
  onNavigateToReels: () => void;
}

export default function HomePage({ onNavigateToPortfolio, onNavigateToReels }: HomePageProps) {
  return (
    <>
      <SEOHelmet
        title="SSM Detailing - Premium Auto Detailing Marculesti | Plafoane Starlight"
        description="SSM Detailing - Atelier specializat in plafoane starlight personalizate, curatare interioara premium si restaurare faruri in Marculesti, Ialomita."
        keywords="detailing auto, plafon starlight, curatare auto, reconditionare faruri, detailing interior, detailing Marculesti, SSM Detailing"
        canonical="https://ssmdetailing.ro/"
      />
      <SchemaMarkup />
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
