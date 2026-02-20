import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { formatPhoneForDisplay, formatPhoneForWhatsApp, formatPhoneForTel } from '../utils/phoneFormatter';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  const { settings } = useSiteData();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: cardsRef, getItemStyle } = useStaggerAnimation(4);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-900 to-black">
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
            Contact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Vrei o Oferta?
          </h2>
          <p className="text-xl text-gray-400">
            Contacteaza-ne pe WhatsApp sau suna direct.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              style={getItemStyle(0)}
            >
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Telefon</h3>
              <a
                href={`tel:${formatPhoneForTel(settings.contact_phone)}`}
                className="text-white hover:text-gray-300 transition-colors text-lg font-medium"
              >
                {formatPhoneForDisplay(settings.contact_phone)}
              </a>
              <p className="text-gray-500 mt-2">Lun - Sam, 09:00 - 18:00</p>
            </div>

            <div
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              style={getItemStyle(1)}
            >
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">WhatsApp</h3>
              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors text-lg font-medium"
              >
                Cere Oferta
              </a>
              <p className="text-gray-500 mt-2">Metoda preferata de contact</p>
            </div>

            <div
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              style={getItemStyle(2)}
            >
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Locatie</h3>
              <p className="text-gray-400">
                {settings.contact_address}<br />
                Romania
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              style={getItemStyle(3)}
            >
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Program</h3>
              <div className="text-gray-400 space-y-1">
                <p>Lun - Vin: 09:00 - 18:00</p>
                <p>Sam: 09:00 - 14:00</p>
                <p className="text-gray-500">Dum: Inchis</p>
              </div>
            </div>
          </div>

          <div
            ref={ctaRef}
            className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 text-center"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Incepe Transformarea Interiorului
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Trimite mesaj pe WhatsApp pentru oferta sau programare.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(settings.whatsapp_number)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={24} />
                Scrie-ne pe WhatsApp
              </a>
              <a
                href={`tel:${formatPhoneForTel(settings.contact_phone)}`}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20"
              >
                <Phone size={24} />
                Programeaza-te Acum
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
