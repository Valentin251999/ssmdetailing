import { useState, useEffect } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPhoneForDisplay, formatPhoneForTel } from '../utils/phoneFormatter';

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('footer_tagline, contact_phone, contact_address, instagram_url, facebook_url, tiktok_url')
          .maybeSingle();

        setTagline(data?.footer_tagline || 'Atelier specializat interior. Rezultate profesionale.');
        setPhone(data?.contact_phone || '0726 521 578');
        setAddress(data?.contact_address || 'Mărculești, Ialomița, România');
        setInstagram(data?.instagram_url || 'https://www.instagram.com/ssm_detailing06/');
        setFacebook(data?.facebook_url || 'https://www.facebook.com/profile.php?id=61568245228709');
        setTiktok(data?.tiktok_url || 'https://www.tiktok.com/@stefanmarian66');
      } catch {
        setTagline('Atelier specializat interior. Rezultate profesionale.');
        setPhone('0726 521 578');
        setAddress('Mărculești, Ialomița, România');
        setInstagram('https://www.instagram.com/ssm_detailing06/');
        setFacebook('https://www.facebook.com/profile.php?id=61568245228709');
        setTiktok('https://www.tiktok.com/@stefanmarian66');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <footer className="bg-black border-t border-white/5 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto h-64"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-black border-t border-white/5 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <svg width="75" height="75" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SSM Detailing Logo">
                  <defs>
                    <linearGradient id="goldGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glowFooter">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <circle cx="70" cy="70" r="64" fill="#0a0a0a"/>
                  <circle cx="70" cy="70" r="64" stroke="url(#goldGradientFooter)" strokeWidth="4" fill="none" filter="url(#glowFooter)"/>
                  <circle cx="70" cy="70" r="60" stroke="url(#goldGradientFooter)" strokeWidth="1" fill="none" opacity="0.4"/>

                  <text x="70" y="65" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">SSM</text>
                  <text x="70" y="83" textAnchor="middle" fill="url(#goldGradientFooter)" fontSize="11" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">DETAILING</text>

                  <path d="M 35 90 Q 70 93 105 90" stroke="url(#goldGradientFooter)" strokeWidth="1.5" fill="none" opacity="0.7"/>
                </svg>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-600">SSM</span>
                    <span className="text-white ml-2">DETAILING</span>
                  </h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {tagline}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Servicii</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li>Plafoane Starlight</li>
                <li>Restaurare Faruri</li>
                <li>Detailing Interior</li>
                <li>Retapițare</li>
                <li>Curățare Jante</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-500 text-sm mb-6">
                <li>
                  <a href={`tel:${formatPhoneForTel(phone)}`} className="hover:text-white transition-colors">
                    {formatPhoneForDisplay(phone)}
                  </a>
                </li>
                <li>{address}</li>
                <li>Lun - Sâm: 09:00 - 18:00</li>
              </ul>
              <div className="flex items-center space-x-4">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                )}
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                    aria-label="TikTok"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-sm mb-2">
              © 2024 SSM Detailing. Toate drepturile rezervate.
            </p>
            <p className="text-gray-500 text-xs">
              Web design & dezvoltare: <a
                href="https://www.facebook.com/chituvalentin25/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 font-medium hover:text-amber-400 transition-colors"
              >
                Chițu Valentin
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
