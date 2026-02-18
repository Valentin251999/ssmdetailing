import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  id: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_eyebrow: string;
  about_title: string;
  about_intro: string;
  about_what_we_do: string[];
  about_what_we_dont_do: string[];
  about_motto: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  footer_tagline: string;
  footer_description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string;
  content: string;
  rating: number;
  display_order: number;
  is_active: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: '',
  hero_eyebrow: 'Construim interioare care impresionează',
  hero_title: 'Atelier Premium de Detailing Interior Auto',
  hero_subtitle: 'Plafoane Starlight, Detailing Interior & Recondiționare Faruri',
  hero_cta_primary: 'Programează-te Acum',
  hero_cta_secondary: 'Scrie-ne pe WhatsApp',
  about_eyebrow: 'Despre Noi',
  about_title: 'Atelier Specializat',
  about_intro: 'SSM Detailing este specializat în lucrări de interior și detalii selective de exterior.',
  about_what_we_do: [
    'Plafoane Starlight personalizate',
    'Detailing interior premium',
    'Restaurare faruri',
    'Retapițare plafon & stâlpi',
    'Curățare jante'
  ],
  about_what_we_dont_do: [
    'Spălare exterioară',
    'Corecție vopsea',
    'Ceară / Lustruire',
    'Servicii de volum'
  ],
  about_motto: 'Ne concentrăm pe calitate, nu pe cantitate.',
  contact_phone: '+40726521578',
  contact_email: 'contact@ssmdetailing.ro',
  contact_address: 'Mărculești, Ialomița, România',
  whatsapp_number: '+40726521578',
  facebook_url: 'https://www.facebook.com/chituvalentin25/',
  instagram_url: '',
  tiktok_url: 'https://www.tiktok.com/@stefanmarian66',
  footer_tagline: 'Excelență în detailing interior auto',
  footer_description: 'Atelier specializat exclusiv pe interior - transformăm fiecare mașină într-o experiență unică.'
};

const DEFAULT_SERVICES: Service[] = [
  { id: 'd1', title: 'Detailing Exterior', description: 'Curățare și tratamente specializate pentru exteriorul mașinii. Tratament hidrofob pentru geamuri, parbriz și oglinzi. Degresare și curățare jante.', icon_name: 'Sparkles', display_order: 1, is_active: true },
  { id: 'd2', title: 'Detailing Interior Premium', description: 'Curățare profesională în profunzime pentru întreg interiorul mașinii. Tapițerie, piele, fețe uși, mochete, stâlpi și centuri de siguranță.', icon_name: 'Home', display_order: 2, is_active: true },
  { id: 'd3', title: 'Recondiționare & Polimerizare Faruri', description: 'Redăm claritatea farurilor printr-un proces profesional de polimerizare pentru o vizibilitate optimă și siguranță sporită.', icon_name: 'Lightbulb', display_order: 4, is_active: true },
  { id: 'd4', title: 'Detailing Motor', description: 'Curățare meticuloasă a compartimentului motor urmată de aplicarea unui tratament de protecție specializat.', icon_name: 'Wrench', display_order: 6, is_active: true }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: 't1', customer_name: 'Andrei Popescu', customer_role: 'Proprietar BMW X5', content: 'Servicii excepționale! Mașina arată ca nouă după tratamentul ceramic. Recomand cu încredere!', rating: 5, display_order: 1, is_active: true },
  { id: 't2', customer_name: 'Maria Ionescu', customer_role: 'Proprietar Audi A4', content: 'Profesionalism la superlativ. Echipa este dedicată și atentă la detalii. Mulțumit 100%!', rating: 5, display_order: 2, is_active: true },
  { id: 't3', customer_name: 'Alexandru Popa', customer_role: 'Proprietar Mercedes C-Class', content: 'Cel mai bun detailing! Rezultate impecabile și prețuri corecte.', rating: 5, display_order: 3, is_active: true }
];

const DEFAULT_FAQS: FAQItem[] = [
  { id: 'f1', question: 'Cât durează un serviciu complet de detailing?', answer: 'Durata variază în funcție de starea mașinii și serviciile alese. Un detailing interior complet durează de obicei 4-8 ore. Vă recomandăm să ne contactați pentru o estimare personalizată.', display_order: 1, is_active: true },
  { id: 'f2', question: 'Este nevoie de programare?', answer: 'Da, lucrăm exclusiv pe bază de programare pentru a asigura atenția maximă fiecărui client. Contactați-ne pe WhatsApp sau telefon pentru a stabili o dată.', display_order: 2, is_active: true },
  { id: 'f3', question: 'Ce tipuri de mașini acceptați pentru detailing?', answer: 'Acceptăm orice tip de autovehicul: berline, SUV-uri, mașini sport, crossovere. Nu există restricții privind marca sau modelul.', display_order: 3, is_active: true },
  { id: 'f4', question: 'Care este diferența față de o spălătorie auto obișnuită?', answer: 'Detailing-ul este un proces mult mai aprofundat care implică curățarea și recondiționarea fiecărui detaliu al mașinii, folosind produse și echipamente profesionale specializate.', display_order: 4, is_active: true }
];

interface SiteDataContextType {
  settings: SiteSettings;
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  loaded: boolean;
  refetch: () => void;
}

const SiteDataContext = createContext<SiteDataContextType>({
  settings: DEFAULT_SETTINGS,
  services: DEFAULT_SERVICES,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
  loaded: false,
  refetch: () => {}
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [loaded, setLoaded] = useState(false);

  async function fetchAll() {
    try {
      const [settingsRes, servicesRes, testimonialsRes, faqsRes] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle(),
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('testimonials').select('*').eq('is_active', true).order('display_order'),
        supabase.from('faq_items').select('*').eq('is_active', true).order('display_order')
      ]);

      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
      if (servicesRes.data && servicesRes.data.length > 0) setServices(servicesRes.data);
      if (testimonialsRes.data && testimonialsRes.data.length > 0) setTestimonials(testimonialsRes.data);
      if (faqsRes.data && faqsRes.data.length > 0) setFaqs(faqsRes.data);
    } catch {
      // datele default raman
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <SiteDataContext.Provider value={{ settings, services, testimonials, faqs, loaded, refetch: fetchAll }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
