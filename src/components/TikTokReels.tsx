import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, ExternalLink, Play, Volume2, VolumeX, Filter, ArrowLeft, X, Send } from 'lucide-react';
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
  is_featured: boolean;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface TikTokReelsProps {
  onNavigateToHome?: () => void;
}

function getSessionId() {
  let id = localStorage.getItem('reels_session_id');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('reels_session_id', id);
  }
  return id;
}

function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return '';
}

function isLocalVideo(url: string) {
  if (!url) return false;
  return (
    !url.includes('tiktok.com') &&
    !url.includes('youtube.com') &&
    !url.includes('youtu.be') &&
    !url.includes('instagram.com')
  );
}

const SESSION_ID = getSessionId();

export default function TikTokReels({ onNavigateToHome }: TikTokReelsProps) {
  const [allReels, setAllReels] = useState<VideoReel[]>([]);
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [category, setCategory] = useState('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [showComments, setShowComments] = useState(false);
  const [commentsVideoId, setCommentsVideoId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const activeIdxRef = useRef(0);
  const isMutedRef = useRef(true);
  const reelsRef = useRef<VideoReel[]>([]);

  reelsRef.current = reels;

  useEffect(() => {
    loadReels();
    loadLikes();
  }, []);

  useEffect(() => {
    if (allReels.length === 0) return;
    const channel = supabase
      .channel('reels-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_reel_likes' }, (p) => {
        const vid = (p.new as any)?.video_reel_id || (p.old as any)?.video_reel_id;
        if (vid) refreshLikeCount(vid);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'video_reel_comments' }, (p) => {
        const vid = (p.new as any)?.video_reel_id;
        if (vid) {
          refreshCommentCount(vid);
          if (showComments && commentsVideoId === vid) loadComments(vid);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [allReels, showComments, commentsVideoId]);

  useEffect(() => {
    let filtered = category === 'all' ? allReels : allReels.filter(r => r.category === category);
    stopAll();
    videoRefs.current = {};
    activeIdxRef.current = 0;
    setActiveIdx(0);
    setIsPaused(false);
    setReels(filtered);
  }, [category, allReels]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (reels.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = 0;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach(entry => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (!isNaN(idx) && entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { idx, ratio: entry.intersectionRatio };
            }
          }
        });
        if (best && (best as { idx: number; ratio: number }).ratio >= 0.5) {
          const newIdx = (best as { idx: number; ratio: number }).idx;
          if (newIdx !== activeIdxRef.current) {
            stopAll();
            activeIdxRef.current = newIdx;
            setActiveIdx(newIdx);
            setIsPaused(false);
          }
          tryPlay(newIdx);
        }
      },
      { root: container, threshold: [0.5, 0.8, 1.0] }
    );
    observerRef.current = observer;

    const slides = container.querySelectorAll('[data-idx]');
    slides.forEach(s => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  function stopAll() {
    Object.values(videoRefs.current).forEach(v => {
      if (v && !v.paused) v.pause();
    });
  }

  function tryPlay(idx: number) {
    const reel = reelsRef.current[idx];
    if (!reel || !isLocalVideo(reel.video_url)) return;

    const attemptPlay = () => {
      const v = videoRefs.current[idx];
      if (!v) return;
      if (activeIdxRef.current !== idx) return;
      v.muted = true;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (activeIdxRef.current === idx) {
              v.muted = isMutedRef.current;
            }
          })
          .catch(() => {});
      }
    };

    const v = videoRefs.current[idx];
    if (v) {
      if (v.readyState >= 2) {
        attemptPlay();
      } else {
        v.addEventListener('canplay', attemptPlay, { once: true });
        v.load();
      }
    } else {
      setTimeout(() => {
        if (activeIdxRef.current === idx) tryPlay(idx);
      }, 150);
    }
  }

  function setVideoRef(el: HTMLVideoElement | null, idx: number) {
    videoRefs.current[idx] = el;
    if (el && idx === activeIdxRef.current) {
      tryPlay(idx);
      if (observerRef.current && el.closest('[data-idx]')) {
        const slide = el.closest('[data-idx]') as HTMLElement;
        observerRef.current.observe(slide);
      }
    }
  }

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    Object.values(videoRefs.current).forEach(v => { if (v) v.muted = next; });
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRefs.current[activeIdxRef.current];
    if (!v) return;
    if (v.paused) {
      v.muted = isMutedRef.current;
      v.play()
        .then(() => setIsPaused(false))
        .catch(() => {
          v.muted = true; isMutedRef.current = true; setIsMuted(true);
          v.play().then(() => setIsPaused(false)).catch(() => {});
        });
    } else {
      v.pause();
      setIsPaused(true);
    }
  }, []);

  async function loadReels() {
    try {
      setIsLoading(true);
      setFetchError(false);
      const { data, error } = await supabase
        .from('video_reels')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      const list = data || [];
      setAllReels(list);
      if (list.length > 0) await loadCounts(list.map(r => r.id));
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadLikes() {
    try {
      const { data } = await supabase
        .from('video_reel_likes')
        .select('video_reel_id')
        .eq('session_id', SESSION_ID);
      if (data) setLikedVideos(new Set(data.map(d => d.video_reel_id)));
    } catch {}
  }

  async function loadCounts(ids: string[]) {
    try {
      const [l, c] = await Promise.all([
        supabase.from('video_reel_likes').select('video_reel_id').in('video_reel_id', ids),
        supabase.from('video_reel_comments').select('video_reel_id').in('video_reel_id', ids),
      ]);
      const lm: Record<string, number> = {};
      const cm: Record<string, number> = {};
      ids.forEach(id => { lm[id] = 0; cm[id] = 0; });
      l.data?.forEach(r => { lm[r.video_reel_id] = (lm[r.video_reel_id] || 0) + 1; });
      c.data?.forEach(r => { cm[r.video_reel_id] = (cm[r.video_reel_id] || 0) + 1; });
      setLikeCounts(lm);
      setCommentCounts(cm);
    } catch {}
  }

  async function refreshLikeCount(vid: string) {
    const { count } = await supabase.from('video_reel_likes').select('*', { count: 'exact', head: true }).eq('video_reel_id', vid);
    setLikeCounts(p => ({ ...p, [vid]: count || 0 }));
  }

  async function refreshCommentCount(vid: string) {
    const { count } = await supabase.from('video_reel_comments').select('*', { count: 'exact', head: true }).eq('video_reel_id', vid);
    setCommentCounts(p => ({ ...p, [vid]: count || 0 }));
  }

  async function toggleLike(vid: string) {
    if (likedVideos.has(vid)) {
      setLikedVideos(p => { const s = new Set(p); s.delete(vid); return s; });
      setLikeCounts(p => ({ ...p, [vid]: Math.max(0, (p[vid] || 0) - 1) }));
      await supabase.from('video_reel_likes').delete().eq('video_reel_id', vid).eq('session_id', SESSION_ID);
    } else {
      setLikedVideos(p => new Set([...p, vid]));
      setLikeCounts(p => ({ ...p, [vid]: (p[vid] || 0) + 1 }));
      await supabase.from('video_reel_likes').insert([{ video_reel_id: vid, session_id: SESSION_ID }]);
    }
  }

  async function openComments(vid: string) {
    setCommentsVideoId(vid);
    setShowComments(true);
    await loadComments(vid);
  }

  async function loadComments(vid: string) {
    try {
      const { data, error } = await supabase
        .from('video_reel_comments')
        .select('*')
        .eq('video_reel_id', vid)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch {
      setCommentError('Nu s-au putut incarca comentariile.');
    }
  }

  async function submitComment() {
    if (!newComment.trim() || !commentsVideoId) return;
    setCommentError(null);
    try {
      const { error } = await supabase.from('video_reel_comments').insert([{
        video_reel_id: commentsVideoId,
        author_name: authorName.trim() || 'Anonim',
        content: newComment.trim(),
        session_id: SESSION_ID,
      }]);
      if (error) throw error;
      setNewComment('');
      await loadComments(commentsVideoId);
    } catch {
      setCommentError('Comentariul nu a putut fi trimis. Incearca din nou.');
    }
  }

  const CATEGORIES = [
    { value: 'all', label: 'Toate' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'starlight', label: 'Starlight' },
    { value: 'funny', label: 'Amuzante' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Nu s-au putut incarca video-urile.</p>
        <button onClick={loadReels} className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors">
          Incearca din nou
        </button>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Nu exista video-uri disponibile</p>
      </div>
    );
  }

  return (
    <div id="reels" className="relative bg-black">
      {/* Category filter */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-white hidden md:block mr-1" />
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all ${
                category === c.value ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {onNavigateToHome && (
        <button
          onClick={onNavigateToHome}
          className="fixed top-16 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-full p-3 hover:bg-black/90 transition-all shadow-lg"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Mute hint */}
      {isMuted && (
        <button
          onClick={toggleMute}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-5 py-3 text-white text-sm font-medium shadow-lg animate-pulse"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <VolumeX className="w-5 h-5" />
          <span>Apasa pentru sunet</span>
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
        className="scrollbar-hide"
      >
        {reels.map((reel, idx) => {
          const local = isLocalVideo(reel.video_url);
          const isActive = idx === activeIdx;
          const ytId = extractYouTubeId(reel.video_url);

          return (
            <div
              key={reel.id + idx}
              data-idx={idx}
              style={{ height: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              className="relative w-full flex items-center justify-center bg-black flex-shrink-0"
            >
              {/* Video / embed */}
              {reel.video_url.includes('tiktok.com') ? (
                <>
                  <img
                    src={reel.thumbnail_url || 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-12 h-12 text-white ml-2" fill="currentColor" />
                      </div>
                      <div className="px-6 py-3 bg-white rounded-full flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-bold">Vezi pe TikTok</span>
                      </div>
                    </a>
                  </div>
                </>
              ) : (reel.video_url.includes('youtube.com') || reel.video_url.includes('youtu.be')) ? (
                <iframe
                  src={isActive
                    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}`
                    : `https://www.youtube.com/embed/${ytId}?autoplay=0&mute=1`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={reel.title}
                />
              ) : reel.video_url.includes('instagram.com') ? (
                <iframe
                  src={`${reel.video_url}embed`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title={reel.title}
                />
              ) : (
                <video
                  ref={el => setVideoRef(el, idx)}
                  src={reel.video_url}
                  poster={reel.thumbnail_url}
                  loop
                  playsInline
                  muted
                  preload={idx === 0 || idx === 1 ? 'auto' : 'metadata'}
                  onClick={togglePlay}
                  className="absolute inset-0 w-full h-full object-cover md:object-contain cursor-pointer"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                />
              )}

              {/* Pause overlay */}
              {local && isActive && isPaused && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 cursor-pointer"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-10 h-10 text-black ml-2" fill="currentColor" />
                  </div>
                </button>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                <div className="max-w-lg">
                  <h3 className="text-white text-xl font-bold mb-2">{reel.title}</h3>
                  {reel.description && <p className="text-white/90 text-sm mb-3">{reel.description}</p>}
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    {reel.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right action buttons */}
              <div className="absolute right-4 bottom-28 flex flex-col gap-5 z-20">
                {local && (
                  <button onClick={toggleMute} className="flex flex-col items-center gap-1" style={{ WebkitTapHighlightColor: 'transparent' }}>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                      {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </div>
                  </button>
                )}

                <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1" style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <div className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${likedVideos.has(reel.id) ? 'bg-red-500' : 'bg-white/20 hover:bg-red-500'}`}>
                    <Heart className={`w-6 h-6 ${likedVideos.has(reel.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{likeCounts[reel.id] || 0}</span>
                </button>

                <button onClick={() => openComments(reel.id)} className="flex flex-col items-center gap-1" style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500 transition-all">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{commentCounts[reel.id] || 0}</span>
                </button>

                {reel.tiktok_url && (
                  <a href={reel.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all">
                      <ExternalLink className="w-6 h-6 text-white hover:text-black" />
                    </div>
                    <span className="text-white text-xs font-medium">TikTok</span>
                  </a>
                )}
              </div>

              {/* Counter */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white text-sm z-20 bg-black/40 px-3 py-1 rounded-full">
                {idx + 1} / {reels.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white text-lg font-bold">Comentarii ({commentCounts[commentsVideoId || ''] || 0})</h3>
              <button onClick={() => setShowComments(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-white/60 text-center py-8">Fii primul care comenteaza!</p>
              ) : comments.map(c => (
                <div key={c.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                      {c.author_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{c.author_name}</p>
                      <p className="text-white/40 text-xs">
                        {new Date(c.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 space-y-3">
              {commentError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{commentError}</p>
              )}
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Numele tau (optional)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitComment()}
                  placeholder="Scrie un comentariu..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={submitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
