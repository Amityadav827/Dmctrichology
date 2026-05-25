"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicIntro({ data = {} }) {
  const {
    heading = "Welcome to DMC Trichology",
    welcomeText = "<p>At DMC Trichology, we believe that hair restoration is as much an art as it is a science. As one of Delhi’s most elite trichology clinics, we offer a dedicated suite of cutting-edge hair transplant techniques, custom-tailored to the unique physiological profile and aesthetic goals of every patient.</p><p>Under the guidance of our clinical directors, our highly trained team of surgeons utilizes state-of-the-art medical innovations to ensure high-density hair graft survival rates, absolute safety, and virtually seamless blending with your natural hairline.</p>",
    directorQuote = "Our mission is simple: to combine surgical precision with visual artistry to restore not just your hair, but your self-assurance.",
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-intro" label="Hair Transplant Clinic Intro">
      <section className="hair-clinic-welcome-section">
        <div className="hair-clinic-welcome-grid">
          {/* Welcome Text block */}
          <div className="hair-clinic-welcome-content">
            <h2>
              <EditableText sectionId="hair-clinic-intro" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            <div className="hair-clinic-welcome-body">
              <EditableText sectionId="hair-clinic-intro" fieldPath="welcomeText" tag="div" html>
                {welcomeText}
              </EditableText>
            </div>

            {directorQuote && (
              <blockquote className="hair-clinic-welcome-quote">
                <p>
                  <EditableText sectionId="hair-clinic-intro" fieldPath="directorQuote" tag="span">
                    {directorQuote}
                  </EditableText>
                </p>
              </blockquote>
            )}
          </div>

          {/* Featured Welcoming Image */}
          <div className="hair-clinic-welcome-media">
            <div className="hair-clinic-welcome-image-frame">
              <img src={image} alt="DMC Trichology Care" />
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
