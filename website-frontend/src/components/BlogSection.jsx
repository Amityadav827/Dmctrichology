"use client";
import React from 'react';
// Force build update for blog images

export default function BlogSection() {
  const blogs = [
    {
      date: "May 9, 2025",
      image: "http://dmctrichology-1.onrender.com/uploads/gallery/frame-134637-1778052227822.png",
      author: "Dr. Alisha Verma, Physiotherapist",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/xfi18qjzfi3nlsrf4taa.png",
      title: "PRP Hair Treatment – How Many Sessions Needed?",
      link: "#"
    },
    {
      date: "May 9, 2025",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777639995/dmc-trichology/zsnaxe1vrwm9mzu278tn.png",
      author: "Dr. Meera Joshi, Posture & Spine",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/hkpas8djntgu0tkj5mpe.png",
      title: "Best Shampoo For Hair Fall — What Actually Helps And Why Most People Are Looking In The Wrong Place",
      link: "#",
      isActive: true
    },
    {
      date: "May 9, 2025",
      image: "http://dmctrichology-1.onrender.com/uploads/gallery/frame-134664-1778052226564.png",
      author: "Dr. Rahul Kapoor, Neuro & Expert",
      authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/xfi18qjzfi3nlsrf4taa.png",
      title: "Hair Regrowth Timeline — What To Realistically Expect And When To Actually See Results",
      link: "#"
    }
  ];

  return (
    <section>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
             <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
             <span className="section-subtitle">OUR LATEST BLOGS</span>
          </div>
          <h2 className="section-title">News & Wellness Advice</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '15px', color: '#666', fontFamily: "'Marcellus', serif", lineHeight: '1.6' }}>
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
                  fontFamily: "'Marcellus', serif"
                }}>
                  {blog.date}
                </div>
              </div>

              {/* Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div>
                   <img src={blog.authorIcon} alt="author" style={{ width: '32px' }} />
                </div>
                <span style={{ fontSize: '16px', color: blog.isActive ? 'rgba(255,255,255,0.7)' : '#666', fontFamily: "'Marcellus', serif" }}>
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
                  fontFamily: "'Marcellus', serif", 
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
          <button className="view-all-blogs-btn" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 15px 10px 25px',
            borderRadius: '50px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#fff',
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: "'Marcellus', serif",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            zIndex: 1
          }}>
            View All
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" 
              className="btn-arrow"
              alt="arrow" 
              style={{ width: '32px', height: '32px', transition: 'all 0.3s ease' }} 
            />
          </button>
        </div>

      </div>

      <style jsx>{`
        .view-all-blogs-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
          border-color: #ddd !important;
        }
        .view-all-blogs-btn:hover .btn-arrow {
          transform: translateX(8px);
        }
        @media (max-width: 768px) {
          section { padding: 60px 5% !important; }
        }
      `}</style>
    </section>
  );
}
