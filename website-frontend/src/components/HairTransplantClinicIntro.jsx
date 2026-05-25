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
    textColor = "#475569",
    paddingTop = "100px",
    paddingBottom = "100px",
    isVisible = true,
    headingSize = "38px",
    headingFontFamily = "Marcellus",
    bodySize = "16px",
    bodyFontFamily = "Lato",
    mobilePaddingTop = "60px",
    mobilePaddingBottom = "60px",
    mobileHeadingSize = "30px"
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
        <section className="hair-clinic-intro-section animate-fade-in" style={sectionStyle}>
          
          {/* Subtle soft layered backdrop glow */}
          <div className="hair-clinic-intro-glow-bg" aria-hidden="true" />
          
          <div className="hair-clinic-intro-container max-w-[1250px] mx-auto relative z-10">
            <div className="hair-clinic-intro-grid">
              
              {/* LEFT COLUMN: Editorial Storytelling Content */}
              <div className="hair-clinic-intro-content-box">
                <div className="hair-clinic-intro-badge-wrapper">
                  <span className="hair-clinic-intro-gold-dot" />
                  <span className="hair-clinic-intro-badge">Clinical Excellence</span>
                </div>
                
                <h2 className="hair-clinic-intro-title">
                  <EditableText sectionId="hair-clinic-intro" fieldPath="intro.heading" tag="span">
                    {heading}
                  </EditableText>
                </h2>

                <div className="hair-clinic-intro-divider-wrap">
                  <div className="hair-clinic-intro-divider-gold" />
                  <div className="hair-clinic-intro-divider-gray" />
                </div>

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

              {/* RIGHT COLUMN: Luxury Framed Visual */}
              <div className="hair-clinic-intro-visual-box">
                <div className="hair-clinic-intro-frame-outer">
                  <div className="hair-clinic-intro-frame-glow-subtle" />
                  <div className="hair-clinic-intro-frame-glow" />
                  <div className="hair-clinic-intro-frame-inner">
                    <img 
                      src={image} 
                      alt="DMC Clinical Directors" 
                      className="hair-clinic-intro-img"
                    />
                  </div>
                  {/* Subtle luxury brand highlight tag */}
                  <div className="hair-clinic-intro-brand-tag">DMC FLAGSHIP</div>
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

        .hair-clinic-intro-glow-bg {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(191, 155, 48, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
          top: -200px;
          left: -200px;
          pointer-events: none;
          z-index: 1;
        }

        .hair-clinic-intro-container {
          padding: 0 5%;
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
          animation: hairClinicIntroFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
          z-index: 2;
        }

        @keyframes hairClinicIntroFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hair-clinic-intro-badge-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .hair-clinic-intro-gold-dot {
          width: 6px;
          height: 6px;
          background-color: #bf9b30;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #bf9b30;
        }

        .hair-clinic-intro-badge {
          font-family: 'Lato', sans-serif !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          letter-spacing: 3.5px !important;
          text-transform: uppercase !important;
          color: #bf9b30 !important; /* Muted Premium Gold */
          display: inline-block;
        }

        .hair-clinic-intro-title {
          font-family: ${getFontFamilyCSS(headingFontFamily)} !important;
          font-size: ${headingSize} !important;
          font-weight: 400 !important;
          line-height: 1.25 !important;
          color: #0b132b !important; /* Deep Navy */
          margin: 0 0 20px 0 !important;
          letter-spacing: 0.5px !important;
        }

        .hair-clinic-intro-divider-wrap {
          display: flex;
          width: 100px;
          height: 3px;
          margin-bottom: 32px;
          border-radius: 2px;
          overflow: hidden;
        }

        .hair-clinic-intro-divider-gold {
          width: 40%;
          height: 100%;
          background-color: #bf9b30;
        }

        .hair-clinic-intro-divider-gray {
          width: 60%;
          height: 100%;
          background-color: #e2e8f0;
        }

        .hair-clinic-intro-body {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: ${bodySize} !important;
          line-height: 1.85 !important;
          margin-bottom: 32px;
          max-width: 680px;
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
          border-bottom: 1px solid rgba(191, 155, 48, 0.2);
          padding-bottom: 1px;
        }

        /* Quote box with luxury gold border */
        .hair-clinic-intro-quote-wrapper {
          border-left: 3px solid #bf9b30;
          padding-left: 28px;
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
          font-size: 18px !important;
          font-style: italic !important;
          color: #0b132b !important;
          line-height: 1.6 !important;
          font-weight: 400 !important;
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
          max-width: 420px;
          aspect-ratio: 4/5;
        }

        .hair-clinic-intro-frame-glow-subtle {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(191, 155, 48, 0.08) 0%, rgba(255,255,255,0) 80%);
          z-index: 0;
          pointer-events: none;
        }

        .hair-clinic-intro-frame-glow {
          position: absolute;
          inset: -12px;
          border: 1px solid rgba(191, 155, 48, 0.2);
          border-radius: 20px;
          z-index: 1;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hair-clinic-intro-frame-outer:hover .hair-clinic-intro-frame-glow {
          inset: -18px;
          border-color: rgba(191, 155, 48, 0.35);
        }

        .hair-clinic-intro-frame-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          z-index: 2;
          box-shadow: 0 25px 60px rgba(11, 19, 43, 0.15);
          background-color: #f8fafc;
          border: 1px solid rgba(11, 19, 43, 0.06);
        }

        .hair-clinic-intro-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hair-clinic-intro-frame-outer:hover .hair-clinic-intro-img {
          transform: scale(1.05);
        }

        .hair-clinic-intro-brand-tag {
          position: absolute;
          bottom: 24px;
          right: -16px;
          z-index: 3;
          background-color: #bf9b30;
          color: #ffffff;
          font-family: 'Lato', sans-serif !important;
          font-size: 10.5px !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
          padding: 6px 16px !important;
          border-radius: 4px;
          box-shadow: 0 4px 15px rgba(191, 155, 48, 0.35);
          text-transform: uppercase;
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
            max-width: 440px;
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
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
