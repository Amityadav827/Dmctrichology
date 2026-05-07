"use client";
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';

export default function EditableSection({ sectionId, label, children }) {
  const { isEditMode, setActiveElement } = useBuilder();

  const handleClick = (e) => {
    if (!isEditMode) return;
    
    // Prevent bubbling to nested sections if any
    e.stopPropagation();
    
    // Notify the parent builder that this section was clicked
    window.parent.postMessage({
      type: 'SECTION_CLICKED',
      payload: { sectionId, label }
    }, '*');

    setActiveElement({ sectionId, label });
  };

  return (
    <div 
      className={`editable-section ${isEditMode ? 'builder-editable' : ''}`}
      data-section-id={sectionId}
      data-label={label}
      onClick={handleClick}
    >
      {children}
      {isEditMode && <div className="builder-overlay"></div>}
    </div>
  );
}
