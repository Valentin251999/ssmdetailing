import { Star } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { ReviewSchema } from './SchemaMarkup';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function Testimonials() {
  const { testimonials } = useSiteData();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: gridRef, getItemStyle } = useStaggerAnimation(testimonials.length);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <ReviewSchema reviews={testimonials} />
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
            Testimoniale
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Feedback Clienti
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              style={getItemStyle(index)}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-white text-white" />
                ))}
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white font-semibold">{testimonial.customer_name}</p>
                <p className="text-gray-500 text-sm">{testimonial.customer_role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
