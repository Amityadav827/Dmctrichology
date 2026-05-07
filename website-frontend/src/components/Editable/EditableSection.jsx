"use client";
import React, { useState } from "react";
import { useBuilder } from "../../context/BuilderContext";

const EditableSection = ({ children, sectionId, label }) => {
  const { isEditMode } = useBuilder();
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div 
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Controls Overlay */}
      {isHovered && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 50,
          background: "#1E293B",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          animation: "fade-in 0.2s ease"
        }}>
          <span style={{ opacity: 0.7 }}>{label || "Section"}</span>
          <div style={{ height: "12px", width: "1px", background: "rgba(255,255,255,0.2)" }}></div>
          <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "11px" }}>Settings</button>
          <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "11px" }}>Move</button>
        </div>
      )}

      {/* Visual Selection Border */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        border: isHovered ? "2px solid #2563EB" : "1px solid transparent",
        zIndex: 40,
        transition: "all 0.2s ease"
      }}></div>

      {children}
    </div>
  );
};

export default EditableSection;
