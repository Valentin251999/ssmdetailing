import { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

interface VideoReel {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  order_index: number;
  is_featured: boolean;
}

export default function Reels() {
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState<VideoReel | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { containerRef: gridRef, getItemStyle } = useStaggerAnimation(reels.length, { threshold: 0.05 });

  useEffect(() => {
    async function fetchReels() {
      const { data } = await supabase
        .from('video_reels')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(4);

      if (data) {
        setReels(data);
      }
      setLoading(false);
    }
    fetchReels();
  }, []);

  const isLocalVideo = (url: string) => {
    return !url.includes('youtube.com') &&
           !url.includes('youtu.be') &&
           !url.includes('instagram.com') &&
           !url.includes('tiktok.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()?.split('?')[0]
        : new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('instagram.com')) {
      return `${url}embed`;
    }
    if (url.includes('tiktok.com')) {
      return url.replace('/video/', '/embed/');
    }
    return url;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleOpenReel = (reel: VideoReel) => {
    setIsMuted(true);
    setSelectedReel(reel);
  };

  const handleCloseModal = () => {
    setSelectedReel(null);
    setIsMuted(true);
  };

  const handleVideoMount = (el: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
    if (el) {
      el.muted = true;
      const p = el.play();
      if (p) p.catch(() => {});
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!loading && reels.length === 0) {
    return null;
  }

  return (
    <>
      <section id="reels" className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              ref={headerRef}
              className="text-center mb-12"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
              }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-600">
                  Transformari
                </span>
                <span className="text-white ml-3">in Actiune</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Urmareste procesul nostru de lucru si rezultatele spectaculoase
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {reels.map((reel, index) => (
                  <div
                    key={reel.id}
                    onClick={() => handleOpenReel(reel)}
                    className="group relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    style={getItemStyle(index)}
                  >
                    {reel.thumbnail_url ? (
                      <img
                        src={reel.thumbnail_url}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/20" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                        <Play size={32} className="text-black fill-black ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="font-bold text-sm mb-1 line-clamp-2">{reel.title}</h3>
                      {reel.duration > 0 && (
                        <p className="text-xs text-gray-300">{formatDuration(reel.duration)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedReel && (
        <div
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
          onClick={() => handleCloseModal()}
          onKeyDown={(e) => { if (e.key === 'Escape') handleCloseModal(); }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedReel.title}
        >
          <div
            className="relative w-full h-full max-w-[500px] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {isLocalVideo(selectedReel.video_url) ? (
              <>
                <video
                  ref={handleVideoMount}
                  src={selectedReel.video_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="absolute bottom-24 right-4 z-[70] w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal();
                  }}
                  className="absolute top-4 right-4 z-[70] w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Inchide"
                  autoFocus
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <iframe
                  src={getEmbedUrl(selectedReel.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedReel.title}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal();
                  }}
                  className="absolute top-4 right-4 z-[70] w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Inchide"
                  autoFocus
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pb-8">
              <h3 className="text-white font-bold text-lg mb-1">{selectedReel.title}</h3>
              {selectedReel.description && (
                <p className="text-gray-300 text-sm">{selectedReel.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
