"use client";
import React from 'react';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicCTA({ data = {} }) {
  const {
    heading = "Begin Your Hair Restoration Journey Today",
    subheading = "Schedule a private clinical assessment with our trichology directors.",
    buttonText = "Book A Luxury Consultation",
    buttonLink = "#appointment-form",
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-cta" label="Hair Transplant Clinic CTA">
      <section className="hair-clinic-cta-section">
        <div className="hair-clinic-cta-container">
          <h2>
            <EditableText sectionId="hair-clinic-cta" fieldPath="heading" tag="span">
              {heading}
            </EditableText>
          </h2>
          <p>
            <EditableText sectionId="hair-clinic-cta" fieldPath="subheading" tag="span">
              {subheading}
            </EditableText>
          </p>

          <Link href={buttonLink} className="hair-clinic-cta-btn">
            <EditableText sectionId="hair-clinic-cta" fieldPath="buttonText" tag="span">
              {buttonText}
            </EditableText>
            <span>→</span>
          </Link>
        </div>
      </section>
    </EditableSection>
  );
}
