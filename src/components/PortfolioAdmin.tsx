import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Upload, X } from 'lucide-react';
import { supabase, type PortfolioItem } from '../lib/supabase';

interface PortfolioAdminProps {
  onNavigateToHome: () => void;
}

const categories = [
  'Detailing Exterior',
  'Detailing Interior',
  'Plafon Înstelat',
  'Recondiționare Faruri'
];

export default function PortfolioAdmin({ onNavigateToHome }: PortfolioAdminProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'before' | 'after' | null>(null);
  const [beforePreview, setBeforePreview] = useState<string>('');
  const [afterPreview, setAfterPreview] = useState<string>('');
  const [newItem, setNewItem] = useState({
    title: '',
    category: categories[0],
    before_image_url: '',
    after_image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

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
      void err;
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem() {
    if (!newItem.title || !newItem.before_image_url || !newItem.after_image_url) {
      alert('Te rog completează toate câmpurile obligatorii');
      return;
    }

    try {
      setSaving(true);
      const maxOrder = Math.max(...portfolioItems.map(item => item.display_order), 0);

      const { error } = await supabase
        .from('portfolio_items')
        .insert([{
          ...newItem,
          display_order: maxOrder + 1
        }]);

      if (error) throw error;

      setNewItem({
        title: '',
        category: categories[0],
        before_image_url: '',
        after_image_url: '',
        is_featured: false
      });
      setBeforePreview('');
      setAfterPreview('');

      await fetchPortfolioItems();
      alert('Lucrare adăugată cu succes!');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : JSON.stringify(err);
      alert('Eroare la adăugarea lucrării: ' + msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Sigur vrei să ștergi această lucrare?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPortfolioItems();
      alert('Lucrare ștearsă cu succes!');
    } catch (err) {
      alert('Eroare la ștergerea lucrării: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  async function handleImageUpload(file: File, type: 'before' | 'after') {
    try {
      setUploading(type);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${type}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (type === 'before') {
        setNewItem({ ...newItem, before_image_url: publicUrl });
        setBeforePreview(URL.createObjectURL(file));
      } else {
        setNewItem({ ...newItem, after_image_url: publicUrl });
        setAfterPreview(URL.createObjectURL(file));
      }
    } catch (err) {
      alert('Eroare la încărcarea imaginii: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(null);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Te rog selectează doar fișiere imagine!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Imaginea este prea mare! Mărime maximă: 5MB');
        return;
      }
      handleImageUpload(file, type);
    }
  }

  function clearImage(type: 'before' | 'after') {
    if (type === 'before') {
      setNewItem({ ...newItem, before_image_url: '' });
      setBeforePreview('');
    } else {
      setNewItem({ ...newItem, after_image_url: '' });
      setAfterPreview('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-40 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Înapoi la Homepage</span>
          </button>
        </div>
      </div>

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Administrare Portofoliu
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Adaugă și gestionează lucrările din portofoliu
            </p>
          </div>

          <div className="bg-neutral-900 rounded-2xl p-6 mb-8 border border-neutral-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-amber-500" />
              Adaugă Lucrare Nouă
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Titlu *
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Ex: BMW Seria 5 - Detailing Complet"
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Categorie *
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-amber-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Imagine Înainte * (URL extern sau încarcă fișier)
                </label>
                <input
                  type="text"
                  value={newItem.before_image_url}
                  onChange={(e) => {
                    setNewItem({ ...newItem, before_image_url: e.target.value });
                    setBeforePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image-before.jpg"
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-amber-500 focus:outline-none mb-2"
                />
                {beforePreview || newItem.before_image_url ? (
                  <div className="relative">
                    <img
                      src={beforePreview || newItem.before_image_url}
                      alt="Before preview"
                      loading="lazy"
                      className="w-full h-48 object-cover rounded-lg border border-neutral-700"
                      onError={() => {
                        setBeforePreview('');
                        setNewItem(prev => ({ ...prev, before_image_url: '' }));
                      }}
                    />
                    <button
                      onClick={() => clearImage('before')}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-750 hover:border-amber-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading === 'before' ? (
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                      ) : (
                        <Upload className="w-10 h-10 text-neutral-500 mb-3" />
                      )}
                      <p className="mb-2 text-sm text-neutral-400">
                        <span className="font-semibold">SAU click pentru a încărca</span>
                      </p>
                      <p className="text-xs text-neutral-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'before')}
                      disabled={uploading !== null}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Imagine După * (URL extern sau încarcă fișier)
                </label>
                <input
                  type="text"
                  value={newItem.after_image_url}
                  onChange={(e) => {
                    setNewItem({ ...newItem, after_image_url: e.target.value });
                    setAfterPreview(e.target.value);
                  }}
                  placeholder="https://example.com/image-after.jpg"
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-amber-500 focus:outline-none mb-2"
                />
                {afterPreview || newItem.after_image_url ? (
                  <div className="relative">
                    <img
                      src={afterPreview || newItem.after_image_url}
                      alt="After preview"
                      loading="lazy"
                      className="w-full h-48 object-cover rounded-lg border border-neutral-700"
                      onError={() => {
                        setAfterPreview('');
                        setNewItem(prev => ({ ...prev, after_image_url: '' }));
                      }}
                    />
                    <button
                      onClick={() => clearImage('after')}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-750 hover:border-amber-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading === 'after' ? (
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                      ) : (
                        <Upload className="w-10 h-10 text-neutral-500 mb-3" />
                      )}
                      <p className="mb-2 text-sm text-neutral-400">
                        <span className="font-semibold">SAU click pentru a încărca</span>
                      </p>
                      <p className="text-xs text-neutral-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'after')}
                      disabled={uploading !== null}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="featured"
                checked={newItem.is_featured}
                onChange={(e) => setNewItem({ ...newItem, is_featured: e.target.checked })}
                className="w-4 h-4 text-amber-500 bg-neutral-800 border-neutral-700 rounded focus:ring-amber-500"
              />
              <label htmlFor="featured" className="text-sm text-neutral-300">
                Afișează pe homepage (în secțiunea Gallery)
              </label>
            </div>

            <button
              onClick={handleAddItem}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg transition-all font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Se salvează...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Adaugă Lucrare
                </>
              )}
            </button>
          </div>

          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Lucrări Existente ({portfolioItems.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700"
                  >
                    <div className="flex gap-2 flex-shrink-0">
                      <img
                        src={item.before_image_url}
                        alt={`${item.title} - înainte`}
                        loading="lazy"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <img
                        src={item.after_image_url}
                        alt={`${item.title} - după`}
                        loading="lazy"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-sm text-neutral-400">{item.category}</p>
                      {item.is_featured && (
                        <span className="inline-block mt-1 text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Șterge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Cum să adaugi o lucrare nouă:
            </h3>
            <ol className="space-y-2 text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">1.</span>
                <span>Completează titlul proiectului (ex: BMW Seria 5 - Detailing Complet)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">2.</span>
                <span>Alege categoria potrivită din dropdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">3.</span>
                <span>Pentru imaginea ÎNAINTE: introdu URL-ul extern SAU click pe casetă pentru încărcare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">4.</span>
                <span>Pentru imaginea DUPĂ: introdu URL-ul extern SAU click pe casetă pentru încărcare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">5.</span>
                <span>Bifează "Afișează pe homepage" dacă vrei ca proiectul să apară în galerie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">6.</span>
                <span>Click pe "Adaugă Lucrare" pentru a salva</span>
              </li>
            </ol>
            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <p className="text-sm text-neutral-400">
                Imaginile acceptate: JPG, PNG, WEBP | Mărime maximă: 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
