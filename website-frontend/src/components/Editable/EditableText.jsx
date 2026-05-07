"use client";
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';

export default function EditableText({ sectionId, fieldPath, children, tag: Tag = "span" }) {
  const { isEditMode, updateField } = useBuilder();

  const handleBlur = (e) => {
    if (!isEditMode) return;
    const newValue = e.target.innerText;
    updateField(sectionId, fieldPath, newValue);
  };

  return (
    <Tag
      className={`editable-text ${isEditMode ? 'builder-text-editable' : ''}`}
      contentEditable={isEditMode}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onClick={(e) => isEditMode && e.stopPropagation()}
    >
      {children}
    </Tag>
  );
}
