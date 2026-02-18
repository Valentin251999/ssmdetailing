import { useNavigate } from 'react-router-dom';
import TikTokReels from '../components/TikTokReels';
import SEOHelmet from '../components/SEOHelmet';
import { BreadcrumbSchema } from '../components/SchemaMarkup';

export default function ReelsPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEOHelmet
        title="Video Reels SSM Detailing | Transformări Auto Înainte și După"
        description="Vizionează transformările spectaculoase realizate de SSM Detailing: plafoane starlight, curățare interioară, restaurare faruri. Videoclipuri reale din atelierul nostru din Mărculești."
        keywords="video detailing auto, reels detailing Marculesti, transformari inainte dupa video, plafon starlight video, SSM Detailing TikTok"
        canonical="https://ssmdetailing.ro/reels"
      />
      <BreadcrumbSchema items={[
        { name: 'Acasă', url: 'https://ssmdetailing.ro/' },
        { name: 'Reels', url: 'https://ssmdetailing.ro/reels' }
      ]} />
      <TikTokReels onNavigateToHome={() => navigate('/')} />
    </>
  );
}
