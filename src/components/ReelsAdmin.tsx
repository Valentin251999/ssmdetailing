import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MoveUp, MoveDown, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoReel {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  tiktok_url: string;
  category: 'interior' | 'exterior' | 'starlight' | 'funny';
  likes_count: number;
  comments_count: number;
  duration: number;
  order_index: number;
  is_active: boolean;
  is_featured: boolean;
}

export default function ReelsAdmin() {
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    tiktok_url: '',
    category: 'interior' as 'interior' | 'exterior' | 'starlight' | 'funny',
    likes_count: 0,
    comments_count: 0,
    duration: 0,
    is_active: true,
    is_featured: false,
  });

  const inputStyle = { color: '#ffffff', backgroundColor: '#111827' };

  useEffect(() => {
    fetchReels();
  }, []);

  async function fetchReels() {
    const { data } = await supabase
      .from('video_reels')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setReels(data);
    }
    setLoading(false);
  }

  async function handleSave() {
    try {
      // Validate featured videos limit (max 4)
      if (formData.is_featured) {
        const featuredCount = reels.filter(r => r.is_featured && r.id !== editingId).length;
        if (featuredCount >= 4) {
          alert('Poți avea maxim 4 videoclipuri principale! Te rog să dezactivezi un alt videoclip principal mai întâi.');
          return;
        }
      }

      if (editingId) {
        const { error } = await supabase
          .from('video_reels')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        setEditingId(null);
      } else {
        const maxOrder = Math.max(...reels.map(r => r.order_index), -1);
        const { error } = await supabase
          .from('video_reels')
          .insert([{ ...formData, order_index: maxOrder + 1 }]);
        if (error) throw error;
        setIsAdding(false);
      }
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        tiktok_url: '',
        category: 'interior',
        likes_count: 0,
        comments_count: 0,
        duration: 0,
        is_active: true,
        is_featured: false,
      });
      fetchReels();
      alert('Video salvat cu succes!');
    } catch (error) {
      console.error('Eroare la salvare:', error);
      alert('Eroare la salvare: ' + (error as Error).message);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Sigur vrei să ștergi acest video?')) {
      try {
        const reel = reels.find(r => r.id === id);

        // Delete video file from storage if it's a Supabase Storage URL
        if (reel?.video_url && reel.video_url.includes('supabase')) {
          const urlParts = reel.video_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          await supabase.storage.from('video-reels').remove([fileName]);
        }

        const { error } = await supabase.from('video_reels').delete().eq('id', id);
        if (error) throw error;
        fetchReels();
        alert('Video șters cu succes!');
      } catch (error) {
        console.error('Eroare la ștergere:', error);
        alert('Eroare la ștergere: ' + (error as Error).message);
      }
    }
  }

  async function handleVideoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Te rog selectează un fișier video valid!');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      alert('Fișierul este prea mare! Maxim 100MB permis.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('video-reels')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('video-reels')
        .getPublicUrl(fileName);

      // Update form data with the video URL
      setFormData({ ...formData, video_url: publicUrl });
      setUploadProgress(100);
      alert('Video încărcat cu succes!');
    } catch (error) {
      console.error('Eroare la upload:', error);
      alert('Eroare la încărcarea video-ului: ' + (error as Error).message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    const index = reels.findIndex(r => r.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === reels.length - 1)
    ) {
      return;
    }

    try {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newReels = [...reels];
      [newReels[index], newReels[newIndex]] = [newReels[newIndex], newReels[index]];

      const results = await Promise.all(
        newReels.map((reel, idx) =>
          supabase
            .from('video_reels')
            .update({ order_index: idx })
            .eq('id', reel.id)
        )
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error('Eroare la reordonare');
      }

      fetchReels();
    } catch (error) {
      console.error('Eroare la mutare:', error);
      alert('Eroare la mutare: ' + (error as Error).message);
    }
  }

  function startEdit(reel: VideoReel) {
    setEditingId(reel.id);
    setFormData({
      title: reel.title,
      description: reel.description,
      video_url: reel.video_url,
      thumbnail_url: reel.thumbnail_url,
      tiktok_url: reel.tiktok_url || '',
      category: reel.category || 'interior',
      likes_count: reel.likes_count || 0,
      comments_count: reel.comments_count || 0,
      duration: reel.duration,
      is_active: reel.is_active,
      is_featured: reel.is_featured || false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      tiktok_url: '',
      category: 'interior',
      likes_count: 0,
      comments_count: 0,
      duration: 0,
      is_active: true,
      is_featured: false,
    });
  }

  if (loading) {
    return <div className="text-white">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Video Reels</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
        >
          <Plus size={20} />
          <span>Adaugă Video</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white/5 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titlu *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
              placeholder="Ex: Restaurare Plafon Starlight BMW"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descriere
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
              rows={3}
              placeholder="Descriere scurtă a videoclipului..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video *
            </label>

            {/* Upload Video File */}
            <div className="mb-4">
              <label className="flex items-center justify-center w-full px-4 py-6 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-300">
                    {uploading ? 'Se încarcă...' : 'Click pentru a încărca un video'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, WEBM (max 100MB)</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {uploading && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    {uploadProgress}% încărcat
                  </p>
                </div>
              )}
            </div>

            {/* OR separator */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-700 flex-grow"></div>
              <span className="px-4 text-sm text-gray-500">SAU</span>
              <div className="border-t border-gray-700 flex-grow"></div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                URL Video (YouTube, Instagram, TikTok, sau link direct)
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                style={inputStyle}
                placeholder="https://www.tiktok.com/@user/video/1234567890"
              />
              <div className="text-xs text-gray-400 mt-1 space-y-1">
                <p>• <span className="font-medium">TikTok:</span> https://www.tiktok.com/@user/video/1234567890</p>
                <p>• <span className="font-medium">YouTube:</span> https://www.youtube.com/watch?v=xxxxxxxxxxx</p>
                <p>• <span className="font-medium">Instagram:</span> https://www.instagram.com/reel/xxxxxxxxxxx/</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Thumbnail (imagine preview)
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Link TikTok (opțional)
            </label>
            <input
              type="url"
              value={formData.tiktok_url}
              onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
              placeholder="https://www.tiktok.com/@user/video/..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Link direct către videoclipul TikTok original
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'interior' | 'exterior' | 'starlight' | 'funny' })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
            >
              <option value="interior" className="bg-gray-900 text-white">Interior</option>
              <option value="exterior" className="bg-gray-900 text-white">Exterior</option>
              <option value="starlight" className="bg-gray-900 text-white">Starlight</option>
              <option value="funny" className="bg-gray-900 text-white">Amuzante</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Like-uri (afișare)
              </label>
              <input
                type="number"
                value={formData.likes_count}
                onChange={(e) => setFormData({ ...formData, likes_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comentarii (afișare)
              </label>
              <input
                type="number"
                value={formData.comments_count}
                onChange={(e) => setFormData({ ...formData, comments_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Durată (secunde)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg !text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              style={inputStyle}
              placeholder="60"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-300">
                Activ (vizibil pe site)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="is_featured" className="text-sm text-gray-300">
                Videoclip Principal (afișat pe pagina principală - max 4)
              </label>
            </div>
            <p className="text-xs text-gray-400 ml-6">
              Doar videoclipurile marcate ca principale vor apărea în secțiunea "Transformări în Acțiune" de pe pagina principală (maxim 4 videoclipuri).
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={20} />
              <span>Anulează</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title || !formData.video_url}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>Salvează</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              {reel.thumbnail_url && (
                <img
                  src={reel.thumbnail_url}
                  alt={reel.title}
                  className="w-24 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold">{reel.title}</h4>
                {reel.description && (
                  <p className="text-gray-400 text-sm mt-1">{reel.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                    {reel.category ? reel.category.toUpperCase() : 'INTERIOR'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Durată: {Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-gray-500">
                    ❤️ {reel.likes_count || 0} 💬 {reel.comments_count || 0}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    reel.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {reel.is_active ? 'Activ' : 'Inactiv'}
                  </span>
                  {reel.is_featured && (
                    <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                      ⭐ Principal
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMove(reel.id, 'up')}
                disabled={index === 0}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mută în sus"
              >
                <MoveUp size={20} />
              </button>
              <button
                onClick={() => handleMove(reel.id, 'down')}
                disabled={index === reels.length - 1}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mută în jos"
              >
                <MoveDown size={20} />
              </button>
              <button
                onClick={() => startEdit(reel)}
                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                title="Editează"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(reel.id)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Șterge"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reels.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-400">
          <p>Nu există videoclipuri încă. Adaugă primul video!</p>
        </div>
      )}
    </div>
  );
}
