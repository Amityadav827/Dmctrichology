import { notFound } from 'next/navigation';
import { servicesData } from '../../../data/servicesData';
import DetailsBanner from '../../../components/DetailsBanner';
import ServiceIntro from '../../../components/ServiceIntro';
import ProcessSlider from '../../../components/ProcessSlider';
import BeforeAfterTreatment from '../../../components/BeforeAfterTreatment';
import FaqEnquiry from '../../../components/FaqEnquiry';
import IdealFrequency from '../../../components/IdealFrequency';
import '../../service.css';
import '../../details.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const rawSlug = slug || '';
  const normalizedSlug = String(rawSlug).toLowerCase().trim();
  
  const service = servicesData.find(s => s.slug.toLowerCase() === normalizedSlug);

  if (!service) {
    return {
      title: 'Service Not Found | DMC Trichology',
    };
  }

  return {
    title: `${service.banner.title} | DMC Trichology`,
    description: service.banner.subtitle,
  };
}

export default async function DynamicDetailsPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const rawSlug = slug || '';
  // Normalize slug to handle case differences, trailing spaces, or extra query-like parts (though Next.js handles queries)
  const normalizedSlug = String(rawSlug).toLowerCase().trim();
  
  const service = servicesData.find(s => s.slug.toLowerCase() === normalizedSlug);

  // --- Temporary Debug Logs ---
  console.log('--- DYNAMIC ROUTING DEBUG ---');
  console.log('params.slug:', slug);
  console.log('Normalized Slug:', normalizedSlug);
  console.log('Matched Result:', service ? service.slug : 'Not Found');
  console.log('-----------------------------');

  if (!service) {
    notFound();
  }

  const { banner, intro, process, beforeAfter, faqEnquiry, idealFrequency } = service;

  return (
    <div className="bg-white min-h-screen">
      <DetailsBanner data={banner} />
      <ServiceIntro data={intro} />
      <ProcessSlider data={process} />
      <IdealFrequency data={idealFrequency} />
      <BeforeAfterTreatment data={beforeAfter} />
      <FaqEnquiry data={faqEnquiry} />
    </div>
  );
}
