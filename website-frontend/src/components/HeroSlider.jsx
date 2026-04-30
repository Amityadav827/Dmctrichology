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
          image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png',
          tag: 'TRUSTED CARE',
          tagIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png',
          patientsIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png',
          starIcon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png',
          description: 'Experience Compassionate Care And Advanced Trichology Solutions For Healthier, Stronger Hair.'
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
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div className="slide-content">
            <span className="slide-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1F3D3F', fontWeight: 'bold' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#E4B753' }}></div>
              {slide.tag}
            </span>
            <h1 className="slide-title" style={{ fontFamily: "'Marcellus', serif", fontSize: '72px', color: '#000', marginBottom: '16px' }}>{slide.title}</h1>
            <p className="slide-desc" style={{ fontFamily: "'Lato', sans-serif", fontSize: '18px', color: '#333' }}>{slide.description}</p>
            {/* Social proof row */}
            {(slide.patientsIcon || slide.starIcon) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {slide.patientsIcon && [1,2,3,4].map(i => (
                    <div key={i} style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      border: '2px solid #fff', 
                      overflow: 'hidden', 
                      marginLeft: i > 1 ? '-10px' : '0',
                      backgroundColor: '#ddd'
                    }}>
                      <img src={slide.patientsIcon} alt="satisfied patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1F3D3F' }}>225+ Satisfied Patients</div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(i => (
                      <img key={i} src={slide.starIcon} alt="star" style={{ width: '12px', height: '12px' }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
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
