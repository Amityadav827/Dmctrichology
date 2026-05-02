"use client";
import React from 'react';

export default function Footer() {
  const hairTransplants = [
    "Hair Transplant In Delhi",
    "Hair Transplant Cost In Delhi",
    "FUE Hair Transplant",
    "Body Hair Transplant",
    "Beard Hair Transplant",
    "Women Hair Transplant",
    "Repair Hair Transplant",
    "DMC – Golden Touch",
    "Hair Transplant In India",
    "Hair Transplant Cost In India"
  ];

  const hairTreatments = [
    "DMC-Mesogrow",
    "DMC- Root Restore therapy®",
    "DMC- Advance HGP®",
    "DMC-Advanced HGP 2.0 ®",
    "DMC- Keravive Hair",
    "DMC- Hair Rituals",
    "GFC Hair Restoration"
  ];

  const socialIcons = [
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/jkidxsr5nbpwq7y7x0x0.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png",
    "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png"
  ];

  return (
    <footer style={{ width: '100%', fontFamily: "'Lato', sans-serif" }}>
      
      {/* Top Footer Section (Beige) */}
      <div style={{ backgroundColor: '#F9F4EA', padding: '100px 5% 180px 5%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          
          {/* Column 1: Hair Transplant */}
          <div>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '30px', fontWeight: '400', letterSpacing: '0.5px' }}>HAIR TRANSPLANT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {hairTransplants.map((item, i) => (
                <li key={i} style={{ marginBottom: '14px' }}>
                  <a href="#" style={{ color: '#444', fontSize: '15px', textDecoration: 'none', transition: 'color 0.3s', fontWeight: '400' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Hair Treatments */}
          <div>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '30px', fontWeight: '400', letterSpacing: '0.5px' }}>HAIR TREATMENTS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {hairTreatments.map((item, i) => (
                <li key={i} style={{ marginBottom: '14px' }}>
                  <a href="#" style={{ color: '#444', fontSize: '15px', textDecoration: 'none', transition: 'color 0.3s', fontWeight: '400' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '30px', fontWeight: '400', letterSpacing: '0.5px' }}>CONTACT US</h4>
            <div style={{ color: '#444', fontSize: '15px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '18px' }}>Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India</p>
              <p style={{ marginBottom: '18px' }}>Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India</p>
              <p style={{ marginBottom: '10px' }}>+91-8527830194,</p>
              <p style={{ marginBottom: '18px' }}>+91-9810939319</p>
              <p>info@dadumedicalcentre.com</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Area */}
        <div style={{ maxWidth: '1400px', margin: '80px auto 0 auto', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '25px', textAlign: 'right' }}>
           <p style={{ fontSize: '12px', color: '#888', maxWidth: '480px', marginLeft: 'auto', lineHeight: '1.5' }}>
            <strong>Disclaimer:</strong> Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.
          </p>
        </div>
      </div>

      {/* Bottom Footer Section (Black) */}
      <div style={{ backgroundColor: '#000', padding: '0 5% 30px 5%', position: 'relative' }}>
        
        {/* Overlap Card (Centered Horizontally) */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'relative',
          top: '-140px', // 40-50% overlap
          marginBottom: '-80px' // Compensate for the top shift
        }}>
          <div style={{ 
            backgroundColor: '#FEF9F1', 
            borderRadius: '40px', 
            padding: '70px 80px', // Increased internal padding
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '1000px', // Increased card width
            zIndex: '20' 
          }}>
            <h2 style={{ fontSize: '36px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '20px', fontWeight: '400' }}>
              Stay Connected With Expert Care Support
            </h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '40px', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto 40px auto' }}>
              We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.
            </p>

            {/* Newsletter Input */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: '#000', 
              borderRadius: '60px', 
              padding: '8px',
              marginBottom: '20px',
              alignItems: 'center',
              maxWidth: '650px',
              margin: '0 auto 20px auto'
            }}>
              <input 
                type="email" 
                placeholder="Your Email Adress" 
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  border: 'none', 
                  padding: '12px 30px', 
                  color: '#fff', 
                  fontSize: '15px',
                  outline: 'none'
                }} 
              />
              <button style={{ 
                backgroundColor: '#fff', 
                color: '#000', 
                border: 'none', 
                borderRadius: '50px', 
                padding: '14px 35px', 
                fontWeight: '600', 
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                Submit
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777703175/dmc-trichology/vj4qbxtxftqzqslowwgd.png" alt="arrow" style={{ width: '24px' }} />
              </button>
            </div>

            {/* Subscription Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '45px' }}>
              <input type="checkbox" id="subscribe" style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
              <label htmlFor="subscribe" style={{ fontSize: '14px', color: '#444', cursor: 'pointer' }}>Subscribe For Health Tips & Updates</label>
            </div>

            {/* Contact Info Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="phone" style={{ width: '32px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#1C1C1C' }}>+91-8527830194</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777622110/dmc-trichology/mzd4ynevgozuwiehhwah.png" alt="email" style={{ width: '32px' }} />
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C' }}>Info@Dadumedicalcentre.Com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo and About Section (Left Aligned) */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png" alt="logo" style={{ width: '200px', marginBottom: '35px' }} />
          
          <h5 style={{ color: '#fff', fontSize: '15px', letterSpacing: '1.5px', marginBottom: '20px', fontWeight: '500', fontFamily: "'Marcellus', serif" }}>ABOUT DMC TRICHOLOGY</h5>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '500px', lineHeight: '1.8', marginBottom: '40px' }}>
            One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures.
          </p>
          
          {/* Social Icons - One Row, Evenly Spaced */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
            {socialIcons.map((url, i) => (
              <a key={i} href="#" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <img src={url} alt="social" style={{ width: '24px' }} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider Line */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0 auto 30px auto', maxWidth: '1400px' }}></div>

        {/* Bottom Footer Alignment */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>© 2024 . All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '25px', fontSize: '14px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Terms And Condition</a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
}
