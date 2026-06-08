"use client";
import React from "react";
import EditableSection from "./Editable/EditableSection";
import EditableImage from "./Editable/EditableImage";

export default function AboutDrNandaniTimeline({ data = {} }) {
  const {
    sectionBgColor = "#FFFFFF",
    sectionImage = ""
  } = data;

  if (!sectionImage) {
    return null;
  }

  return (
    <EditableSection sectionId="about-nandani-timeline" label="Dr Nandani Image Section">
      <section
        className="dr-nandani-image-section"
        style={{
          backgroundColor: sectionBgColor || "#FFFFFF",
          width: "100%",
          padding: "72px 24px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto"
          }}
        >
          <div className="dr-nandani-image-frame">
            <EditableImage
              sectionId="about-nandani-timeline"
              fieldPath="timeline.sectionImage"
              src={sectionImage}
              alt="Dr. Nandani Dadu"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover"
              }}
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        .dr-nandani-image-frame {
          width: 100%;
          aspect-ratio: 16 / 6;
          min-height: 240px;
          max-height: 360px;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
          background: #f8fafc;
        }

        @media (max-width: 991px) {
          .dr-nandani-image-frame {
            aspect-ratio: 16 / 7;
            min-height: 220px;
            border-radius: 24px;
          }
        }

        @media (max-width: 767px) {
          .dr-nandani-image-section {
            padding: 48px 16px;
          }

          .dr-nandani-image-frame {
            aspect-ratio: 16 / 9;
            min-height: 180px;
            max-height: 240px;
            border-radius: 20px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
