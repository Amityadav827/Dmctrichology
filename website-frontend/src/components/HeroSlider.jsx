"use client";
import { useState, useEffect } from 'react';
import { fetchHeroSlides } from '../services/api';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';

export default function HeroSlider() {
  const [slides, setSlides] = useState([
    {
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
      tag: 'TRUSTED CARE',
      tagIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png',
      patientsIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png',
      starIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png',
      title: 'Recover Stronger, Move Freely, Live Pain-Free',
      description: 'Experience Compassionate Care And Advanced Trichology Solutions For Healthier, Stronger Hair.'
    },
    {
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
      tag: 'TRUSTED CARE',
      tagIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png',
      patientsIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png',
      starIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png',
      title: 'Expert Trichology Care for Healthy Hair',
      description: 'Experience Compassionate Care And Advanced Trichology Solutions For Healthier, Stronger Hair.'
    },
    {
      image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
      tag: 'TRUSTED CARE',
      tagIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png',
      patientsIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png',
      starIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png',
      title: 'Advanced Hair Solutions You Can Trust',
      description: 'Experience Compassionate Care And Advanced Trichology Solutions For Healthier, Stronger Hair.'
    }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    fetchHeroSlides().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setSlides(data);
      }
    });
    // Trigger entrance animation shortly after mount
    const t = setTimeout(() => setContentReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <EditableSection sectionId="hero" label="Hero Slider">
      <div className="hero-slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            {/* Background with zoom animation */}
            <div
              className={`slide-bg ${index === currentSlide ? 'slide-bg-zoom' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)', 
              zIndex: 1 
            }}></div>

            <div className={`slide-content ${index === currentSlide && contentReady ? 'slide-content-animate' : ''}`}>
              <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
                {slide.tag}
              </span>
              <h1 className="section-title" style={{ fontSize: '54px', marginBottom: '16px', textTransform: 'none' }}>
                <EditableText sectionId="hero" fieldPath={`slides.${index}.title`} tag="span">
                  {slide.title}
                </EditableText>
              </h1>
              <p className="slide-desc" style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: '#333' }}>
                <EditableText sectionId="hero" fieldPath={`slides.${index}.description`} tag="span">
                  {slide.description}
                </EditableText>
              </p>
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
