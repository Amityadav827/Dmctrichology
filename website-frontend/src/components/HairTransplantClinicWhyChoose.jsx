"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicWhyChoose({ data = {} }) {
  const {
    heading = "WHY CHOOSE OUR HAIR CLINIC IN DELHI?",
    description = "At DMC Trichology, patient comfort, meticulous hygiene, and long-term result quality are our primary directives.",
    highlightedText = "Elite Care & Technology",
    backgroundColor = "#0b132b",
    gradientColor = "#1e293b",
    titleColor = "#ffffff",
    textColor = "#e2e8f0",
    paddingTop = "100px",
    paddingBottom = "100px",
    isVisible = true,
    items = [],
    headingSize = "38px",
    headingFontFamily = "Marcellus",
    bodySize = "14.5px",
    bodyFontFamily = "Lato",
    mobilePaddingTop = "60px",
    mobilePaddingBottom = "60px",
    mobileHeadingSize = "30px"
  } = data;

  if (isVisible === false) return null;

  const resolvedItems = items.length > 0 ? items : [
    { title: 'US-FDA Approved Tech', content: 'Utilizing world-class automated follicular extraction systems and microscopic implanters for maximum survival rates.', isVisible: true },
    { title: 'Board-Certified Surgeons', content: 'Our procedures are strictly led by highly trained and certified hair restoration experts with decades of scalp mapping expertise.', isVisible: true },
    { title: 'Class-100 Sterile Suites', content: 'Experience absolute safety inside our state-of-the-art cleanroom surgical theatres designed to minimize any contamination risks.', isVisible: true }
  ];

  const sectionStyle = {
    background: `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientColor} 100%)`,
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
      <EditableSection sectionId="hair-clinic-why" label="Hair Transplant Clinic Why Choose Section">
        <section className="hair-clinic-why-section" style={sectionStyle}>
          {/* Subtle luxury background elements / soft layered glow */}
          <div className="hair-clinic-why-blur" aria-hidden="true" />
          <div className="hair-clinic-why-glow-top" aria-hidden="true" />
          
          <div className="hair-clinic-why-container max-w-[1250px] mx-auto">
            
            {/* Header block */}
            <div className="hair-clinic-why-header">
              <span className="hair-clinic-why-badge" style={{ color: '#bf9b30' }}>
                <EditableText sectionId="hair-clinic-why" fieldPath="whyChoose.highlightedText" tag="span">
                  {highlightedText}
                </EditableText>
              </span>
              
              <h2 className="hair-clinic-why-title" style={{ color: titleColor }}>
                <EditableText sectionId="hair-clinic-why" fieldPath="whyChoose.heading" tag="span">
                  {heading}
                </EditableText>
              </h2>
              
              <div className="hair-clinic-why-divider" />
              
              <p className="hair-clinic-why-lead" style={{ color: textColor }}>
                <EditableText sectionId="hair-clinic-why" fieldPath="whyChoose.description" tag="span">
                  {description}
                </EditableText>
              </p>
            </div>

            {/* Alternating trust grid */}
            <div className="hair-clinic-why-grid">
              {resolvedItems.filter(item => item.isVisible !== false).map((item, idx) => (
                <div className="hair-clinic-why-card" key={idx}>
                  {/* Glowing border element */}
                  <div className="hair-clinic-why-card-glow" />
                  
                  {/* Number Badge */}
                  <div className="hair-clinic-why-card-number">0{idx + 1}</div>
                  
                  <h3 className="hair-clinic-why-card-title">
                    <EditableText sectionId="hair-clinic-why" fieldPath={`whyChoose.items.${idx}.title`} tag="span">
                      {item.title}
                    </EditableText>
                  </h3>
                  
                  <p className="hair-clinic-why-card-content">
                    <EditableText sectionId="hair-clinic-why" fieldPath={`whyChoose.items.${idx}.content`} tag="span">
                      {item.content}
                    </EditableText>
                  </p>

                  <div className="hair-clinic-why-card-footer">
                    <span className="hair-clinic-why-card-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </EditableSection>

      <style>{`
        .hair-clinic-why-section {
          width: 100%;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          z-index: 5;
        }

        .hair-clinic-why-blur {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191, 155, 48, 0.05) 0%, rgba(191, 155, 48, 0) 70%);
          bottom: -100px;
          right: -100px;
          z-index: 1;
          pointer-events: none;
        }

        .hair-clinic-why-glow-top {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(72, 106, 145, 0.12) 0%, rgba(72, 106, 145, 0) 70%);
          top: -200px;
          left: 10%;
          z-index: 1;
          pointer-events: none;
        }

        .hair-clinic-why-container {
          padding: 0 5%;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        /* Centered Section Header cloned from homepage system */
        .hair-clinic-why-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: hairClinicWhyFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes hairClinicWhyFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hair-clinic-why-badge {
          font-family: 'Lato', sans-serif !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          letter-spacing: 3.5px !important;
          text-transform: uppercase !important;
          margin-bottom: 16px;
          display: inline-block;
        }

        .hair-clinic-why-title {
          font-family: ${getFontFamilyCSS(headingFontFamily)} !important;
          font-size: ${headingSize} !important;
          font-weight: 400 !important;
          line-height: 1.25 !important;
          margin: 0 0 20px 0 !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase;
        }

        .hair-clinic-why-divider {
          width: 60px;
          height: 3px;
          background-color: #bf9b30;
          margin-bottom: 24px;
          border-radius: 2px;
        }

        .hair-clinic-why-lead {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: 16px !important;
          line-height: 1.75 !important;
          font-weight: 300 !important;
          max-width: 660px;
        }

        /* 3-Column Glassmorphism Grid */
        .hair-clinic-why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .hair-clinic-why-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(12px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        /* Glowing Border Hover effect */
        .hair-clinic-why-card-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(191, 155, 48, 0.15) 0%, rgba(191, 155, 48, 0) 100%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }

        .hair-clinic-why-card:hover {
          transform: translateY(-8px);
          border-color: rgba(191, 155, 48, 0.35);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);
        }

        .hair-clinic-why-card:hover .hair-clinic-why-card-glow {
          opacity: 1;
        }

        /* Numeric Accent badge */
        .hair-clinic-why-card-number {
          font-family: 'Marcellus', serif !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #bf9b30;
          background: rgba(191, 155, 48, 0.1);
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 24px;
          letter-spacing: 1px;
          z-index: 2;
        }

        .hair-clinic-why-card-title {
          font-family: 'Marcellus', serif !important;
          font-size: 21px !important;
          color: #ffffff !important;
          margin-bottom: 16px !important;
          font-weight: 400 !important;
          letter-spacing: 0.5px !important;
          z-index: 2;
        }

        .hair-clinic-why-card-content {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: ${bodySize} !important;
          line-height: 1.75 !important;
          color: #cbd5e1 !important;
          margin-bottom: 24px;
          flex: 1;
          z-index: 2;
        }

        .hair-clinic-why-card-footer {
          margin-top: auto;
          z-index: 2;
        }

        .hair-clinic-why-card-arrow {
          font-size: 18px;
          color: #bf9b30;
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .hair-clinic-why-card:hover .hair-clinic-why-card-arrow {
          transform: translateX(6px);
        }

        /* Responsive styling */
        @media (max-width: 1024px) {
          .hair-clinic-why-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .hair-clinic-why-section {
            padding-top: ${mobilePaddingTop} !important;
            padding-bottom: ${mobilePaddingBottom} !important;
          }
          
          .hair-clinic-why-title {
            font-size: ${mobileHeadingSize} !important;
          }

          .hair-clinic-why-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </>
  );
}
