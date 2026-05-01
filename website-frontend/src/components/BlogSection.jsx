"use client";
import React from 'react';

export default function BlogSection() {
  const blogs = [
    {
      date: "May 9, 2025",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777614507/dmc-trichology/nfk4apuep0hexzvztq70.png", // Placeholder until user provides images
      author: "Dr. Alisha Verma, Physiotherapist",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png",
      title: "PRP Hair Treatment – How Many Sessions Needed?",
      link: "#"
    },
    {
      date: "May 9, 2025",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777614507/dmc-trichology/faxp8cvrttxpt3w38asw.png",
      author: "Dr. Meera Joshi, Posture & Spine",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png",
      title: "Best Shampoo For Hair Fall — What Actually Helps And Why Most People Are Looking In The Wrong Place",
      link: "#",
      isActive: true
    },
    {
      date: "May 9, 2025",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777614507/dmc-trichology/uwcoyjbmka6mtnpxif4t.png",
      author: "Dr. Rahul Kapoor, Neuro & Expert",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623764/dmc-trichology/onx0emcsxjwpat8uk5i4.png",
      title: "Hair Regrowth Timeline — What To Realistically Expect And When To Actually See Results",
      link: "#"
    }
  ];

  return (
    <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
             <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
             <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1C1C1C', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Marcellus', serif" }}>OUR LATEST BLOGS</span>
          </div>
          <h2 style={{ fontSize: '48px', color: '#000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '20px' }}>News & Wellness Advice</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '15px', color: '#666', fontFamily: "'Lato', sans-serif", lineHeight: '1.6' }}>
            Our Expert Therapists Work With You To Create Tailored Recovery Plans That Target Your Specific Needs And Goals.
          </p>
        </div>

        {/* Blog Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
          {blogs.map((blog, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: blog.isActive ? '#000' : '#F9F7F2',
                borderRadius: '40px',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: blog.isActive ? 'none' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', marginBottom: '25px' }}>
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '30px' }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '20px', 
                  backgroundColor: blog.isActive ? 'rgba(255,255,255,0.9)' : '#000', 
                  color: blog.isActive ? '#000' : '#fff', 
                  padding: '6px 20px', 
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  {blog.date}
                </div>
              </div>

              {/* Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: blog.isActive ? '#fff' : '#000', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                   <img src={blog.authorIcon} alt="author" style={{ width: '18px', filter: blog.isActive ? 'none' : 'invert(1)' }} />
                </div>
                <span style={{ fontSize: '13px', color: blog.isActive ? 'rgba(255,255,255,0.7)' : '#666', fontFamily: "'Lato', sans-serif" }}>
                  {blog.author}
                </span>
              </div>

              <h3 style={{ 
                fontSize: '24px', 
                color: blog.isActive ? '#fff' : '#000', 
                fontFamily: "'Marcellus', serif", 
                fontWeight: '400', 
                marginBottom: '20px',
                lineHeight: '1.3',
                flexGrow: 1
              }}>
                {blog.title}
              </h3>

              <a 
                href={blog.link} 
                style={{ 
                  fontSize: '14px', 
                  color: blog.isActive ? '#fff' : '#000', 
                  fontFamily: "'Lato', sans-serif", 
                  textDecoration: 'underline',
                  fontWeight: 'bold'
                }}
              >
                Explore More
              </a>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 40px',
            borderRadius: '50px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#fff',
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'Marcellus', serif"
          }}>
            View All
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: 'rotate(-45deg)'
            }}>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" alt="arrow" style={{ width: '24px' }} />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
