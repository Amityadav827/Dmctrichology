"use client";
import React, { useState, useRef, useEffect } from 'react';

const EnquirySection = () => {
  const iconUrl = "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (e) => {
    setSelectedDateTime(e.target.value);
    // Don't close immediately to let them select time if we had a combined one, 
    // but for simple date input we can.
  };

  return (
    <section className="enquiry-section" style={{ padding: '100px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Row: Info Left, Form Right */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginBottom: '0' }}>
          
          {/* Header and Contact Info */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img src={iconUrl} alt="icon" style={{ width: '40px', height: 'auto' }} />
              <span className="section-subtitle">WHY CHOOSE US SERVICES</span>
            </div>
            <h2 className="section-title">REQUEST A <br />CONSULTATION</h2>
            <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Marcellus', serif", marginBottom: '30px' }}>Clinic Timings ( By Appointments Only)</p>

            {/* Contact Info Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              {[
                { label: 'Phone Number', value: '+91-8527830194', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png' },
                { label: 'Service Timing ( Mon To Sat )', value: '9:00 AM To 8:00 PM', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png' },
                { label: 'Service Timing ( Sunday )', value: '10:00 AM To 7:00 PM', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/tvkpjjjy78damrrfvi57.png' }
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: i > 0 ? '1px solid #ddd' : 'none', paddingLeft: i > 0 ? '30px' : '0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flexShrink: 0 }}>
                    <img src={item.icon} alt="icon" style={{ width: '30px' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', fontFamily: "'Marcellus', serif" }}>{item.label}</p>
                    {item.label === 'Phone Number' ? (
                      <a href={`tel:${item.value}`} style={{ textDecoration: 'none', color: '#000' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#000', fontFamily: "'Marcellus', serif" }}>{item.value}</p>
                      </a>
                    ) : (
                      <p style={{ margin: 0, fontSize: '14px', color: '#000', fontFamily: "'Marcellus', serif" }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: '1 1 400px', paddingTop: '55px', position: 'relative', zIndex: 2 }}>
            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                 <input type="text" placeholder="Name*" className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease' }} />
              </div>
              <div>
                 <input type="email" placeholder="E-Mail Address*" className="premium-input" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease' }} />
              </div>
              <div style={{ position: 'relative' }}>
                 <select className="premium-select" style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", appearance: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                   <option>Type Of Service Enquiry*</option>
                   <option>Hair Transplant</option>
                   <option>Laser Hair Removal</option>
                   <option>Skin Treatment</option>
                   <option>Others</option>
                 </select>
                 <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/qcrzwotm1zyqsdbu6ttb.png" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '12px', pointerEvents: 'none' }} alt="icon" />
              </div>
              <div style={{ position: 'relative' }} ref={calendarRef}>
                 <input 
                   type="text" 
                   placeholder="Select Date & Time*" 
                   readOnly
                   value={selectedDateTime}
                   className="premium-input-readonly" 
                   style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", transition: 'all 0.3s ease', cursor: 'default' }} 
                 />
                 <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="calendar-trigger-btn"
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 5 }}
                 >
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/bze1cv4xanahe5dvljhb.png" style={{ width: '22px', height: '22px', filter: 'invert(1)' }} alt="icon" />
                 </div>

                 {/* Premium Calendar Popup */}
                 {showCalendar && (
                   <div style={{
                     position: 'absolute',
                     top: '110%',
                     right: '0',
                     width: '320px',
                     backgroundColor: '#fff',
                     borderRadius: '20px',
                     boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                     padding: '20px',
                     zIndex: 1000,
                     border: '1px solid #f0f0f0',
                     animation: 'fadeInUp 0.3s ease'
                   }}>
                     <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', fontFamily: "'Marcellus', serif", color: '#333' }}>Schedule Appointment</p>
                     </div>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '5px', fontFamily: "'Marcellus', serif" }}>Pick Date</label>
                          <input 
                            type="date" 
                            onChange={(e) => setSelectedDateTime(prev => e.target.value + (prev.split(' ')[1] ? ' ' + prev.split(' ')[1] : ''))}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #eee', outline: 'none', fontFamily: "'Marcellus', serif" }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '5px', fontFamily: "'Marcellus', serif" }}>Pick Time</label>
                          <input 
                            type="time" 
                            onChange={(e) => setSelectedDateTime(prev => (prev.split(' ')[0] || '') + ' ' + e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #eee', outline: 'none', fontFamily: "'Marcellus', serif" }} 
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowCalendar(false)}
                          style={{ width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Marcellus', serif", fontSize: '14px', marginTop: '5px' }}
                        >
                          Confirm Selection
                        </button>
                     </div>
                   </div>
                 )}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <textarea placeholder="Enter Your Message Here*" className="premium-textarea" style={{ width: '100%', padding: '20px 25px', borderRadius: '30px', border: 'none', backgroundColor: '#F2F2F2', outline: 'none', fontFamily: "'Marcellus', serif", minHeight: '100px', resize: 'none', transition: 'all 0.3s ease' }}></textarea>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <button className="premium-submit-btn" style={{ 
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
                  gap: '15px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  Schedule Your Visit
                  <div style={{ 
                    transform: 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.4s ease'
                  }} className="btn-arrow">
                    <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" style={{ width: '40px' }} alt="arrow" />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Row: Full Width Image with negative margin */}
        <div style={{ width: '100%', marginTop: '-95px', position: 'relative', zIndex: 1 }}>
          <img 
            src="https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" 
            alt="Consultation Result" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '40px' }} 
          />
        </div>

      </div>

      <style jsx>{`
        .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
          background-color: #fff !important;
          box-shadow: 0 0 0 2px #E4B753;
        }
        .premium-input:hover, .premium-select:hover, .premium-textarea:hover {
          background-color: #ededed;
        }
        .calendar-trigger-btn:hover {
          transform: translateY(-50%) scale(1.1) !important;
          background-color: #333 !important;
        }
        .premium-submit-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
          background-color: #1a1a1a;
        }
        .premium-submit-btn:hover .btn-arrow {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        .premium-submit-btn:active {
          transform: translateY(-1px);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .enquiry-section { padding: 60px 5% !important; }
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
