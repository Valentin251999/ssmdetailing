import { useEffect } from 'react';
import Portfolio from '../components/Portfolio';

export default function PortfolioPage() {
  useEffect(() => {
    document.title = 'Portofoliu Detailing Auto | Lucrări Înainte și După';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Descoperă portofoliul nostru cu lucrări de detailing auto. Imagini înainte și după pentru detailing exterior, interior, plafon înstelat și recondiționare faruri.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Descoperă portofoliul nostru cu lucrări de detailing auto. Imagini înainte și după pentru detailing exterior, interior, plafon înstelat și recondiționare faruri.';
      document.head.appendChild(meta);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Portofoliu Detailing Auto | Lucrări Înainte și După');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute(
        'content',
        'Descoperă portofoliul nostru cu lucrări de detailing auto. Imagini înainte și după pentru detailing exterior, interior, plafon înstelat și recondiționare faruri.'
      );
    }
  }, []);

  return <Portfolio />;
}
