import { useNavigate } from 'react-router-dom';
import TikTokReels from '../components/TikTokReels';
import SEOHelmet from '../components/SEOHelmet';
import { BreadcrumbSchema } from '../components/SchemaMarkup';

export default function ReelsPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEOHelmet
        title="Video Reels Detailing Auto | Transformări Before & After - SSM Detailing"
        description="Videoclipuri spectaculoase cu transformări de detailing auto. Vezi rezultatele live: polish caroserie, detailing interior, plafon starlight, ceramic coating. Subscribe pentru conținut nou!"
        keywords="reels detailing auto, video detailing, transformari auto, before after video, detailing tiktok, car detailing videos, ssm detailing videos"
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
