import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const META_ATTRS = [
  { attr: 'name', value: 'description' },
  { attr: 'name', value: 'keywords' },
  { attr: 'property', value: 'og:title' },
  { attr: 'property', value: 'og:description' },
  { attr: 'property', value: 'og:image' },
  { attr: 'property', value: 'og:url' },
  { attr: 'property', value: 'og:type' },
  { attr: 'property', value: 'og:site_name' },
  { attr: 'property', value: 'og:locale' },
  { attr: 'name', value: 'twitter:card' },
  { attr: 'name', value: 'twitter:title' },
  { attr: 'name', value: 'twitter:description' },
  { attr: 'name', value: 'twitter:image' },
];

function setMeta(attr: string, value: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    el.setAttribute('data-seo-helmet', 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEOHelmet({
  title = 'SSM Detailing Mărculești | Plafoane Starlight & Detailing Auto Premium',
  description = 'Atelier specializat în plafoane starlight personalizate, curățare interioară premium și restaurare faruri în Mărculești, Ialomița. Peste 8 ani experiență, rezultate garantate.',
  keywords = 'detailing auto Marculesti, plafon starlight, curatare auto interioara, reconditionare faruri, detailing Ialomita, SSM Detailing',
  ogImage = 'https://ssmdetailing.ro/og-image.svg',
  canonical
}: SEOHelmetProps) {
  const location = useLocation();
  const baseUrl = 'https://ssmdetailing.ro';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'SSM Detailing');
    setMeta('property', 'og:locale', 'ro_RO');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.setAttribute('data-seo-helmet', 'true');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    return () => {
      META_ATTRS.forEach(({ attr, value }) => {
        const el = document.querySelector(`meta[${attr}="${value}"][data-seo-helmet]`);
        if (el) el.remove();
      });
      const link = document.querySelector('link[rel="canonical"][data-seo-helmet]');
      if (link) link.remove();
    };
  }, [title, description, keywords, ogImage, fullUrl, canonicalUrl]);

  return null;
}
