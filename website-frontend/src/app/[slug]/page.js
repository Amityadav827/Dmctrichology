import ScienceHero from '@/components/ScienceHero';
import ScienceIntro from '@/components/ScienceIntro';
import ScienceDualFeatures from '@/components/ScienceDualFeatures';
import ScienceConsultation from '@/components/ScienceConsultation';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Advanced Hair Restoration Science | DMC Trichology',
  description: 'Explore the science behind DMC Trichology’s advanced hair restoration and skin care solutions. Rooted in research, powered by innovation.',
};

// Disable static generation because this is now a dynamic catch-all route for CMS pages
export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

export default async function DynamicSlugPage({ params }) {
  const { slug } = await params;

  let pageData = null;
  
  try {
    // 1. Fetch dynamic page from CMS generic Pages
    const res = await fetch(`${API_BASE}/pages/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const json = await res.json();
      pageData = json.data;
    } else if (res.status === 404 && slug === 'science-at-dmc-trichology') {
      // Fallback for hardcoded URL if not created in CMS
      pageData = { title: 'Science at DMC Trichology' };
    } else {
      notFound();
    }
    
    // 2. Check if the CMS page is our custom premium Science page
    // We check by title or if the slug is the old fallback
    if (pageData && (pageData.title === 'Science at DMC Trichology' || slug === 'science-at-dmc-trichology')) {
      // Fetch Science specific modular content
      let scienceSections = {
        hero: null,
        intro: null,
        features: null,
        consultation: null
      };

      try {
        const scienceRes = await fetch(`${API_BASE}/science-dmc`, {
          cache: 'no-store'
        });
        const scienceJson = await scienceRes.json();
        if (scienceJson.success) {
          const config = scienceJson.data?.config || {};
          scienceSections = {
            hero: config.hero || null,
            intro: config.intro || null,
            features: config.features || null,
            consultation: config.consultation || null
          };
        }
      } catch (err) {
        console.error('Error fetching science specific content:', err);
      }

      return (
        <main className="science-dmc-page">
          <ScienceHero data={scienceSections.hero} />
          <ScienceIntro data={scienceSections.intro} />
          <ScienceDualFeatures data={scienceSections.features} />
          <ScienceConsultation data={scienceSections.consultation} />
        </main>
      );
    }
    
    // 3. Render a generic CMS page if it's not the science page
    return (
      <main className="generic-cms-page pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-black text-slate-900 mb-8 font-marcellus">{pageData.title}</h1>
          {pageData.content && (
            <div 
              className="prose prose-lg max-w-none text-slate-600 prose-headings:font-marcellus prose-headings:text-slate-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
        </div>
      </main>
    );
    
  } catch (error) {
    console.error('Error fetching dynamic page:', error);
    notFound();
  }
}
