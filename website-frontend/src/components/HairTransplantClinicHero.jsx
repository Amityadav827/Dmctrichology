"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicHero({ data = {} }) {
  const {
    backgroundImage = '',
    mainHeading = 'About Clinic',
    breadcrumbText = 'Hair Transplant Clinic in Delhi',
    backgroundColor = '#3b5998',
    overlayOpacity = 0.55,
    bannerHeight = '420px',
  } = data;

  const bgStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    minHeight: bannerHeight,
  } : {
    minHeight: bannerHeight,
  };

  return (
    <>
      <EditableSection sectionId="hair-clinic-hero" label="Hair Transplant Clinic Hero Banner">
        <section
          className="hair-clinic-hero-banner"
          style={bgStyle}
        >
          {/* Gradient overlay */}
          <div
            className="hair-clinic-hero-overlay"
            style={{
              opacity: overlayOpacity,
              background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${backgroundColor}CC 50%, rgba(0,0,0,0.3) 100%)`
            }}
          />

          {/* Floating shapes / blurred circle particles */}
          <div className="hair-clinic-hero-particles" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`hair-clinic-particle hair-clinic-particle-${i + 1}`} />
            ))}
          </div>

          {/* Centered Editorial Content */}
          <div className="hair-clinic-hero-content max-w-[1400px] mx-auto w-full">
            <h1 className="hair-clinic-hero-title">
              <EditableText sectionId="hair-clinic-hero" fieldPath="hero.mainHeading">
                {String(mainHeading || '')}
              </EditableText>
            </h1>

            {/* Premium Breadcrumbs inside Banner */}
            <div className="hair-clinic-hero-breadcrumb">
              <a href="/" className="hair-clinic-bc-home">Home</a>
              <span className="hair-clinic-bc-sep" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="hair-clinic-bc-current">
                <EditableText sectionId="hair-clinic-hero" fieldPath="hero.breadcrumbText">
                  {String(breadcrumbText || '')}
                </EditableText>
              </span>
            </div>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .hair-clinic-hero-banner {
          background-color: ${backgroundColor};
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
          animation: hairClinicHeroBannerIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
          width: 100%;
          box-sizing: border-box;
          z-index: 10;
        }

        @keyframes hairClinicHeroBannerIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .hair-clinic-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        /* Animated Floating Circle Shapes */
        .hair-clinic-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .hair-clinic-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          animation: hairClinicParticleFloat linear infinite;
        }

        .hair-clinic-particle-1 { width: 80px; height: 80px; top: 10%; left: 8%;  animation-duration: 14s; animation-delay: 0s; }
        .hair-clinic-particle-2 { width: 50px; height: 50px; top: 60%; left: 12%; animation-duration: 18s; animation-delay: 2s; }
        .hair-clinic-particle-3 { width: 120px; height: 120px; top: 5%;  right: 10%; animation-duration: 22s; animation-delay: 1s; }
        .hair-clinic-particle-4 { width: 40px; height: 40px; top: 75%; right: 15%; animation-duration: 16s; animation-delay: 3s; }
        .hair-clinic-particle-5 { width: 70px; height: 70px; top: 30%; left: 50%; animation-duration: 20s; animation-delay: 0.5s; }
        .hair-clinic-particle-6 { width: 30px; height: 30px; top: 85%; left: 40%; animation-duration: 12s; animation-delay: 4s; }
        .hair-clinic-particle-7 { width: 90px; height: 90px; top: 20%; right: 35%; animation-duration: 25s; animation-delay: 1.5s; }
        .hair-clinic-particle-8 { width: 55px; height: 55px; top: 50%; right: 5%;  animation-duration: 17s; animation-delay: 2.5s; }

        @keyframes hairClinicParticleFloat {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          33%  { transform: translateY(-30px) rotate(120deg); opacity: 0.3; }
          66%  { transform: translateY(20px) rotate(240deg); opacity: 0.5; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.6; }
        }

        /* Content sits above overlay + particles */
        .hair-clinic-hero-content {
          position: relative;
          z-index: 3;
          animation: hairClinicContentFadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        @keyframes hairClinicContentFadeIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Centered Luxury Typography Scale cloned from PressMediaHero */
        .hair-clinic-hero-title {
          font-family: 'Marcellus', serif !important;
          font-size: 60px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          margin: 0 0 20px !important;
          letter-spacing: 1px !important;
          line-height: 1.15 !important;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
          text-transform: none !important; /* mixed case matches press media title */
        }

        /* Elegant Breadcrumbs layout cloned from PressMediaHero */
        .hair-clinic-hero-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Marcellus', serif !important;
          font-size: 14px !important;
          color: rgba(255,255,255,0.7) !important;
        }

        .hair-clinic-bc-home {
          color: rgba(255,255,255,0.7) !important;
          text-decoration: none !important;
          transition: color 0.2s ease;
        }

        .hair-clinic-bc-home:hover {
          color: #ffffff !important;
        }

        .hair-clinic-bc-sep {
          color: rgba(255,255,255,0.4) !important;
          display: flex !important;
          align-items: center !important;
        }

        .hair-clinic-bc-current {
          color: #ffffff !important;
          font-weight: 400 !important;
        }

        /* Responsive Breakpoints cloned from PressMediaHero */
        @media (max-width: 768px) {
          .hair-clinic-hero-banner {
            padding: 140px 5% 80px !important;
            min-height: 320px !important;
          }
          .hair-clinic-hero-title {
            font-size: 40px !important;
          }
          .hair-clinic-particle-3, .hair-clinic-particle-7 {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hair-clinic-hero-title {
            font-size: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
