"use client";
import { useState, useEffect } from 'react';
import { fetchHeroSlides } from '../services/api';

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

  useEffect(() => {
    fetchHeroSlides().then(data => {
      if (data && data.length > 0) {
        setSlides(data);
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


  return (
    <div className="hero-slider-container">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div className="slide-content">
            <span className="slide-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1F3D3F', fontWeight: 'bold' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
              {slide.tag}
            </span>
            <h1 className="slide-title" style={{ fontFamily: "'Marcellus', serif", fontSize: '54px', color: '#000', marginBottom: '16px' }}>{slide.title}</h1>
            <p className="slide-desc" style={{ fontFamily: "'Lato', sans-serif", fontSize: '18px', color: '#333' }}>{slide.description}</p>
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
