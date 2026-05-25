"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicTimeline({ data = {} }) {
  const {
    heading = "Milestones in Clinical Excellence",
    timelineTitle = "Our Journey",
    timelineItems = [],
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-timeline" label="Hair Transplant Clinic Timeline">
      <section className="hair-clinic-timeline-section">
        <div className="hair-clinic-timeline-container">
          <div className="hair-clinic-section-header">
            <h2>
              <EditableText sectionId="hair-clinic-timeline" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p>
              <EditableText sectionId="hair-clinic-timeline" fieldPath="timelineTitle" tag="span">
                {timelineTitle}
              </EditableText>
            </p>
          </div>

          <div className="hair-clinic-timeline-wrapper">
            {timelineItems.filter(item => item.enabled !== false).map((item, idx) => (
              <div className="hair-clinic-timeline-node" key={idx}>
                {/* Glowing gold dot */}
                <div className="hair-clinic-timeline-marker" />

                {/* Content block */}
                <div className="hair-clinic-timeline-item">
                  <div className="hair-clinic-timeline-item-year">
                    <EditableText sectionId="hair-clinic-timeline" fieldPath={`timelineItems.${idx}.year`} tag="span">
                      {item.year}
                    </EditableText>
                  </div>
                  <h3>
                    <EditableText sectionId="hair-clinic-timeline" fieldPath={`timelineItems.${idx}.title`} tag="span">
                      {item.title}
                    </EditableText>
                  </h3>
                  <p>
                    <EditableText sectionId="hair-clinic-timeline" fieldPath={`timelineItems.${idx}.description`} tag="span">
                      {item.description}
                    </EditableText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
