"use client";
import React from 'react';

// YouTube/Shorts Style Play Icon
const PlayIcon = () => (
  <div style={{
    width: '60px',
    height: '60px',
    backgroundColor: '#FF0000',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(255,0,0,0.3)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  }} className="play-btn-hover">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
           <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Icon.svg" alt="G" style={{ width: '16px' }} />
           <span style={{ fontSize: '8px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Posted on</span>
        </div>
        <span style={{ fontSize: '8px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Google</span>
      </div>
    </div>
  </div>
);

const VideoCard = ({ name, image, height = "400px" }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: height,
    borderRadius: '30px',
    overflow: 'hidden',
    marginBottom: '24px',
    cursor: 'pointer'
  }}>
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
      <PlayIcon />
      <div style={{ height: '20px' }}></div> {/* Spacer */}
    </div>
  </div>
);

const TestimonialSection = () => {
  return (
    <section className="testimonials-grid-section" style={{ padding: '100px 5%', backgroundColor: '#fff' }}>
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
            <VideoCard name="Real Results Story" image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop" height="450px" />
            <ReviewCard name="Ravi Malik" text="The result of laser treatment is very nice. I have tried LHR from different places but find this the best." />
          </div>

          {/* Column 2 - Staggered Down */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
            <VideoCard name="Tanvi&apos;s Hydration" image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787&auto=format&fit=crop" height="480px" />
            <ReviewCard name="Priya Sharma" text="Today is the first session of slimming the abdomen, and love handles inch loss. I am totally satisfied with service." />
            <ReviewCard name="Vikas sharma" text="I really liked the way you handled that unwanted hair on my body. Avataar, you made it all so simple and quick" />
          </div>

          {/* Column 3 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ReviewCard name="Sneha Aggrawal" text="I highly recommend their services to anyone looking to enhance their natural beauty and enjoy a moment of relaxation." />
            <VideoCard name="Kritika Kamra S" image="https://images.unsplash.com/photo-1595959183082-c8a00e74dc7d?q=80&w=1964&auto=format&fit=crop" height="450px" />
            <ReviewCard name="Rahul Tomar" text="The results exceeded my expectations, and I felt pampered without the hassle of traveling to a salon." />
          </div>

          {/* Column 4 - Staggered Down */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
            <VideoCard name="Shweta Tiwari" image="https://images.unsplash.com/photo-1596415307505-101f0a4421e7?q=80&w=1740&auto=format&fit=crop" height="480px" />
            <ReviewCard name="Priyal Sen" text="The procedure was quick, comfortable... I&apos;ve already started noticing positive changes since my first session." />
            <ReviewCard name="Viihan Rath" text="The technician was very skilled, gentle, and made sure I was comfortable throughout the session." />
          </div>

          {/* Column 5 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ReviewCard name="Simran Paul" text="I&apos;ve had a great experience with my laser hair reduction sessions. My therapist is highly professional and gentle." />
            <VideoCard name="Influencer Dish" image="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop" height="450px" />
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

      <style jsx>{`
        .testimonial-staggered-grid {
          transition: all 0.5s ease;
        }
        .play-btn-hover:hover {
          transform: scale(1.1);
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
            gap: 0;
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
