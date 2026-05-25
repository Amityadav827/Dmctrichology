"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicAssociations({ data = {} }) {
  const {
    heading = "GLOBAL MEMBERSHIPS & TRUST CERTIFICATIONS",
    sectionBgColor = "#ffffff",
    logos = [],
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-associations" label="Hair Transplant Clinic Associations">
      <section className="hair-clinic-associations-bar" style={{ backgroundColor: sectionBgColor }}>
        <div className="hair-clinic-associations-container">
          <h4>
            <EditableText sectionId="hair-clinic-associations" fieldPath="heading" tag="span">
              {heading}
            </EditableText>
          </h4>

          <div className="hair-clinic-associations-grid">
            {logos.filter(logo => logo.enabled !== false).map((logo, idx) => {
              const content = logo.imageUrl ? (
                <img src={logo.imageUrl} alt={logo.title} style={{ filter: 'grayscale(100%)', opacity: 0.7 }} />
              ) : (
                <EditableText sectionId="hair-clinic-associations" fieldPath={`logos.${idx}.title`} tag="span">
                  {logo.title}
                </EditableText>
              );

              return logo.link ? (
                <a key={logo.id || idx} href={logo.link} target="_blank" rel="noopener noreferrer" className="hair-clinic-association-logo-card">
                  {content}
                </a>
              ) : (
                <div key={logo.id || idx} className="hair-clinic-association-logo-card">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
