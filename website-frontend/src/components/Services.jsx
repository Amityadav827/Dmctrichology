import React from 'react';

const serviceCards = [
  {
    title: 'Follicular Unit Extraction (FUE)',
    desc: 'Each Hair Follicle Is Removed Individually And Implanted Into The Thinning Or Bald Areas, Making Sure That It\'s Natural Volume And Growth.',
    image: 'http://dmctrichology-1.onrender.com/uploads/gallery/follicular-unit-extraction-fue-1777543866001.png'
  },
  {
    title: 'Follicular Unit Transplantation (FUT)',
    desc: 'FUT is another effective technique for hair restoration with high graft yield.',
    image: 'http://dmctrichology-1.onrender.com/uploads/gallery/follicular-unit-transplantation-fut-1777543865771.png'
  },
  {
    title: 'Hair Replacement In Delhi – Non-Surgical Solutions',
    desc: 'Advanced non-surgical hair replacement solutions for natural look.',
    image: 'http://dmctrichology-1.onrender.com/uploads/gallery/hair-replacement-in-delhi-non-surgical-solutions-1777543865905.png'
  },
  {
    title: 'Scalp Treatments For Healthy Hair',
    desc: 'Nourish your scalp and promote healthy hair growth with our treatments.',
    image: 'http://dmctrichology-1.onrender.com/uploads/gallery/scalp-treatments-for-healthy-hair-1777543865767.png'
  }
];

export default function Services() {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderCard = (card, isCenter = false) => (
    <div style={{ 
      backgroundColor: '#FEF0D7', 
      borderRadius: '24px', 
      padding: '30px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img src={card.image} alt={card.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '20px', height: '200px', objectFit: 'cover' }} />
      <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', lineHeight: '32px', color: '#000', marginBottom: '12px', fontWeight: 400 }}>{card.title}</h3>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px', lineHeight: '26px', color: '#7B7B7B', flex: 1 }}>{card.desc}</p>
      {isCenter && (
        <div style={{ marginTop: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
            {['Best For Both Men And Women', 'Low Scarring And Recovery Time', 'Permanent, Natural-Looking Results'].map((item, i) => (
              <li key={i} style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#333', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#E4B753' }}>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <section className="services-section" style={{ padding: '100px 5%', backgroundColor: '#FFFAF1', textAlign: 'center' }}>
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <img src={iconUrl} alt="icon" style={{ width: '50px', height: 'auto' }} />
        <span style={{ 
          fontFamily: "'Marcellus', serif", 
          fontSize: '12px', 
          lineHeight: '28px', 
          textTransform: 'uppercase', 
          color: '#1C1C1C',
          fontWeight: 400
        }}>
          Services
        </span>
      </div>

      <h2 style={{ 
        fontFamily: "'Marcellus', serif", 
        fontSize: '44px', 
        lineHeight: '60px', 
        color: '#000000', 
        marginBottom: '60px',
        fontWeight: 400,
        textTransform: 'capitalize'
      }}>
        Our Hair Transplant Services
      </h2>

      <div className="services-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '30px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'stretch'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {renderCard(serviceCards[1])} {/* FUT */}
          {renderCard(serviceCards[3])} {/* Scalp */}
        </div>

        {/* Center Focus Card */}
        <div style={{ height: '100%' }}>
          {renderCard(serviceCards[0], true)} {/* FUE */}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {renderCard(serviceCards[2])} {/* Non-Surgical */}
          <div style={{ backgroundColor: '#FEF0D7', borderRadius: '24px', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
             <p style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', color: '#1C1C1C' }}>Expert Solutions for You</p>
          </div>
        </div>
      </div>
    </section>
  );
}
