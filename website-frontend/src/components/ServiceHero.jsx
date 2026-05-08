"use client";
import EditableText from './Editable/EditableText';

const ServiceHero = ({ data }) => {
  if (!data) return null;

  const { bannerImage, pageTitle, breadcrumbText, overlayOpacity, bannerHeight } = data;

  return (
    <section 
      data-section-id="service-hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: bannerHeight || '400px' }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bannerImage || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity || 0.5})` }}
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-4" style={{ fontFamily: 'Marcellus, serif' }}>
          <EditableText sectionId="service-hero" fieldPath="hero.pageTitle" value={pageTitle} />
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm uppercase tracking-widest font-sans">
          <EditableText sectionId="service-hero" fieldPath="hero.breadcrumbText" value={breadcrumbText} />
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
