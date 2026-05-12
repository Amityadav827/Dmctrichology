"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const BlogHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder
  React.useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'blog-hero') {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const {
    title = "Blog",
    breadcrumbText = "Blog",
    bannerImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    overlayOpacity = 0.5,
    bannerHeight = "400px"
  } = data || {};

  return (
    <EditableSection sectionId="blog-hero" label="Blog Hero Banner">
      <section 
        className="service-hero-premium" 
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          minHeight: bannerHeight,
        }}
      >
        {/* Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
            zIndex: 1
          }}
        />

        <div className="max-w-[1400px] mx-auto w-full relative" style={{ zIndex: 2 }}>
          {/* Heading on Top */}
          <h1 className="service-hero-title" style={{ color: '#ffffff' }}>
            <EditableText sectionId="blog-hero" fieldPath="hero.title">
              {title}
            </EditableText>
          </h1>

          {/* Breadcrumb Below */}
          <div className="service-hero-breadcrumb" style={{ color: 'rgba(255,255,255,0.8)' }}>
            <span className="current" style={{ color: '#ffffff' }}>Home</span>
            <span className="sep" style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span className="current" style={{ color: '#ffffff' }}>
               <EditableText sectionId="blog-hero" fieldPath="hero.breadcrumbText">
                  {breadcrumbText}
               </EditableText>
            </span>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default BlogHero;
