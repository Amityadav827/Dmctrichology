"use client";
import React from 'react';

const EnquirySection = () => {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";
  
  return (
    <section className="enquiry-section" style={{ padding: '100px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
        
        {/* Left: Info and Form */}
        <div style={{ flex: '1 1 600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <img src={iconUrl} alt="icon" style={{ width: '40px', height: 'auto' }} />
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1C1C1C', fontFamily: "'Marcellus', serif" }}>TRUSTED CARE SERVICES</span>
          </div>
          <h2 style={{ fontSize: '44px', color: '#000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '40px' }}>Request A Free <br />Consultation Today</h2>

          {/* Contact Info Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#FEF0D7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="phone" style={{ width: '20px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#777', fontFamily: "'Lato', sans-serif" }}>Phone number</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#000', fontFamily: "'Lato', sans-serif" }}>+91 12345 67890</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#FEF0D7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png" alt="timing" style={{ width: '20px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#777', fontFamily: "'Lato', sans-serif" }}>Mon to Sat</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#000', fontFamily: "'Lato', sans-serif" }}>10:00 AM - 08:00 PM</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
               <input type="text" placeholder="Full Name*" style={{ width: '100%', padding: '15px 20px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: '#F9F9F9', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div>
               <input type="text" placeholder="Phone Number*" style={{ width: '100%', padding: '15px 20px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: '#F9F9F9', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
            </div>
            <div style={{ position: 'relative' }}>
               <select style={{ width: '100%', padding: '15px 20px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: '#F9F9F9', outline: 'none', fontFamily: "'Lato', sans-serif", appearance: 'none' }}>
                 <option>Type of service enquiry*</option>
                 <option>Hair Transplant</option>
                 <option>FUE Technique</option>
                 <option>Scalp Treatment</option>
               </select>
               <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '16px' }} alt="icon" />
            </div>
            <div style={{ gridColumn: 'span 2', position: 'relative' }}>
               <input type="text" placeholder="Select Date & Time*" style={{ width: '100%', padding: '15px 20px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: '#F9F9F9', outline: 'none', fontFamily: "'Lato', sans-serif" }} />
               <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/bze1cv4xanahe5dvljhb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '16px' }} alt="icon" />
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <button style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '30px', 
                backgroundColor: '#1F3D3F', 
                color: '#fff', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontFamily: "'Lato', sans-serif"
              }}>Submit Now</button>
            </div>
          </form>
        </div>

        {/* Right: Image */}
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" 
            alt="Enquiry" 
            style={{ width: '100%', height: 'auto', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} 
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
