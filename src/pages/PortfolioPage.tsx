import Portfolio from '../components/Portfolio';
import SEOHelmet from '../components/SEOHelmet';
import { BreadcrumbSchema } from '../components/SchemaMarkup';

export default function PortfolioPage() {
  return (
    <>
      <SEOHelmet
        title="Portofoliu SSM Detailing | Transformări Spectaculoase Înainte și După"
        description="Galerie cu transformări reale de detailing auto din Mărculești: plafoane starlight, curățare interioară, recondiționare faruri. Lucrări realizate de SSM Detailing - vezi diferența!"
        keywords="portofoliu detailing auto Marculesti, inainte dupa detailing, lucrari plafon starlight, transformare auto, reconditionare faruri rezultate"
        canonical="https://ssmdetailing.ro/portofoliu"
      />
      <BreadcrumbSchema items={[
        { name: 'Acasă', url: 'https://ssmdetailing.ro/' },
        { name: 'Portofoliu', url: 'https://ssmdetailing.ro/portofoliu' }
      ]} />
      <Portfolio />
    </>
  );
}
