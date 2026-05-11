"use client";
import { useState, useEffect, useRef } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const ServiceIntro = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [introData, setIntroData] = useState(data);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (data) setIntroData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...introData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('service-intro.intro.')) {
          const field = key.replace('service-intro.intro.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) setIntroData(nextData);
    }
  }, [isEditMode, siteConfig]);

          {/* ─── LEFT: Video Player Section ─────────── */}
          <div className="details-gallery-col">
            <div className="details-video-player-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', backgroundColor: '#f8fafc' }}>
              
              {!showVideo ? (
                <div 
                  className="video-thumbnail-overlay"
                  style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 10 }}
                  onClick={() => setShowVideo(true)}
                >
                  {/* Thumbnail Image */}
                  <img 
                    src={introData.videoThumbnail || 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png'} 
                    alt="Video Thumbnail" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Overlay gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' }}></div>
                  
                  {/* Play Button Center */}
                  {introData.videoUrl && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70px', height: '70px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'transform 0.3s' }} className="hover:scale-110">
                      <Play size={30} fill="#1e293b" color="#1e293b" style={{ marginLeft: '4px' }} />
                    </div>
                  )}

                  {/* YouTube/Vimeo Logo Bottom Right */}
                  {introData.videoUrl && introData.videoType === 'youtube' && (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                      alt="YouTube" 
                      style={{ position: 'absolute', bottom: '20px', right: '20px', width: '50px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                    />
                  )}
                  {introData.videoUrl && introData.videoType === 'vimeo' && (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Vimeo_logo_2015.svg" 
                      alt="Vimeo" 
                      style={{ position: 'absolute', bottom: '20px', right: '20px', width: '50px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                    />
                  )}
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000' }}>
                  {introData.videoType === 'mp4' ? (
                    <video 
                      src={introData.videoUrl} 
                      controls 
                      autoPlay 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    ></video>
                  ) : (
                    <iframe
                      src={introData.videoType === 'youtube' && introData.videoUrl && !introData.videoUrl.includes('?') 
                        ? `${introData.videoUrl}?autoplay=1&rel=0` 
                        : introData.videoUrl}
                      title="Service Video"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ─── RIGHT: Content ─────────────────────── */}
          <div className="details-content-col">

            {/* Category Badge */}
            <div className="details-badge">
              <EditableText sectionId="service-intro" fieldPath="intro.badge">
                {introData.badge || 'HAIR TREATMENT'}
              </EditableText>
            </div>

            {/* Title */}
            <h2 className="details-title">
              <EditableText sectionId="service-intro" fieldPath="intro.title">
                {introData.title || 'Follicular Unit Extraction (FUE)'}
              </EditableText>
            </h2>

            {/* Meta: Rating + Duration */}
            <div className="details-meta-row">
              <div className="details-rating">
                <span className="details-rating-num">
                  <EditableText sectionId="service-intro" fieldPath="intro.rating">
                    {introData.rating || '4.85'}
                  </EditableText>
                </span>
                <div className="details-stars">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
              </div>
              <div className="details-duration">
                <Clock size={13} />
                <span>
                  <EditableText sectionId="service-intro" fieldPath="intro.duration">
                    {introData.duration || '180 mins'}
                  </EditableText>
                </span>
              </div>
            </div>

            {/* Sub-title */}
            {introData.subTitle && (
              <div className="details-subtitle">
                <EditableText sectionId="service-intro" fieldPath="intro.subTitle">
                  {introData.subTitle}
                </EditableText>
              </div>
            )}

            {/* Description */}
            <p className="details-description">
              <EditableText sectionId="service-intro" fieldPath="intro.description">
                {introData.description || ''}
              </EditableText>
            </p>

            {/* Bullet Points */}
            {bullets.length > 0 && (
              <ul className="details-bullets">
                {bullets.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            {/* Closing Text */}
            {introData.closingText && (
              <p className="details-closing">
                <EditableText sectionId="service-intro" fieldPath="intro.closingText">
                  {introData.closingText}
                </EditableText>
              </p>
            )}
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default ServiceIntro;
