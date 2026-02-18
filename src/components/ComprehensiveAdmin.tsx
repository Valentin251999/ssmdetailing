import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Save, Settings, Home, Info, Briefcase,
  Folder, MessageSquare, HelpCircle,
  Phone, Trash2, Plus, Edit2, X, Video, LogOut
} from 'lucide-react';
import ReelsAdmin from './ReelsAdmin';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'hero' | 'about' | 'services' | 'portfolio' | 'reels' | 'reviews' | 'faq' | 'contact';

interface SiteSettings {
  id: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_eyebrow: string;
  about_title: string;
  about_intro: string;
  about_what_we_do: string[];
  about_what_we_dont_do: string[];
  about_motto: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  footer_tagline: string;
  footer_description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
  is_featured: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

interface PublicReview {
  id: string;
  author_name: string;
  message: string;
  rating: number;
  created_at: string;
  is_approved: boolean;
  reviewed_at: string | null;
}

export default function ComprehensiveAdmin() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [settingsRes, servicesRes, portfolioRes, reviewsRes, faqRes] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle(),
        supabase.from('services').select('*').order('display_order'),
        supabase.from('portfolio_items').select('*').order('display_order'),
        supabase.from('public_reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('faq_items').select('*').order('display_order')
      ]);

      if (settingsRes.data) setSettings(settingsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (portfolioRes.data) setPortfolioItems(portfolioRes.data);
      if (reviewsRes.data) setPublicReviews(reviewsRes.data);
      if (faqRes.data) setFaqItems(faqRes.data);
    } catch (error) {
      void error;
      showMessage('Eroare la încărcarea datelor. Verifică conexiunea la internet.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', settings.id);

      if (error) throw error;
      showMessage('Setările au fost salvate cu succes!');
    } catch (error) {
      void error;
      showMessage('Eroare la salvarea setărilor');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.hash = '';
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const addListItem = (key: 'about_what_we_do' | 'about_what_we_dont_do') => {
    if (!settings) return;
    const newItem = prompt('Adaugă un element nou:');
    if (newItem) {
      updateSetting(key, [...settings[key], newItem]);
    }
  };

  const removeListItem = (key: 'about_what_we_do' | 'about_what_we_dont_do', index: number) => {
    if (!settings) return;
    const newList = settings[key].filter((_, i) => i !== index);
    updateSetting(key, newList);
  };

  const editListItem = (key: 'about_what_we_do' | 'about_what_we_dont_do', index: number) => {
    if (!settings) return;
    const newValue = prompt('Modifică:', settings[key][index]);
    if (newValue !== null) {
      const newList = [...settings[key]];
      newList[index] = newValue;
      updateSetting(key, newList);
    }
  };

  const saveService = async (service: Partial<Service>) => {
    try {
      if (service.id) {
        const { error } = await supabase
          .from('services')
          .update(service)
          .eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([service]);
        if (error) throw error;
      }
      await loadData();
      showMessage('Serviciul a fost salvat!');
    } catch (error) {
      void error;
      showMessage('Eroare la salvarea serviciului');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest serviciu?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      showMessage('Serviciul a fost șters!');
    } catch (error) {
      void error;
      showMessage('Eroare la ștergerea serviciului');
    }
  };

  const saveFAQ = async (faq: Partial<FAQItem>) => {
    try {
      if (faq.id) {
        const { error } = await supabase
          .from('faq_items')
          .update(faq)
          .eq('id', faq.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert([{ ...faq, display_order: faqItems.length }]);
        if (error) throw error;
      }
      await loadData();
      showMessage('FAQ-ul a fost salvat!');
    } catch (error) {
      void error;
      showMessage('Eroare la salvarea FAQ-ului');
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această întrebare?')) return;
    try {
      const { error } = await supabase.from('faq_items').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      showMessage('FAQ-ul a fost șters!');
    } catch (error) {
      void error;
      showMessage('Eroare la ștergerea FAQ-ului');
    }
  };

  const deletePublicReview = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această recenzie?')) return;
    try {
      const { error } = await supabase.from('public_reviews').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      showMessage('Recenzia a fost ștearsă!');
    } catch (error) {
      void error;
      showMessage('Eroare la ștergerea recenziei');
    }
  };

  const approveReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('public_reviews')
        .update({ is_approved: true, reviewed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await loadData();
      showMessage('Recenzia a fost aprobată!');
    } catch (error) {
      void error;
      showMessage('Eroare la aprobarea recenziei');
    }
  };

  const rejectReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('public_reviews')
        .update({ is_approved: false, reviewed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await loadData();
      showMessage('Recenzia a fost respinsă!');
    } catch (error) {
      void error;
      showMessage('Eroare la respingerea recenziei');
    }
  };

  const tabs = [
    { id: 'hero' as Tab, label: 'Hero', icon: Home },
    { id: 'about' as Tab, label: 'Despre', icon: Info },
    { id: 'services' as Tab, label: 'Servicii', icon: Briefcase },
    { id: 'portfolio' as Tab, label: 'Portfolio', icon: Folder },
    { id: 'reels' as Tab, label: 'Video Reels', icon: Video },
    { id: 'reviews' as Tab, label: 'Recenzii Publice', icon: MessageSquare },
    { id: 'faq' as Tab, label: 'FAQ', icon: HelpCircle },
    { id: 'contact' as Tab, label: 'Contact', icon: Phone }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-600">Se încarcă...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel Complet</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Se salvează...' : 'Salvează Modificări'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                title="Deconectare"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Ieșire</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {message && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'hero' && !settings && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">Nu s-au putut încărca setările. <button onClick={loadData} className="text-blue-600 underline">Reîncearcă</button></p>
          </div>
        )}

        {activeTab === 'hero' && settings && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Secțiunea Hero</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Mic Sus (Eyebrow)
              </label>
              <input
                type="text"
                value={settings.hero_eyebrow}
                onChange={(e) => updateSetting('hero_eyebrow', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titlu Principal
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => updateSetting('hero_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitlu
              </label>
              <textarea
                value={settings.hero_subtitle}
                onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Buton Principal
                </label>
                <input
                  type="text"
                  value={settings.hero_cta_primary}
                  onChange={(e) => updateSetting('hero_cta_primary', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Buton Secundar
                </label>
                <input
                  type="text"
                  value={settings.hero_cta_secondary}
                  onChange={(e) => updateSetting('hero_cta_secondary', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && settings && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Secțiunea Despre Noi</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Mic Sus (Eyebrow)
              </label>
              <input
                type="text"
                value={settings.about_eyebrow}
                onChange={(e) => updateSetting('about_eyebrow', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titlu
              </label>
              <input
                type="text"
                value={settings.about_title}
                onChange={(e) => updateSetting('about_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introducere
              </label>
              <textarea
                value={settings.about_intro}
                onChange={(e) => updateSetting('about_intro', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ce Facem
              </label>
              <div className="space-y-2">
                {settings.about_what_we_do.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => editListItem('about_what_we_do', index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeListItem('about_what_we_do', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addListItem('about_what_we_do')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă element
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ce NU Facem
              </label>
              <div className="space-y-2">
                {settings.about_what_we_dont_do.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => editListItem('about_what_we_dont_do', index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeListItem('about_what_we_dont_do', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addListItem('about_what_we_dont_do')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă element
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motto Final
              </label>
              <input
                type="text"
                value={settings.about_motto}
                onChange={(e) => updateSetting('about_motto', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Servicii</h2>
                <button
                  onClick={() => {
                    const title = prompt('Titlu serviciu:');
                    const description = prompt('Descriere:');
                    if (title && description) {
                      saveService({ title, description, icon_name: 'Sparkles', display_order: services.length, is_active: true });
                    }
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă Serviciu
                </button>
              </div>

              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Icon: {service.icon_name}</span>
                          <span>Ordine: {service.display_order}</span>
                          <span className={service.is_active ? 'text-green-600' : 'text-red-600'}>
                            {service.is_active ? 'Activ' : 'Inactiv'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const title = prompt('Titlu serviciu:', service.title);
                            const description = prompt('Descriere:', service.description);
                            if (title && description) {
                              saveService({ ...service, title, description });
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
            <p className="text-gray-600">Folosește panoul PortfolioAdmin existent pentru management portfolio.</p>
            <div className="mt-4 grid gap-4">
              {portfolioItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="bg-gray-900 rounded-lg shadow-sm p-6">
            <ReelsAdmin />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recenzii Publice</h2>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    Aprobate: {publicReviews.filter(r => r.is_approved).length}
                  </span>
                  <span className="text-yellow-600">
                    Pending: {publicReviews.filter(r => !r.is_approved).length}
                  </span>
                  <span className="text-gray-600">Total: {publicReviews.length}</span>
                </div>
              </div>

              {publicReviews.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Nicio recenzie încă</p>
              ) : (
                <div className="space-y-3">
                  {publicReviews.map((review) => (
                    <div
                      key={review.id}
                      className={`border rounded-lg p-4 ${
                        review.is_approved
                          ? 'border-green-200 bg-green-50/30'
                          : 'border-yellow-200 bg-yellow-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{review.author_name}</h3>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                review.is_approved
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {review.is_approved ? 'Aprobat' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{review.message}</p>
                          <p className="text-xs text-gray-400">
                            Trimis: {new Date(review.created_at).toLocaleString('ro-RO')}
                            {review.reviewed_at && (
                              <> • Revizuit: {new Date(review.reviewed_at).toLocaleString('ro-RO')}</>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!review.is_approved && (
                            <button
                              onClick={() => approveReview(review.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Aprobă recenzia"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {review.is_approved && (
                            <button
                              onClick={() => rejectReview(review.id)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                              title="Respinge recenzia"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deletePublicReview(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Șterge recenzia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Întrebări Frecvente (FAQ)</h2>
                <button
                  onClick={() => {
                    const question = prompt('Întrebare:');
                    const answer = prompt('Răspuns:');
                    if (question && answer) {
                      saveFAQ({ question, answer, is_active: true });
                    }
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqItems.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const question = prompt('Întrebare:', faq.question);
                            const answer = prompt('Răspuns:', faq.answer);
                            if (question && answer) {
                              saveFAQ({ ...faq, question, answer });
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFAQ(faq.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && settings && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Informații Contact & Footer</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => updateSetting('contact_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresă
                </label>
                <input
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) => updateSetting('contact_address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => updateSetting('facebook_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => updateSetting('instagram_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok URL
                </label>
                <input
                  type="url"
                  value={settings.tiktok_url}
                  onChange={(e) => updateSetting('tiktok_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Footer</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline Footer
                  </label>
                  <input
                    type="text"
                    value={settings.footer_tagline}
                    onChange={(e) => updateSetting('footer_tagline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere Footer
                  </label>
                  <textarea
                    value={settings.footer_description}
                    onChange={(e) => updateSetting('footer_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}