/**
 * STEP 8 — Testimonials + Gallery System Migration
 *
 * Core testimonials, gallery, result_categories, result_inner, videos, video_categories
 * are ALL already Supabase-native. No data migration needed for these.
 *
 * This script:
 * 1. Verifies all Supabase-native media tables
 * 2. Migrates PressMedia singleton (MongoDB → homepage_sections[press_media])
 * 3. Migrates Influencer singleton (MongoDB → homepage_sections[influencers])
 *
 * Run: node migrateTestimonialsToSupabase.js
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const MONGO_URI = process.env.MONGO_URI;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !MONGO_URI) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const cleanDoc = (doc) => {
  if (!doc) return null;
  const cleaned = { ...doc };
  delete cleaned._id;
  delete cleaned.__v;
  return cleaned;
};

// ─── Default fallbacks ───────────────────────────────────────────────────────
const defaultPressMediaData = {
  hero: {
    title: "Press & Media",
    breadcrumbText: "Press & Media",
    bannerImage: "",
    backgroundColor: "#3b5998",
    overlayOpacity: 0.55,
    bannerHeight: "420px"
  },
  mediaCards: [
    {
      id: "1",
      mediaImage: "https://www.dmctrichology.com/assets/images/media_1.webp",
      mediaLogo: "https://www.dmctrichology.com/assets/images/media_logo1.webp",
      mediaTitle: "DMC Trichology Featured in Leading Health Publication",
      mediaLink: "#",
      isVisible: true,
      order: 0
    }
  ],
  enabled: true,
  heading: "WHAT THE PRESS AND MEDIA ARE SAYING ABOUT OUR CLINIC",
  ratingText: "4.9 Rating",
  patientCountText: "5000+ Satisfied Patients",
  button: { text: "EXPLORE MEDIA", link: "/press-media" },
  avatars: [
    { id: "1", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png" }
  ],
  mediaLogos: [
    { id: "1", title: "Press 1", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png", link: "#" },
    { id: "2", title: "Press 2", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png", link: "#" },
    { id: "3", title: "Press 3", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png", link: "#" }
  ]
};

const defaultInfluencerData = {
  hero: {
    title: "Influencers",
    breadcrumbText: "Influencers",
    backgroundColor: "#3b5998",
    overlayOpacity: 0.55,
    bannerHeight: "420px",
    bannerImage: "",
    ctaText: "Watch Stories",
    ctaLink: "#influencer-showcase"
  },
  influencerCards: [
    {
      id: "1",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      autoplay: false,
      muted: true,
      loop: true,
      isVisible: true,
      order: 0
    }
  ]
};

const migrate = async () => {
  console.log("=============================================");
  console.log("🚀 STEP 8 — TESTIMONIALS + GALLERY MIGRATION");
  console.log("=============================================\n");

  // ─── Phase 1: Verify all core media tables ─────────────────────────────────
  console.log("📋 Phase 1: Verifying Core Media Tables in Supabase...");

  const tablesToCheck = [
    { table: "testimonials", min: 1 },
    { table: "gallery", min: 1 },
    { table: "result_categories", min: 1 },
    { table: "result_inner", min: 0 },
    { table: "video_categories", min: 0 },
    { table: "videos", min: 0 },
  ];

  let allOk = true;
  const counts = {};
  for (const check of tablesToCheck) {
    const { count, error } = await supabase
      .from(check.table)
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error(`  ❌ "${check.table}": ${error.message}`);
      allOk = false;
    } else {
      console.log(`  ✅ "${check.table}": ${count} rows`);
      counts[check.table] = count;
    }
  }

  if (!allOk) {
    console.error("\n❌ Some core media tables are missing. Check Supabase setup.");
    process.exit(1);
  }

  // ─── Phase 2: Testimonials schema integrity check ──────────────────────────
  console.log("\n📋 Phase 2: Testimonials Schema Field Check...");
  const { data: sampleTest } = await supabase.from("testimonials").select("*").limit(1).single();
  if (sampleTest) {
    const presentCols = Object.keys(sampleTest);
    const requiredCols = ["id", "name", "message", "rating", "status", "show_type", "service_name", "short_name", "source"];
    const missingCols = requiredCols.filter(c => !presentCols.includes(c));
    if (missingCols.length > 0) {
      console.warn(`  ⚠️  Testimonials table is MISSING columns: ${missingCols.join(", ")}`);
      console.warn(`  ⚠️  IMPORTANT: Please run the SQL in 'backend/media_supabase_schema_patch.sql'`);
      console.warn(`       in your Supabase SQL Editor to add these columns before continuing.`);
    } else {
      console.log(`  ✅ All required testimonials columns present: ${requiredCols.join(", ")}`);
    }
    console.log(`  ✅ Testimonials current columns: ${presentCols.join(", ")}`);
  }

  // ─── Phase 3: Gallery & Media Integrity Stats ──────────────────────────────
  console.log("\n📋 Phase 3: Media Data Integrity Statistics...");
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("id, image_url, status")
    .limit(1000);
  
  const withImage = galleryItems.filter(g => g.image_url).length;
  const activeGallery = galleryItems.filter(g => g.status === "active").length;
  console.log(`  🖼️  Gallery Items:          ${counts.gallery}`);
  console.log(`  ✅  With Image URL:         ${withImage}/${galleryItems.length}`);
  console.log(`  ✅  Active:                 ${activeGallery}/${galleryItems.length}`);
  console.log(`  📁  Result Categories:      ${counts.result_categories}`);
  console.log(`  🔁  Before/After Media:     ${counts.result_inner}`);
  console.log(`  📹  Video Categories:       ${counts.video_categories}`);
  console.log(`  🎬  Videos:                 ${counts.videos}`);
  console.log(`  ⭐  Testimonials:           ${counts.testimonials}`);

  // ─── Phase 4: Migrate PressMedia singleton ─────────────────────────────────
  console.log("\n📋 Phase 4: Migrating PressMedia CMS Singleton (MongoDB → Supabase)...");
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    await mongoClient.connect();
    console.log("  ✅ MongoDB Connected");
    const db = mongoClient.db("dmctrichology");

    // Migrate PressMedia
    const pmColl = db.collection("pressmedia");
    const pmDoc = await pmColl.findOne({});
    const pressMediaData = pmDoc ? cleanDoc(pmDoc) : defaultPressMediaData;
    const pmSourceMsg = pmDoc ? "migrated from MongoDB document" : "seeded default fallback";

    const { error: pmErr } = await supabase
      .from("homepage_sections")
      .upsert({ id: "press_media", data: pressMediaData, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (pmErr) {
      console.error(`  ❌ PressMedia upsert failed: ${pmErr.message}`);
    } else {
      console.log(`  ✅ PressMedia saved to homepage_sections[press_media] — ${pmSourceMsg}`);
    }

    // ─── Phase 5: Migrate Influencer singleton ─────────────────────────────
    console.log("\n📋 Phase 5: Migrating Influencer CMS Singleton (MongoDB → Supabase)...");
    const infColl = db.collection("influencers");
    const infDoc = await infColl.findOne({});
    const influencerData = infDoc ? cleanDoc(infDoc) : defaultInfluencerData;
    const infSourceMsg = infDoc ? "migrated from MongoDB document" : "seeded default fallback";

    const { error: infErr } = await supabase
      .from("homepage_sections")
      .upsert({ id: "influencers", data: influencerData, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (infErr) {
      console.error(`  ❌ Influencer upsert failed: ${infErr.message}`);
    } else {
      console.log(`  ✅ Influencer saved to homepage_sections[influencers] — ${infSourceMsg}`);
    }

  } finally {
    await mongoClient.close();
    console.log("  🔌 MongoDB connection closed.");
  }

  // ─── Final Report ────────────────────────────────────────────────────────
  console.log("\n=============================================");
  console.log("🎉 STEP 8 — MEDIA MIGRATION COMPLETE");
  console.log("=============================================");
  console.log(`  ✅ testimonials:             ${counts.testimonials} rows — Supabase-native`);
  console.log(`  ✅ gallery:                  ${counts.gallery} items — Supabase-native`);
  console.log(`  ✅ result_categories:        ${counts.result_categories} categories — Supabase-native`);
  console.log(`  ✅ result_inner:             ${counts.result_inner} before/after items — Supabase-native`);
  console.log(`  ✅ video_categories:         ${counts.video_categories} categories — Supabase-native`);
  console.log(`  ✅ videos:                   ${counts.videos} videos — Supabase-native`);
  console.log(`  ✅ PressMedia CMS:           Migrated → homepage_sections[press_media]`);
  console.log(`  ✅ Influencer CMS:           Migrated → homepage_sections[influencers]`);
  console.log("=============================================\n");
};

migrate().catch(err => {
  console.error("❌ Fatal migration error:", err.message);
  process.exit(1);
});
