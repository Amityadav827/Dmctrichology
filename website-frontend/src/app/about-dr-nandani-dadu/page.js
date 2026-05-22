import AboutDrNandaniClient from './AboutDrNandaniClient';

// Premium high-fidelity static fallback dataset for build stability
const staticFallback = {
  hero: {
    backgroundImage: "",
    doctorImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    mainHeading: "BEST HAIR TRANSPLANT SURGEON IN DELHI",
    doctorName: "Dr. Nandani Dadu",
    degreeText: "MD (Dermatology)",
    descriptionParagraph: "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi.",
    namePlaceholder: "Name*",
    phonePlaceholder: "Mobile Number*",
    emailPlaceholder: "E-Mail Address*",
    datePlaceholder: "Select Preferred Date*",
    messagePlaceholder: "Enter Your Message Here",
    captchaPlaceholder: "Code*",
    submitButtonText: "Schedule Your Visit",
    backgroundColor: "#3b5998",
    overlayOpacity: 0.4
  },
  
  intro: {
    heading: "Delhi's Premier Hair Specialist & Clinical Director",
    description: "<p>Dr. Nandani Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each patient's physiological profile.</p>",
    bulletList: [
      "Clinical expertise with 15+ years of specialized hair treatment experience.",
      "Customized high-density hairline designs backed by medical science.",
      "State-of-the-art clinical theater with advanced sterile protocols.",
      "Comprehensive pre-and-post care guidance for long-term retention."
    ],
    ctaText: "Discover Signature Treatments"
  },

  formSettings: {
    title: "Request Private Consultation",
    subtitle: "Reserve your bespoke scalp assessment and consultation session.",
    successMessage: "Your consultation request has been successfully submitted to Dr. Nandani Dadu's private desk. Our concierge team will reach out to you shortly."
  },

  seo: {
    metaTitle: "Dr. Nandani Dadu | Best Hair Restoration Specialist & Trichologist",
    metaDescription: "Consult Delhi's premier hair restoration specialist, Dr. Nandani Dadu. Experience luxury clinical consultations, high-density transplants, and customized scalp treatments.",
    ogImage: ""
  },
  breadcrumb: {
    title: "Hair Specialist in Delhi",
    parentLabel: "Home",
    parentUrl: "/",
    currentPageText: "Hair Specialist in Delhi",
    backgroundColor: "#f8f9fa"
  }
};

async function getPageData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api';
    const response = await fetch(`${API_URL}/about-dr-nandani?t=${Date.now()}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return staticFallback;
    const result = await response.json();
    return result.success ? result.data : staticFallback;
  } catch (error) {
    console.error('SSR Fetch Error (Dr. Nandani page):', error);
    return staticFallback;
  }
}

// Generate dynamic SEO Metadata
export async function generateMetadata() {
  const data = await getPageData();
  const seo = data?.seo || staticFallback.seo;

  return {
    title: seo.metaTitle || staticFallback.seo.metaTitle,
    description: seo.metaDescription || staticFallback.seo.metaDescription,
    openGraph: {
      title: seo.metaTitle || staticFallback.seo.metaTitle,
      description: seo.metaDescription || staticFallback.seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : []
    }
  };
}

export default async function DrNandaniPage() {
  const data = await getPageData();
  return <AboutDrNandaniClient initialData={data} />;
}
