"use client";

import React from 'react';

const services = [
  {
    title: "Follicular Unit Extraction (FUE)",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"
  },
  {
    title: "Follicular Unit Transplantation (FUT)",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/scwz5ugmiwn9npmzpk5d.png"
  },
  {
    title: "Hair Replacement In Delhi – Non-Surgical Solutions",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/l141dtwrmlhc3xm8tlir.png"
  },
  {
    title: "Scalp Treatments For Healthy Hair",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/kuhwci9p4pp7r7mzmxof.png"
  },
  // Duplicated for scrolling
  {
    title: "Follicular Unit Extraction (FUE)",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png"
  },
  {
    title: "Follicular Unit Transplantation (FUT)",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/scwz5ugmiwn9npmzpk5d.png"
  },
  {
    title: "Hair Replacement In Delhi – Non-Surgical Solutions",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/l141dtwrmlhc3xm8tlir.png"
  },
  {
    title: "Scalp Treatments For Healthy Hair",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/kuhwci9p4pp7r7mzmxof.png"
  }
];

export default function ServiceSlider() {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth; // Scroll by one full page
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ backgroundColor: '#FFFAF1', padding: '80px 5%' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Area - Centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
              alt="icon" 
              style={{ width: '40px', height: 'auto' }} 
            />
            <span style={{ fontSize: '14px', letterSpacing: '2.5px', color: '#3D5A80', fontWeight: '600' }}>SERVICES</span>
          </div>
          <h2 style={{ fontSize: '42px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", fontWeight: '400', textAlign: 'center' }}>
            Our Hair Transplant Services
          </h2>
          <a href="#" style={{ position: 'absolute', right: 0, bottom: '10px', color: '#888', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View All
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" 
              alt="arrow" 
              style={{ width: '20px', height: 'auto' }} 
            />
          </a>
        </div>

        {/* Slider Container */}
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows - Using Provided Images */}
          <button 
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: '-30px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'unset',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0'
            }}
          >
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777610955/dmc-trichology/acctki1o9lkpujrsmtqu.png" 
              alt="prev" 
              style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
            />
          </button>
          <button 
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: '-30px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'unset',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0'
            }}
          >
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777610955/dmc-trichology/aevxkziamfrlmc14tpv1.png" 
              alt="next" 
              style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
            />
          </button>

          {/* Cards Wrapper */}
          <div 
            ref={scrollContainerRef}
            style={{ 
              display: 'flex', 
              gap: '25px', 
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              padding: '10px 0 40px 0'
            }}
          >
            {services.map((service, index) => (
              <div 
                key={index} 
                style={{ 
                  flex: '0 0 calc(25% - 19px)', 
                  minWidth: '280px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '100%', 
                  height: '280px', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  marginBottom: '20px' 
                }}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: '#1C1C1C', 
                  textAlign: 'center', 
                  lineHeight: '1.4',
                  fontWeight: '500',
                  padding: '0 10px'
                }}>
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
