import { useState, useEffect } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForWhatsApp } from '../utils/phoneFormatter';

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('');
  const [showLabel, setShowLabel] = useState(false);
  const [labelDismissed, setLabelDismissed] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!labelDismissed) setShowLabel(true);
    }, 3000);

    let hideTimer: ReturnType<typeof setTimeout>;
    if (showLabel && !labelDismissed) {
      hideTimer = setTimeout(() => {
        setShowLabel(false);
      }, 6000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [showLabel, labelDismissed]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="relative flex items-center">
        <div
          className="absolute right-full mr-3 whitespace-nowrap pointer-events-none"
          style={{
            opacity: showLabel ? 1 : 0,
            transform: showLabel ? 'translateX(0)' : 'translateX(10px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <span className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
            Lasa o recenzie
          </span>
        </div>

        <a
          href="/recenzii"
          onClick={() => setLabelDismissed(true)}
          className="review-btn relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-full shadow-xl shadow-amber-600/40 transition-all duration-300 hover:scale-110 group"
          aria-label="Lasa o recenzie"
          title="Lasa o recenzie"
        >
          <Star size={22} className="fill-white group-hover:scale-110 transition-transform" />
          <span className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-ping" style={{ animationDuration: '2.5s' }} />
        </a>
      </div>

      <a
        href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-2xl shadow-green-600/30 transition-all duration-300 hover:scale-110 group"
        aria-label="Contacteaza-ne pe WhatsApp"
      >
        <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </a>
    </div>
  );
}
