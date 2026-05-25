"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../../context/BuilderContext';
import HairTransplantClinicHero from '../../components/HairTransplantClinicHero';
import HairTransplantClinicBreadcrumb from '../../components/HairTransplantClinicBreadcrumb';
import HairTransplantClinicIntro from '../../components/HairTransplantClinicIntro';
import HairTransplantClinicProcedures from '../../components/HairTransplantClinicProcedures';
import HairTransplantClinicTimeline from '../../components/HairTransplantClinicTimeline';
import HairTransplantClinicPatientCare from '../../components/HairTransplantClinicPatientCare';
import HairTransplantClinicAssociations from '../../components/HairTransplantClinicAssociations';
import HairTransplantClinicReviews from '../../components/HairTransplantClinicReviews';
import HairTransplantClinicFAQ from '../../components/HairTransplantClinicFAQ';
import HairTransplantClinicCTA from '../../components/HairTransplantClinicCTA';

import './HairTransplantClinic.css';

// Map sectionId prefix → pageData key
const SECTION_MAP = {
  'hair-clinic-hero.':                 'hero',
  'hair-clinic-breadcrumb.':           'breadcrumb',
  'hair-clinic-intro.':                 'intro',
  'hair-clinic-procedures.':           'procedures',
  'hair-clinic-timeline.':             'timeline',
  'hair-clinic-patient-care.':         'patientCare',
  'hair-clinic-associations.':         'associations',
  'hair-clinic-reviews.':             'reviews',
  'hair-clinic-faq.':                 'faq',
  'hair-clinic-cta.':                 'cta',
};

const SECTION_ID_MAP = {
  'hair-clinic-hero':                'hero',
  'hair-clinic-breadcrumb':          'breadcrumb',
  'hair-clinic-intro':                'intro',
  'hair-clinic-procedures':          'procedures',
  'hair-clinic-timeline':            'timeline',
  'hair-clinic-patient-care':        'patientCare',
  'hair-clinic-associations':        'associations',
  'hair-clinic-reviews':            'reviews',
  'hair-clinic-faq':                'faq',
  'hair-clinic-cta':                'cta',
};

function applyDeepPath(obj, fieldPath, value) {
  const parts = fieldPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

export default function HairTransplantClinicClient({ initialData }) {
  const [pageData, setPageData] = useState(initialData || {});
  const { siteConfig } = useBuilder();
  const searchParams = useSearchParams();

  // Sync Visual Live Builder changes
  useEffect(() => {
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        const matchedPrefix = Object.keys(SECTION_MAP).find(p => key.startsWith(p));
        if (!matchedPrefix) return;

        const dataKey = SECTION_MAP[matchedPrefix];
        const fieldPath = key.slice(matchedPrefix.length);
        const value = siteConfig[key];

        if (!newData[dataKey]) newData[dataKey] = {};
        const before = JSON.stringify(newData[dataKey]);
        applyDeepPath(newData[dataKey], fieldPath, value);
        if (JSON.stringify(newData[dataKey]) !== before) hasChanges = true;
      });

      return hasChanges ? newData : prev;
    });
  }, [siteConfig]);

  // Listen for inline CMS click-to-edit updates
  useEffect(() => {
    const handleCmsUpdate = (event) => {
      const { sectionId, fieldPath, value } = event.detail || {};
      if (!sectionId || !fieldPath) return;

      const dataKey = SECTION_ID_MAP[sectionId];
      if (!dataKey) return;

      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        if (!newData[dataKey]) newData[dataKey] = {};
        applyDeepPath(newData[dataKey], fieldPath, value);
        return newData;
      });
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  return (
    <main className="hair-clinic-body">
      <HairTransplantClinicHero data={pageData.hero || {}} />
      <HairTransplantClinicBreadcrumb data={pageData.breadcrumb || {}} />
      <HairTransplantClinicIntro data={pageData.intro || {}} />
      <HairTransplantClinicProcedures data={pageData.procedures || {}} />
      <HairTransplantClinicTimeline data={pageData.timeline || {}} />
      <HairTransplantClinicPatientCare data={pageData.patientCare || {}} />
      <HairTransplantClinicAssociations data={pageData.associations || {}} />
      <HairTransplantClinicReviews data={pageData.reviews || {}} />
      <HairTransplantClinicFAQ data={pageData.faq || {}} />
      <HairTransplantClinicCTA data={pageData.cta || {}} />
    </main>
  );
}
