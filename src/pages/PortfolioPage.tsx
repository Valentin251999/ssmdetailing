import Portfolio from '../components/Portfolio';
import SEOHelmet from '../components/SEOHelmet';
import { BreadcrumbSchema } from '../components/SchemaMarkup';

export default function PortfolioPage() {
  return (
    <>
      <SEOHelmet
        title="Portofoliu Detailing Auto | Lucrări Înainte și După - SSM Detailing"
        description="Galerie completă cu lucrări de detailing auto realizate de SSM Detailing. Transformări spectaculoase: detailing exterior, interior, plafon înstelat, recondiționare faruri. Vezi rezultatele!"
        keywords="portofoliu detailing auto, inainte dupa detailing, lucrari detailing, transformare auto, polish rezultate, detailing profesional"
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
