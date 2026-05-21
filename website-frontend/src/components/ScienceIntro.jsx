"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const ScienceIntro = ({ data: initialData = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Real-time sync from Visual Builder (postMessage UPDATE_CONFIG)
  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('science-intro.introSection.')) {
          hasChanges = true;
          const field = key.replace('science-intro.introSection.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-intro') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('introSection.')) {
          const key = fieldPath.split('.')[1];
          setData(prev => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  return (
    <EditableSection sectionId="science-intro" label="Science Intro Section">
      <section className="sci-intro-section" style={{ backgroundImage: data?.backgroundImage ? `url(${data?.backgroundImage})` : 'none' }}>
        <div className="sci-intro-container">
          <div className="sci-intro-card">
            <h2 className="sci-intro-heading">
              <EditableText sectionId="science-intro" fieldPath="introSection.heading" tag="span">
                {String(data?.heading || 'The Science Behind Hair Restoration')}
              </EditableText>
            </h2>
            <div className="sci-intro-divider"></div>
            <EditableText sectionId="science-intro" fieldPath="introSection.description" tag="p" className="sci-intro-desc">
              {String(data?.description || 'At DMC Trichology, we blend cutting-edge medical science with artistic precision to deliver natural-looking hair restoration. Our protocols are rooted in evidence-based medicine.')}
            </EditableText>
          </div>
        </div>
      </section>

      <style>{`
        .sci-intro-section {
          padding: 100px 5%;
          background-color: #f8fafc;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .sci-intro-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sci-intro-card {
          background: #ffffff;
          padding: 60px 80px;
          border-radius: 30px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(13, 13, 26, 0.05);
          border: 1px solid rgba(59, 89, 152, 0.05);
        }

        .sci-intro-heading {
          font-family: 'Marcellus', serif !important;
          font-size: 38px !important;
          color: #1a2740 !important;
          margin: 0 0 24px !important;
          line-height: 1.2 !important;
        }

        .sci-intro-divider {
          width: 60px;
          height: 3px;
          background: #3b5998;
          margin: 0 auto 30px;
          border-radius: 3px;
        }

        .sci-intro-desc {
          font-family: 'Lato', sans-serif;
          font-size: 18px;
          line-height: 1.8;
          color: #475569;
          margin: 0;
        }

        @media (max-width: 768px) {
          .sci-intro-card { padding: 40px 30px; }
          .sci-intro-heading { font-size: 28px !important; }
          .sci-intro-desc { font-size: 16px; }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceIntro;
