import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('whatsapp_number')
        .maybeSingle();

      setWhatsapp(data?.whatsapp_number || '+40726521578');
    }
    fetchSettings();
  }, []);

  return (
    <a
      href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-green-600/30 transition-all duration-300 hover:scale-110 group"
      aria-label="Contactează-ne pe WhatsApp"
    >
      <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
    </a>
  );
}
