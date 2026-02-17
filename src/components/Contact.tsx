import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForDisplay, formatPhoneForWhatsApp, formatPhoneForTel } from '../utils/phoneFormatter';

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('contact_phone, whatsapp_number, contact_address')
        .single();

      if (data) {
        setPhone(data.contact_phone || '0726 521 578');
        setWhatsapp(data.whatsapp_number || '+40726521578');
        setAddress(data.contact_address || 'Mărculești, Ialomița');
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section id="contact" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            Contact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Vrei o Ofertă?
          </h2>
          <p className="text-xl text-gray-400">
            Contactează-ne pe WhatsApp sau sună direct.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Telefon</h3>
              <a
                href={`tel:${formatPhoneForTel(phone)}`}
                className="text-white hover:text-gray-300 transition-colors text-lg font-medium"
              >
                {formatPhoneForDisplay(phone)}
              </a>
              <p className="text-gray-500 mt-2">Lun - Sâm, 09:00 - 18:00</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">WhatsApp</h3>
              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors text-lg font-medium"
              >
                Cere Ofertă
              </a>
              <p className="text-gray-500 mt-2">Metoda preferată de contact</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Locație</h3>
              <p className="text-gray-400">
                {address}<br />
                România
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Program</h3>
              <div className="text-gray-400 space-y-1">
                <p>Lun - Vin: 09:00 - 18:00</p>
                <p>Sâm: 09:00 - 14:00</p>
                <p className="text-gray-500">Dum: Închis</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Începe Transformarea Interiorului
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Trimite mesaj pe WhatsApp pentru ofertă sau programare.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={24} />
                Scrie-ne pe WhatsApp
              </a>
              <a
                href={`tel:${formatPhoneForTel(phone)}`}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
              >
                <Phone size={24} />
                Programează-te Acum
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
