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
        className="blog-hero-section"
        style={{ 
          backgroundColor: '#F4F5FB',
          padding: '80px 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <h1 
            style={{ 
              fontSize: '64px', 
              fontFamily: "'Marcellus', serif", 
              color: '#111111',
              marginBottom: '16px',
              fontWeight: '400'
            }}
          >
            <EditableText sectionId="blog-hero" fieldPath="hero.title">
              {title}
            </EditableText>
          </h1>

          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '16px',
              fontFamily: "'Lato', sans-serif",
              color: '#666666'
            }}
          >
            <span style={{ cursor: 'pointer' }}>Home</span>
            <span style={{ color: '#CCCCCC' }}>/</span>
            <span style={{ color: '#111111', fontWeight: '600' }}>
               <EditableText sectionId="blog-hero" fieldPath="hero.breadcrumbText">
                  {breadcrumbText}
               </EditableText>
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-hero-section {
          min-height: 300px;
        }
        @media (max-width: 768px) {
          .blog-hero-section h1 {
            font-size: 40px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default BlogHero;
