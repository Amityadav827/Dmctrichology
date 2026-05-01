"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const gradeData = [
  {
    id: 1,
    grade: 'GRADE 1',
    area: '20 cm²',
    density: '40/cm²',
    grafts: '800',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/s4afgaemlnxgpza6klc2.png'
  },
  {
    id: 2,
    grade: 'GRADE 2',
    area: '40 cm²',
    density: '40/cm²',
    grafts: '1600',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/txprqtwbqrckrqbbtkbm.png'
  },
  {
    id: 3,
    grade: 'GRADE 3',
    area: '60 cm²',
    density: '40/cm²',
    grafts: '2400',
    session: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/lm1wuhdnisarojusnl1c.png'
  },
  {
    id: 4,
    grade: 'GRADE 4',
    area: '80 cm²',
    density: '40/cm²',
    grafts: '3200',
    session: '1-2',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/fnby98gc9fgctznkbpdt.png'
  },
  {
    id: 5,
    grade: 'GRADE 5',
    area: '100 cm²',
    density: '40/cm²',
    grafts: '4000',
    session: '2',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/r3etpyboaedgq8gizzpc.png'
  },
  {
    id: 6,
    grade: 'GRADE 6',
    area: '120 cm²',
    density: '40/cm²',
    grafts: '4800',
    session: '2-3',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/apdtgxwhhkwjz2c6l7lv.png'
  },
  {
    id: 7,
    grade: 'GRADE 7',
    area: '140 cm²',
    density: '40/cm²',
    grafts: '5600',
    session: '3',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png'
  }
];

export default function GradeSlider() {
  return (
    <section className="grade-section" style={{ backgroundColor: '#000', padding: '100px 0 100px 5%', position: 'relative', overflow: 'hidden' }}>
      <div className="grade-header" style={{ marginBottom: '50px', maxWidth: '1400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
           <div style={{ width: '60px', height: '1.5px', backgroundColor: '#F09819' }}></div>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F09819' }}></div>
           <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '3px', color: '#fff', fontFamily: "'Lato', sans-serif" }}>EQUIP YOUR RECOVERY</span>
        </div>
        <h2 style={{ fontSize: '54px', color: '#fff', fontFamily: "'Marcellus', serif", fontWeight: '400', lineHeight: '1.2' }}>Know Your Grade For Hair Transplant</h2>
      </div>

      <div className="slider-container" style={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={25}
          slidesPerView={1.2}
          navigation={{
            nextEl: '.grade-next-btn',
            prevEl: '.grade-prev-btn',
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1400: { slidesPerView: 4.5 },
          }}
          className="grade-swiper"
          style={{ padding: '20px 0' }}
        >
          {gradeData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="grade-card" style={{ 
                backgroundColor: '#FFFAF1', 
                borderRadius: '30px', 
                padding: '40px 30px',
                height: 'auto',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#333', fontFamily: "'Lato', sans-serif" }}>{item.grade}</span>
                  <img src={item.image} alt={item.grade} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #F09819' }} />
                </div>

                <div style={{ margin: '30px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Approx Area</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>{item.area}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Avg. Density</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>{item.density}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', backgroundColor: '#FBEED7', margin: '10px -10px', paddingLeft: '10px', paddingRight: '10px', borderRadius: '8px' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>No. of Grafts</span>
                    <span style={{ fontWeight: '700', color: '#F09819' }}>{item.grafts}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Session</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>{item.session}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                  <img src={item.image} alt="Full Illustration" style={{ width: '150px', height: 'auto' }} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons at the bottom center */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', paddingRight: '5%' }}>
          <button className="grade-prev-btn" style={{
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <ArrowLeft size={24} color="#000" />
          </button>
          <button className="grade-next-btn" style={{
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <ArrowRight size={24} color="#000" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .grade-prev-btn:hover, .grade-next-btn:hover {
          background-color: #F09819 !important;
        }
        .grade-prev-btn:hover :global(svg), .grade-next-btn:hover :global(svg) {
          color: #fff !important;
        }
        .grade-card:hover {
          transform: translateY(-10px);
          background-color: #fff !important;
        }
        @media (max-width: 1024px) {
          h2 { font-size: 36px !important; }
          .grade-section { padding-top: 60px !important; padding-bottom: 60px !important; }
        }
      `}</style>
    </section>
  );
}
