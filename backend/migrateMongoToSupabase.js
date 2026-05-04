require("dotenv").config();
const mongoose = require("mongoose");
const { createClient } = require("@supabase/supabase-js");

// Models
const Role = require("./models/Role");
const User = require("./models/User");
const ServiceCategory = require("./models/ServiceCategory");
const SecondCategory = require("./models/SecondCategory");
const ServiceFaq = require("./models/ServiceFaq");
const Service = require("./models/Service");
const Blog = require("./models/Blog");
const Testimonial = require("./models/Testimonial");
const Gallery = require("./models/Gallery");
const ResultCategory = require("./models/ResultCategory");
const ResultInner = require("./models/ResultInner");
const Appointment = require("./models/Appointment");
const Callback = require("./models/Callback");
const Contact = require("./models/Contact");
const Menu = require("./models/Menu");
const Operation = require("./models/Operation");
const MenuOperation = require("./models/MenuOperation");
const Page = require("./models/Page");
const Redirect = require("./models/Redirect");
const SeoPage = require("./models/SeoPage");
const Robots = require("./models/Robots");
const Sitemap = require("./models/Sitemap");
const VideoCategory = require("./models/VideoCategory");
const Video = require("./models/Video");

// Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const idMap = new Map(); // MongoId -> SupabaseId

