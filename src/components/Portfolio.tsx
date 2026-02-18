import { useState, useEffect } from 'react';
import { Sparkles, Car, Wind, Stars, Lightbulb, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, type PortfolioItem } from '../lib/supabase';
import BeforeAfterSlider from './BeforeAfterSlider';

interface PortfolioProps {
  onNavigateToHome?: () => void;
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
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-500 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Înapoi acasă</span>
            </Link>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Portofoliul Nostru
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-3">
              Transformări spectaculoase care vorbesc despre calitatea serviciilor noastre
            </p>
            <p className="text-sm text-amber-500/80 font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8M8 17h4" />
              </svg>
              Trage sliderul pe fiecare imagine pentru a vedea transformarea
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12 mt-8">
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
                  className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  <BeforeAfterSlider
                    beforeUrl={item.before_image_url}
                    afterUrl={item.after_image_url}
                    title={item.title}
                  />
                  <div className="px-4 py-3">
                    <h3 className="text-white font-semibold text-base text-center">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
