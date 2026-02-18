export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export const setPageMeta = (meta: PageMeta) => {
  // Title
  document.title = meta.title;

  // Meta description
  updateMetaTag('name', 'description', meta.description);

  // Keywords
  if (meta.keywords) {
    updateMetaTag('name', 'keywords', meta.keywords);
  }

  // Open Graph
  updateMetaTag('property', 'og:title', meta.title);
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:type', 'website');
  if (meta.ogImage) {
    updateMetaTag('property', 'og:image', meta.ogImage);
  }

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', meta.title);
  updateMetaTag('name', 'twitter:description', meta.description);
  if (meta.ogImage) {
    updateMetaTag('name', 'twitter:image', meta.ogImage);
  }

  // Canonical URL
  if (meta.canonical) {
    updateCanonicalLink(meta.canonical);
  }
};

const updateMetaTag = (attr: string, attrValue: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

export const generateStructuredData = (type: 'LocalBusiness' | 'VideoObject', data: any) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);

  const existing = document.querySelector(`script[type="application/ld+json"]`);
  if (existing) {
    existing.remove();
  }

  document.head.appendChild(script);
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'SSM Detailing',
  image: 'https://ssmdetailing.ro/og-image.svg',
  '@id': 'https://ssmdetailing.ro',
  url: 'https://ssmdetailing.ro',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mărculești',
    addressRegion: 'Ialomița',
    addressCountry: 'RO'
  },
  sameAs: [
    'https://www.instagram.com/ssm_detailing06/',
    'https://www.facebook.com/profile.php?id=61568245228709',
    'https://www.tiktok.com/@stefanmarian66'
  ]
};
