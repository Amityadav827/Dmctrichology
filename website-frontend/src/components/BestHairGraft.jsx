"use client";
import React from 'react';

export default function BestHairGraft() {
  return (
    <section className="hair-graft-section" style={{ backgroundColor: '#ffffff', padding: '100px 5%' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 className="section-title">
            Best Hair Graft Clinic
          </h2>
          <p style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            color: '#666', 
            lineHeight: '1.8',
            fontFamily: "'Marcellus', serif",
            fontSize: '18px'
          }}>
            Experience the most advanced hair restoration techniques at DMC Trichology. Our expert surgeons specialize in high-density hair transplants with natural-looking results, tailored to your unique needs.
          </p>
        </div>
        
        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          marginTop: '60px'
        }}>
          {[
            { title: 'FUE Technique', desc: 'Minimally invasive follicular unit extraction.' },
            { title: 'DHI Method', desc: 'Direct Hair Implantation for maximum density.' },
            { title: 'Natural Hairline', desc: 'Artistic approach to hair design.' }
          ].map((feature, i) => (
            <div key={i} style={{ 
              padding: '40px', 
              borderRadius: '20px', 
              border: '1px solid #eee',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              backgroundColor: '#fff'
            }} className="feature-item">
              <h4 style={{ fontSize: '22px', marginBottom: '15px', color: '#1F3D3F' }}>{feature.title}</h4>
              <p style={{ color: '#666', fontSize: '15px' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .feature-item:hover {
          border-color: #F09819;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
      `}</style>
    </section>
  );
}
