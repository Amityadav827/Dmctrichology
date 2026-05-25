"use client";
import React, { useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicFAQ({ data = {} }) {
  const {
    heading = "Frequently Asked Questions",
    description = "Explore comprehensive expert insights on hair restoration, grafting, and timeline expectations.",
    faqsList = [],
    isVisible = true
  } = data;

  const [activeIndex, setActiveIndex] = useState(null);

  if (isVisible === false) return null;

  const toggleAccordion = (idx) => {
    setActiveIndex(prev => prev === idx ? null : idx);
  };

  return (
    <EditableSection sectionId="hair-clinic-faq" label="Hair Transplant Clinic FAQ">
      <section className="hair-clinic-faq-section">
        <div className="hair-clinic-faq-container">
          <div className="hair-clinic-section-header">
            <h2>
              <EditableText sectionId="hair-clinic-faq" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p>
              <EditableText sectionId="hair-clinic-faq" fieldPath="description" tag="span">
                {description}
              </EditableText>
            </p>
          </div>

          <div className="hair-clinic-faq-list">
            {faqsList.filter(item => item.isVisible !== false).map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  className={`hair-clinic-faq-accordion ${isActive ? 'hair-clinic-faq-accordion-active' : ''}`} 
                  key={idx}
                >
                  <button 
                    className="hair-clinic-faq-header"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isActive}
                  >
                    <h3>
                      <EditableText sectionId="hair-clinic-faq" fieldPath={`faqsList.${idx}.question`} tag="span">
                        {item.question}
                      </EditableText>
                    </h3>
                    <span className="hair-clinic-faq-icon">
                      {isActive ? '−' : '+'}
                    </span>
                  </button>

                  <div className="hair-clinic-faq-body">
                    <div className="hair-clinic-faq-content">
                      <EditableText sectionId="hair-clinic-faq" fieldPath={`faqsList.${idx}.answer`} tag="div" html>
                        {item.answer}
                      </EditableText>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
