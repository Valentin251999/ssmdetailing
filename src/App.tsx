import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Reels from './components/Reels';
import ReelsCTA from './components/ReelsCTA';
import TikTokReels from './components/TikTokReels';
import About from './components/About';
import Testimonials from './components/Testimonials';
import TestimonialSubmission from './components/TestimonialSubmission';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ReelsFloatingButton from './components/ReelsFloatingButton';
import Portfolio from './components/Portfolio';
import PortfolioAdmin from './components/PortfolioAdmin';
import ComprehensiveAdmin from './components/ComprehensiveAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio' | 'reels' | 'admin' | 'admin-panel'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin-panel') {
        setCurrentPage('admin-panel');
      } else if (hash === '#admin') {
        setCurrentPage('admin');
      } else if (hash === '#portfolio') {
        setCurrentPage('portfolio');
      } else if (hash === '#reels') {
        setCurrentPage('reels');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateToPortfolio = () => {
    setCurrentPage('portfolio');
    window.location.hash = '';
  };

  const navigateToReels = () => {
    setCurrentPage('reels');
    window.location.hash = '';
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.location.hash = '';
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        {currentPage === 'home' ? (
          <>
            <Header onNavigateToPortfolio={navigateToPortfolio} onNavigateToReels={navigateToReels} />
            <main>
              <Hero />
              <Services />
              <Gallery onNavigateToPortfolio={navigateToPortfolio} />
              <Reels />
              <ReelsCTA onNavigateToReels={navigateToReels} />
              <About />
              <Testimonials />
              <TestimonialSubmission />
              <FAQ />
              <Contact />
            </main>
            <Footer />
            <WhatsAppButton />
            <ReelsFloatingButton onClick={navigateToReels} />
          </>
        ) : currentPage === 'portfolio' ? (
          <>
            <Portfolio onNavigateToHome={navigateToHome} />
            <WhatsAppButton />
          </>
        ) : currentPage === 'reels' ? (
          <TikTokReels onNavigateToHome={navigateToHome} />
        ) : currentPage === 'admin-panel' ? (
          <ProtectedRoute>
            <ComprehensiveAdmin />
          </ProtectedRoute>
        ) : (
          <ProtectedRoute>
            <PortfolioAdmin onNavigateToHome={navigateToHome} />
          </ProtectedRoute>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
