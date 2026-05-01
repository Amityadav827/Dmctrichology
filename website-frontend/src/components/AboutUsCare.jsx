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
    <section className="about-us-care" style={{ padding: '60px 5%', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
        
        {/* Left Side: Large Image */}
        <div style={{ flex: '1 1 450px', position: 'relative' }}>
          <div style={{ 
            width: '100%'
          }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png" 
              alt="Doctor at Work" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>


        {/* Right Side: Content */}
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
             <img 
               src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
               alt="icon" 
               style={{ width: '40px', height: 'auto' }} 
             />
             <span style={{ 
               fontSize: '11px', 
               lineHeight: '24px',
               fontWeight: '400', 
               textTransform: 'uppercase', 
               color: '#1F3D3F', 
               fontFamily: "'Marcellus', serif" 
             }}>ABOUT US CARE</span>
          </div>

          <h2 style={{ 
            fontSize: '36px', 
            lineHeight: '48px',
            color: '#1F3D3F', 
            fontFamily: "'Marcellus', serif", 
            fontWeight: '400',
            marginBottom: '15px'
          }}>WHY CHOOSE DMC <br /> TRICHOLOGY?</h2>

          <p style={{ 
            fontSize: '14px', 
            lineHeight: '22px', 
            color: '#666', 
            fontFamily: "'Lato', sans-serif",
            marginBottom: '30px',
            maxWidth: '500px'
          }}>
            At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.
          </p>

          {/* Feature Box */}
          <div style={{ 
            display: 'flex', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            backgroundColor: '#1a1a1a',
            height: '180px'
          }}>
            {/* Box Left: Image */}
            <div style={{ width: '40%' }}>
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png" 
                alt="Hair Detail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Box Right: Points with Background */}
            <div style={{ 
              width: '60%', 
              padding: '20px', 
              backgroundImage: `url('https://res.cloudinary.com/dseixl6px/image/upload/v1777615992/dmc-trichology/une4wf3ini0mowjzhgq3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              alignContent: 'center',
              gap: '10px',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 
              }}></div>

              {points.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', zIndex: 2 }}>
                  <CheckCircle2 size={14} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '12px', fontFamily: "'Lato', sans-serif" }}>{point}</span>
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
