import { useState, useEffect } from 'react';
import { Sparkles, Armchair, Droplets, Lightbulb, CircleDot, Layers, Home, Shield, Wrench, SprayCan, type LucideIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';

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

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
}

export default function Services() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [whatsapp, setWhatsapp] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const [servicesData, settingsData] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('whatsapp_number').maybeSingle()
      ]);

      if (servicesData.error) throw servicesData.error;
      if (servicesData.data) setServices(servicesData.data);
      setWhatsapp(settingsData.data?.whatsapp_number || '+40726521578');
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96"></div>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section id="services" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[300px] gap-4">
          <p className="text-gray-400 text-lg text-center">Serviciile nu au putut fi încărcate.</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Încearcă din nou
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            Servicii Premium
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Specializare Exclusivă Interior
          </h2>
          <p className="text-xl text-gray-400">
            Fără spălare exterioară. Fără ceară. Fără lustruire. Doar interior de calitate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name] || Sparkles;
            return (
              <div key={service.id} className="relative group">
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

        <div className="text-center mt-16">
          <a
            href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
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
