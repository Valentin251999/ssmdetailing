import { useState, useEffect } from 'react';
import { ArrowLeft, X, Sparkles, Car, Wind, Stars, Lightbulb, Loader2 } from 'lucide-react';
import { supabase, type PortfolioItem } from '../lib/supabase';

interface PortfolioProps {
  onNavigateToHome: () => void;
}

const categories = [
  { name: 'Toate', icon: Sparkles },
  { name: 'Detailing Exterior', icon: Car },
  { name: 'Detailing Interior', icon: Wind },
  { name: 'Plafon Înstelat', icon: Stars },
  { name: 'Recondiționare Faruri', icon: Lightbulb }
];

export default function Portfolio({ onNavigateToHome }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; type: 'before' | 'after' } | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setPortfolioItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioItems();
  }, []);

  const filteredItems = selectedCategory === 'Toate'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-40 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Înapoi</span>
          </button>
        </div>
      </div>

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Portofoliul Nostru
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Transformări spectaculoase care vorbesc despre calitatea serviciilor noastre
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/50 scale-105'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">Nu există lucrări în această categorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02]"
              >
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-3 text-lg">{item.title}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative cursor-pointer" onClick={() => setLightboxImage({ url: item.before_image_url, title: item.title, type: 'before' })}>
                      <img
                        src={item.before_image_url}
                        alt="Înainte"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end p-2">
                        <span className="text-white text-sm font-medium">Înainte</span>
                      </div>
                    </div>
                    <div className="relative cursor-pointer" onClick={() => setLightboxImage({ url: item.after_image_url, title: item.title, type: 'after' })}>
                      <img
                        src={item.after_image_url}
                        alt="După"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-600/70 to-transparent rounded-lg flex items-end p-2">
                        <span className="text-white text-sm font-medium">După</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-amber-500 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-1">{lightboxImage.title}</h3>
              <p className="text-amber-500 font-medium">
                {lightboxImage.type === 'before' ? 'Înainte' : 'După'}
              </p>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
