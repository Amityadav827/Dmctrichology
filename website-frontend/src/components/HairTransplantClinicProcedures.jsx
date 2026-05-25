"use client";
import React from 'react';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicProcedures({ data = {} }) {
  const {
    heading = "Our Elite Hair Restoration Procedures",
    introText = "We leverage state-of-the-art US-FDA approved technologies to deliver dense, natural, and permanent results.",
    items = [],
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-procedures" label="Hair Transplant Clinic Procedures">
      <section className="hair-clinic-procedures-section">
        <div className="hair-clinic-procedures-container">
          <div className="hair-clinic-section-header">
            <h2>
              <EditableText sectionId="hair-clinic-procedures" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p>
              <EditableText sectionId="hair-clinic-procedures" fieldPath="introText" tag="span">
                {introText}
              </EditableText>
            </p>
          </div>

          <div className="hair-clinic-procedures-grid">
            {items.filter(item => item.enabled !== false).map((item, idx) => (
              <div className="hair-clinic-procedure-card" key={item.id || idx}>
                {item.image && (
                  <div className="hair-clinic-procedure-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <div className="hair-clinic-procedure-card-body">
                  <h3>
                    <EditableText sectionId="hair-clinic-procedures" fieldPath={`items.${idx}.title`} tag="span">
                      {item.title}
                    </EditableText>
                  </h3>
                  <p>
                    <EditableText sectionId="hair-clinic-procedures" fieldPath={`items.${idx}.description`} tag="span">
                      {item.description}
                    </EditableText>
                  </p>
                  {item.link && (
                    <Link href={item.link} className="hair-clinic-procedure-card-btn">
                      Explore Treatment
                      <span className="btn-arrow-icon">→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
