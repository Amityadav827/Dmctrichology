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
  const { slug } = params;
  const service = servicesData.find(s => s.slug === slug);

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

export default function DynamicDetailsPage({ params }) {
  const { slug } = params;
  const service = servicesData.find(s => s.slug === slug);

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
