"use client";
import React from "react";
import { useBuilder } from "../../context/BuilderContext";

const EditableText = ({ children, sectionId, fieldPath, className, style, tag: Tag = "span" }) => {
  const { isEditMode, updateField } = useBuilder();

  if (!isEditMode) {
    return <Tag className={className} style={style}>{children}</Tag>;
  }

  const handleBlur = (e) => {
    const newValue = e.target.innerText;
    updateField(sectionId, fieldPath, newValue);
  };

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      className={`${className} editable-text-active`}
      style={{
        ...style,
        outline: "none",
        border: "1px dashed rgba(37, 99, 235, 0.3)",
        padding: "2px",
        borderRadius: "4px",
        cursor: "text",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => e.target.style.border = "1px solid #2563EB"}
      onMouseLeave={(e) => e.target.style.border = "1px dashed rgba(37, 99, 235, 0.3)"}
    >
      {children}
    </Tag>
  );
};

export default EditableText;
