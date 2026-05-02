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
      <div style={{ backgroundColor: '#F9F4EA', padding: '80px 5% 150px 5%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
          
          {/* Column 1: Hair Transplant */}
          <div>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>HAIR TRANSPLANT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {hairTransplants.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#444', fontSize: '14px', textDecoration: 'none', transition: 'color 0.3s' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Hair Treatments */}
          <div>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>HAIR TREATMENTS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {hairTreatments.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{ color: '#444', fontSize: '14px', textDecoration: 'none', transition: 'color 0.3s' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div style={{ position: 'relative' }}>
            <h4 style={{ fontSize: '18px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '25px', fontWeight: '400' }}>CONTACT US</h4>
            <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '15px' }}>Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India</p>
              <p style={{ marginBottom: '15px' }}>Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India</p>
              <p style={{ marginBottom: '8px' }}>+91-8527830194,</p>
              <p style={{ marginBottom: '15px' }}>+91-9810939319</p>
              <p>info@dadumedicalcentre.com</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Area - Updated to 30% width and right aligned */}
        <div style={{ width: '30%', marginLeft: 'auto', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '25px 0', margin: '60px 0 0 auto' }}>
           <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', textAlign: 'right' }}>
            <strong>Disclaimer:</strong> Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.
          </p>
        </div>
      </div>

      {/* Bottom Footer Section (Black) */}
      <div style={{ backgroundColor: '#000', padding: '0 5% 0 5%', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Left Side: Logo & About - Flexed Side by Side */}
          <div style={{ flex: '2', minWidth: '500px', paddingTop: '80px', paddingBottom: '60px', display: 'flex', alignItems: 'center', gap: '40px' }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png" 
              alt="logo" 
              style={{ width: '220px', flexShrink: 0 }} 
            />
            <div>
              <h5 style={{ color: '#fff', fontSize: '15px', letterSpacing: '1.5px', marginBottom: '15px', fontWeight: '500', fontFamily: "'Marcellus', serif" }}>ABOUT DMC TRICHOLOGY</h5>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', maxWidth: '450px', lineHeight: '1.7', marginBottom: '25px' }}>
                One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures.
              </p>
              
              {/* Social Icons - Circle Styles Removed, Size Increased to 40px */}
              <div style={{ display: 'flex', gap: '20px' }}>
                {socialIcons.map((url, i) => (
                  <a key={i} href="#" style={{ textDecoration: 'none' }}>
                    <img src={url} alt="social" style={{ width: '40px' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Overlap Card */}
          <div style={{ 
            flex: '1', 
            minWidth: '350px', 
            maxWidth: '850px',
            marginTop: '-120px', 
            zIndex: '10' 
          }}>
            <div style={{ 
              backgroundColor: '#FEF9F1', 
              borderRadius: '40px', 
              padding: '60px 50px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '32px', color: '#1C1C1C', fontFamily: "'Marcellus', serif", marginBottom: '20px', fontWeight: '400' }}>
                Stay Connected With Expert Care Support
              </h2>
              <p style={{ fontSize: '15px', color: '#555', marginBottom: '35px', lineHeight: '1.6' }}>
                We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.
              </p>

              {/* Newsletter Input */}
              <div style={{ 
                display: 'flex', 
                backgroundColor: '#000', 
                borderRadius: '50px', 
                padding: '6px',
                marginBottom: '20px',
                alignItems: 'center'
              }}>
                <input 
                  type="email" 
                  placeholder="Your Email Adress" 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '12px 25px', 
                    color: '#fff', 
                    fontSize: '14px',
                    outline: 'none'
                  }} 
                />
                <button style={{ 
                  backgroundColor: '#fff', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '50px', 
                  padding: '12px 30px', 
                  fontWeight: '600', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  Submit
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777703175/dmc-trichology/vj4qbxtxftqzqslowwgd.png" alt="arrow" style={{ width: '24px' }} />
                </button>
              </div>

              {/* Subscription Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '35px' }}>
                <input type="checkbox" id="subscribe" style={{ cursor: 'pointer' }} />
                <label htmlFor="subscribe" style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }}>Subscribe For Health Tips & Updates</label>
              </div>

              {/* Contact Info Pills */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png" alt="phone" style={{ width: '32px' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C' }}>+91-8527830194</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777622110/dmc-trichology/mzd4ynevgozuwiehhwah.png" alt="email" style={{ width: '32px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1C1C' }}>Info@Dadumedicalcentre.Com</span>
                </div>
              </div>

              {/* Card Footer Links */}
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#777' }}>
                 <span>© 2024 . All Rights Reserved.</span>
                 <div style={{ display: 'flex', gap: '15px' }}>
                   <a href="#" style={{ color: '#1C1C1C', textDecoration: 'none' }}>Terms And Condition</a>
                   <span>|</span>
                   <a href="#" style={{ color: '#1C1C1C', textDecoration: 'none' }}>Privacy Policy</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
