import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigateToPortfolio: () => void;
  onNavigateToReels: () => void;
}

export default function Header({ onNavigateToPortfolio, onNavigateToReels }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handlePortfolioClick = () => {
    onNavigateToPortfolio();
    setIsMenuOpen(false);
  };

  const handleReelsClick = () => {
    onNavigateToReels();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-5">
            <svg width="75" height="75" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <circle cx="70" cy="70" r="64" fill="#0a0a0a"/>
              <circle cx="70" cy="70" r="64" stroke="url(#goldGradient)" strokeWidth="4" fill="none" filter="url(#glow)"/>
              <circle cx="70" cy="70" r="60" stroke="url(#goldGradient)" strokeWidth="1" fill="none" opacity="0.4"/>

              <text x="70" y="65" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">SSM</text>
              <text x="70" y="83" textAnchor="middle" fill="url(#goldGradient)" fontSize="11" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">DETAILING</text>

              <path d="M 35 90 Q 70 93 105 90" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" opacity="0.7"/>
            </svg>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-600">SSM</span>
                <span className="text-white ml-2">DETAILING</span>
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">
              Acasă
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">
              Servicii
            </button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-400 hover:text-white transition-colors">
              Galerie
            </button>
            <button onClick={handlePortfolioClick} className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
              Portofoliu
            </button>
            <button onClick={handleReelsClick} className="text-red-500 hover:text-red-400 transition-colors font-medium">
              Reels
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">
              Contact
            </button>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/ssm_detailing06/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61568245228709"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@stefanmarian66"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <a
              href="tel:0726521578"
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-lg transition-all font-medium"
            >
              Sună Acum
            </a>
          </nav>

          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/5">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors text-left py-2">
              Acasă
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors text-left py-2">
              Servicii
            </button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-400 hover:text-white transition-colors text-left py-2">
              Galerie
            </button>
            <button onClick={handlePortfolioClick} className="text-amber-500 hover:text-amber-400 transition-colors text-left py-2 font-medium">
              Portofoliu
            </button>
            <button onClick={handleReelsClick} className="text-red-500 hover:text-red-400 transition-colors text-left py-2 font-medium">
              Reels
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors text-left py-2">
              Contact
            </button>
            <div className="flex items-center space-x-6 py-2">
              <a
                href="https://www.instagram.com/ssm_detailing06/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61568245228709"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@stefanmarian66"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="TikTok"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <a
              href="tel:0726521578"
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-all font-medium text-center"
            >
              Sună Acum
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
