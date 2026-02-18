import { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  beforeLabel = 'Înainte',
  afterLabel = 'După',
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hintPlayed, setHintPlayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const getPositionFromEvent = useCallback((clientX: number): number => {
    const container = containerRef.current;
    if (!container) return 50;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    return Math.min(Math.max(pct, 2), 98);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        setPosition(getPositionFromEvent(e.clientX));
      });
    },
    [isDragging, getPositionFromEvent]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        setPosition(getPositionFromEvent(e.touches[0].clientX));
      });
    },
    [getPositionFromEvent]
  );

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) {
        setPosition(getPositionFromEvent(e.clientX));
      }
    },
    [isDragging, getPositionFromEvent]
  );

  useEffect(() => {
    if (hintPlayed) return;
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const duration = 1200;
      const from = 50;
      const to = 30;

      const step = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setPosition(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(step);
        else {
          let start2: number | null = null;
          const step2 = (ts2: number) => {
            if (!start2) start2 = ts2;
            const elapsed2 = ts2 - start2;
            const t2 = Math.min(elapsed2 / duration, 1);
            const eased2 = t2 < 0.5 ? 2 * t2 * t2 : -1 + (4 - 2 * t2) * t2;
            setPosition(to + (from - to) * eased2);
            if (t2 < 1) requestAnimationFrame(step2);
          };
          requestAnimationFrame(step2);
        }
      };
      requestAnimationFrame(step);
      setHintPlayed(true);
    }, 800);
    return () => clearTimeout(timeout);
  }, [hintPlayed]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] overflow-hidden rounded-xl select-none ${
        isDragging ? 'cursor-ew-resize' : 'cursor-col-resize'
      }`}
      onMouseDown={handleContainerClick}
      aria-label={`Comparator inainte/dupa: ${title}`}
    >
      <img
        src={afterUrl}
        alt={`${title} - ${afterLabel}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeUrl}
          alt={`${title} - ${beforeLabel}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{ left: `${position}%` }}
      />

      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,0,0,0.5)] transition-transform ${
          isDragging ? 'scale-110' : 'hover:scale-110'
        }`}
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e);
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={handleTouchMove}
      >
        <GripVertical className="w-5 h-5 text-neutral-800" />
      </div>

      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="bg-amber-500/90 backdrop-blur-sm text-black text-xs font-semibold px-2.5 py-1 rounded-full">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
