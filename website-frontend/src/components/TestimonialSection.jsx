"use client";
import React, { useState } from 'react';

const ReviewCard = ({ name, text }) => (
  <div style={{
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    marginBottom: '24px',
    textAlign: 'left',
    border: '1px solid #f0f0f0'
  }}>
    <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: '#E4B753', fontSize: '18px' }}>★</span>
      ))}
    </div>
    <p style={{ 
      fontSize: '14px', 
      color: '#444', 
      lineHeight: '1.6', 
      marginBottom: '20px',
      fontFamily: "'Lato', sans-serif" 
    }}>
      {text}
    </p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>- {name}.</span>
      <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777721827/dmc-trichology/ju75pcuuqsccgndqvnno.png" alt="Google Review" style={{ height: '35px' }} />
    </div>
  </div>
);

const VideoCard = ({ name, image, height = "400px", onPlay }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: height,
    borderRadius: '30px',
    overflow: 'hidden',
    marginBottom: '24px',
    cursor: 'pointer'
  }} onClick={onPlay}>
    <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px',
      alignItems: 'center'
    }}>
      <h4 style={{ color: '#fff', fontSize: '20px', fontFamily: "'Marcellus', serif", fontWeight: '400', textAlign: 'center' }}>{name}</h4>
      <div style={{ height: '20px' }}></div>
    </div>
  </div>
);

const TestimonialSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const closeVideo = () => setActiveVideo(null);

  return (
    <section className="testimonials-grid-section" style={{ padding: '0 5% 100px 5%', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1450px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
             <div style={{ width: '40px', height: '2px', backgroundColor: '#E4B753' }}></div>
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E4B753' }}></div>
             <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1C1C1C', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: "'Marcellus', serif" }}>REVIEWS</span>
          </div>
          <h2 style={{ fontSize: '48px', color: '#000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '10px' }}>
            See the Results. Hear the Stories.
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', color: '#666' }}>7000+ Reviews on</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" style={{ width: '80px', marginTop: '4px' }} />
          </div>
        </div>

        {/* Staggered Grid */}
        <div className="testimonial-staggered-grid" style={{ 
          display: 'flex', 
          gap: '24px', 
          alignItems: 'flex-start'
        }}>
          
          {/* Column 1 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ReviewCard name="Anjali Kohli" text="The full body laser session was excellent. The therapist was highly skilled and made the experience comfortable and effective." />
            <VideoCard 
              name="Real Results Story" 
              image="https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/ba79ohixgo962pduymyd.png" 
              height="450px" 
              onPlay={() => setActiveVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
            />
            <ReviewCard name="Ravi Malik" text="The result of laser treatment is very nice. I have tried LHR from different places but find this the best." />
          </div>

          {/* Column 2 - Staggered Down */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
            <VideoCard 
              name="Tanvi&apos;s Hydration" 
              image="https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/u1z7ggmemmekm84ep5hu.png" 
              height="480px" 
              onPlay={() => setActiveVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
            />
            <ReviewCard name="Priya Sharma" text="Today is the first session of slimming the abdomen, and love handles inch loss. I am totally satisfied with service." />
            <ReviewCard name="Vikas sharma" text="I really liked the way you handled that unwanted hair on my body. Avataar, you made it all so simple and quick" />
          </div>

          {/* Column 3 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ReviewCard name="Sneha Aggrawal" text="I highly recommend their services to anyone looking to enhance their natural beauty and enjoy a moment of relaxation." />
            <VideoCard 
              name="Kritika Kamra" 
              image="https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/pgab6yn3skxpsx4oftws.png" 
              height="450px" 
              onPlay={() => setActiveVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
            />
            <ReviewCard name="Rahul Tomar" text="The results exceeded my expectations, and I felt pampered without the hassle of traveling to a salon." />
          </div>

          {/* Column 4 - Staggered Down */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
            <VideoCard 
              name="Shweta Tiwari" 
              image="https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/fgljhvgnh4lyhilbokdf.png" 
              height="480px" 
              onPlay={() => setActiveVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
            />
            <ReviewCard name="Priyal Sen" text="The procedure was quick, comfortable... I&apos;ve already started noticing positive changes since my first session." />
            <ReviewCard name="Viihan Rath" text="The technician was very skilled, gentle, and made sure I was comfortable throughout the session." />
          </div>

          {/* Column 5 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ReviewCard name="Simran Paul" text="I&apos;ve had a great experience with my laser hair reduction sessions. My therapist is highly professional and gentle." />
            <VideoCard 
              name="Influencer Dish" 
              image="https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/o0naqjvopw7otiwdzwsg.png" 
              height="450px" 
              onPlay={() => setActiveVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
            />
            <ReviewCard name="Alka Singh" text="Thank you for the wonderful facial! The entire experience was relaxing and refreshing. You were very professional." />
          </div>

        </div>

        {/* Bottom Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button style={{
            padding: '12px 40px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: '#1C1C1C',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} className="view-all-testimonials-btn">
            View All
          </button>
        </div>

      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={closeVideo}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            aspectRatio: '16/9',
            backgroundColor: '#000',
            borderRadius: '20px',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeVideo}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 10
              }}
            >
              &times;
            </button>
            <iframe 
              width="100%" 
              height="100%" 
              src={`${activeVideo}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <style jsx>{`
        .testimonial-staggered-grid {
          transition: all 0.5s ease;
        }
        .view-all-testimonials-btn:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        @media (max-width: 1200px) {
          .testimonial-staggered-grid > div:nth-child(4),
          .testimonial-staggered-grid > div:nth-child(5) {
            display: none;
          }
        }
        @media (max-width: 992px) {
          .testimonial-staggered-grid > div:nth-child(3) {
            display: none;
          }
          .testimonials-grid-section h2 {
            font-size: 36px !important;
          }
        }
        @media (max-width: 768px) {
          .testimonial-staggered-grid {
            flex-direction: column;
            gap: 20px;
          }
          .testimonial-staggered-grid > div {
            margin-top: 0 !important;
            width: 100%;
          }
          .testimonial-staggered-grid > div:nth-child(2),
          .testimonial-staggered-grid > div:nth-child(3) {
            display: flex;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
