"use client";

import React, { useState, useEffect } from 'react';
import AboutUsHero from '@/components/AboutUsHero';
import AboutUsStory from '@/components/AboutUsStory';
import AboutUsJourney from '@/components/AboutUsJourney';
import AboutUsVision from '@/components/AboutUsVision';
import AboutUsExperts from '@/components/AboutUsExperts';
import AboutUsTestimonials from '@/components/AboutUsTestimonials';
import { fetchAboutUs } from '@/services/api';

// Static fallback data for production safety
const staticFallback = {
  hero: {
    badge: "ESTABLISHED 2008",
    title: "Crafting The Art Of Natural Hair Restoration",
    subtitle: "India's premier luxury trichology center combining advanced medical science with artistic precision.",
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "25k+", label: "Happy Patients" },
      { value: "12+", label: "Expert Board" }
    ],
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png"
  },
  story: {
    badge: "OUR HERITAGE",
    heading: "A Legacy Of Clinical Excellence",
    description: "Founded in 2008 by Dr. Gaurav Garg, DMC Trichology has pioneered the field of hair restoration in India.",
    points: ["US-FDA Approved Technologies", "Award-winning Surgeons", "Gold Standard Protocols"],
    mainImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
    sideImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png"
  }
};

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const result = await fetchAboutUs();
        if (result && result.success) {
          setAboutData(result.data);
        } else {
          // If API returns success: false, use static fallback
          setAboutData(staticFallback);
        }
      } catch (error) {
        console.error('Error fetching About Us data:', error);
        setAboutData(staticFallback);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!aboutData) return null;

  return (
    <main className="about-us-page-wrapper">
      <AboutUsHero data={aboutData.hero} />
      <AboutUsStory data={aboutData.story} />
      <AboutUsVision data={aboutData.vision} />
      <AboutUsJourney data={aboutData.journey} />
      <AboutUsExperts data={aboutData.experts} />
      <AboutUsTestimonials data={aboutData.testimonials} />
    </main>
  );
}
