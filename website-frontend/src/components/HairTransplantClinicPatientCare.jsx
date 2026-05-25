"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicPatientCare({ data = {} }) {
  const {
    heading = "Expertise & Premium Patient Care",
    introText = "At DMC Trichology, patient comfort, meticulous hygiene, and long-term result quality are our primary directives.",
    items = [],
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-patient-care" label="Hair Transplant Clinic Patient Care">
      <section className="hair-clinic-care-section">
        <div className="hair-clinic-care-container">
          <div className="hair-clinic-section-header">
            <h2>
              <EditableText sectionId="hair-clinic-patient-care" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p>
              <EditableText sectionId="hair-clinic-patient-care" fieldPath="introText" tag="span">
                {introText}
              </EditableText>
            </p>
          </div>

          <div className="hair-clinic-care-grid">
            {items.filter(item => item.isVisible !== false).map((item, idx) => (
              <div className="hair-clinic-care-card" key={idx}>
                <h3>
                  <EditableText sectionId="hair-clinic-patient-care" fieldPath={`items.${idx}.title`} tag="span">
                    {item.title}
                  </EditableText>
                </h3>
                <p>
                  <EditableText sectionId="hair-clinic-patient-care" fieldPath={`items.${idx}.content`} tag="span">
                    {item.content}
                  </EditableText>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
