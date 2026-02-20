import { Sparkles, Armchair, Droplets, Lightbulb, CircleDot, Layers, Home, Shield, Wrench, SprayCan, type LucideIcon } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Armchair,
  Droplets,
  Lightbulb,
  CircleDot,
  Layers,
  Home,
  Shield,
  Wrench,
  SprayCan
};

export default function Services() {
  const { services, settings } = useSiteData();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: gridRef, getItemStyle } = useStaggerAnimation(services.length);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}
        >
          <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            Servicii Premium
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Specializare Exclusiva Interior
          </h2>
          <p className="text-xl text-gray-400">
            Fara spalare exterioara. Fara ceara. Fara lustruire. Doar interior de calitate.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Sparkles;
            return (
              <div key={service.id} className="relative group" style={getItemStyle(index)}>
                <div className="h-full bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white">
                    <Icon size={32} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={ctaRef}
          className="text-center mt-16"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <a
            href={`https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg shadow-lg shadow-green-600/20"
          >
            Scrie-ne pe WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
