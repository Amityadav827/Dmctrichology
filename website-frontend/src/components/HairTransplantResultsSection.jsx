import React from "react";

export default function HairTransplantResultsSection({ data }) {
  if (!data || data.isVisible === false) return null;

  const cards = data.cards || [];
  if (cards.length === 0) return null;

  return (
    <section className="hair-transplant-results-section">
      <div className="hair-transplant-results-container">
        <div className="hair-transplant-results-kicker">
          <span></span>
          {data.subtitle || "BEFORE AND AFTER"}
        </div>
        <h2 className="hair-transplant-results-heading">
          {data.title || "RESULTS THAT SPEAK FOR THEMSELVES"}
        </h2>

        <div className="hair-transplant-results-grid">
          {cards.map((item, idx) => (
            <article className="hair-transplant-results-card" key={idx}>
              <h3 className="hair-transplant-results-title">{item.title}</h3>
              <div className="hair-transplant-results-images">
                <div className="hair-transplant-results-image-box">
                  <img src={item.beforeImg} alt={`${item.title} before`} loading="lazy" />
                  <span>Before</span>
                </div>
                <div className="hair-transplant-results-image-box">
                  <img src={item.afterImg} alt={`${item.title} after`} loading="lazy" />
                  <span>After</span>
                </div>
              </div>
              <p className="hair-transplant-results-sessions">{item.sessions}</p>
            </article>
          ))}
        </div>

        {(data.buttonText || data.buttonLink) && (
          <div className="hair-transplant-results-action">
            <button 
              onClick={() => {
                if (data.buttonLink) {
                  window.location.href = data.buttonLink;
                }
              }} 
              className="hair-transplant-results-btn" 
              type="button"
            >
              <span>{data.buttonText || "VIEW ALL"}</span>
              <span className="hair-transplant-results-btn-arrow" aria-hidden="true">
                <img
                  src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ngfngyyxjj86kvn5nd5n.png"
                  alt=""
                  className="hair-transplant-results-btn-arrow-icon"
                />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
