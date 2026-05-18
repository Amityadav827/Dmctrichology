import React from 'react';

export default function ServiceBenefits({ data }) {
  if (!data) return null;

  const { heading, image, altText, points } = data;

  // Filter visible points and sort them by sortOrder ascending
  const activePoints = (points || [])
    .filter(pt => pt.isVisible !== false && pt.benefitText?.trim() !== "")
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      return orderA - orderB;
    });

  if (activePoints.length === 0) {
    return null;
  }

  return (
    <section className="service-benefits-section">
      <div className="service-benefits-container">
        {/* Left Side: Image Column */}
        {image && (
          <div className="service-benefits-image-col">
            <div className="service-benefits-image-wrapper">
              <img 
                src={image} 
                alt={altText || heading || "Treatment benefits"} 
                className="service-benefits-img" 
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Right Side: Content Column */}
        <div className="service-benefits-content-col">
          {heading && (
            <h2 className="service-benefits-heading">
              {heading}
            </h2>
          )}
          
          <ul className="service-benefits-list">
            {activePoints.map((pt, idx) => (
              <li key={pt._id || idx} className="service-benefits-list-item">
                <span className="service-benefits-check-icon-wrapper">
                  <svg 
                    className="service-benefits-check-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2.5" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="service-benefits-text">
                  {pt.benefitText}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
