require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log("Starting migration...");

// Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const idMap = new Map(); // MongoId -> SupabaseId

const migrateCollection = async (db, collectionName, tableName, transformFn) => {
  console.log(`\n--- Migrating ${collectionName} -> ${tableName} ---`);
  try {
    const mongoData = await db.collection(collectionName).find({}).toArray();
    console.log(`Fetched ${mongoData.length} records from MongoDB collection: ${collectionName}`);

    if (mongoData.length === 0) return;

    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (const item of mongoData) {
      try {
        const transformed = transformFn(item);
        
        // Remove undefined fields
        Object.keys(transformed).forEach(key => transformed[key] === undefined && delete transformed[key]);

        const { data, error } = await supabase.from(tableName).insert([transformed]).select().single();

        if (error) {
          if (error.code === '23505') { // Unique violation
            duplicateCount++;
            // Try to find the existing record to map the ID for relationships
            let searchField = '';
            let searchValue = '';
            if (transformed.email) { searchField = 'email'; searchValue = transformed.email; }
            else if (transformed.slug) { searchField = 'slug'; searchValue = transformed.slug; }
            else if (transformed.name) { searchField = 'name'; searchValue = transformed.name; }
            else if (transformed.title) { searchField = 'title'; searchValue = transformed.title; }

            if (searchField && searchValue) {
              const { data: existing } = await supabase.from(tableName).select('id').eq(searchField, searchValue).single();
              if (existing) idMap.set(item._id.toString(), existing.id);
            }
          } else {
            console.error(`Error inserting into ${tableName} (${item._id}):`, error.message);
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
    console.log(`Finished ${tableName}: ${successCount} success, ${duplicateCount} skipped duplicates, ${errorCount} errors.`);
  } catch (err) {
    console.error(`Fatal error migrating ${tableName}:`, err.message);
  }
};

const runMigration = async () => {
  const mongoClient = new MongoClient(process.env.MONGO_URI);
  try {
    await mongoClient.connect();
    console.log("✅ MongoDB connection success");
    const db = mongoClient.db();

    // 1. Roles
    await migrateCollection(db, 'roles', 'roles', (item) => ({
      name: item.name,
      permissions: item.permissions || []
    }));

    // 2. Users
    await migrateCollection(db, 'users', 'users', (item) => ({
      name: item.name,
      email: item.email,
      password: item.password,
      phone: item.phone || "",
      status: item.status || "active",
      role_id: idMap.get(item.role?.toString()) || null
    }));

    // 3. Service Categories
    await migrateCollection(db, 'servicecategories', 'service_categories', (item) => ({
      name: item.name,
      slug: item.slug,
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 4. Second Categories
    await migrateCollection(db, 'secondcategories', 'second_categories', (item) => ({
      name: item.name,
      slug: item.slug,
      order: item.order || 0,
      status: item.status || "active",
      category_id: idMap.get(item.categoryId?.toString()) || null
    }));

    // 5. Result Categories
    await migrateCollection(db, 'resultcategories', 'result_categories', (item) => ({
      name: item.name,
      description: item.description || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 6. Video Categories
    await migrateCollection(db, 'videocategories', 'video_categories', (item) => ({
      name: item.name,
      description: item.description || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 7. Services
    await migrateCollection(db, 'services', 'services', (item) => ({
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

    // 8. Blogs
    await migrateCollection(db, 'blogs', 'blogs', (item) => ({
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
      blog_date: item.blogDate ? new Date(item.blogDate).toISOString() : new Date().toISOString(),
      status: item.status || "active",
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords,
      canonical_url: item.canonicalUrl
    }));

    // 9. Testimonials
    await migrateCollection(db, 'testimonials', 'testimonials', (item) => ({
      name: item.name,
      designation: item.designation || "",
      review: item.message || item.review || "",
      rating: item.rating || 5,
      image: item.image || "",
      order: item.order || 0,
      status: item.status || "active"
    }));

    // 10. Gallery
    await migrateCollection(db, 'galleries', 'gallery', (item) => ({
      title: item.title,
      images: item.images || [],
      status: item.status || "active",
      order: item.order || 0
    }));

    // 11. Appointments
    await migrateCollection(db, 'appointments', 'appointments', (item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      service: item.service,
      appointment_date: item.appointmentDate,
      message: item.message || "",
      status: item.status || "new",
      notes: item.notes || ""
    }));

    // 12. Callbacks
    await migrateCollection(db, 'callbacks', 'callbacks', (item) => ({
      name: item.name,
      mobile: item.mobile,
      status: item.status || "new"
    }));

    // 13. Contacts
    await migrateCollection(db, 'contacts', 'contacts', (item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      message: item.message,
      status: item.status || "new"
    }));

    // 14. Pages
    await migrateCollection(db, 'pages', 'pages', (item) => ({
      title: item.title,
      slug: item.slug,
      content: item.content || "",
      status: item.status || "Published",
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords,
      canonical_url: item.canonicalUrl
    }));

    // 15. Videos
    await migrateCollection(db, 'videos', 'videos', (item) => ({
      title: item.title,
      video_url: item.videoUrl,
      thumbnail: item.thumbnail || "",
      category_id: idMap.get(item.categoryId?.toString()) || null,
      status: item.status || "active",
      order: item.order || 0
    }));

    // 16. Result Items
    await migrateCollection(db, 'resultinners', 'result_inner', (item) => ({
      title: item.title,
      description: item.description || "",
      before_image: item.beforeImage || "",
      after_image: item.afterImage || "",
      category_id: idMap.get(item.categoryId?.toString()) || null,
      status: item.status || "active",
      order: item.order || 0
    }));

    console.log("\n--- MIGRATION COMPLETE ---");
    
    // Verification query
    const { count, error } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
    if (!error) {
      console.log(`✅ Verification: blogs table now has ${count} records in Supabase.`);
    } else {
      console.error(`❌ Verification failed: ${error.message}`);
    }

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoClient.close();
    process.exit(0);
  }
};

runMigration();
