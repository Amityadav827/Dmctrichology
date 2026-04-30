import React from 'react';

const featureImages = [
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/dujziywmelzwixisgvyb.png",
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/rhqehubr894icsuzfcew.png",
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/gqnszoyafmildmq6l9mm.png",
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/eqmyy5zthf9zi92xyvxm.png",
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/oihmmdhj7lbltqp9qgrj.png",
  "https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/pdc64p00mfiv0080ippb.png"
];

export default function FeaturesBar() {
  return (
    <section className="features-bar" style={{ padding: '40px 0', backgroundColor: '#fff', overflow: 'hidden' }}>
      <div className="features-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '20px', 
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 5%'
      }}>
        {featureImages.map((src, index) => (
          <div key={index} className="feature-item" style={{ 
            flex: '0 0 auto',
            width: '180px',
            transition: 'transform 0.3s ease'
          }}>
            <img 
              src={src} 
              alt={`Feature ${index + 1}`} 
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
