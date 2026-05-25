"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicIntro({ data = {} }) {
  const {
    heading = "BEST HAIR TRANSPLANT CLINIC IN DELHI",
    welcomeText = "<p>DMC Trichology is Delhi's premier flagship clinic for <strong>high-density, advanced hair restoration</strong>. Under the direct guidance of our board-certified clinical specialists, we offer customized FUE and DHI procedures tailored to your unique hairline biology.</p><p>We combine <strong>cutting-edge US-FDA approved technologies</strong> with refined artistic hairline mapping. Our surgeons meticulously calculate exact follicular spacing and density vectors, ensuring natural blending and a <strong>98%+ graft survival rate</strong> for permanent, life-changing results.</p>",
    directorQuote = "Our mission is simple: to combine surgical precision with visual artistry to restore not just your hair, but your self-assurance.",
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    backgroundColor = "#ffffff",
    textColor = "#374151",
    paddingTop = "100px",
    paddingBottom = "100px",
    isVisible = true,
    headingSize = "36px",
    headingFontFamily = "Marcellus",
    bodySize = "15.5px",
    bodyFontFamily = "Marcellus",
    mobilePaddingTop = "60px",
    mobilePaddingBottom = "60px",
    mobileHeadingSize = "28px"
  } = data;

  if (isVisible === false) return null;

  const sectionStyle = {
    backgroundColor: backgroundColor,
    paddingTop: paddingTop,
    paddingBottom: paddingBottom,
  };

  const getFontFamilyCSS = (fontName) => {
    if (fontName === 'Marcellus') return "'Marcellus', serif";
    if (fontName === 'Montserrat') return "'Montserrat', sans-serif";
    if (fontName === 'Lato') return "'Lato', sans-serif";
    if (fontName === 'Inter') return "'Inter', sans-serif";
    return "'Marcellus', serif";
  };

  return (
    <>
      <EditableSection sectionId="hair-clinic-intro" label="Hair Transplant Clinic Editorial Welcome">
        <section className="hair-clinic-intro-section" style={sectionStyle}>
          <div className="hair-clinic-intro-container max-w-[1200px] mx-auto relative z-10">
            <div className="hair-clinic-intro-grid">
              
              {/* LEFT COLUMN: Editorial Storytelling Content */}
              <div className="hair-clinic-intro-content-box">
                <div className="hair-clinic-intro-badge-wrapper">
                  <span className="hair-clinic-intro-badge">CLINICAL EXCELLENCE</span>
                </div>
                
                <h2 className="hair-clinic-intro-title">
                  <EditableText sectionId="hair-clinic-intro" fieldPath="intro.heading" tag="span">
                    {heading}
                  </EditableText>
                </h2>

                <div className="hair-clinic-intro-divider" />

                <div className="hair-clinic-intro-body" style={{ color: textColor }}>
                  <EditableText sectionId="hair-clinic-intro" fieldPath="intro.welcomeText" tag="div" html>
                    {welcomeText}
                  </EditableText>
                </div>

                {directorQuote && (
                  <div className="hair-clinic-intro-quote-wrapper">
                    <blockquote className="hair-clinic-intro-quote">
                      <p>
                        <EditableText sectionId="hair-clinic-intro" fieldPath="intro.directorQuote" tag="span">
                          {directorQuote}
                        </EditableText>
                      </p>
                    </blockquote>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Luxury Editorial Image Frame */}
              <div className="hair-clinic-intro-visual-box">
                <div className="hair-clinic-intro-frame-outer">
                  <div className="hair-clinic-intro-frame-inner">
                    <img 
                      src={image} 
                      alt="DMC Clinical Directors" 
                      className="hair-clinic-intro-img"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .hair-clinic-intro-section {
          width: 100%;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          z-index: 5;
        }

        .hair-clinic-intro-container {
          padding: 0 24px;
          box-sizing: border-box;
        }

        .hair-clinic-intro-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 80px;
          align-items: center;
        }

        /* Editorial Left Column */
        .hair-clinic-intro-content-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          animation: hairClinicIntroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          z-index: 2;
        }

        @keyframes hairClinicIntroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hair-clinic-intro-badge-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .hair-clinic-intro-badge {
          font-family: 'Marcellus', serif !important;
          font-size: 11px !important;
          font-weight: 400 !important;
          letter-spacing: 0.25em !important;
          text-transform: uppercase !important;
          color: #bf9b30 !important; /* Muted Gold */
          display: inline-block;
        }

        .hair-clinic-intro-title {
          font-family: ${getFontFamilyCSS(headingFontFamily)} !important;
          font-size: ${headingSize} !important;
          font-weight: 400 !important;
          line-height: 1.3 !important;
          color: #0b132b !important; /* Deep Navy */
          margin: 0 0 20px 0 !important;
          letter-spacing: 0.02em !important;
        }

        .hair-clinic-intro-divider {
          width: 48px;
          height: 1px;
          background-color: #bf9b30;
          margin-bottom: 32px;
        }

        .hair-clinic-intro-body {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: ${bodySize} !important;
          line-height: 1.85 !important;
          margin-bottom: 32px;
          max-width: 680px;
          text-align: justify;
        }

        .hair-clinic-intro-body p {
          margin-bottom: 20px !important;
        }

        .hair-clinic-intro-body p:last-child {
          margin-bottom: 0 !important;
        }

        /* Keyword Highlights Styling */
        .hair-clinic-intro-body strong {
          color: #0b132b !important;
          font-weight: 600 !important;
        }

        /* Quote box with luxury gold border */
        .hair-clinic-intro-quote-wrapper {
          border-left: 2px solid #bf9b30;
          padding-left: 24px;
          margin-top: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .hair-clinic-intro-quote {
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
        }

        .hair-clinic-intro-quote p {
          font-family: 'Marcellus', serif !important;
          font-size: 16px !important;
          font-style: italic !important;
          color: #0b132b !important;
          line-height: 1.6 !important;
          font-weight: 400 !important;
          letter-spacing: 0.01em;
        }

        /* Right Column: Visual Frame */
        .hair-clinic-intro-visual-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .hair-clinic-intro-frame-outer {
          position: relative;
          width: 100%;
          max-width: 400px;
          aspect-ratio: 4/5;
        }

        .hair-clinic-intro-frame-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          z-index: 2;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.04);
          background-color: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .hair-clinic-intro-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hair-clinic-intro-frame-outer:hover .hair-clinic-intro-img {
          transform: scale(1.03);
        }

        /* Responsive styling */
        @media (max-width: 1024px) {
          .hair-clinic-intro-grid {
            grid-template-columns: 1fr;
            gap: 56px;
          }

          .hair-clinic-intro-content-box {
            align-items: flex-start;
          }

          .hair-clinic-intro-visual-box {
            max-width: 400px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .hair-clinic-intro-section {
            padding-top: ${mobilePaddingTop} !important;
            padding-bottom: ${mobilePaddingBottom} !important;
          }
          
          .hair-clinic-intro-title {
            font-size: ${mobileHeadingSize} !important;
          }

          .hair-clinic-intro-quote p {
            font-size: 15px !important;
          }
        }
      `}</style>
    </>
  );
}
