/**
 * MIGRATION: MongoDB servicedetails → Supabase service_details
 *
 * Run: node migrateServiceDetailsToSupabase.js
 *
 * What it does:
 *  1. Connects to MongoDB and fetches ALL documents from `servicedetails` collection
 *  2. Upserts each document into Supabase `service_details` table
 *     - slug     → unique key (TEXT)
 *     - data     → full document as JSONB (minus Mongo-specific fields)
 *  3. Logs success/error for each document
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const MONGO_URI = process.env.MONGO_URI;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_KEY missing in .env");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const cleanMongoDoc = (doc) => {
  const cleaned = { ...doc };
  // Remove MongoDB internal fields
  delete cleaned._id;
  delete cleaned.__v;
  // Keep createdAt/updatedAt in data for reference, but Supabase has its own timestamps
  return cleaned;
};

const migrate = async () => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    await mongoClient.connect();
    console.log("✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");
    // Mongoose model name is 'ServiceDetail' → collection is 'servicedetails'
    const collection = db.collection("servicedetails");

    const allDocs = await collection.find({}).toArray();
    console.log(`\n📦 Found ${allDocs.length} service detail documents in MongoDB\n`);

    if (allDocs.length === 0) {
      console.log("⚠️  No documents found. Make sure the collection name is correct.");
      console.log("   Checking available collections...");
      const collections = await db.listCollections().toArray();
      console.log("   Collections:", collections.map(c => c.name).join(", "));
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    for (const doc of allDocs) {
      const slug = doc.slug;

      if (!slug) {
        console.warn(`⚠️  Skipping document without slug: ${doc._id}`);
        skipCount++;
        continue;
      }

      const cleanedData = cleanMongoDoc(doc);

      // Upsert: if slug already exists → update data, else insert
      const { error } = await supabase
        .from("service_details")
        .upsert(
          {
            slug: slug,
            data: cleanedData,
          },
          {
            onConflict: "slug", // slug is unique key
            ignoreDuplicates: false, // update on conflict
          }
        );

      if (error) {
        console.error(`❌ Error migrating slug "${slug}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated: ${slug}`);
        successCount++;
      }
    }

    console.log("\n========================================");
    console.log(`🎉 MIGRATION COMPLETE`);
    console.log(`   ✅ Success : ${successCount}`);
    console.log(`   ❌ Errors  : ${errorCount}`);
    console.log(`   ⚠️  Skipped : ${skipCount}`);
    console.log("========================================\n");

  } catch (err) {
    console.error("❌ Fatal error during migration:", err.message);
    console.error(err);
  } finally {
    await mongoClient.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  }
};

migrate();
