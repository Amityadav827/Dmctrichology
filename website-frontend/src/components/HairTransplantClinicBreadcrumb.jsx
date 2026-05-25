"use client";
import React from 'react';
import Link from 'next/link';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function HairTransplantClinicBreadcrumb({ data = {} }) {
  const {
    parentLabel = "Home",
    parentUrl = "/",
    currentPageText = "Hair Transplant Clinic",
    backgroundColor = "#f8f9fa"
  } = data;

  return (
    <EditableSection sectionId="hair-clinic-breadcrumb" label="Hair Transplant Clinic Breadcrumb">
      <div className="hair-clinic-breadcrumbs-bar" style={{ backgroundColor }}>
        <div className="hair-clinic-breadcrumbs-content">
          <Link href={parentUrl} className="hair-clinic-breadcrumbs-link">
            <EditableText sectionId="hair-clinic-breadcrumb" fieldPath="parentLabel" tag="span">
              {parentLabel}
            </EditableText>
          </Link>
          <span>/</span>
          <span className="hair-clinic-breadcrumbs-active">
            <EditableText sectionId="hair-clinic-breadcrumb" fieldPath="currentPageText" tag="span">
              {currentPageText}
            </EditableText>
          </span>
        </div>
      </div>
    </EditableSection>
  );
}
