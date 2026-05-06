"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const gradeData = [
  {
    id: 1,
    grade: 'GRADE 1',
    displayNum: '1',
    area: '20 cm²',
    density: '40/cm²',
    grafts: '800',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/s4afgaemlnxgpza6klc2.png'
  },
  {
    id: 2,
    grade: 'GRADE 2',
    displayNum: '2',
    area: '40 cm²',
    density: '40/cm²',
    grafts: '1600',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/txprqtwbqrckrqbbtkbm.png'
  },
  {
    id: 3,
    grade: 'GRADE 3',
    displayNum: '3',
    area: '60 cm²',
    density: '40/cm²',
    grafts: '2400',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/lm1wuhdnisarojusnl1c.png'
  },
  {
    id: 4,
    grade: 'GRADE 4',
    displayNum: '4',
    area: '80 cm²',
    density: '40/cm²',
    grafts: '3200',
    session: '1-2',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/fnby98gc9fgctznkbpdt.png'
  },
  {
    id: 5,
    grade: 'GRADE 5',
    displayNum: '5',
    area: '100 cm²',
    density: '40/cm²',
    grafts: '4000',
    session: '2',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/r3etpyboaedgq8gizzpc.png'
  }
];

export default function GradeSlider() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // If nothing is hovered, index 1 (Grade 2) is flipped
  const activeFlippedIndex = hoveredIndex !== null ? hoveredIndex : 1;

  return (
    <section className="grade-section" style={{ backgroundColor: '#000', padding: '60px 5%', position: 'relative', overflow: 'hidden' }}>
      <div className="grade-header" style={{ marginBottom: '40px', maxWidth: '1400px', margin: '0 auto 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
           <img 
             src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
             alt="icon" 
             style={{ width: '40px', height: 'auto' }} 
           />
           <span className="section-subtitle" style={{ color: '#ffffff !important' }}>EQUIP YOUR RECOVERY</span>
        </div>
        <h2 className="section-title" style={{ color: '#fff !important' }}>Know Your Grade For Hair Transplant</h2>
      </div>

      <div className="slider-container" style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          navigation={{
            nextEl: '.grade-next-btn',
            prevEl: '.grade-prev-btn',
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
          className="grade-swiper"
          style={{ padding: '10px 0' }}
        >
          {gradeData.map((item, index) => (
            <SwiperSlide key={item.id}>
              <div 
                className="flip-card"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  perspective: '1500px',
                  height: '320px',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className={`flip-card-inner ${activeFlippedIndex === index ? 'is-flipped' : ''}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Front Side */}
                  <div className="flip-card-front" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#FFFAF1',
                    borderRadius: '25px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img src={item.image} alt={item.grade} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#FFFAF1',
                    borderRadius: '25px',
                    padding: '25px 20px',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#333', fontFamily: "'Marcellus', serif" }}>{item.grade}</span>
                      <img src={item.image} alt={item.grade} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #F09819' }} />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                        <span style={{ color: '#666', fontSize: '13px' }}>Approx Area</span>
                        <span style={{ fontWeight: '600', color: '#333', fontSize: '13px' }}>{item.area}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                        <span style={{ color: '#666', fontSize: '13px' }}>Avg. Density</span>
                        <span style={{ fontWeight: '600', color: '#333', fontSize: '13px' }}>{item.density}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', backgroundColor: '#FBEED7', margin: '8px -5px', paddingLeft: '5px', paddingRight: '5px', borderRadius: '6px' }}>
                        <span style={{ color: '#666', fontSize: '13px' }}>No. of Grafts</span>
                        <span style={{ fontWeight: '700', color: '#F09819', fontSize: '13px' }}>{item.grafts}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ color: '#666', fontSize: '13px' }}>Session</span>
                        <span style={{ fontWeight: '600', color: '#333', fontSize: '13px' }}>{item.session}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          <button className="grade-prev-btn" style={{
            background: 'transparent',
            border: 'none',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/apdtgxwhhkwjz2c6l7lv.png" 
              alt="Prev" 
              style={{ width: '100%', height: 'auto' }} 
            />
          </button>
          <button className="grade-next-btn" style={{
            background: 'transparent',
            border: 'none',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}>
            <img 
              src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" 
              alt="Next" 
              style={{ width: '100%', height: 'auto' }} 
            />
          </button>

        </div>
      </div>

      <style jsx>{`
        .grade-prev-btn:hover, .grade-next-btn:hover {
          transform: scale(1.1);
        }
        .is-flipped {
          transform: rotateY(180deg);
        }
        @media (max-width: 1024px) {
          .grade-section { padding-top: 60px !important; padding-bottom: 60px !important; }
        }
      `}</style>
    </section>
  );
}
