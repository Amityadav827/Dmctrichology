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
  // Triple the images to ensure a seamless infinite loop even on ultra-wide screens
  const displayImages = [...featureImages, ...featureImages, ...featureImages];

  return (
    <section className="features-bar" style={{ 
      padding: '40px 0', 
      backgroundColor: 'transparent', 
      overflow: 'hidden' 
    }}>
      <style>
        {`
          @keyframes infiniteMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .marquee-content-fixed {
            display: flex;
            gap: 40px;
            animation: infiniteMarquee 25s linear infinite;
            width: max-content;
          }
          .feature-card {
            flex: 0 0 auto;
            width: 200px;
            background: #fff;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80px;
          }
        `}
      </style>
      <div className="marquee-container" style={{ overflow: 'hidden', width: '100%' }}>
        <div className="marquee-content-fixed">
          {displayImages.map((src, index) => (
            <div key={index} className="feature-card">
              <img 
                src={src} 
                alt={`Certification ${index + 1}`} 
                style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '100%' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
