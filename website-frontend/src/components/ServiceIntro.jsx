"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DUMMY_MEDIA = [
  {
    type: "video",
    url: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png", // Placeholder video if available, else use image as poster
    title: "Cinematic Experience",
    alt: "Premium Service Video"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    title: "Expert Care",
    alt: "Expert Care Team"
  }
];

const ServiceIntro = ({ data = {}, banner = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [bannerData, setBannerData] = useState(banner);
  const swiperRef = useRef(null);

  // Sync from props
  useEffect(() => {
    if (data) setIntroData(data);
    if (banner) setBannerData(banner);
  }, [data, banner]);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasIntroUpdates = false;
      let hasBannerUpdates = false;
      const nextIntroData = { ...introData };
      const nextBannerData = { ...bannerData };
      
      Object.keys(siteConfig).forEach(key => {
        // Handle Intro Updates
        if (key.startsWith('service-intro.intro.')) {
          const fieldPath = key.replace('service-intro.intro.', '');
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let current = nextIntroData;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = siteConfig[key];
          } else {
            nextIntroData[fieldPath] = siteConfig[key];
          }
          hasIntroUpdates = true;
        }

        // Handle Banner Updates (for shared Hero/Intro fields)
        if (key.startsWith('details-banner.banner.')) {
          const fieldPath = key.replace('details-banner.banner.', '');
          nextBannerData[fieldPath] = siteConfig[key];
          hasBannerUpdates = true;
        }
      });

      if (hasIntroUpdates) setIntroData(nextIntroData);
      if (hasBannerUpdates) setBannerData(nextBannerData);
    }
  }, [isEditMode, siteConfig]);

  const intro = introData.intro || introData; // Handle both cases where intro is nested or top-level
  const mediaItems = intro.introMedia?.length > 0 ? intro.introMedia : DUMMY_MEDIA;
  const benefits = intro.benefits || [];
  const sliderSettings = intro.sliderSettings || { autoplay: true, autoplaySpeed: 5000, showDots: true, loopVideos: true };

  return (
    <EditableSection sectionId="service-intro" label="Service Intro">
      <section className="service-intro-premium">
        <div className="intro-container-premium">
          <div className="intro-flex-row">
            
            {/* ─── LEFT SIDE: Cinematic Media Slider ─────────── */}
            <div className="intro-media-column">
              <div className="media-card-wrapper">
                {/* Main Slider Container */}
                <div className="video-slider-main">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={sliderSettings.loopVideos}
                    autoplay={sliderSettings.autoplay ? { delay: sliderSettings.autoplaySpeed, disableOnInteraction: false } : false}
                    pagination={sliderSettings.showDots ? { clickable: true, el: '.custom-swiper-pagination' } : false}
                    className="full-height-swiper"
                  >
                    {mediaItems.map((media, index) => (
                      <SwiperSlide key={index}>
                        <div className="slide-video-container">
                          <div className="video-poster-wrapper">
                            {media.type === 'video' ? (
                              <video
                                src={media.url}
                                className="video-poster-img object-cover w-full h-full"
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster={media.thumbnail || ""}
                              />
                            ) : (
                              <img 
                                src={media.url || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                                alt={media.alt || media.title || "Service Media"} 
                                className="video-poster-img"
                              />
                            )}
                            
                            <div className="video-poster-gradient"></div>
                            
                            {/* Slide Title */}
                            {media.title && (
                              <div className="slide-info-overlay">
                                <p className="slide-count">Feature {index + 1}</p>
                                <h4 className="slide-main-title">{media.title}</h4>
                              </div>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="swiper-nav-btn swiper-prev"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="swiper-nav-btn swiper-next"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Pagination Dots (Bottom Center) */}
                {sliderSettings.showDots && (
                  <div className="pagination-dots-container">
                    <div className="custom-swiper-pagination"></div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT SIDE: Content (Restored to Reference) ─── */}
            <div className="details-content-col">
              {/* Badge */}
              <span className="details-badge">
                <EditableText sectionId="details-banner" fieldPath="banner.badgeText">
                  {bannerData.badgeText || 'FOR UNWANTED HAIR'}
                </EditableText>
              </span>

              {/* Title */}
              <h1 className="details-title">
                <EditableText sectionId="details-banner" fieldPath="banner.title">
                  {bannerData.title || 'Follicular Unit Extraction (FUE)'}
                </EditableText>
              </h1>

              {/* Meta Row */}
              <div className="details-meta-row">
                <span className="details-rating-num">
                  <EditableText sectionId="details-banner" fieldPath="banner.rating">
                    {bannerData.rating || '4.85'}
                  </EditableText>
                </span>
                <div className="details-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <div className="details-duration">
                  <Clock size={14} />
                  <span>
                    <EditableText sectionId="details-banner" fieldPath="banner.duration">
                      {bannerData.duration || '180 mins'}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Intro Section Heading */}
              <h3 className="details-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.introHeading">
                  {intro.introHeading || intro.title || ""}
                </EditableText>
              </h3>

              {/* Short Description / Tagline */}
              {intro.shortDescription && (
                <div className="details-intro-short-desc">
                  <EditableText sectionId="service-intro" fieldPath="intro.shortDescription">
                    {intro.shortDescription}
                  </EditableText>
                </div>
              )}

              {/* Main Description */}
              <p className="details-description">
                <EditableText sectionId="service-intro" fieldPath="intro.longDescription">
                  {intro.longDescription || 'FUE is one of the most popular and limited modern procedure techniques for hair repair.'}
                </EditableText>
              </p>

              {/* Bullet Points */}
              {benefits.length > 0 && (
                <ul className="details-bullets">
                  {benefits.map((benefit, i) => (
                    <li key={i}>
                      <EditableText sectionId="service-intro" fieldPath={`benefits.${i}.text`}>
                        {benefit.text}
                      </EditableText>
                    </li>
                  ))}
                </ul>
              )}

              {/* Closing Text */}
              <p className="details-closing">
                <EditableText sectionId="service-intro" fieldPath="intro.closingText">
                  {intro.closingText || 'Our FUE procedure is performed by skilled hair transplant surgeons with years of experience, making us the best hair transplant centre in Delhi.'}
                </EditableText>
              </p>
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #1e293b;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </EditableSection>
  );
};

export default ServiceIntro;
