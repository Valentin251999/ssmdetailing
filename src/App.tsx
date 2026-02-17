import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ReelsFloatingButton from './components/ReelsFloatingButton';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ReelsPage from './pages/ReelsPage';
import PortfolioAdmin from './components/PortfolioAdmin';
import ComprehensiveAdmin from './components/ComprehensiveAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isReelsPage = location.pathname === '/reels';
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/admin-panel';

  return (
    <>
      <ScrollToSection />
      {!isReelsPage && !isAdminPage && <Header />}

      <Routes>
        <Route path="/" element={
          <>
            <main>
              <HomePage onNavigateToPortfolio={() => {}} onNavigateToReels={() => {}} />
            </main>
            <Footer />
            <WhatsAppButton />
            <ReelsFloatingButton onClick={() => window.location.href = '/reels'} />
          </>
        } />

        <Route path="/portofoliu" element={
          <>
            <PortfolioPage />
            <Footer />
            <WhatsAppButton />
          </>
        } />

        <Route path="/reels" element={<ReelsPage />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <PortfolioAdmin onNavigateToHome={() => window.location.href = '/'} />
          </ProtectedRoute>
        } />

        <Route path="/admin-panel" element={
          <ProtectedRoute>
            <ComprehensiveAdmin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
