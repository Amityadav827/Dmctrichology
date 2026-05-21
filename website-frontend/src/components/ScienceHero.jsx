"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const ScienceHero = ({ data: initialData = {} }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-hero') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('hero.')) {
          const key = fieldPath.split('.')[1];
          setData(prev => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  return (
    <EditableSection sectionId="science-hero" label="Science Hero Banner">
      <section
        className="sci-hero-banner"
        style={{
          minHeight: '420px',
          backgroundColor: data?.backgroundColor || '#3b5998',
        }}
      >
        {/* Gradient overlay */}
        <div
          className="sci-hero-overlay"
          style={{ opacity: data?.overlayOpacity ?? 0.55 }}
        />

        {/* Floating particles for premium design system consistency */}
        <div className="sci-hero-particles" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`sci-particle sci-particle-${i + 1}`} />
          ))}
        </div>

        {/* Content */}
        <div className="sci-hero-content max-w-[1400px] mx-auto w-full">
          <div className="sci-hero-badge">
            {data?.subtitle || 'ADVANCED HAIR RESTORATION SCIENCE'}
          </div>

          <h1 className="sci-hero-title">
            {data?.title || 'Science at DMC Trichology'}
          </h1>

          <div className="sci-hero-breadcrumb">
            <a href="/" className="sci-bc-home">Home</a>
            <span className="sci-bc-sep" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="sci-bc-current">
              {data?.breadcrumbText || 'Science at DMC Trichology'}
            </span>
          </div>
        </div>
      </section>

      <style>{`
        .sci-hero-banner {
          background-color: ${data?.backgroundColor || '#3b5998'};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 170px 5% 100px;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: sciHeroBannerIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sciHeroBannerIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .sci-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0,0,0,0.6) 0%,
            ${data?.backgroundColor || '#3b5998'}CC 50%,
            rgba(0,0,0,0.3) 100%
          );
          z-index: 1;
        }

        /* Animated floating particles */
        .sci-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .sci-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          animation: sciFloat linear infinite;
        }

        .sci-particle-1 { width: 80px; height: 80px; top: 10%; left: 8%;  animation-duration: 14s; animation-delay: 0s; }
        .sci-particle-2 { width: 50px; height: 50px; top: 60%; left: 12%; animation-duration: 18s; animation-delay: 2s; }
        .sci-particle-3 { width: 120px; height: 120px; top: 5%;  right: 10%; animation-duration: 22s; animation-delay: 1s; }
        .sci-particle-4 { width: 40px; height: 40px; top: 75%; right: 15%; animation-duration: 16s; animation-delay: 3s; }
        .sci-particle-5 { width: 70px; height: 70px; top: 30%; left: 50%; animation-duration: 20s; animation-delay: 0.5s; }
        .sci-particle-6 { width: 30px; height: 30px; top: 85%; left: 40%; animation-duration: 12s; animation-delay: 4s; }
        .sci-particle-7 { width: 90px; height: 90px; top: 20%; right: 35%; animation-duration: 25s; animation-delay: 1.5s; }
        .sci-particle-8 { width: 55px; height: 55px; top: 50%; right: 5%;  animation-duration: 17s; animation-delay: 2.5s; }

        @keyframes sciFloat {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 0.6; }
          33%  { transform: translateY(-30px) rotate(120deg); opacity: 0.3; }
          66%  { transform: translateY(20px)  rotate(240deg); opacity: 0.5; }
          100% { transform: translateY(0)    rotate(360deg); opacity: 0.6; }
        }

        /* Content sits above overlay + particles */
        .sci-hero-content {
          position: relative;
          z-index: 3;
          animation: sciContentFadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        @keyframes sciContentFadeIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Premium badge */
        .sci-hero-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 100px;
          padding: 6px 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.08);
        }

        .sci-hero-title {
          font-family: 'Marcellus', serif !important;
          font-size: 60px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          margin: 0 0 20px !important;
          letter-spacing: 1px !important;
          line-height: 1.15 !important;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .sci-hero-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Marcellus', serif;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .sci-bc-home {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sci-bc-home:hover { color: #ffffff; }

        .sci-bc-sep {
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
        }

        .sci-bc-current { color: #ffffff; font-weight: 400; }

        @media (max-width: 768px) {
          .sci-hero-banner { padding: 140px 5% 80px; min-height: 320px !important; }
          .sci-hero-title { font-size: 40px !important; }
          .sci-particle-3, .sci-particle-7 { display: none; }
        }

        @media (max-width: 480px) {
          .sci-hero-title { font-size: 32px !important; }
          .sci-hero-badge { font-size: 10px; }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceHero;
