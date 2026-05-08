"use client";
import React, { useState, useEffect } from "react";
import { fetchPressMedia } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";

const PressMediaSection = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchPressMedia();
      if (res?.success) {
        setData(res.data);
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === "press-media-section") {
        const { fieldPath, value } = e.detail;
        setData((prev) => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes(".")) {
            const parts = fieldPath.split(".");
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener("cms-update", handleCmsUpdate);
    return () => window.removeEventListener("cms-update", handleCmsUpdate);
  }, []);

  if (!data?.enabled && data !== null) return null;

  const heading = data?.heading || "WHAT THE PRESS AND MEDIA ARE SAYING ABOUT OUR CLINIC";
  const ratingText = data?.ratingText || "4.9 Rating";
  const patientCountText = data?.patientCountText || "5000+ Satisfied Patients";
  const button = data?.button || { text: "EXPLORE MEDIA", link: "/media" };
  const avatars = data?.avatars || [];
  const mediaLogos = data?.mediaLogos || [];

  return (
    <EditableSection sectionId="press-media-section" label="Press & Media Section">
      <section style={{ padding: "80px 5%", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ 
              fontSize: "clamp(28px, 4vw, 42px)", 
              color: "#1A1A1A", 
              fontFamily: "'Marcellus', serif",
              maxWidth: "900px",
              margin: "0 auto 30px",
              lineHeight: "1.2"
            }}>
              <EditableText sectionId="press-media-section" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", marginLeft: "10px" }}>
                {avatars.map((avatar, idx) => (
                  <div key={idx} style={{ 
                    width: "45px", 
                    height: "45px", 
                    borderRadius: "50%", 
                    border: "3px solid #fff",
                    marginLeft: idx === 0 ? 0 : "-15px",
                    overflow: "hidden",
                    backgroundColor: "#eee"
                  }}>
                    <img src={avatar.image} alt="Patient" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: "#E4B753", fontSize: "14px" }}>★</span>
                  ))}
                  <span style={{ fontSize: "14px", fontWeight: "600", marginLeft: "5px", fontFamily: "'Lato', sans-serif" }}>
                    <EditableText sectionId="press-media-section" fieldPath="ratingText" tag="span">
                      {ratingText}
                    </EditableText>
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#666", fontFamily: "'Lato', sans-serif" }}>
                  <EditableText sectionId="press-media-section" fieldPath="patientCountText" tag="span">
                    {patientCountText}
                  </EditableText>
                </div>
              </div>
            </div>

            <a href={button.link} style={{ 
              display: "inline-block", 
              padding: "12px 35px", 
              backgroundColor: "#000", 
              color: "#fff", 
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              letterSpacing: "1px",
              transition: "all 0.3s ease"
            }}>
              <EditableText sectionId="press-media-section" fieldPath="button.text" tag="span">
                {button.text}
              </EditableText>
            </a>
          </div>

          {/* Logo Slider Area */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "50px", 
            flexWrap: "wrap",
            padding: "40px 0",
            borderTop: "1px solid #eee"
          }}>
            {mediaLogos.map((logo, idx) => (
              <a key={idx} href={logo.link} title={logo.title} style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}>
                <img src={logo.image} alt={logo.title} style={{ height: "40px", objectFit: "contain", filter: "grayscale(100%)" }} />
              </a>
            ))}
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default PressMediaSection;
