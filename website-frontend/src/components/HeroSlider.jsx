"use client";
import { useState, useEffect } from 'react';
import { fetchHeroSlides } from '../services/api';

export default function HeroSlider() {
  const [heroData, setHeroData] = useState(null);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    fetchHeroSlides().then(data => {
      if (data) {
        setHeroData(data);
      }
    });
    const t = setTimeout(() => setContentReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!heroData || heroData.isActive === false) return null;

  return (
    <div className="hero-slider-container" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="slide active">
        {/* Background with zoom animation */}
        <div
          className={`slide-bg ${contentReady ? 'slide-bg-zoom' : ''}`}
          style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)', 
          zIndex: 1 
        }}></div>

        <div className={`slide-content ${contentReady ? 'slide-content-animate' : ''}`}>
          <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
            {heroData.trustedText}
          </span>
          <h1 className="section-title" style={{ fontSize: '54px', marginBottom: '16px', textTransform: 'none' }}>
            {heroData.heading}
          </h1>
          <p className="slide-desc" style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: '#333', marginBottom: '30px' }}>
            {heroData.subheading}
          </p>
          
          <a href={heroData.buttonLink} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 35px', borderRadius: '50px', textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Marcellus', serif", fontSize: '1.1rem', color: '#000' }}>{heroData.buttonText}</span>
            <div className="icon-circle" style={{ backgroundColor: '#000', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
