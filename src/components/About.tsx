import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function About() {
  const [eyebrow, setEyebrow] = useState('Despre Noi');
  const [title, setTitle] = useState('Atelier Specializat');
  const [intro, setIntro] = useState('SSM Detailing este specializat în lucrări de interior și detalii selective de exterior.');
  const [whatWeDo, setWhatWeDo] = useState<string[]>([
    'Plafoane Starlight personalizate',
    'Detailing interior premium',
    'Restaurare faruri',
    'Retapițare plafon & stâlpi',
    'Curățare jante'
  ]);
  const [whatWeDontDo, setWhatWeDontDo] = useState<string[]>([
    'Spălare exterioară',
    'Corecție vopsea',
    'Ceară / Lustruire',
    'Servicii de volum'
  ]);
  const [motto, setMotto] = useState('Ne concentrăm pe calitate, nu pe cantitate.');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('about_eyebrow, about_title, about_intro, about_what_we_do, about_what_we_dont_do, about_motto')
          .maybeSingle();

        if (data) {
          if (data.about_eyebrow) setEyebrow(data.about_eyebrow);
          if (data.about_title) setTitle(data.about_title);
          if (data.about_intro) setIntro(data.about_intro);
          if (data.about_what_we_do?.length) setWhatWeDo(data.about_what_we_do);
          if (data.about_what_we_dont_do?.length) setWhatWeDontDo(data.about_what_we_dont_do);
          if (data.about_motto) setMotto(data.about_motto);
        }
      } catch {
        // valorile default raman
      }
    }
    fetchSettings();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              {eyebrow}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
              {title}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 sm:p-12">
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p className="text-xl">
                {intro}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 py-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Ce facem</h3>
                  <ul className="space-y-2 text-gray-400">
                    {whatWeDo.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Ce NU facem</h3>
                  <ul className="space-y-2 text-gray-400">
                    {whatWeDontDo.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-white font-medium text-xl text-center">
                  {motto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
