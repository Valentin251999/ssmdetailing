import { ChevronDown } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useSiteData } from '../contexts/SiteDataContext';
import { FAQSchema } from './SchemaMarkup';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function FAQ() {
  const { faqs } = useSiteData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: listRef, getItemStyle } = useStaggerAnimation(faqs.length, { threshold: 0.05 });

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % faqs.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + faqs.length) % faqs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = faqs.length - 1;
    }
    if (targetIndex >= 0) {
      buttonRefs.current[targetIndex]?.focus();
    }
  }, [faqs.length]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <FAQSchema faqs={faqs} />
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
            Intrebari Frecvente
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Intrebari Comune
          </h2>
        </div>

        <div ref={listRef} className="max-w-3xl mx-auto space-y-4" role="region" aria-label="Intrebari frecvente">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300"
              style={getItemStyle(index)}
            >
              <button
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => toggleFAQ(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/10 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
