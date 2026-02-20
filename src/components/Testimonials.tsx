import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteData } from '../contexts/SiteDataContext';
import { ReviewSchema } from './SchemaMarkup';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PublicReview {
  id: string;
  author_name: string;
  message: string;
  rating: number;
  created_at: string;
}

interface UnifiedReview {
  id: string;
  name: string;
  text: string;
  rating: number;
  source: 'testimonial' | 'review';
}

function MarqueeRow({ reviews, direction, speed }: { reviews: UnifiedReview[]; direction: 'left' | 'right'; speed: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const doubled = [...reviews, ...reviews];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

      <div
        ref={rowRef}
        className="flex gap-5"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {doubled.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="flex-shrink-0 w-[340px] sm:w-[380px] bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/60 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 group cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    className={si < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}
                  />
                ))}
              </div>
              <Quote size={16} className="text-zinc-700 group-hover:text-amber-500/40 transition-colors" />
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed mb-5 line-clamp-4">
              {review.text}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
              <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 font-semibold text-xs">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{review.name}</p>
                <p className="text-zinc-600 text-xs">Client verificat</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TestimonialsProps {
  onNavigateToRecenzii?: () => void;
}

export default function Testimonials({ onNavigateToRecenzii }: TestimonialsProps) {
  const { testimonials } = useSiteData();
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    async function fetchPublicReviews() {
      try {
        const { data } = await supabase
          .from('public_reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        if (data) setPublicReviews(data);
      } catch {
        // silent
      }
    }
    fetchPublicReviews();
  }, []);

  const allReviews: UnifiedReview[] = [
    ...testimonials.map(t => ({
      id: t.id,
      name: t.customer_name,
      text: t.content,
      rating: t.rating,
      source: 'testimonial' as const,
    })),
    ...publicReviews.map(r => ({
      id: r.id,
      name: r.author_name,
      text: r.message,
      rating: r.rating,
      source: 'review' as const,
    })),
  ];

  const totalCount = allReviews.length;
  const avgRating = totalCount > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount)
    : 5;

  const midpoint = Math.ceil(allReviews.length / 2);
  const row1 = allReviews.slice(0, midpoint);
  const row2 = allReviews.slice(midpoint);

  if (totalCount === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
      <ReviewSchema reviews={testimonials} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto text-center"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}
        >
          <span className="text-amber-500/80 font-medium text-sm uppercase tracking-widest">
            Pareri clienti
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Ce Spun Clientii Nostri
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Recenzii reale de la clienti multumiti. Fiecare parere conteaza.
          </p>
        </div>

        <div
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mt-10"
          style={{
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</span>
            <div>
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}
                  />
                ))}
              </div>
              <p className="text-zinc-500 text-sm">Rating mediu</p>
            </div>
          </div>

          <div className="h-10 w-px bg-zinc-800 hidden sm:block" />

          <div className="text-center sm:text-left">
            <span className="text-4xl font-bold text-white">{totalCount}</span>
            <p className="text-zinc-500 text-sm">Recenzii verificate</p>
          </div>

          <div className="h-10 w-px bg-zinc-800 hidden sm:block" />

          <div className="text-center sm:text-left">
            <span className="text-4xl font-bold text-amber-400">100%</span>
            <p className="text-zinc-500 text-sm">Clienti multumiti</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <MarqueeRow reviews={row1} direction="left" speed={row1.length * 6} />
        {row2.length > 0 && (
          <MarqueeRow reviews={row2} direction="right" speed={row2.length * 7} />
        )}
      </div>

      {onNavigateToRecenzii && (
        <div
          ref={ctaRef}
          className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
          }}
        >
          <div className="text-center">
            <button
              onClick={onNavigateToRecenzii}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors group"
            >
              Vezi toate recenziile si lasa o parere
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
