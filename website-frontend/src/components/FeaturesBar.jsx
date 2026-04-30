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
    <section className="features-bar" style={{ 
      padding: '60px 0', 
      backgroundColor: '#f8f8f8', 
      borderTop: '1px solid #eee',
      borderBottom: '1px solid #eee',
      overflow: 'hidden' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '30px', 
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 5%'
      }}>
        {featureImages.map((src, index) => (
          <div key={index} style={{ 
            flex: '0 0 auto',
            width: '220px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={src} 
              alt={`Certification ${index + 1}`} 
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
