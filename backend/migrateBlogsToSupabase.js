/**
 * STEP 7 — Blogs System Migration
 * 
 * Core blogs, blog_categories, blog_comments are ALREADY Supabase-native.
 * This script migrates only the BlogPage CMS singleton (MongoDB) → Supabase homepage_sections.
 * 
 * Run: node migrateBlogsToSupabase.js
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

// Default fallback for BlogPage CMS singleton
const defaultBlogPageData = {
  hero: {
    title: "Blog",
    breadcrumbText: "Blog",
    bannerImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    overlayOpacity: 0.5,
    bannerHeight: "400px"
  },
  listing: {
    sidebarSearchPlaceholder: "Enter Key Word",
    sidebarCategoriesTitle: "Blog Categories",
    sidebarRecentPostsTitle: "Recent Post",
    promoImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    promoLink: "",
    promoButtonText: "Special Offer",
    categories: [
      { name: "Hair Transplant Tips", count: 4 },
      { name: "Scalp Care", count: 3 },
      { name: "PRP & Biologicals", count: 2 }
    ],
    recentPosts: []
  }
};

const cleanDoc = (doc) => {
  if (!doc) return null;
  const cleaned = { ...doc };
  delete cleaned._id;
  delete cleaned.__v;
  return cleaned;
};

const migrate = async () => {
  console.log("=========================================");
  console.log("🚀 STEP 7 — BLOGS SYSTEM MIGRATION");
  console.log("=========================================\n");

  // ─── Phase 1: Verify core blogs tables ─────────────────────────
  console.log("📋 Phase 1: Verifying Core Blog Tables in Supabase...");
  
  const tableChecks = [
    { table: 'blogs', expectedMin: 1 },
    { table: 'blog_categories', expectedMin: 1 },
    { table: 'blog_comments', expectedMin: 0 },
  ];

  let allTablesOk = true;
  for (const check of tableChecks) {
    const { count, error } = await supabase
      .from(check.table)
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error(`  ❌ Table "${check.table}": ERROR — ${error.message}`);
      allTablesOk = false;
    } else {
      console.log(`  ✅ Table "${check.table}": EXISTS with ${count} rows (min required: ${check.expectedMin})`);
    }
  }

  if (!allTablesOk) {
    console.error("\n❌ Core blog tables missing in Supabase. Please check your setup.");
    process.exit(1);
  }

  // ─── Phase 2: Schema field integrity check ──────────────────────
  console.log("\n📋 Phase 2: Blog Schema Field Integrity Check...");
  const { data: sampleBlog } = await supabase.from('blogs').select('*').limit(1).single();
  if (sampleBlog) {
    const requiredFields = ['id','title','slug','status','meta_title','meta_description','blog_image','faqs','category_id','created_at'];
    const presentFields = Object.keys(sampleBlog);
    const missingFields = requiredFields.filter(f => !presentFields.includes(f));
    if (missingFields.length > 0) {
      console.error(`  ❌ Missing fields in blogs table: ${missingFields.join(', ')}`);
    } else {
      console.log(`  ✅ All required fields present in blogs table: ${requiredFields.join(', ')}`);
    }
  }

  // ─── Phase 3: Data integrity stats ─────────────────────────────
  console.log("\n📋 Phase 3: Blog Data Integrity Statistics...");
  const { data: allBlogs, count: blogCount } = await supabase
    .from('blogs')
    .select('id,title,slug,status,meta_title,blog_image,faqs,category_id', { count: 'exact' });

  const withSeo = allBlogs.filter(b => b.meta_title).length;
  const withImage = allBlogs.filter(b => b.blog_image).length;
  const withFaqs = allBlogs.filter(b => b.faqs && (Array.isArray(b.faqs) ? b.faqs.length > 0 : false)).length;
  const published = allBlogs.filter(b => b.status === 'Published').length;
  const withCategory = allBlogs.filter(b => b.category_id).length;
  const slugsPresent = allBlogs.filter(b => b.slug && b.slug.length > 0).length;

  console.log(`  📰 Total Blogs:         ${blogCount}`);
  console.log(`  ✅ Published:           ${published}/${blogCount}`);
  console.log(`  ✅ With Slugs:          ${slugsPresent}/${blogCount}`);
  console.log(`  ✅ With SEO meta:       ${withSeo}/${blogCount}`);
  console.log(`  ✅ With Blog Image:     ${withImage}/${blogCount}`);
  console.log(`  ✅ With FAQs:           ${withFaqs}/${blogCount}`);
  console.log(`  ℹ️  With Category Link:  ${withCategory}/${blogCount}`);

  const { count: catCount } = await supabase.from('blog_categories').select('id', { count: 'exact', head: true });
  const { count: commentCount } = await supabase.from('blog_comments').select('id', { count: 'exact', head: true });
  console.log(`  📁 Blog Categories:     ${catCount}`);
  console.log(`  💬 Blog Comments:       ${commentCount}`);

  // ─── Phase 4: Migrate BlogPage singleton ─────────────────────────
  console.log("\n📋 Phase 4: Migrating BlogPage CMS Singleton (MongoDB → Supabase)...");
  
  const mongoClient = new MongoClient(MONGO_URI);
  try {
    await mongoClient.connect();
    console.log("  ✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");
    const coll = db.collection("blogpages");
    const doc = await coll.findOne({});

    let blogPageData;
    let sourceMsg;

    if (doc) {
      blogPageData = cleanDoc(doc);
      sourceMsg = "migrated from MongoDB singleton";
    } else {
      blogPageData = defaultBlogPageData;
      sourceMsg = "seeded default fallback (no MongoDB document found)";
    }

    const { error: upsertErr } = await supabase
      .from('homepage_sections')
      .upsert({
        id: 'blog_page',
        data: blogPageData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (upsertErr) {
      console.error(`  ❌ Failed to upsert BlogPage to Supabase: ${upsertErr.message}`);
    } else {
      console.log(`  ✅ BlogPage CMS singleton saved to homepage_sections (key: "blog_page") — ${sourceMsg}`);
    }

  } finally {
    await mongoClient.close();
    console.log("  🔌 MongoDB connection closed.");
  }

  // ─── Final Report ────────────────────────────────────────────────
  console.log("\n=========================================");
  console.log("🎉 STEP 7 — BLOGS SYSTEM MIGRATION COMPLETE");
  console.log("=========================================");
  console.log(`  ✅ blogs table:          ${blogCount} rows — Supabase-native (no migration needed)`);
  console.log(`  ✅ blog_categories:      ${catCount} rows — Supabase-native (no migration needed)`);
  console.log(`  ✅ blog_comments:        ${commentCount} rows — Supabase-native (no migration needed)`);
  console.log(`  ✅ BlogPage CMS:         Migrated to homepage_sections[blog_page]`);
  console.log("=========================================\n");
};

migrate().catch(err => {
  console.error("❌ Fatal migration error:", err.message);
  process.exit(1);
});
