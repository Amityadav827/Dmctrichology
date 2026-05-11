const mongoose = require("mongoose");

const detailsPageSchema = new mongoose.Schema(
  {
    // ── Section 1: Banner ─────────────────────────────
    banner: {
      bannerImage: { type: String, default: "" },
      pageTitle: { type: String, default: "Service Details" },
      breadcrumbText: { type: String, default: "Details" },
      overlayOpacity: { type: Number, default: 0.3 },
    },

    // ── Section 2: Service Intro ──────────────────────
    intro: {
      badge: { type: String, default: "FOR UNWANTED HAIR" },
      title: { type: String, default: "Follicular Unit Extraction (FUE)" },
      rating: { type: String, default: "4.85" },
      duration: { type: String, default: "180 mins" },
      subTitle: { type: String, default: "Follicular Unit Extraction (FUE)\nSafe, smart & skin-friendly" },
      description: { type: String, default: "FUE is one of the most popular and limited modern procedure techniques for hair repair. Each hair follicle is removed individually and implanted into the thinning or bald areas, making sure that it's natural volume and growth." },
      closingText: { type: String, default: "Our FUE procedure is performed by skilled hair transplant surgeons with years of experience, making us the best hair transplant centre in Delhi." },
      videoUrl: { type: String, default: "" },
      galleryImages: { type: [String], default: [
        "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
        "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
        "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png"
      ]},
      bulletPoints: {
        type: [String],
        default: [
          "Best for both men and women",
          "Low scarring and recovery time",
          "Permanent, natural-looking results"
        ]
      },
    },

    // ── Section 3: Process Slider ─────────────────────
    process: {
      sectionTitle: { type: String, default: "How Full Body Laser Hair Reduction works?" },
      processSteps: {
        type: [
          {
            image: { type: String, default: "" },
            stepNumber: { type: String, default: "STEP 1" },
            title: { type: String, default: "" },
            description: { type: String, default: "" },
          }
        ],
        default: [
          { image: "", stepNumber: "STEP 1", title: "Consultation", description: "Area is marked, cleansed and shaved" },
          { image: "", stepNumber: "STEP 2", title: "Preparation", description: "ECG gel is applied to protect the skin" },
          { image: "", stepNumber: "STEP 3", title: "Treatment", description: "Laser shots target the hair follicles" },
          { image: "", stepNumber: "STEP 4", title: "Aftercare", description: "Sunscreen is applied post-treatment for protection" },
        ]
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetailsPage", detailsPageSchema);
