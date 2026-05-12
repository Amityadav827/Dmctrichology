import BlogHero from '../../components/BlogHero';
import BlogListing from '../../components/BlogListing';
import { fetchBlogPage } from '../../services/api';
import '../service.css';



export const metadata = {
  title: 'Blog | DMC Trichology',
  description: 'Stay updated with the latest hair transplant and skin care news, tips, and wellness advice from our experts.',
};

async function getPageData() {
  const res = await fetchBlogPage();
  return res?.data || {};
}

export default async function BlogPage() {
  const pageData = await getPageData();

  return (
    <div className="bg-white min-h-screen">
      <BlogHero data={pageData.hero} />
      <BlogListing data={pageData} />
    </div>
  );
}

