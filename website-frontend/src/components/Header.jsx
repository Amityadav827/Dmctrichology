"use client";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchSiteSettings } from '../services/api';

export default function Header() {
  const [logoUrl, setLogoUrl] = useState('http://dmctrichology-1.onrender.com/uploads/gallery/logo-1777456606992.png');

  useEffect(() => {
    fetchSiteSettings().then(data => {
      if(data && data.logo) setLogoUrl(data.logo);
    });
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src={logoUrl} alt="Logo" />
      </div>
      
      <Navbar />

      <div className="header-right" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
        <a href="#book" className="btn-primary">
          Book Appointment 
          <div className="icon-circle">
            <img src="http://dmctrichology-1.onrender.com/uploads/gallery/book-appointment-arrow-1777456775616.png" alt="arrow" style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
          </div>
        </a>
      </div>
    </header>
  );
}
