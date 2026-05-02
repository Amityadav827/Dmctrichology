import React from 'react';

const services = [
  {
    title: "Follicular Unit Extraction (FUE)",
    image: "https://images.unsplash.com/photo-1628156112302-31050899650b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Follicular Unit Transplantation (FUT)",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Hair Replacement In Delhi – Non-Surgical Solutions",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Scalp Treatments For Healthy Hair",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function ServiceSlider() {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ backgroundColor: '#FFFAF1', padding: '80px 5%' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#3D5A80' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3D5A80' }}></div>
              <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#3D5A80', fontWeight: '600' }}>SERVICES</span>
            </div>
            <h2 style={{ fontSize: '36px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", fontWeight: '400' }}>
              Our Hair Transplant Services
            </h2>
          </div>
          <a href="#" style={{ color: '#888', fontSize: '14px', textDecoration: 'none', marginBottom: '10px' }}>
            View All &gt;
          </a>
        </div>

        {/* Slider Container */}
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: '-25px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#444'
            }}
          >
            &#8249;
          </button>
          <button 
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: '-25px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#444'
            }}
          >
            &#8250;
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
