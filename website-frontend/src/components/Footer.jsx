"use client";
import React, { useState, useEffect } from "react";
import { fetchFooter } from "../services/api";
import EditableSection from "./Editable/EditableSection";
import EditableText from "./Editable/EditableText";

const Footer = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchFooter();
      if (res?.success) {
        setData(res.data);
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === "footer-section") {
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

  const columns = data?.columns || [];
  const contact = data?.contact || {};
  const disclaimer = data?.disclaimer || "";
  const newsletter = data?.newsletter || {};
  const branding = data?.branding || {};
  const socials = data?.socials || [];
  const bottomFooter = data?.bottomFooter || {};

  return (
    <EditableSection sectionId="footer-section" label="Footer Section">
      <footer style={{ backgroundColor: "#F9F7F2", padding: "80px 5% 40px", borderTop: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            
            {/* Dynamic Columns */}
            {columns.map((col, cIdx) => (
              <div key={cIdx}>
                <h4 style={{ fontSize: "18px", color: "#1A1A1A", fontFamily: "'Marcellus', serif", marginBottom: "25px" }}>
                  <EditableText sectionId="footer-section" fieldPath={`columns.${cIdx}.title`} tag="span">
                    {col.title}
                  </EditableText>
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(col.links || []).map((link, lIdx) => (
                    <li key={lIdx} style={{ marginBottom: "12px" }}>
                      <a href={link.url} style={{ color: "#666", textDecoration: "none", fontSize: "14px", fontFamily: "'Lato', sans-serif", transition: "color 0.3s ease" }}>
                        <EditableText sectionId="footer-section" fieldPath={`columns.${cIdx}.links.${lIdx}.label`} tag="span">
                          {link.label}
                        </EditableText>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div>
              <h4 style={{ fontSize: "18px", color: "#1A1A1A", fontFamily: "'Marcellus', serif", marginBottom: "25px" }}>
                <EditableText sectionId="footer-section" fieldPath="contact.heading" tag="span">
                  {contact.heading}
                </EditableText>
              </h4>
              <div style={{ color: "#666", fontSize: "14px", fontFamily: "'Lato', sans-serif", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 10px" }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.address1" tag="span">
                    {contact.address1}
                  </EditableText>
                  <br />
                  <EditableText sectionId="footer-section" fieldPath="contact.address2" tag="span">
                    {contact.address2}
                  </EditableText>
                </p>
                <p style={{ margin: "0 0 10px" }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.phone1" tag="span">
                    {contact.phone1}
                  </EditableText>
                  <br />
                  <EditableText sectionId="footer-section" fieldPath="contact.phone2" tag="span">
                    {contact.phone2}
                  </EditableText>
                </p>
                <p style={{ margin: 0 }}>
                  <EditableText sectionId="footer-section" fieldPath="contact.email" tag="span">
                    {contact.email}
                  </EditableText>
                </p>
              </div>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 style={{ fontSize: "18px", color: "#1A1A1A", fontFamily: "'Marcellus', serif", marginBottom: "20px" }}>
                <EditableText sectionId="footer-section" fieldPath="newsletter.heading" tag="span">
                  {newsletter.heading}
                </EditableText>
              </h4>
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "20px", lineHeight: "1.6" }}>
                <EditableText sectionId="footer-section" fieldPath="newsletter.description" tag="span">
                  {newsletter.description}
                </EditableText>
              </p>
              <div style={{ position: "relative" }}>
                <input 
                  type="email" 
                  placeholder={newsletter.placeholder} 
                  style={{ 
                    width: "100%", 
                    padding: "15px 20px", 
                    borderRadius: "50px", 
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }} 
                />
                <button style={{ 
                  position: "absolute", 
                  right: "5px", 
                  top: "5px", 
                  bottom: "5px",
                  padding: "0 25px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  <EditableText sectionId="footer-section" fieldPath="newsletter.buttonText" tag="span">
                    {newsletter.buttonText}
                  </EditableText>
                </button>
              </div>
            </div>

          </div>

          <div style={{ borderTop: "1px solid #E5E5E5", padding: "40px 0 20px" }}>
            <p style={{ color: "#999", fontSize: "12px", textAlign: "center", fontStyle: "italic", marginBottom: "40px" }}>
              <EditableText sectionId="footer-section" fieldPath="disclaimer" tag="span">
                {disclaimer}
              </EditableText>
            </p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "30px" }}>
              <div style={{ maxWidth: "400px" }}>
                <img src={branding.logo || "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/logo-main.png"} alt="DMC Logo" style={{ height: "45px", marginBottom: "15px" }} />
                <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                  <EditableText sectionId="footer-section" fieldPath="branding.aboutText" tag="span">
                    {branding.aboutText}
                  </EditableText>
                </p>
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                {socials.map((social, sIdx) => (
                  <a key={sIdx} href={social.url} style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    backgroundColor: "#000", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    transition: "all 0.3s ease"
                  }}>
                    <span style={{ color: "#fff", fontSize: "14px" }}>{social.icon.charAt(0).toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #E5E5E5", padding: "20px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>
              <EditableText sectionId="footer-section" fieldPath="bottomFooter.copyright" tag="span">
                {bottomFooter.copyright}
              </EditableText>
            </p>
            <div style={{ display: "flex", gap: "30px" }}>
              <a href={bottomFooter.termsLink} style={{ color: "#999", fontSize: "13px", textDecoration: "none" }}>
                <EditableText sectionId="footer-section" fieldPath="bottomFooter.termsText" tag="span">
                  {bottomFooter.termsText}
                </EditableText>
              </a>
              <a href={bottomFooter.privacyLink} style={{ color: "#999", fontSize: "13px", textDecoration: "none" }}>
                <EditableText sectionId="footer-section" fieldPath="bottomFooter.privacyText" tag="span">
                  {bottomFooter.privacyText}
                </EditableText>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </EditableSection>
  );
};

export default Footer;
