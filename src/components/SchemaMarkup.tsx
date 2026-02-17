import { useEffect } from 'react';

export default function SchemaMarkup() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://danalprodus.com/#organization',
      name: 'SSM Detailing',
      alternateName: 'SSM Detailing Galați',
      description: 'Servicii profesionale de detailing auto în Galați cu experiență de peste 8 ani. Oferim polish caroserie, tratamente ceramice, curățare detaliată interior și exterior.',
      url: 'https://danalprodus.com',
      telephone: '+40726521578',
      priceRange: '$$',
      image: 'https://danalprodus.com/og-image.svg',
      logo: {
        '@type': 'ImageObject',
        url: 'https://danalprodus.com/og-image.svg',
        width: 140,
        height: 140
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Galați',
        addressRegion: 'Galați',
        addressCountry: 'RO'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 45.4353,
        longitude: 28.0080
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
          opens: '10:00',
          closes: '16:00'
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
              name: 'Polish Caroserie',
              description: 'Restaurare finisaj vopsea, eliminare zgârieturi'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Tratament Ceramic',
              description: 'Protecție avansată cu durată lungă pentru caroserie'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Curățare Interior',
              description: 'Curățare detaliată a interiorului mașinii'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Detailing Complet',
              description: 'Serviciu complet interior și exterior'
            }
          }
        ]
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);
  }, []);

  return null;
}
