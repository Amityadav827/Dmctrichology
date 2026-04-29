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
        setSlides([
          {
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            tag: 'TRUSTED CARE',
            title: 'Recover Stronger, Move Freely, Live Pain-Free',
            description: 'Experience Compassionate Care And Advanced Dental Solutions For A Healthier, Brighter Smile.'
          },
          {
            image: 'https://images.unsplash.com/photo-1538108149393-ce905ce60d5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            tag: 'EXPERT TEAM',
            title: 'Your Health Is Our Priority',
            description: 'Providing world-class treatments with state-of-the-art facilities.'
          }
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
            <span className="slide-tag">{slide.tag}</span>
            <h1 className="slide-title">{slide.title}</h1>
            <p className="slide-desc">{slide.description}</p>
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
