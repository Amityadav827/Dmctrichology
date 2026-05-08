import ServiceHero from '../../components/ServiceHero';
import ServiceListing from '../../components/ServiceListing';
import { fetchServicePageSettings, fetchServiceListingCards, fetchServiceListingCategories } from '../../services/serviceApi';
import '../service.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicePage() {
  const [settingsRes, servicesRes, categoriesRes] = await Promise.all([
    fetchServicePageSettings().catch(() => ({ data: { hero: {} } })),
    fetchServiceListingCards().catch(() => ({ data: [] })),
    fetchServiceListingCategories().catch(() => ({ data: [] }))
  ]);

  let settings = settingsRes?.data?.hero || settingsRes?.hero || {};
  if (Object.keys(settings).length === 0 && settingsRes?.data) {
     // Fallback if data is the hero object itself
     if (settingsRes.data.pageTitle) settings = settingsRes.data;
  }
  const services = Array.isArray(servicesRes?.data) ? servicesRes.data : (Array.isArray(servicesRes) ? servicesRes : []);
  const categories = Array.isArray(categoriesRes?.data) ? categoriesRes.data : (Array.isArray(categoriesRes) ? categoriesRes : []);

  return (
    <div className="bg-white min-h-screen">
      <ServiceHero data={settings} />
      <ServiceListing services={services} categories={categories} />
    </div>
  );
}
