import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense, Component, type ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ReelsFloatingButton from './components/ReelsFloatingButton';
import { AuthProvider } from './contexts/AuthContext';
import { SiteDataProvider } from './contexts/SiteDataContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ReelsPage = lazy(() => import('./pages/ReelsPage'));
const RecenziiPage = lazy(() => import('./pages/RecenziiPage'));
const PortfolioAdmin = lazy(() => import('./components/PortfolioAdmin'));
const ComprehensiveAdmin = lazy(() => import('./components/ComprehensiveAdmin'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const NotFound = lazy(() => import('./pages/NotFound'));

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">Ceva nu a mers bine</h1>
            <p className="text-gray-400 mb-8">A aparut o eroare neasteptata. Te rugam sa reincerci.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Reincarca Pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToSection() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      if (id === 'admin-panel') {
        navigate('/admin-panel', { replace: true });
        return;
      }
      if (id === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [location, navigate]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isReelsPage = location.pathname === '/reels';
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/admin-panel';

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-amber-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:font-medium">
        Salt la continut
      </a>

      <ScrollToSection />
      {!isReelsPage && !isAdminPage && <Header />}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            <SiteDataProvider>
              <main id="main-content">
                <HomePage onNavigateToPortfolio={() => navigate('/portofoliu')} onNavigateToReels={() => navigate('/reels')} onNavigateToRecenzii={() => navigate('/recenzii')} />
              </main>
              <Footer />
              <WhatsAppButton />
              <ReelsFloatingButton onClick={() => window.location.href = '/reels'} />
            </SiteDataProvider>
          } />

          <Route path="/portofoliu" element={
            <SiteDataProvider>
              <main id="main-content">
                <PortfolioPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </SiteDataProvider>
          } />

          <Route path="/reels" element={
            <main id="main-content">
              <ReelsPage />
            </main>
          } />

          <Route path="/recenzii" element={
            <SiteDataProvider>
              <main id="main-content">
                <RecenziiPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </SiteDataProvider>
          } />

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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
