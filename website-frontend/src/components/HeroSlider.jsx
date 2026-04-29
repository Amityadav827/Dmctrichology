"use client";
import { useState, useEffect } from 'react';
import { fetchHeroSlides } from '../services/api';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHeroSlides().then(data => {
      if (data && data.length > 0) {
        setSlides(data);
      } else {
        // Fallback dummy data matching the design
        const baseSlide = {
          image: 'http://dmctrichology-1.onrender.com/uploads/gallery/banner-1-1777465282572.png',
          tag: 'TRUSTED CARE',
          tagIcon: 'http://dmctrichology-1.onrender.com/uploads/gallery/trusted-care-1777465282570.png',
          description: 'Experience Compassionate Care And Advanced Dental Solutions For A Healthier, Brighter Smile.'
        };
        setSlides([
          { ...baseSlide, title: 'Recover Stronger, Move Freely, Live Pain-Free' },
          { ...baseSlide, title: 'Expert Trichology Care for Healthy Hair' },
          { ...baseSlide, title: 'Advanced Hair Solutions You Can Trust' }
        ]);
      }
    });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="hero-slider-container">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 248, 0.75)' }}></div>
          <div className="slide-content">
            <span className="slide-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {slide.tagIcon && <img src={slide.tagIcon} alt="icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
              {slide.tag}
            </span>
            <h1 className="slide-title" style={{ fontFamily: "'Marcellus', serif", fontSize: '64px' }}>{slide.title}</h1>
            <p className="slide-desc" style={{ fontFamily: "'Lato', sans-serif" }}>{slide.description}</p>
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
  );
}
