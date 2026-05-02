"use client";
import React from 'react';

export default function PressMediaSection() {
  const logos = [
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png"
  ];

  const avatars = [
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png"
  ];

  return (
    <section style={{ padding: '60px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#FFFAF1', 
          borderRadius: '50px', 
          padding: '80px',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            gap: '80px',
            flexWrap: 'wrap'
          }}>
            
            {/* Left Side: Heading + Rating */}
            <div style={{ flex: '1.2', minWidth: '350px' }}>
              <h2 style={{ 
                fontSize: '48px', 
                color: '#1C1C1C', 
                fontFamily: "'Marcellus', serif", 
                fontWeight: '400', 
                margin: '0 0 50px 0',
                lineHeight: '1.25',
                maxWidth: '650px'
              }}>
                What The Press And Media Are Saying About Our Clinic
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginTop: '10px' }}>
                {/* Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {avatars.map((url, i) => (
                    <div key={i} style={{ 
                      width: '54px', 
                      height: '54px', 
                      borderRadius: '50%', 
                      border: '3px solid #FFFAF1',
                      marginLeft: i === 0 ? '0' : '-18px',
                      overflow: 'hidden',
                      backgroundColor: '#E5E5E5'
                    }}>
                      <img src={url} alt="patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>

                {/* Rating Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <img 
                        key={s} 
                        src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png" 
                        alt="star" 
                        style={{ width: '20px', height: '20px' }} 
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#1C1C1C', fontFamily: "'Lato', sans-serif" }}>
                    225+ Satisfied Patients
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Button + Logos */}
            <div style={{ 
              flex: '1', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end', 
              gap: '60px',
              minWidth: '350px'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 10px 10px 30px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: "'Lato', sans-serif",
                marginTop: '15px' // Aligned slightly lower with heading
              }}>
                Get Free Consulting
                <div style={{ 
                  width: '45px', 
                  height: '45px', 
                  backgroundColor: '#fff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                   <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" alt="arrow" style={{ width: '32px' }} />
                </div>
              </button>

              {/* Logos in one horizontal row */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '40px', 
                justifyContent: 'flex-end',
                width: '100%'
              }}>
                {logos.map((url, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={url} alt="media logo" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
