"use client";
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AboutUsCare = () => {
  const points = [
    "Golden Technique",
    "Minimal Procedure",
    "Natural Results",
    "Safe Procedure",
    "Expert Team",
    "Affordable Quality",
    "FUE MesoGrow",
    "Top Trichologist"
  ];

  return (
    <section className="about-us-care" style={{ padding: '100px 5%', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
        
        {/* Left Side: Large Image */}
        <div style={{ flex: '1 1 500px', position: 'relative' }}>
          <div style={{ 
            borderRadius: '40px 40px 150px 40px', 
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
          }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png" 
              alt="Doctor at Work" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
             <img 
               src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
               alt="icon" 
               style={{ width: '50px', height: 'auto' }} 
             />
             <span style={{ 
               fontSize: '12px', 
               lineHeight: '28px',
               fontWeight: '400', 
               textTransform: 'uppercase', 
               color: '#1F3D3F', 
               fontFamily: "'Marcellus', serif" 
             }}>ABOUT US CARE</span>
          </div>

          <h2 style={{ 
            fontSize: '44px', 
            lineHeight: '60px',
            color: '#1F3D3F', 
            fontFamily: "'Marcellus', serif", 
            fontWeight: '400',
            marginBottom: '25px'
          }}>WHY CHOOSE DMC <br /> TRICHOLOGY?</h2>

          <p style={{ 
            fontSize: '15px', 
            lineHeight: '26px', 
            color: '#666', 
            fontFamily: "'Lato', sans-serif",
            marginBottom: '40px',
            maxWidth: '550px'
          }}>
            At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results. We Make Every Effort To Offer The Most Effective, Comfortable, And Secure Surgical And Non-Surgical Methods For Hair Loss And Hair Transplantation.
          </p>

          {/* Feature Box */}
          <div style={{ 
            display: 'flex', 
            borderRadius: '30px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            backgroundColor: '#1a1a1a' // Fallback
          }}>
            {/* Box Left: Image */}
            <div style={{ width: '40%', minHeight: '200px' }}>
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png" 
                alt="Hair Detail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Box Right: Points with Background */}
            <div style={{ 
              width: '60%', 
              padding: '30px', 
              backgroundImage: `url('https://res.cloudinary.com/dseixl6px/image/upload/v1777615992/dmc-trichology/une4wf3ini0mowjzhgq3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              position: 'relative'
            }}>
              {/* Overlay for readability if needed */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 
              }}></div>

              {points.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <CheckCircle2 size={16} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '13px', fontFamily: "'Lato', sans-serif" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          h2 { font-size: 36px !important; line-height: 48px !important; }
          .about-us-care { padding: 60px 5% !important; }
        }
        @media (max-width: 640px) {
          .points-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default AboutUsCare;
