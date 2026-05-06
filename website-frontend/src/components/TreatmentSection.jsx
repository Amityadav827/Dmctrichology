"use client";
import React from 'react';

export default function TreatmentSection() {
  const cards = [
    {
      title: "Laser Hair Reduction",
      desc: "Curious about Laser Hair reduction? Take our quick test to know how it works- and find out the best suited treatment plan for you!",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777634594/dmc-trichology/tgdwxqknoq3nftmlapnq.png",
      link: "#"
    },
    {
      title: "Weight Reduction Assessment",
      desc: "Explore your personal slimming roadmap—take our AI-guided test and discover custom sessions for your goals.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777634594/dmc-trichology/wbodpzympkp4nnjnrme2.png",
      link: "#"
    }
  ];

  return (
    <section style={{ padding: '0', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
             <div style={{ width: '40px', height: '1px', backgroundColor: '#E4B753' }}></div>
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E4B753' }}></div>
             <span className="section-subtitle">REVIEWS</span>
          </div>
          <h2 className="section-title">Know the Right Treatment for You</h2>
        </div>

        {/* Cards Container */}
        <div className="treatment-grid" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cards.map((card, index) => (
            <div key={index} style={{ 
              flex: '1 1 600px', 
              display: 'flex', 
              backgroundColor: '#F7F8F8', 
              borderRadius: '30px', 
              overflow: 'hidden',
              minHeight: '300px'
            }}>
              {/* Image Side */}
              <div style={{ flex: '0 0 45%', minHeight: '300px' }}>
                <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              {/* Content Side */}
              <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '28px', color: '#000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '15px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Lato', sans-serif", lineHeight: '1.6', marginBottom: '30px' }}>{card.desc}</p>
                
                <a href={card.link} className="treatment-btn" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  backgroundColor: '#000', 
                  color: '#fff', 
                  padding: '12px 25px', 
                  borderRadius: '10px', 
                  textDecoration: 'none',
                  width: 'fit-content',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: "'Marcellus', serif",
                  transition: 'all 0.3s ease'
                }}>
                  TAKE THE TEST
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .treatment-btn:hover {
          background-color: #E4B753 !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .treatment-btn:hover svg {
          transform: translateX(5px);
          transition: transform 0.3s ease;
        }
        @media (max-width: 992px) {
          .treatment-grid > div {
            flex-direction: column !important;
          }
          .treatment-grid > div > div {
            flex: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
