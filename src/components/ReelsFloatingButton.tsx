import { Video } from 'lucide-react';

interface ReelsFloatingButtonProps {
  onClick: () => void;
}

export default function ReelsFloatingButton({ onClick }: ReelsFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-32 left-6 z-50 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 transition-all duration-300 hover:scale-110 group"
      aria-label="Vezi Reels"
    >
      <Video size={28} className="md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse"></span>
    </button>
  );
}
