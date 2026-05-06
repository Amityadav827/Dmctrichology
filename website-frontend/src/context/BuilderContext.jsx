"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteConfig, setSiteConfig] = useState({});
  const [activeElement, setActiveElement] = useState(null);

  useEffect(() => {
    // Check if we are in edit mode via URL parameter or postMessage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true") {
      setIsEditMode(true);
    }

    // Listen for messages from the Dashboard (Admin Panel)
    const handleMessage = (event) => {
      // Security: Check origin if possible
      if (event.data.type === "TOGGLE_EDIT_MODE") {
        setIsEditMode(event.data.payload);
      }
      if (event.data.type === "UPDATE_CONFIG") {
        setSiteConfig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const updateField = (sectionId, fieldPath, value) => {
    setSiteConfig((prev) => {
      const newConfig = { ...prev };
      // Logic to update nested fields could go here
      return newConfig;
    });
    
    // Notify Dashboard of the change
    window.parent.postMessage({
      type: "FIELD_UPDATED",
      payload: { sectionId, fieldPath, value }
    }, "*");
  };

  return (
    <BuilderContext.Provider value={{ isEditMode, siteConfig, activeElement, setActiveElement, updateField }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
