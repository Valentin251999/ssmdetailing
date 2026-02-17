import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [heroEyebrow, setHeroEyebrow] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [ctaPrimary, setCtaPrimary] = useState('');
  const [ctaSecondary, setCtaSecondary] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('hero_eyebrow, hero_title, hero_subtitle, hero_cta_primary, hero_cta_secondary, whatsapp_number')
        .single();

      if (data) {
        setHeroEyebrow(data.hero_eyebrow || 'Atelier Specializat Interior Auto');
        setHeroTitle(data.hero_title || 'Transformăm Interioarele Auto în Opere de Artă');
        setHeroSubtitle(data.hero_subtitle || 'Specializați exclusiv pe interioare premium');
        setCtaPrimary(data.hero_cta_primary || 'Programează-te');
        setCtaSecondary(data.hero_cta_secondary || 'Vezi Portfolio');
        setWhatsapp(data.whatsapp_number || '+40726521578');
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
              {heroEyebrow}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
            >
              <MessageCircle size={24} />
              {ctaSecondary}
            </a>
            <a
              href={`tel:${whatsapp}`}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
            >
              <Phone size={24} />
              {ctaPrimary}
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
