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
  // Duplicate images for infinite loop
  const displayImages = [...featureImages, ...featureImages];

  return (
    <section className="features-bar" style={{ 
      padding: '60px 0', 
      backgroundColor: 'transparent', 
      overflow: 'hidden' 
    }}>
      <div className="marquee-container">
        <div className="marquee-content">
          {displayImages.map((src, index) => (
            <div key={index} style={{ 
              flex: '0 0 auto',
              width: '240px',
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
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
      </div>
    </section>
  );
}
