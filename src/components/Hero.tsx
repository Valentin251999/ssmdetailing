import { Phone, MessageCircle } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';

export default function Hero() {
  const { settings } = useSiteData();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              {settings.hero_eyebrow}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {settings.hero_title}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {settings.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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
              href={`tel:${settings.whatsapp_number}`}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
            >
              <Phone size={24} />
              {settings.hero_cta_primary}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3+</div>
              <div className="text-gray-500">Ani Experiență</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-gray-500">Mașini Finalizate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-500">Clienți Mulțumiți</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600" aria-label="Derulare în jos">
          <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
