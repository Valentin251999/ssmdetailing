import { useEffect } from 'react';

const BASE_URL = 'https://ssmdetailing.ro';

function injectSchema(id: string, schema: object) {
  let scriptTag = document.querySelector(`script[data-schema-id="${id}"]`);
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-schema-id', id);
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schema);
}

function removeSchema(id: string) {
  const scriptTag = document.querySelector(`script[data-schema-id="${id}"]`);
  if (scriptTag) scriptTag.remove();
}

export default function SchemaMarkup() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#organization`,
      name: 'SSM Detailing',
      alternateName: 'SSM Detailing Mărculești',
      description: 'Servicii profesionale de detailing auto în Mărculești, Ialomița. Oferim detailing interior și exterior, plafoane starlight, recondiționare faruri.',
      url: BASE_URL,
      telephone: '+40726521578',
      priceRange: '$$',
      image: `${BASE_URL}/og-image.svg`,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/og-image.svg`,
        width: 140,
        height: 140
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mărculești',
        addressRegion: 'Ialomița',
        addressCountry: 'RO'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 44.4413,
        longitude: 27.3513
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '14:00'
        }
      ],
      sameAs: [
        'https://www.instagram.com/ssm_detailing06/',
        'https://www.facebook.com/profile.php?id=61568245228709',
        'https://www.tiktok.com/@stefanmarian66'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '50'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicii Detailing Auto',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Detailing Interior',
              description: 'Curățare și recondiționare profesională a interiorului auto'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Detailing Exterior',
              description: 'Polish caroserie, tratamente ceramice, protecție vopsea'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Plafon Starlight',
              description: 'Instalare plafon înstelat personalizat cu fibră optică'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Recondiționare Faruri',
              description: 'Restaurare și polish faruri, eliminare opacitate'
            }
          }
        ]
      }
    };

    injectSchema('local-business', schema);

    return () => removeSchema('local-business');
  }, []);

  return null;
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    if (faqs.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    injectSchema('faq', schema);

    return () => removeSchema('faq');
  }, [faqs]);

  return null;
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    if (items.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };

    injectSchema('breadcrumb', schema);

    return () => removeSchema('breadcrumb');
  }, [items]);

  return null;
}

interface VideoSchemaProps {
  videos: Array<{
    title: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
  }>;
}

export function VideoSchema({ videos }: VideoSchemaProps) {
  useEffect(() => {
    if (videos.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: videos.map((video, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: video.title,
          description: video.description || video.title,
          thumbnailUrl: video.thumbnailUrl,
          contentUrl: video.contentUrl,
          uploadDate: new Date().toISOString().split('T')[0]
        }
      }))
    };

    injectSchema('videos', schema);

    return () => removeSchema('videos');
  }, [videos]);

  return null;
}
