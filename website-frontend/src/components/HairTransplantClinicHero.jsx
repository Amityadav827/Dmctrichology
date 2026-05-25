"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicHero({ data = {} }) {
  const {
    backgroundImage = '',
    mainHeading = 'Hair Transplant Clinic In Delhi',
    eyebrowText = 'PREMIUM HAIR RESTORATION CLINIC',
    breadcrumbText = 'Hair Transplant Clinic In Delhi',
    descriptionParagraph = 'Premium hair restoration solutions with advanced technology, expert specialists, and world-class patient care.',
    backgroundColor = '#0b132b',
    gradientColor = '#3b5998',
    overlayOpacity = 0.6,
    showFloatingShapes = true,
    paddingTop = '170px',
    paddingBottom = '100px',
    bannerHeight = '420px',
    mobileTitleSize = '40px',
    mobileDescSize = '14px'
  } = data;

  const bgStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    minHeight: bannerHeight,
    paddingTop: paddingTop,
    paddingBottom: paddingBottom
  } : {
    minHeight: bannerHeight,
    paddingTop: paddingTop,
    paddingBottom: paddingBottom
  };

  return (
    <>
      <EditableSection sectionId="hair-clinic-hero" label="Hair Transplant Clinic Premium Banner">
        <section
          className="hair-clinic-hero-banner"
          style={bgStyle}
        >
          {/* Custom isolated style element for live dynamic gradients, overlay opacity, and shapes */}
          <div
            className="hair-clinic-hero-overlay"
            style={{
              opacity: overlayOpacity,
              background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, ${gradientColor}B3 50%, ${backgroundColor}E6 100%)`
            }}
          />

          {/* Floating shapes / blurred circle particles */}
          {showFloatingShapes !== false && (
            <div className="hair-clinic-hero-shapes" aria-hidden="true">
              <div className="hair-clinic-shape hair-clinic-shape-1" />
              <div className="hair-clinic-shape hair-clinic-shape-2" />
              <div className="hair-clinic-shape hair-clinic-shape-3" />
              <div className="hair-clinic-shape hair-clinic-shape-4" />
              <div className="hair-clinic-shape hair-clinic-shape-5" />
            </div>
          )}

          {/* Centered Editorial Content */}
          <div className="hair-clinic-hero-container">
            <div className="hair-clinic-hero-badge-box">
              <span className="hair-clinic-hero-badge">
                <EditableText sectionId="hair-clinic-hero" fieldPath="eyebrowText" tag="span">
                  {eyebrowText}
                </EditableText>
              </span>
            </div>

            <h1 className="hair-clinic-hero-main-title">
              <EditableText sectionId="hair-clinic-hero" fieldPath="mainHeading" tag="span">
                {mainHeading}
              </EditableText>
            </h1>

            <p className="hair-clinic-hero-desc">
              <EditableText sectionId="hair-clinic-hero" fieldPath="descriptionParagraph" tag="span">
                {descriptionParagraph}
              </EditableText>
            </p>

            {/* Premium Breadcrumbs inside Banner */}
            <nav className="hair-clinic-hero-breadcrumbs" aria-label="Breadcrumb">
              <a href="/" className="hair-clinic-bc-home">Home</a>
              <span className="hair-clinic-bc-sep" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="hair-clinic-bc-current">
                <EditableText sectionId="hair-clinic-hero" fieldPath="breadcrumbText" tag="span">
                  {breadcrumbText}
                </EditableText>
              </span>
            </nav>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .hair-clinic-hero-banner {
          background-color: ${backgroundColor};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          z-index: 10;
          animation: hairClinicHeroFadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes hairClinicHeroFadeIn {
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
        .hair-clinic-hero-shapes {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .hair-clinic-shape {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
          filter: blur(12px);
          animation: hairClinicShapeFloat linear infinite;
        }

        .hair-clinic-shape-1 { width: 140px; height: 140px; top: 12%; left: 6%; animation-duration: 16s; animation-delay: 0s; }
        .hair-clinic-shape-2 { width: 90px; height: 90px; top: 62%; left: 15%; animation-duration: 20s; animation-delay: 2s; }
        .hair-clinic-shape-3 { width: 180px; height: 180px; top: 8%; right: 8%; animation-duration: 24s; animation-delay: 1s; }
        .hair-clinic-shape-4 { width: 80px; height: 80px; top: 72%; right: 18%; animation-duration: 18s; animation-delay: 3s; }
        .hair-clinic-shape-5 { width: 110px; height: 110px; top: 35%; left: 48%; animation-duration: 22s; animation-delay: 0.5s; }

        @keyframes hairClinicShapeFloat {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.6; }
          33%  { transform: translateY(-25px) rotate(120deg) scale(1.05); opacity: 0.35; }
          66%  { transform: translateY(15px) rotate(240deg) scale(0.95); opacity: 0.5; }
          100% { transform: translateY(0) rotate(360deg) scale(1); opacity: 0.6; }
        }

        /* Centered Main Container */
        .hair-clinic-hero-container {
          position: relative;
          z-index: 3;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: hairClinicContentFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }

        @keyframes hairClinicContentFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Glassmorphism Badge styling */
        .hair-clinic-hero-badge-box {
          margin-bottom: 24px;
        }

        .hair-clinic-hero-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          letter-spacing: 3.5px !important;
          text-transform: uppercase !important;
          color: rgba(255,255,255,0.85) !important;
          border: 1px solid rgba(255,255,255,0.25) !important;
          border-radius: 100px !important;
          padding: 7px 22px !important;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Centered Luxury Typography */
        .hair-clinic-hero-main-title {
          font-family: 'Marcellus', serif !important;
          font-size: 56px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          margin: 0 auto 20px auto !important;
          letter-spacing: 1.5px !important;
          line-height: 1.2 !important;
          text-transform: uppercase !important;
          max-width: 820px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .hair-clinic-hero-desc {
          font-family: 'Lato', sans-serif !important;
          font-size: 16.5px !important;
          font-weight: 300 !important;
          line-height: 1.65 !important;
          color: rgba(255,255,255,0.85) !important;
          margin: 0 auto 36px auto !important;
          max-width: 680px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }

        /* Elegant Breadcrumbs layout */
        .hair-clinic-hero-breadcrumbs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Marcellus', serif !important;
          font-size: 13.5px;
          color: rgba(255,255,255,0.7);
        }

        .hair-clinic-bc-home {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .hair-clinic-bc-home:hover {
          color: #ffffff;
        }

        .hair-clinic-bc-sep {
          color: rgba(255,255,255,0.45);
          display: flex;
          align-items: center;
        }

        .hair-clinic-bc-current {
          color: #ffffff;
          font-weight: 400;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .hair-clinic-hero-banner {
            padding-top: 140px !important;
            padding-bottom: 80px !important;
            min-height: 320px !important;
          }
          .hair-clinic-hero-main-title {
            font-size: ${mobileTitleSize} !important;
            line-height: 1.25 !important;
          }
          .hair-clinic-hero-desc {
            font-size: ${mobileDescSize} !important;
            margin-bottom: 28px !important;
          }
          .hair-clinic-shape-3, .hair-clinic-shape-5 {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hair-clinic-hero-main-title {
            font-size: calc(${mobileTitleSize} * 0.8) !important;
          }
          .hair-clinic-hero-badge {
            font-size: 10px !important;
            padding: 5px 16px !important;
          }
        }
      `}</style>
    </>
  );
}
