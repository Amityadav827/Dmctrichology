"use client";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchSiteSettings } from '../services/api';

export default function Header() {
  const [logoUrl, setLogoUrl] = useState('https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png');

  useEffect(() => {
    fetchSiteSettings().then(data => {
      if(data && data.logo) setLogoUrl(data.logo);
    });
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logoUrl} alt="Logo" />
        </div>
        
        <Navbar />

        <div className="header-right" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <a href="#book" className="btn-primary" style={{ backgroundColor: '#000000', color: '#ffffff', borderRadius: '50px', padding: '10px 10px 10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'none' }}>
            <span style={{ fontFamily: "'Marcellus', serif" }}>Book Appointment</span>
            <div className="icon-circle" style={{ width: '32px', height: '32px', backgroundColor: '#ffffff' }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png" alt="arrow" style={{ width: '12px', height: '12px', objectFit: 'contain', filter: 'brightness(0)' }} />
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
