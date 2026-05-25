import ScienceHero from '@/components/ScienceHero';
import ScienceIntro from '@/components/ScienceIntro';
import ScienceDualFeatures from '@/components/ScienceDualFeatures';
import ScienceConsultation from '@/components/ScienceConsultation';
import HairTransplantClinicClient from '../hair-transplant-clinic-in-delhi/HairTransplantClinicClient';
import { notFound } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';

// Disable static generation because this is now a dynamic catch-all route for CMS pages
export const dynamic = 'force-dynamic';

// Generate dynamic SEO Metadata dynamically based on slug
export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (slug === 'hair-transplant-clinic-in-delhi') {
    try {
      const res = await fetch(`${API_BASE}/hair-transplant-clinic-in-delhi`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        const seo = json.data?.seo || {};
        return {
          title: seo.metaTitle || 'Best Hair Transplant Clinic in Delhi | DMC Trichology',
          description: seo.metaDescription || 'DMC Trichology is Delhi’s premium flagship clinic for high-density, advanced FUE and DHI hair transplants.',
          alternates: {
            canonical: `/hair-transplant-clinic-in-delhi`
          },
          openGraph: {
            images: seo.ogImage ? [{ url: seo.ogImage }] : []
          }
        };
      }
    } catch (e) {
      console.error('Error generating metadata for Hair Transplant page:', e);
    }
    return {
      title: 'Best Hair Transplant Clinic in Delhi | DMC Trichology',
      description: 'DMC Trichology is Delhi’s premium flagship clinic for high-density, advanced FUE and DHI hair transplants.'
    };
  }

  if (slug === 'science-at-dmc' || slug === 'science-at-dmc-trichology') {
    return {
      title: 'Advanced Hair Restoration Science | DMC Trichology',
      description: 'Explore the science behind DMC Trichology’s advanced hair restoration and skin care solutions. Rooted in research, powered by innovation.',
    };
  }

  // Fallback for other generic CMS pages
  try {
    const res = await fetch(`${API_BASE}/pages/slug/${slug}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      return {
        title: json.data?.meta_title || `${json.data?.title} | DMC Trichology`,
        description: json.data?.meta_description || 'Explore premium hair and skin restoration services.',
      };
    }
  } catch (e) {
    console.error('Error fetching generic page metadata:', e);
  }

  return {
    title: 'DMC Trichology',
    description: 'Explore our premium clinical trichological treatments.'
  };
}

export default async function DynamicSlugPage({ params }) {
  const { slug } = await params;

  // 1. Intercept Hair Transplant Clinic Landing Page
  if (slug === 'hair-transplant-clinic-in-delhi') {
    let clinicData = null;
    try {
      const res = await fetch(`${API_BASE}/hair-transplant-clinic-in-delhi`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        clinicData = json.data;
      }
    } catch (err) {
      console.error('Error fetching Hair Transplant Clinic data:', err);
    }
    return <HairTransplantClinicClient initialData={clinicData} />;
  }

  let pageData = null;
  
  try {
    // 2. Fetch dynamic page from CMS generic Pages
    const res = await fetch(`${API_BASE}/pages/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const json = await res.json();
      pageData = json.data;
    } else if (res.status === 404 && (slug === 'science-at-dmc' || slug === 'science-at-dmc-trichology')) {
      // Fallback for hardcoded URL if not created in CMS
      pageData = { title: 'Science at DMC Trichology', slug };
    } else {
      notFound();
    }
    
    // 3. Check if the CMS page is our custom premium Science page
    const isSciencePage = 
      slug === 'science-at-dmc' || 
      slug === 'science-at-dmc-trichology' || 
      (pageData && (pageData.title === 'Science at DMC Trichology' || pageData.title === 'Science at DMC'));

    if (isSciencePage) {
      // Fetch Science specific modular content
      let scienceSections = {
        hero: {},
        intro: {},
        features: {},
        consultation: {}
      };

      try {
        const scienceRes = await fetch(`${API_BASE}/science-dmc`, {
          cache: 'no-store'
        });
        
        if (scienceRes.ok) {
          const scienceJson = await scienceRes.json();
          if (scienceJson.success && scienceJson.data) {
            const rawData = scienceJson.data;
            const config = rawData.config || rawData || {};
            scienceSections = {
              hero: config.hero || {},
              intro: config.introSection || config.intro || {},
              features: config.dualFeatureSection || config.features || {},
              consultation: config.consultationSection || config.consultation || {}
            };
          }
        }
      } catch (err) {
        console.error('Error fetching science specific content:', err);
      }

      // Add complete null safety and fallback structures
      const heroData = scienceSections.hero || {};
      const introData = scienceSections.intro || {};
      const featuresData = scienceSections.features || {};
      const consultationData = scienceSections.consultation || {};

      return (
        <main className="science-dmc-page">
          <ScienceHero data={heroData} />
          <ScienceIntro data={introData} />
          <ScienceDualFeatures data={featuresData} />
          <ScienceConsultation data={consultationData} />
        </main>
      );
    }
    
    // 4. Render a generic CMS page if it's not the science page
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

