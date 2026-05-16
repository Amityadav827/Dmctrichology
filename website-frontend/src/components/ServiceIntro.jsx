"use client";
import { useState, useEffect } from 'react';
import { Star, Clock, Play } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const ServiceIntro = ({ data = {}, banner = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [bannerData, setBannerData] = useState(banner);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(false);

  const DUMMY_VIDEOS = [
    {
      title: "FUE Process Explained",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
      isYoutubeStyleButtonEnabled: true
    },
    {
      title: "Patient Success Story",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      isYoutubeStyleButtonEnabled: true
    },
    {
      title: "Technology at DMC",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
      isYoutubeStyleButtonEnabled: false
    },
    {
      title: "Clinic Walkthrough",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      isYoutubeStyleButtonEnabled: true
    }
  ];

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

  const intro = introData.intro || introData;
  const videos = intro.videos?.length > 0 ? intro.videos : DUMMY_VIDEOS;
  const benefits = intro.benefits || [];
  const currentVideo = videos[selectedIndex];

  return (
    <EditableSection sectionId="service-intro" label="Service Intro">
      <section className="service-intro-premium">
        <div className="intro-container-premium">
          <div className="intro-flex-row">

            {/* ─── LEFT SIDE: Main Image/Video + Gallery Thumbnails ─────────────────── */}
            <div className="intro-media-column">
              <div className="media-card-wrapper">

                {/* Main Image/Video Display */}
                <div className="service-main-media">
                  {activeVideo ? (
                    <div className="service-video-active">
                      <iframe
                        src={`${currentVideo.videoUrl.includes('?') ? currentVideo.videoUrl : currentVideo.videoUrl + '?'}autoplay=1&rel=0&modestbranding=1`}
                        title={currentVideo.title || "Service Video"}
                        className="service-video-iframe"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                      />
                      <button
                        onClick={() => setActiveVideo(false)}
                        className="service-video-close"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="service-main-image-wrapper">
                      <img
                        src={currentVideo.thumbnail}
                        alt={currentVideo.title}
                        className="service-main-image"
                      />
                      <div className="service-image-gradient"></div>
                      <div className="service-play-overlay" onClick={() => setActiveVideo(true)}>
                        <Play fill="white" className="service-play-icon" size={48} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnails Below (Shopify Style) */}
                <div className="service-gallery-thumbnails">
                  {videos.map((video, index) => (
                    <button
                      key={index}
                      className={`service-thumbnail ${selectedIndex === index ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedIndex(index);
                        setActiveVideo(false);
                      }}
                      title={video.title}
                    >
                      <img
                        src={video.thumbnail}
                        alt={`${video.title} thumbnail`}
                        className="thumbnail-img"
                      />
                      {video.isYoutubeStyleButtonEnabled && (
                        <div className="thumbnail-play-indicator">
                          <Play fill="white" size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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
    </EditableSection>
  );
};

export default ServiceIntro;
