import { Play, TrendingUp, Eye } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

interface ReelsCTAProps {
  onNavigateToReels: () => void;
}

export default function ReelsCTA({ onNavigateToReels }: ReelsCTAProps) {
  const { ref: iconRef, isVisible: iconVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef: statsRef, getItemStyle } = useStaggerAnimation(3, { threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 bg-gradient-to-br from-red-600 via-red-500 to-amber-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full animate-pulse delay-100" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full animate-pulse delay-200" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            ref={iconRef}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6"
            style={{
              opacity: iconVisible ? 1 : 0,
              transform: iconVisible ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            }}
          >
            <Play className="w-10 h-10 text-red-500 fill-red-500 ml-1" />
          </div>

          <div
            ref={titleRef}
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s',
            }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Urmareste-ne Videoclipurile<br />
              <span className="text-black">in Format TikTok!</span>
            </h2>

            <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Descopera procesul nostru de lucru, transformari spectaculoase si rezultate care vorbesc de la sine. Swipe, like si lasa-ne un comentariu!
            </p>
          </div>

          <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <div className="flex items-center gap-3 text-white" style={getItemStyle(0)}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">100K+</div>
                <div className="text-sm opacity-90">Vizualizari</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white" style={getItemStyle(1)}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-90">Videoclipuri</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white" style={getItemStyle(2)}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">@ssm_detailing</div>
                <div className="text-sm opacity-90">Pe TikTok</div>
              </div>
            </div>
          </div>

          <div
            ref={ctaRef}
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            }}
          >
            <button
              onClick={onNavigateToReels}
              className="group relative inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-900 transition-all transform hover:scale-105 shadow-2xl"
            >
              <Play className="w-6 h-6 fill-white group-hover:animate-pulse" />
              <span>Vezi Toate Videoclipurile</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>

            <p className="text-white/80 text-sm mt-6">
              Swipe vertical - Like - Comenteaza - Distribuie
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
    </section>
  );
}
