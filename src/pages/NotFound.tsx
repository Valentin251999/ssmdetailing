import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Pagina nu a fost gasita
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Ne pare rau, dar pagina pe care o cauti nu exista sau a fost mutata.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Pagina Principala
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white px-8 py-3.5 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Inapoi
          </button>
        </div>
      </div>
    </div>
  );
}
