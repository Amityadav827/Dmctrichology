"use client";
import { useEffect, useState } from 'react';
import { fetchMenu } from '../services/api';
import { ChevronDown, Menu as MenuIcon } from 'lucide-react';

export default function Navbar() {
  const [menuItems, setMenuItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchMenu().then(data => {
      if(data && data.length > 0) {
        setMenuItems(data);
      } else {
        // Fallback
        setMenuItems([
          { label: 'Home', link: '/' },
          { label: 'About', link: '/about', dropdown: [{label: 'Our Story', link: '#'}] },
          { label: 'Pages', link: '#', dropdown: [{label: 'Page 1', link: '#'}, {label: 'Page 2', link: '#'}] },
          { label: 'Services', link: '/services' },
          { label: 'Blog', link: '/blog' },
          { label: 'Contact', link: '/contact' }
        ]);
      }
    });
  }, []);

  return (
    <>
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item, i) => (
          <div key={i} className="nav-item" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <a href={item.link}>
              {item.label}
            </a>
            {item.dropdown && <ChevronDown size={14} />}
            {item.dropdown && (
              <div className="dropdown-menu">
                {item.dropdown.map((sub, j) => (
                  <a key={j} href={sub.link} className="dropdown-item">{sub.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
