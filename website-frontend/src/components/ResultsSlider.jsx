"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const resultsData = [
  {
    id: 1,
    title: 'Korean Facial Illumination',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png',
    sessions: 'After 6 sessions'
  },
  {
    id: 2,
    title: 'Acne Arrestor Facial With Salicylic Peel',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png',
    sessions: 'After 4 sessions'
  },
  {
    id: 3,
    title: 'Elastin Boost Facial',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png',
    sessions: 'After 5 sessions'
  },
  {
    id: 4,
    title: 'Derma Revive Facial',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png',
    sessions: 'After 4 sessions'
  },
  // Duplicating for loop functionality with slidesPerView 4
  {
    id: 5,
    title: 'Korean Facial Illumination',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png',
    sessions: 'After 6 sessions'
  },
  {
    id: 6,
    title: 'Acne Arrestor Facial With Salicylic Peel',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png',
    sessions: 'After 4 sessions'
  },
  {
    id: 7,
    title: 'Elastin Boost Facial',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png',
    sessions: 'After 5 sessions'
  },
  {
    id: 8,
    title: 'Derma Revive Facial',
    beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png',
    afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png',
    sessions: 'After 4 sessions'
  }
];



export default function ResultsSlider() {
  return (
    <section className="results-section" style={{ backgroundColor: '#FFFAF1', padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
      <div className="results-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="section-header" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
             <img 
               src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
               alt="icon" 
               style={{ width: '50px', height: 'auto' }} 
             />
             <span className="section-subtitle">BEFORE AND AFTER</span>
          </div>
          <h2 className="section-title">Results that speak for themselves</h2>
        </div>


        <div className="slider-wrapper" style={{ position: 'relative' }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = '.results-prev-btn';
              swiper.params.navigation.nextEl = '.results-next-btn';
            }}
            navigation={{
              nextEl: '.results-next-btn',
              prevEl: '.results-prev-btn',
            }}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
            className="results-swiper"
            style={{ padding: '20px 0 60px' }}
          >

            {resultsData.map((result) => (
              <SwiperSlide key={result.id}>
                <div className="result-card" style={{ 
                  backgroundColor: '#FBEED7', 
                  borderRadius: '16px', 
                  padding: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s ease'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    marginBottom: '24px', 
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: '600',
                    color: '#1F3D3F',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.4'
                  }}>
                    {result.title}
                  </h3>

                  
                  <div className="images-container" style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    width: '100%',
                    marginBottom: '20px'
                  }}>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                      <img 
                        src={result.beforeImg} 
                        alt={`${result.title} Before`} 
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '0', 
                        right: '0', 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        color: '#fff', 
                        fontSize: '12px',
                        padding: '10px 0',
                        fontWeight: '500'
                      }}>Before</div>
                    </div>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                      <img 
                        src={result.afterImg} 
                        alt={`${result.title} After`} 
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '0', 
                        right: '0', 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        color: '#fff', 
                        fontSize: '12px',
                        padding: '10px 0',
                        fontWeight: '500'
                      }}>After</div>
                    </div>
                  </div>
                  
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#666', 
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: '500'
                  }}>
                    {result.sessions}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="results-prev-btn" style={{
            position: 'absolute',
            left: '-25px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            color: '#1F3D3F',
            transition: 'all 0.3s ease'
          }}>
            <ChevronLeft size={24} />
          </button>
          <button className="results-next-btn" style={{
            position: 'absolute',
            right: '-25px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            color: '#1F3D3F',
            transition: 'all 0.3s ease'
          }}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .results-prev-btn:hover, .results-next-btn:hover {
          background-color: #000 !important;
          color: #fff !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .result-card:hover {
          transform: translateY(-10px);
        }
        @media (max-width: 1024px) {
          .results-prev-btn, .results-next-btn {
            display: none !important;
          }
          .results-section {
            padding: 60px 5% !important;
          }
        }
      `}</style>
    </section>
  );
}
