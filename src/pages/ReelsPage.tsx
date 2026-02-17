import { useEffect } from 'react';
import TikTokReels from '../components/TikTokReels';

export default function ReelsPage() {
  useEffect(() => {
    document.title = 'Reels Detailing Auto | Transformări Spectaculoase';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Urmărește transformările spectaculoase ale mașinilor noastre. Videoclipuri scurte cu detailing interior, exterior și starlight.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Urmărește transformările spectaculoase ale mașinilor noastre. Videoclipuri scurte cu detailing interior, exterior și starlight.';
      document.head.appendChild(meta);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Reels Detailing Auto | Transformări Spectaculoase');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute(
        'content',
        'Urmărește transformările spectaculoase ale mașinilor noastre. Videoclipuri scurte cu detailing interior, exterior și starlight.'
      );
    }
  }, []);

  return <TikTokReels />;
}
