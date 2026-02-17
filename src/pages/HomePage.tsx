import { useEffect } from 'react';
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
import { setPageMeta, generateStructuredData, localBusinessSchema } from '../utils/seo';
import SEOHelmet from '../components/SEOHelmet';
import SchemaMarkup from '../components/SchemaMarkup';

interface HomePageProps {
  onNavigateToPortfolio: () => void;
  onNavigateToReels: () => void;
}
  useEffect(() => {
    setPageMeta({
      title: 'Detailing Auto Premium | Servicii Profesionale de Curățare și Recondiționare',
      description: 'Servicii premium de detailing auto: detailing interior și exterior, plafon înstelat starlight, recondiționare faruri. Transformăm mașina ta!',
      keywords: 'detailing auto, curățare auto profesională, detailing interior, detailing exterior, plafon starlight, recondiționare faruri',
      canonical: window.location.origin + '/',
      ogImage: window.location.origin + '/og-image.svg'
    });

    generateStructuredData('LocalBusiness', localBusinessSchema);
  }, []);


export default function HomePage({ onNavigateToPortfolio, onNavigateToReels }: HomePageProps) {
  return (
    <>
      <SEOHelmet
        title="SSM Detailing Galați - Detailing Auto Profesional | Polish, Ceramic Coating"
        description="SSM Detailing oferă servicii premium de detailing auto în Galați: polish caroserie, tratamente ceramice, curățare interior profesională. 8 ani experiență, rezultate garantate. ⭐ Programează online!"
        keywords="detailing auto galati, polish auto galati, ceramic coating galati, curatare interior auto, detailing profesional galati, ssm detailing, corectie vopsea, protectie caroserie"
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
