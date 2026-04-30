import React from 'react';

const serviceCards = [
  {
    title: 'Follicular Unit Extraction (FUE)',
    desc: 'Each Hair Follicle Is Removed Individually And Implanted Into The Thinning Or Bald Areas, Making Sure That It\'s Natural Volume And Growth.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/scr1ziqgtxcsmwf2oq6p.png'
  },
  {
    title: 'Follicular Unit Transplantation (FUT)',
    desc: 'FUT is another effective technique for hair restoration with high graft yield.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/ugxr4ynn8vchlvqj6wkl.png'
  },
  {
    title: 'Hair Replacement In Delhi – Non-Surgical Solutions',
    desc: 'Advanced non-surgical hair replacement solutions for natural look.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545320/dmc-trichology/jzdzyygl81bzzklwosgr.png'
  },
  {
    title: 'Scalp Treatments For Healthy Hair',
    desc: 'Nourish your scalp and promote healthy hair growth with our treatments.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777545319/dmc-trichology/kitvciqmkcr2xm1zr77f.png'
  }
];

export default function Services() {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  const renderCard = (card, isCenter = false) => (
    <div style={{ 
      backgroundColor: '#FEF0D7', 
      borderRadius: '24px', 
      padding: '24px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <div style={{ width: '100%', height: '180px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
        <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', lineHeight: '28px', color: '#000', marginBottom: '12px', fontWeight: 400 }}>{card.title}</h3>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', lineHeight: '22px', color: '#7B7B7B', marginBottom: 0 }}>{card.desc}</p>
      {isCenter && (
        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Best For Both Men And Women', 'Low Scarring And Recovery Time', 'Permanent, Natural-Looking Results'].map((item, i) => (
              <li key={i} style={{ fontFamily: "'Lato', sans-serif", fontSize: '13px', color: '#333', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ color: '#E4B753' }}>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <section className="services-section" style={{ padding: '80px 5%', backgroundColor: '#FFFAF1', textAlign: 'center' }}>
      <div className="section-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
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
        fontSize: '40px', 
        lineHeight: '52px', 
        color: '#000000', 
        marginBottom: '50px',
        fontWeight: 400,
        textTransform: 'capitalize'
      }}>
        Our Hair Transplant Services
      </h2>

      <div className="services-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        alignItems: 'start'
      }}>
        {renderCard(serviceCards[1])} {/* FUT */}
        {renderCard(serviceCards[0], true)} {/* FUE */}
        {renderCard(serviceCards[2])} {/* Non-Surgical */}
        {renderCard(serviceCards[3])} {/* Scalp */}
      </div>
    </section>
  );
}
