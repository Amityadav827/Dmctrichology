"use client";
import CountUpStat from './CountUpStat';

const AboutUs = () => {
  const stats = [
    { value: '2k+', label: 'Patients Healed' },
    { value: '15+', label: 'Certified Doctors' },
    { value: '4.9', label: 'Average Patient Rating' },
    { value: '100+', label: 'New Equipments' }
  ];

  return (
    <section className="welcome-section" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
           <img 
             src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
             alt="icon" 
             style={{ width: '40px', height: 'auto' }} 
           />
           <span style={{ 
             fontSize: '12px', 
             fontWeight: '400', 
             textTransform: 'uppercase', 
             color: '#000', 
             fontFamily: "'Marcellus', serif",
             letterSpacing: '1px'
           }}>ABOUT US CARE</span>
        </div>

        <h2 style={{ 
          fontSize: '44px', 
          lineHeight: '60px',
          color: '#1F3D3F', 
          fontFamily: "'Marcellus', serif", 
          marginBottom: '0',
          fontWeight: '400',
          textTransform: 'uppercase'
        }}>WELCOME TO DMC TRICHOLOGY®</h2>


        <p style={{ 
          fontSize: '44px', 
          lineHeight: '60px',
          color: '#333', 
          fontFamily: "'Marcellus', serif", 
          marginBottom: '60px',
          maxWidth: '1200px',
          margin: '0 auto 60px'
        }}>
          At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence
        </p>

        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '40px',
          marginTop: '40px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '42px', color: '#1F3D3F', fontFamily: "'Marcellus', serif", marginBottom: '10px', fontWeight: '400' }}>
                <CountUpStat value={stat.value} />
              </h3>
              <p style={{ fontSize: '18px', color: '#1F3D3F', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>{stat.label}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img 
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                  alt="divider" 
                  style={{ width: '60px', height: 'auto', marginBottom: '10px' }} 
                />
                <p style={{ fontSize: '12px', color: '#777', fontFamily: "'Lato', sans-serif", maxWidth: '180px', lineHeight: '1.6' }}>
                  Experience Compassionate Care Healthier Care Certified Brighter Smile.
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          h2 { font-size: 36px !important; }
          p { font-size: 18px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
