import { Phone, MessageCircle } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatPhoneForWhatsApp, formatPhoneForTel } from '../utils/phoneFormatter';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function Hero() {
  const { settings } = useSiteData();
  const { ref: eyebrowRef, isVisible: eyebrowVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });
  const { containerRef: statsRef, isVisible: statsVisible, getItemStyle: getStatStyle } = useStaggerAnimation(3, { threshold: 0.1 });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            ref={eyebrowRef}
            className="mb-8 inline-block"
            style={{
              opacity: eyebrowVisible ? 1 : 0,
              transform: eyebrowVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <span className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              {settings.hero_eyebrow}
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s',
            }}
          >
            {settings.hero_title}
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: subtitleVisible ? 1 : 0,
              transform: subtitleVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s',
            }}
          >
            {settings.hero_subtitle}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: 'opacity 0.6s ease-out 0.45s, transform 0.6s ease-out 0.45s',
            }}
          >
            <a
              href={`https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
            >
              <MessageCircle size={24} />
              {settings.hero_cta_secondary}
            </a>
            <a
              href={`tel:${formatPhoneForTel(settings.whatsapp_number)}`}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
            >
              <Phone size={24} />
              {settings.hero_cta_primary}
            </a>
          </div>

          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center" style={getStatStyle(0)}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3+</div>
              <div className="text-gray-500">Ani Experienta</div>
            </div>
            <div className="text-center" style={getStatStyle(1)}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-gray-500">Masini Finalizate</div>
            </div>
            <div className="text-center" style={getStatStyle(2)}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-500">Clienti Multumiti</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600" aria-label="Derulare in jos">
          <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
