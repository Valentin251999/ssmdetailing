import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase, type PortfolioItem } from '../lib/supabase';
import BeforeAfterSlider from './BeforeAfterSlider';

interface GalleryProps {
  onNavigateToPortfolio: () => void;
}

export default function Gallery({ onNavigateToPortfolio }: GalleryProps) {
  const [galleryItems, setGalleryItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      setGalleryItems(data || []);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">
            Lucrările Noastre
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Înainte & După
          </h2>
          <p className="text-xl text-gray-400 mb-2">
            Rezultatele vorbesc de la sine.
          </p>
          <p className="text-sm text-amber-500/80 font-medium flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8M8 17h4" />
            </svg>
            Trage sliderul pentru a vedea transformarea
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-gray-400 text-lg">Galeria nu a putut fi încărcată.</p>
            <button
              onClick={fetchFeaturedItems}
              className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Încearcă din nou
            </button>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nu există imagini în galerie încă</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <BeforeAfterSlider
                  beforeUrl={item.before_image_url}
                  afterUrl={item.after_image_url}
                  title={item.title}
                />
                <div className="px-4 py-3 bg-gray-900/80">
                  <h3 className="text-base font-semibold text-white text-center">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={onNavigateToPortfolio}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-8 py-4 rounded-lg transition-all font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 mb-8"
          >
            Vezi Portofoliul Complet
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="text-gray-400 mb-6">
            Vrei aceste rezultate pentru mașina ta?
          </p>
          <a
            href="https://wa.me/40726521578"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all font-medium text-lg shadow-lg shadow-green-600/20"
          >
            Scrie-ne pe WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
