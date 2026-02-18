import { useSiteData } from '../contexts/SiteDataContext';

export default function About() {
  const { settings } = useSiteData();

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              {settings.about_eyebrow}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
              {settings.about_title}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 sm:p-12">
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p className="text-xl">
                {settings.about_intro}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 py-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Ce facem</h3>
                  <ul className="space-y-2 text-gray-400">
                    {settings.about_what_we_do.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Ce NU facem</h3>
                  <ul className="space-y-2 text-gray-400">
                    {settings.about_what_we_dont_do.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-white font-medium text-xl text-center">
                  {settings.about_motto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
