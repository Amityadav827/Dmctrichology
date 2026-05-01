"use client";
import React from 'react';

const EnquirySection = () => {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";
  
  return (
    <section className="enquiry-section" style={{ padding: '100px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Row: Info Left, Form Right */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '60px', marginBottom: '60px' }}>
          
          {/* Header and Contact Info */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img src={iconUrl} alt="icon" style={{ width: '40px', height: 'auto' }} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1C1C1C', fontFamily: "'Marcellus', serif" }}>WHY CHOOSE US SERVICES</span>
            </div>
            <h2 style={{ fontSize: '44px', color: '#000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '10px' }}>REQUEST A <br />CONSULTATION</h2>
            <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Lato', sans-serif", marginBottom: '30px' }}>Clinic Timings ( By Appointments Only)</p>

            {/* Contact Info Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              {[
                { label: 'Phone Number', value: '+91-8527830194', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png' },
                { label: 'Service Timing ( Mon To Sat )', value: '9:00 AM To 8:00 PM', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png' },
                { label: 'Service Timing ( Sunday )', value: '10:00 AM To 7:00 PM', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png' }
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: i > 0 ? '1px solid #ddd' : 'none', paddingLeft: i > 0 ? '30px' : '0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '35px', height: '35px', backgroundColor: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={item.icon} alt="icon" style={{ width: '16px', filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', fontFamily: "'Lato', sans-serif" }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#000', fontFamily: "'Lato', sans-serif" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: '1 1 500px' }}>
            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                 <input type="text" placeholder="Name*" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
              </div>
              <div>
                 <input type="email" placeholder="E-Mail Address*" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
              </div>
              <div style={{ position: 'relative' }}>
                 <select style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Lato', sans-serif", appearance: 'none' }}>
                   <option>Type Of Service Enquiry*</option>
                 </select>
                 <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '16px' }} alt="icon" />
              </div>
              <div style={{ position: 'relative' }}>
                 <input type="text" placeholder="Select Date & Time*" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
                 <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/bze1cv4xanahe5dvljhb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '16px' }} alt="icon" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <textarea placeholder="Enter Your Message Here*" style={{ width: '100%', padding: '20px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Lato', sans-serif", minHeight: '120px', resize: 'none' }}></textarea>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: '30px', 
                  backgroundColor: '#000', 
                  color: '#fff', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  fontFamily: "'Marcellus', serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  Schedule Your Visit
                  <div style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#000'
                  }}>
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" style={{ width: '14px', transform: 'rotate(-45deg)' }} alt="arrow" />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Row: Full Width Image */}
        <div style={{ width: '100%' }}>
          <img 
            src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" 
            alt="Consultation Result" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '40px' }} 
          />
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .enquiry-section { padding: 60px 5% !important; }
          h2 { font-size: 36px !important; }
        }
        @media (max-width: 640px) {
          form { grid-template-columns: 1fr !important; }
          form div { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
};

export default EnquirySection;