const migrateTable = async (model, tableName, transformFn, selectFields = "") => {
  console.log(`\n--- Migrating ${tableName} ---`);
  try {
    let query = model.find();
    if (selectFields) query = query.select(selectFields);
    const mongoData = await query.lean();
    
    console.log(`Fetched ${mongoData.length} records from MongoDB.`);

    if (mongoData.length === 0) return;

    let successCount = 0;
    let errorCount = 0;

    for (const item of mongoData) {
      try {
        const transformed = transformFn(item);
        
        const { data, error } = await supabase.from(tableName).insert([transformed]).select().single();

        if (error) {
          if (error.code === '23505') { // Unique violation
            console.log(`Skipping duplicate in ${tableName}: ${item._id}`);
            // Still need to map the ID
            // We search for the existing record by unique field (e.g. email, slug, title)
            let searchField = 'id';
            let searchValue = '';
            if (transformed.email) { searchField = 'email'; searchValue = transformed.email; }
            else if (transformed.slug) { searchField = 'slug'; searchValue = transformed.slug; }
            else if (transformed.name) { searchField = 'name'; searchValue = transformed.name; }
            else if (transformed.title) { searchField = 'title'; searchValue = transformed.title; }

            if (searchValue) {
                const { data: existing } = await supabase.from(tableName).select('id').eq(searchField, searchValue).single();
                if (existing) idMap.set(item._id.toString(), existing.id);
            }
          } else {
            console.error(`Error inserting into ${tableName}:`, error.message);
            errorCount++;
          }
        } else {
          idMap.set(item._id.toString(), data.id);
          successCount++;
        }
      } catch (innerErr) {
        console.error(`Error processing item ${item._id} in ${tableName}:`, innerErr.message);
        errorCount++;
      }
    }
    console.log(`Finished ${tableName}: ${successCount} success, ${errorCount} errors.`);
  } catch (err) {
    console.error(`Fatal error migrating ${tableName}:`, err.message);
  }
};

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Roles
    await migrateTable(Role, 'roles', (item) => ({
      name: item.name,
      permissions: item.permissions || []
    }));

    // 2. Users (Include password)
    await migrateTable(User, 'users', (item) => ({
      name: item.name,
      email: item.email,
      password: item.password,
      phone: item.phone || "",
      status: item.status || "active",
      role_id: idMap.get(item.role?.toString()) || null
    }), "+password");

    // 3. Service Categories
    await migrateTable(ServiceCategory, 'service_categories', (item) => ({
      name: item.name,
      slug: item.slug,
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 4. Second Categories
    await migrateTable(SecondCategory, 'second_categories', (item) => ({
      name: item.name,
      slug: item.slug,
      order: item.order || 0,
      status: item.status || "active",
      category_id: idMap.get(item.categoryId?.toString()) || null
    }));

    // 5. Service FAQs
    await migrateTable(ServiceFaq, 'service_faqs', (item) => ({
      question: item.question,
      answer: item.answer,
      order: item.order || 0,
      status: item.status || "active",
      service_id: idMap.get(item.serviceId?.toString()) || null
    }));

    // 6. Result Categories
    await migrateTable(ResultCategory, 'result_categories', (item) => ({
      name: item.name,
      description: item.description || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 7. Video Categories
    await migrateTable(VideoCategory, 'video_categories', (item) => ({
      name: item.name,
      description: item.description || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 8. Menus
    await migrateTable(Menu, 'menus', (item) => ({
      name: item.name,
      url: item.url,
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 9. Operations
    await migrateTable(Operation, 'operations', (item) => ({
      name: item.name,
      url: item.url,
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 10. Menu Operations
    await migrateTable(MenuOperation, 'menu_operations', (item) => ({
      menu_id: idMap.get(item.menuId?.toString()),
      operation_id: idMap.get(item.operationId?.toString())
    }));

    // 11. Services
    await migrateTable(Service, 'services', (item) => ({
      title: item.title,
      slug: item.slug,
      short_description: item.shortDescription || "",
      full_description: item.fullDescription || "",
      service_image: item.serviceImage || "",
      banner_image: item.bannerImage || "",
      order: item.order || 0,
      status: item.status || "active",
      category_id: idMap.get(item.categoryId?.toString()) || null,
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords
    }));

    // 12. Blogs
    await migrateTable(Blog, 'blogs', (item) => ({
      title: item.title,
      slug: item.slug,
      author: item.author || "Admin",
      show_type: item.showType || "General",
      layout_type: item.layoutType || "Grid",
      admin_description: item.adminDescription || "",
      short_description: item.shortDescription || "",
      full_description: item.fullDescription || "",
      blog_image: item.blogImage || "",
      banner_image: item.bannerImage || "",
      alt_tag: item.altTag || "",
      tags: item.tags || [],
      blog_date: item.blogDate || new Date().toISOString(),
      status: item.status || "active",
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords,
      canonical_url: item.canonicalUrl
    }));

    // 13. Testimonials
    await migrateTable(Testimonial, 'testimonials', (item) => ({
      name: item.name,
      designation: item.designation || "",
      review: item.review,
      rating: item.rating || 5,
      image: item.image || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 14. Gallery
    await migrateTable(Gallery, 'gallery', (item) => ({
      title: item.title,
      images: item.images || [],
      status: item.status || "active",
      order: item.order || 0
    }));

    // 15. Appointments
    await migrateTable(Appointment, 'appointments', (item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      service: item.service,
      appointment_date: item.appointmentDate,
      message: item.message || "",
      status: item.status || "new",
      notes: item.notes || ""
    }));

    // 16. Callbacks
    await migrateTable(Callback, 'callbacks', (item) => ({
      name: item.name,
      mobile: item.mobile,
      status: item.status || "new"
    }));

    // 17. Contacts
    await migrateTable(Contact, 'contacts', (item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      message: item.message,
      status: item.status || "new"
    }));

    // 18. Pages
    await migrateTable(Page, 'pages', (item) => ({
      title: item.title,
      slug: item.slug,
      content: item.content || "",
      status: item.status || "Published",
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords,
      canonical_url: item.canonicalUrl
    }));

    // 19. Redirects
    await migrateTable(Redirect, 'redirects', (item) => ({
      source_url: item.sourceUrl,
      destination_url: item.destinationUrl,
      type: item.type || 301,
      status: item.status || "active"
    }));

    // 20. SEO Pages
    await migrateTable(SeoPage, 'seo_pages', (item) => ({
      page_name: item.pageName,
      slug: item.slug,
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords || [],
      status: item.status || "active"
    }));

    // 21. Robots
    await migrateTable(Robots, 'robots', (item) => ({
      content: item.content
    }));

    // 22. Sitemap
    await migrateTable(Sitemap, 'sitemaps', (item) => ({
      url: item.url,
      priority: item.priority || 0.5,
      change_freq: item.changeFreq || "weekly",
      last_modified: item.lastModified || new Date().toISOString()
    }));

    // 23. Result Items
    await migrateTable(ResultInner, 'result_inner', (item) => ({
      title: item.title,
      description: item.description || "",
      before_image: item.beforeImage || "",
      after_image: item.afterImage || "",
      category_id: idMap.get(item.categoryId?.toString()) || null,
      status: item.status || "active",
      order: item.order || 0
    }));

    // 24. Videos
    await migrateTable(Video, 'videos', (item) => ({
      title: item.title,
      video_url: item.videoUrl,
      thumbnail: item.thumbnail || "",
      category_id: idMap.get(item.categoryId?.toString()) || null,
      status: item.status || "active",
      order: item.order || 0
    }));

    console.log("\n--- MIGRATION COMPLETE ---");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

runMigration();
