"use client";
import EditableText from './Editable/EditableText';
import Link from 'next/link';

const ServiceHero = ({ data }) => {
  const heroData = data || {};
  const pageTitle = heroData.pageTitle || 'Service';
  const breadcrumbCurrent = heroData.breadcrumbText || 'Service'; 
  const bannerImage = heroData.bannerImage;

  return (
    <section 
      data-section-id="service-hero"
      className="service-hero-premium"
      style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Heading on Top */}
        <h1 className="service-hero-title">
          <EditableText sectionId="service-hero" fieldPath="hero.pageTitle" value={pageTitle} />
        </h1>

        {/* Breadcrumb Below */}
        <div className="service-hero-breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">
             <EditableText sectionId="service-hero" fieldPath="hero.breadcrumbText" value={breadcrumbCurrent} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
