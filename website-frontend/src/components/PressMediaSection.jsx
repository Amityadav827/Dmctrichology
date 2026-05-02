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
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ujqfjbjqbnxpcngqssi3.png"
  ];

  return (
    <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#FFFAF1', 
          borderRadius: '80px', 
          padding: '60px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Main Layout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
            
            {/* Left Column */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h2 style={{ 
                fontSize: '42px', 
                color: '#1C1C1C', 
                fontFamily: "'Marcellus', serif", 
                fontWeight: '400', 
                margin: '0 0 40px 0',
                lineHeight: '1.2',
                maxWidth: '600px'
              }}>
                What The Press And Media Are Saying About Our Clinic
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {avatars.map((url, i) => (
                    <div key={i} style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      border: '3px solid #FFFAF1',
                      marginLeft: i === 0 ? '0' : '-15px',
                      overflow: 'hidden',
                      backgroundColor: '#E5E5E5'
                    }}>
                      <img src={url} alt="patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>

                {/* Rating Info */}
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#333', fontFamily: "'Lato', sans-serif", marginBottom: '5px' }}>
                    225+ Satisfied Patients
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ color: '#FDB813', fontSize: '18px' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Button) */}
            <div>
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
                transition: 'all 0.3s ease'
              }}>
                Get Free Consulting
                <div style={{ 
                  width: '45px', 
                  height: '45px', 
                  backgroundColor: '#fff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#000'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Logos */}
          <div style={{ 
            marginTop: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px', 
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            {logos.map((url, i) => (
              <div key={i} style={{ 
                backgroundColor: '#fff', 
                padding: '15px 30px', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                minWidth: '180px'
              }}>
                <img src={url} alt="media logo" style={{ maxHeight: '35px', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
