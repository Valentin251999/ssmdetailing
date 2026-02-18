import { useState, useEffect } from 'react';
import { MessageCircle, Star } from 'lucide-react';
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <a
        href="/recenzii"
        className="relative flex items-center justify-center w-12 h-12 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-xl shadow-amber-600/30 transition-all duration-300 hover:scale-110 group"
        aria-label="Lasa o recenzie"
        title="Lasa o recenzie"
      >
        <Star size={20} className="group-hover:scale-110 transition-transform" />
      </a>

      <a
        href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-2xl shadow-green-600/30 transition-all duration-300 hover:scale-110 group"
        aria-label="Contacteaza-ne pe WhatsApp"
      >
        <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </a>
    </div>
  );
}
