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
    gradientColor = "#111827",
    titleColor = "#ffffff",
    textColor = "#e2e8f0",
    paddingTop = "100px",
    paddingBottom = "100px",
    isVisible = true,
    items = [],
    headingSize = "36px",
    headingFontFamily = "Marcellus",
    bodySize = "15px",
    bodyFontFamily = "Marcellus",
    mobilePaddingTop = "60px",
    mobilePaddingBottom = "60px",
    mobileHeadingSize = "28px"
  } = data;

  if (isVisible === false) return null;

  const resolvedItems = items.length > 0 ? items : [
    { title: 'US-FDA Approved Tech', content: 'Utilizing world-class automated follicular extraction systems and microscopic implanters for maximum survival rates.', isVisible: true },
    { title: 'Board-Certified Surgeons', content: 'Our procedures are strictly led by highly trained and certified hair restoration experts with decades of scalp mapping expertise.', isVisible: true },
    { title: 'Class-100 Sterile Suites', content: 'Experience absolute safety inside our state-of-the-art cleanroom surgical theatres designed to minimize any contamination risks.', isVisible: true }
  ];

  const sectionStyle = {
    background: `linear-gradient(180deg, ${backgroundColor} 0%, ${gradientColor} 100%)`,
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
          <div className="hair-clinic-why-container max-w-[1200px] mx-auto">
            
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
                  {/* Numeric Accent badge */}
                  <div className="hair-clinic-why-card-number">0{idx + 1}</div>
                  <div className="hair-clinic-why-card-line" />
                  
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

        .hair-clinic-why-container {
          padding: 0 24px;
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
          animation: hairClinicWhyFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes hairClinicWhyFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hair-clinic-why-badge {
          font-family: 'Marcellus', serif !important;
          font-size: 11px !important;
          font-weight: 400 !important;
          letter-spacing: 0.25em !important;
          text-transform: uppercase !important;
          margin-bottom: 16px;
          display: inline-block;
        }

        .hair-clinic-why-title {
          font-family: ${getFontFamilyCSS(headingFontFamily)} !important;
          font-size: ${headingSize} !important;
          font-weight: 400 !important;
          line-height: 1.3 !important;
          margin: 0 0 20px 0 !important;
          letter-spacing: 0.02em !important;
          text-transform: uppercase;
        }

        .hair-clinic-why-divider {
          width: 48px;
          height: 1px;
          background-color: #bf9b30;
          margin-bottom: 24px;
        }

        .hair-clinic-why-lead {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: 16px !important;
          line-height: 1.8 !important;
          font-weight: 300 !important;
          max-width: 660px;
          text-align: center;
        }

        /* 3-Column Luxury Minimal Grid */
        .hair-clinic-why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
        }

        .hair-clinic-why-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 48px 36px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hair-clinic-why-card:hover {
          border-color: rgba(191, 155, 48, 0.3);
          background: rgba(255, 255, 255, 0.04);
        }

        /* Numeric Accent badge */
        .hair-clinic-why-card-number {
          font-family: 'Marcellus', serif !important;
          font-size: 18px !important;
          font-weight: 400 !important;
          color: #bf9b30;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }

        .hair-clinic-why-card-line {
          width: 28px;
          height: 1px;
          background-color: rgba(191, 155, 48, 0.4);
          margin-bottom: 24px;
        }

        .hair-clinic-why-card-title {
          font-family: 'Marcellus', serif !important;
          font-size: 20px !important;
          color: #ffffff !important;
          margin-bottom: 16px !important;
          font-weight: 400 !important;
          letter-spacing: 0.02em !important;
        }

        .hair-clinic-why-card-content {
          font-family: ${getFontFamilyCSS(bodyFontFamily)} !important;
          font-size: ${bodySize} !important;
          line-height: 1.8 !important;
          color: #cbd5e1 !important;
          margin-bottom: 0px;
          flex: 1;
        }

        /* Responsive styling */
        @media (max-width: 1024px) {
          .hair-clinic-why-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 28px;
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
            padding: 36px 28px;
          }
        }
      `}</style>
    </>
  );
}
