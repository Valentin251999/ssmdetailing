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
        title="SSM Detailing Mărculești | Plafoane Starlight & Detailing Auto Premium"
        description="Atelier specializat în plafoane starlight personalizate, curățare interioară premium și restaurare faruri în Mărculești, Ialomița. Peste 8 ani experiență, rezultate garantate. Sună acum!"
        keywords="detailing auto Marculesti, plafon starlight, curatare auto interioara, reconditionare faruri, detailing Ialomita, SSM Detailing, plafon fibra optica"
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
