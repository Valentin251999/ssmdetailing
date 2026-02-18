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

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Detailing Exterior',
    description: 'Curățare și tratamente specializate pentru exteriorul mașinii, concepute pentru a proteja și îmbunătăți aspectul suprafețelor expuse. Tratament hidrofob pentru geamuri, parbriz și oglinzi. Degresare și curățare jante.',
    icon_name: 'Sparkles',
    is_active: true
  },
  {
    id: '2',
    title: 'Detailing Interior Premium',
    description: 'Curățare profesională în profunzime pentru întreg interiorul mașinii, folosind soluții specializate adaptate fiecărui material. Tapițerie, piele, fețe uși, mochete, stâlpi și centuri de siguranță.',
    icon_name: 'Home',
    is_active: true
  },
  {
    id: '3',
    title: 'Recondiționare & Polimerizare Faruri',
    description: 'Redăm claritatea farurilor printr-un proces profesional de polimerizare pentru o vizibilitate optimă și siguranță sporită.',
    icon_name: 'Lightbulb',
    is_active: true
  },
  {
    id: '4',
    title: 'Detailing Motor',
    description: 'Curățare meticuloasă a compartimentului motor urmată de aplicarea unui tratament de protecție specializat, pentru un aspect îngrijit și protejarea componentelor.',
    icon_name: 'Wrench',
    is_active: true
  }
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [whatsapp, setWhatsapp] = useState('+40726521578');

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesData, settingsData] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true).order('display_order'),
          supabase.from('site_settings').select('whatsapp_number').maybeSingle()
        ]);

        if (servicesData.data && servicesData.data.length > 0) {
          setServices(servicesData.data);
        }
        if (settingsData.data?.whatsapp_number) {
          setWhatsapp(settingsData.data.whatsapp_number);
        }
      } catch {
        // valorile default raman
      }
    }
    fetchData();
  }, []);

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
          {services.map((service) => {
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
