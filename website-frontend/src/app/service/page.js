import ServiceHero from '../../components/ServiceHero';
import ServiceListing from '../../components/ServiceListing';
import { fetchServicePageSettings, fetchServiceListingCards, fetchServiceListingCategories } from '../../services/serviceApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicePage() {
  const [settingsRes, servicesRes, categoriesRes] = await Promise.all([
    fetchServicePageSettings(),
    fetchServiceListingCards(),
    fetchServiceListingCategories()
  ]);

  const settings = settingsRes?.data?.hero || {};
  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <div className="bg-white">
      <ServiceHero data={settings} />
      <ServiceListing services={services} categories={categories} />
    </div>
  );
}
