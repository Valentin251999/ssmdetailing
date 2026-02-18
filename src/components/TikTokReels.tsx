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
  let sessionId = localStorage.getItem('reels_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('reels_session_id', sessionId);
  }
  return sessionId;
}

function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function isPlayableVideo(url: string) {
  return !url.includes('tiktok.com') && !url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('instagram.com');
}

export default function TikTokReels({ onNavigateToHome }: TikTokReelsProps) {
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [filteredReels, setFilteredReels] = useState<VideoReel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedVideoForComments, setSelectedVideoForComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const isMutedRef = useRef(true);
  const currentIndexRef = useRef(0);
  const filteredReelsRef = useRef<VideoReel[]>([]);
  const sessionId = getSessionId();

  filteredReelsRef.current = filteredReels;

  useEffect(() => {
    fetchReels();
    checkUserLikes();
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;

    const channel = supabase
      .channel('reels-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_reel_likes' }, (payload) => {
        const videoId = (payload.new as { video_reel_id?: string })?.video_reel_id || (payload.old as { video_reel_id?: string })?.video_reel_id;
        if (videoId) fetchSingleLikeCount(videoId);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'video_reel_comments' }, (payload) => {
        const videoId = (payload.new as { video_reel_id?: string })?.video_reel_id;
        if (videoId) {
          fetchSingleCommentCount(videoId);
          if (showCommentsModal && selectedVideoForComments === videoId) {
            fetchComments(videoId);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reels, showCommentsModal, selectedVideoForComments]);

  useEffect(() => {
    pauseAllVideos();
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setIsPaused(false);

    if (selectedCategory === 'all') {
      setFilteredReels(reels);
    } else {
      setFilteredReels(reels.filter(reel => reel.category === selectedCategory));
    }
  }, [selectedCategory, reels]);

  useEffect(() => {
    if (filteredReels.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const reelId = entry.target.getAttribute('data-reel-id');
            if (!reelId) continue;

            const reelsList = filteredReelsRef.current;
            const idx = reelsList.findIndex(r => r.id === reelId);
            if (idx === -1 || idx === currentIndexRef.current) continue;

            currentIndexRef.current = idx;
            setCurrentIndex(idx);
            setIsPaused(false);
            playVideoAtIndex(idx);
          }
        }
      },
      {
        root: container,
        threshold: [0.6],
      }
    );

    const slides = container.querySelectorAll<HTMLElement>('[data-reel-id]');
    slides.forEach(slide => observer.observe(slide));

    const timer = setTimeout(() => {
      playVideoAtIndex(0);
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [filteredReels]);

  function playVideoAtIndex(index: number) {
    pauseAllVideos();

    const reelsList = filteredReelsRef.current;
    if (index < 0 || index >= reelsList.length) return;

    const reel = reelsList[index];
    if (!reel || !isPlayableVideo(reel.video_url)) return;

    const video = videoRefs.current.get(reel.id);
    if (!video) return;

    video.currentTime = 0;

    if (video.readyState >= 2) {
      startPlayback(video);
    } else {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('loadeddata', onCanPlay);
        if (currentIndexRef.current === index) {
          startPlayback(video);
        }
      };
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('loadeddata', onCanPlay);
      video.load();
    }
  }

  function startPlayback(video: HTMLVideoElement) {
    video.muted = true;
    const p = video.play();
    if (p) {
      p.then(() => {
        video.muted = isMutedRef.current;
      }).catch(() => {});
    }
  }

  function pauseAllVideos() {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  }

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMutedRef.current;
    isMutedRef.current = newMuted;
    setIsMuted(newMuted);

    videoRefs.current.forEach((video) => {
      if (video) video.muted = newMuted;
    });
  }, []);

  const handleTogglePlay = useCallback(() => {
    const reelsList = filteredReelsRef.current;
    const idx = currentIndexRef.current;
    if (idx < 0 || idx >= reelsList.length) return;

    const reel = reelsList[idx];
    const video = videoRefs.current.get(reel.id);
    if (!video) return;

    if (video.paused) {
      video.muted = isMutedRef.current;
      const p = video.play();
      if (p) {
        p.then(() => setIsPaused(false)).catch(() => {
          video.muted = true;
          isMutedRef.current = true;
          setIsMuted(true);
          video.play().then(() => setIsPaused(false)).catch(() => {});
        });
      } else {
        setIsPaused(false);
      }
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, []);

  const handleVideoRef = useCallback((el: HTMLVideoElement | null, reelId: string) => {
    if (el) {
      videoRefs.current.set(reelId, el);
    } else {
      videoRefs.current.delete(reelId);
    }
  }, []);

  const fetchSingleLikeCount = async (videoId: string) => {
    const { count } = await supabase
      .from('video_reel_likes')
      .select('*', { count: 'exact', head: true })
      .eq('video_reel_id', videoId);
    setLikeCounts(prev => ({ ...prev, [videoId]: count || 0 }));
  };

  const fetchSingleCommentCount = async (videoId: string) => {
    const { count } = await supabase
      .from('video_reel_comments')
      .select('*', { count: 'exact', head: true })
      .eq('video_reel_id', videoId);
    setCommentCounts(prev => ({ ...prev, [videoId]: count || 0 }));
  };

  const fetchReels = async () => {
    try {
      setIsLoading(true);
      setFetchError(false);
      const { data, error } = await supabase
        .from('video_reels')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      const reelData = data || [];
      setReels(reelData);
      setFilteredReels(reelData);

      if (reelData.length > 0) {
        await fetchLikeAndCommentCounts(reelData.map(r => r.id));
      }
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserLikes = async () => {
    try {
      const { data } = await supabase
        .from('video_reel_likes')
        .select('video_reel_id')
        .eq('session_id', sessionId);
      if (data) setLikedVideos(new Set(data.map(like => like.video_reel_id)));
    } catch {}
  };

  const fetchLikeAndCommentCounts = async (videoIds: string[]) => {
    try {
      const [likesData, commentsData] = await Promise.all([
        supabase.from('video_reel_likes').select('video_reel_id').in('video_reel_id', videoIds),
        supabase.from('video_reel_comments').select('video_reel_id').in('video_reel_id', videoIds)
      ]);

      const likesMap: { [key: string]: number } = {};
      const commentsMap: { [key: string]: number } = {};
      videoIds.forEach(id => { likesMap[id] = 0; commentsMap[id] = 0; });

      if (likesData.data) {
        likesData.data.forEach(like => {
          likesMap[like.video_reel_id] = (likesMap[like.video_reel_id] || 0) + 1;
        });
      }
      if (commentsData.data) {
        commentsData.data.forEach(comment => {
          commentsMap[comment.video_reel_id] = (commentsMap[comment.video_reel_id] || 0) + 1;
        });
      }

      setLikeCounts(likesMap);
      setCommentCounts(commentsMap);
    } catch {}
  };

  const toggleLike = async (videoId: string) => {
    const isLiked = likedVideos.has(videoId);

    if (isLiked) {
      const newLiked = new Set(likedVideos);
      newLiked.delete(videoId);
      setLikedVideos(newLiked);
      setLikeCounts(prev => ({ ...prev, [videoId]: Math.max(0, (prev[videoId] || 0) - 1) }));
      await supabase.from('video_reel_likes').delete().eq('video_reel_id', videoId).eq('session_id', sessionId);
    } else {
      const newLiked = new Set(likedVideos);
      newLiked.add(videoId);
      setLikedVideos(newLiked);
      setLikeCounts(prev => ({ ...prev, [videoId]: (prev[videoId] || 0) + 1 }));
      await supabase.from('video_reel_likes').insert([{ video_reel_id: videoId, session_id: sessionId }]);
    }
  };

  const openComments = async (videoId: string) => {
    setSelectedVideoForComments(videoId);
    setShowCommentsModal(true);
    await fetchComments(videoId);
  };

  const fetchComments = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_reel_comments')
        .select('*')
        .eq('video_reel_id', videoId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch {
      setCommentError('Nu s-au putut incarca comentariile.');
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !selectedVideoForComments) return;
    const name = authorName.trim() || 'Anonim';
    setCommentError(null);

    try {
      const { error } = await supabase
        .from('video_reel_comments')
        .insert([{
          video_reel_id: selectedVideoForComments,
          author_name: name,
          content: newComment.trim(),
          session_id: sessionId
        }]);
      if (error) throw error;
      setNewComment('');
      await fetchComments(selectedVideoForComments);
    } catch {
      setCommentError('Comentariul nu a putut fi trimis. Incearca din nou.');
    }
  };

  const categories = [
    { value: 'all', label: 'Toate' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'starlight', label: 'Starlight' },
    { value: 'funny', label: 'Amuzante' }
  ];

  if (isLoading) {
    return (
      <section id="reels" className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (fetchError) {
    return (
      <section id="reels" className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-xl">Nu s-au putut incarca video-urile.</div>
        <button
          onClick={fetchReels}
          className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          Incearca din nou
        </button>
      </section>
    );
  }

  if (filteredReels.length === 0) {
    return (
      <section id="reels" className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Nu exista video-uri disponibile</div>
      </section>
    );
  }

  return (
    <section id="reels" className="relative">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 shadow-lg">
        <div className="flex items-center gap-1 md:gap-2">
          <Filter className="w-4 h-4 text-white hidden md:block" />
          <div className="flex gap-1 md:gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {onNavigateToHome && (
        <button
          onClick={onNavigateToHome}
          className="fixed top-16 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-full p-3 hover:bg-black/90 transition-all group shadow-lg active:scale-95"
          aria-label="Inapoi la pagina principala"
          style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
        >
          <ArrowLeft className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" />
        </button>
      )}

      {isMuted && (
        <button
          onClick={handleToggleMute}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-5 py-3 text-white text-sm font-medium shadow-lg active:scale-95 transition-all animate-pulse"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <VolumeX className="w-5 h-5" />
          <span>Apasa pentru sunet</span>
        </button>
      )}

      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {filteredReels.map((reel, index) => {
          const playable = isPlayableVideo(reel.video_url);
          const isActive = index === currentIndex;

          return (
            <div
              key={reel.id}
              data-reel-id={reel.id}
              className="relative h-screen w-full snap-start snap-always flex items-center justify-center bg-black"
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              {reel.video_url.includes('tiktok.com') ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <img
                    src={reel.thumbnail_url || 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <a
                      href={reel.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-12 h-12 text-white ml-2" fill="currentColor" />
                      </div>
                      <div className="px-6 py-3 bg-white rounded-full flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-bold">Vezi pe TikTok</span>
                      </div>
                    </a>
                  </div>
                </div>
              ) : reel.video_url.includes('youtube.com') || reel.video_url.includes('youtu.be') ? (
                <iframe
                  src={isActive
                    ? `https://www.youtube.com/embed/${extractYouTubeId(reel.video_url)}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeId(reel.video_url)}`
                    : `https://www.youtube.com/embed/${extractYouTubeId(reel.video_url)}?autoplay=0&mute=1`
                  }
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
                  scrolling="no"
                  title={reel.title}
                />
              ) : (
                <video
                  ref={(el) => handleVideoRef(el, reel.id)}
                  src={reel.video_url}
                  poster={reel.thumbnail_url}
                  loop
                  playsInline
                  muted
                  preload={index <= 2 ? 'auto' : 'metadata'}
                  onClick={handleTogglePlay}
                  className="absolute inset-0 w-full h-full object-cover md:object-contain cursor-pointer"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                />
              )}

              {playable && isActive && isPaused && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all cursor-pointer z-10"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center active:scale-95 transition-transform">
                    <Play className="w-10 h-10 text-black ml-2" fill="currentColor" />
                  </div>
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                <div className="max-w-lg">
                  <h3 className="text-white text-xl font-bold mb-2">{reel.title}</h3>
                  {reel.description && (
                    <p className="text-white/90 text-sm mb-4">{reel.description}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      {reel.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 bottom-24 flex flex-col gap-5 z-20">
                {playable && (
                  <button
                    onClick={handleToggleMute}
                    className="flex flex-col items-center gap-1 group"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label={isMuted ? 'Porneste sunetul' : 'Opreste sunetul'}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                      {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </div>
                  </button>
                )}

                <button
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center gap-1 group"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                    likedVideos.has(reel.id)
                      ? 'bg-red-500'
                      : 'bg-white/20 group-hover:bg-red-500'
                  }`}>
                    <Heart className={`w-6 h-6 ${likedVideos.has(reel.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-medium">
                    {likeCounts[reel.id] || 0}
                  </span>
                </button>

                <button
                  onClick={() => openComments(reel.id)}
                  className="flex flex-col items-center gap-1 group"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-500 transition-all">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">
                    {commentCounts[reel.id] || 0}
                  </span>
                </button>

                {reel.tiktok_url && (
                  <a
                    href={reel.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white transition-all">
                      <ExternalLink className="w-6 h-6 text-white group-hover:text-black" />
                    </div>
                    <span className="text-white text-xs font-medium">TikTok</span>
                  </a>
                )}
              </div>

              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-sm z-20">
                {index + 1} / {filteredReels.length}
              </div>
            </div>
          );
        })}
      </div>

      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white text-lg font-bold">
                Comentarii ({commentCounts[selectedVideoForComments || ''] || 0})
              </h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-white/60 text-center py-8">Fii primul care comenteaza!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                        {comment.author_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{comment.author_name}</p>
                        <p className="text-white/40 text-xs">
                          {new Date(comment.created_at).toLocaleDateString('ro-RO', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 space-y-3">
              {commentError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {commentError}
                </p>
              )}
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Numele tau (optional)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Scrie un comentariu..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={submitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </section>
  );
}
