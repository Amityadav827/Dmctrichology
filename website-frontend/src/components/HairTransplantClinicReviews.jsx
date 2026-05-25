"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicReviews({ data = {} }) {
  const {
    heading = "What Our Premium Patients Say",
    googleRating = "4.9",
    count = "15,000+",
    reviewsList = [],
    isVisible = true
  } = data;

  if (isVisible === false) return null;

  return (
    <EditableSection sectionId="hair-clinic-reviews" label="Hair Transplant Clinic Reviews">
      <section className="hair-clinic-reviews-section">
        <div className="hair-clinic-reviews-container">
          <div className="hair-clinic-section-header">
            <h2>
              <EditableText sectionId="hair-clinic-reviews" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            {/* Google rating summary badge */}
            <div className="hair-clinic-reviews-summary-badge">
              <span className="hair-clinic-reviews-rating">{googleRating} ★</span>
              <div className="hair-clinic-reviews-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="hair-clinic-reviews-count">
                <EditableText sectionId="hair-clinic-reviews" fieldPath="count" tag="span">
                  {count}
                </EditableText>
                {" Verified Inquiries"}
              </span>
            </div>
          </div>

          <div className="hair-clinic-reviews-grid">
            {reviewsList.map((review, idx) => (
              <div className="hair-clinic-review-card" key={idx}>
                <div className="hair-clinic-review-author-row">
                  <span className="hair-clinic-review-author">
                    <EditableText sectionId="hair-clinic-reviews" fieldPath={`reviewsList.${idx}.author`} tag="span">
                      {review.author}
                    </EditableText>
                  </span>
                  {review.verified !== false && (
                    <span className="hair-clinic-review-verified">Verified Patient</span>
                  )}
                </div>

                <div className="hair-clinic-reviews-stars" style={{ marginBottom: '14px', fontSize: '14px' }}>
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p>
                  <EditableText sectionId="hair-clinic-reviews" fieldPath={`reviewsList.${idx}.text`} tag="span">
                    "{review.text}"
                  </EditableText>
                </p>

                <span className="hair-clinic-review-date">
                  <EditableText sectionId="hair-clinic-reviews" fieldPath={`reviewsList.${idx}.date`} tag="span">
                    {review.date}
                  </EditableText>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
