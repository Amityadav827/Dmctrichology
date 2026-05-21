import ScienceHero from '../../components/ScienceHero';
import ScienceIntro from '../../components/ScienceIntro';
import ScienceDualFeatures from '../../components/ScienceDualFeatures';
import ScienceConsultation from '../../components/ScienceConsultation';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Science at DMC Trichology',
  description: 'Discover the advanced hair restoration science behind DMC Trichology.',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

async function fetchScienceData() {
  try {
    const res = await fetch(`${API_BASE}/science-dmc?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function ScienceAtDmcPage() {
  const data = await fetchScienceData();

  const hero = data?.hero || {};
  const introSection = data?.introSection || {};
  const dualFeatureSection = data?.dualFeatureSection || {};
  const consultationSection = data?.consultationSection || {};

  return (
    <div className="bg-white min-h-screen">
      {hero.isEnabled !== false && <ScienceHero data={hero} />}
      {introSection.isEnabled !== false && <ScienceIntro data={introSection} />}
      {dualFeatureSection.isEnabled !== false && <ScienceDualFeatures data={dualFeatureSection} />}
      {consultationSection.isEnabled !== false && <ScienceConsultation data={consultationSection} />}
    </div>
  );
}
