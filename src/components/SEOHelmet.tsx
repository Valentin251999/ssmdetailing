import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export default function SEOHelmet({
  title = 'SSM Detailing - Servicii Premium de Detailing Auto în Galați',
  description = 'SSM Detailing oferă servicii profesionale de detailing auto în Galați: polish caroserie, tratamente ceramice, curățare detaliată interior și exterior. Experiență de 8 ani, rezultate garantate.',
  keywords = 'detailing auto galati, polish auto galati, ceramic coating galati, curatare interior auto, detailing profesional, ssm detailing',
  ogImage = 'https://ssmdetailing.ro/og-image.svg',
  canonical
}: SEOHelmetProps) {
  const location = useLocation();
  const baseUrl = 'https://ssmdetailing.ro';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'SSM Detailing' },
      { property: 'og:locale', content: 'ro_RO' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;

      let element = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value!);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;
  }, [title, description, keywords, ogImage, fullUrl, canonicalUrl]);

  return null;
}
