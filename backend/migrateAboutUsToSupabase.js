/**
 * MIGRATION & SEEDING: MongoDB aboutus → Supabase about_us
 *
 * Run: node migrateAboutUsToSupabase.js
 *
 * What it does:
 *  1. Connects to MongoDB and fetches the singleton document from 'aboutus' collection
 *  2. If missing, falls back to the static aboutUsFallback object
 *  3. Cleans up Mongoose internal fields (_id, __v)
 *  4. Upserts into Supabase 'about_us' with id: 1
 *  5. Logs the final status
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");
const { aboutUsFallback } = require("./utils/aboutUsFallback");

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
  if (!doc) return null;
  const cleaned = { ...doc };
  delete cleaned._id;
  delete cleaned.__v;
  delete cleaned.createdAt;
  delete cleaned.updatedAt;
  return cleaned;
};

const migrate = async () => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    console.log("✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");
    const collection = db.collection("aboutus");

    let doc = await collection.findOne({});
    let isFallback = false;

    if (!doc) {
      console.warn("⚠️ No About Us document found in MongoDB! Using static fallback data as a seed...");
      doc = aboutUsFallback;
      isFallback = true;
    }

    const cleanedData = cleanMongoDoc(doc);

    console.log("Upserting to Supabase 'about_us' table...");
    const { data: savedData, error } = await supabase
      .from("about_us")
      .upsert(
        {
          id: 1, // Singleton row ID
          data: cleanedData,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "id",
          ignoreDuplicates: false
        }
      )
      .select("id, updated_at")
      .single();

    if (error) {
      console.error("❌ Error upserting to Supabase:", error.message, error.code);
      // Let's print out what could be wrong
      if (error.message.includes("relation \"public.about_us\" does not exist")) {
        console.error("\n👉 IMPORTANT: You must run the SQL statements in 'backend/about_us_supabase_schema.sql' inside your Supabase SQL Editor first!");
      }
    } else {
      console.log("\n========================================");
      console.log(`🎉 MIGRATION SUCCESSFUL!`);
      console.log(`   Table        : about_us`);
      console.log(`   Row ID       : ${savedData.id}`);
      console.log(`   Source       : ${isFallback ? "Static Fallback Seed" : "MongoDB 'aboutus' collection"}`);
      console.log(`   Last Updated : ${savedData.updated_at}`);
      console.log("========================================\n");
    }

  } catch (err) {
    console.error("❌ Fatal error during migration:", err.message);
    console.error(err);
  } finally {
    await mongoClient.close();
    console.log("🔌 MongoDB connection closed.");
  }
};

migrate();
