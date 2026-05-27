/**
 * MIGRATION & SEEDING: MongoDB aboutdrnandani & aboutdrnandanileads → Supabase
 *
 * Run: node migrateDrNandaniToSupabase.js
 *
 * What it does:
 *  1. Connects to MongoDB and fetches the singleton document from 'aboutdrnandani' collection
 *  2. Connects to MongoDB and fetches all documents from 'aboutdrnandanileads' collection
 *  3. Upserts page settings into Supabase 'about_dr_nandani' with id: 1
 *  4. Inserts/upserts all lead records into Supabase 'about_dr_nandani_leads'
 *  5. Logs the final status and record counts
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
  if (!doc) return null;
  const cleaned = { ...doc };
  delete cleaned._id;
  delete cleaned.__v;
  delete cleaned.createdAt;
  delete cleaned.updatedAt;
  return cleaned;
};

// Converts a 24-character hex MongoDB ObjectId to a valid v4 UUID structure
const convertMongoIdToUuid = (mongoId) => {
  if (!mongoId) return null;
  const str = mongoId.toString();
  if (str.length !== 24) return null;
  // Pad the 24 hex characters to form a 32 hex character UUID (8-4-4-4-12)
  // Format: 12345678-1234-1234-1234-123456789012
  const part1 = str.slice(0, 8);
  const part2 = str.slice(8, 12);
  const part3 = str.slice(12, 16);
  const part4 = str.slice(16, 20);
  const part5 = str.slice(20, 24) + "00000000"; // pad 8 zeroes to make it 12 chars
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

const migrate = async () => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    console.log("✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");

    // ==========================================
    // 1. MIGRATE PAGE CONFIGURATION
    // ==========================================
    console.log("\n--- Migrating Page Settings ---");
    const settingsCollection = db.collection("aboutdrnandani");
    let settingsDoc = await settingsCollection.findOne({});
    let settingsSuccess = false;

    if (!settingsDoc) {
      console.warn("⚠️ No Dr. Nandani page settings found in MongoDB! Settings migration will be skipped.");
    } else {
      const cleanedSettings = cleanMongoDoc(settingsDoc);
      
      const { data: savedSettings, error: settingsErr } = await supabase
        .from("about_dr_nandani")
        .upsert(
          {
            id: 1,
            data: cleanedSettings,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "id",
            ignoreDuplicates: false
          }
        )
        .select("id, updated_at")
        .single();

      if (settingsErr) {
        console.error("❌ Error upserting page settings to Supabase:", settingsErr.message);
        if (settingsErr.message.includes("relation \"public.about_dr_nandani\" does not exist")) {
          console.error("\n👉 IMPORTANT: You must run the SQL statements in 'backend/dr_nandani_supabase_schema.sql' inside your Supabase SQL Editor first!");
          mongoClient.close();
          return;
        }
      } else {
        console.log(`✅ Page settings successfully migrated to Supabase. Row ID: ${savedSettings.id}`);
        settingsSuccess = true;
      }
    }

    // ==========================================
    // 2. MIGRATE CONSULTATION LEADS
    // ==========================================
    console.log("\n--- Migrating Consultation Leads ---");
    const leadsCollection = db.collection("aboutdrnandanileads");
    const allLeads = await leadsCollection.find({}).toArray();
    console.log(`📦 Found ${allLeads.length} leads in MongoDB.`);

    let leadsMigrated = 0;
    let leadsErrors = 0;

    if (allLeads.length > 0) {
      for (const lead of allLeads) {
        const uuid = convertMongoIdToUuid(lead._id);
        
        const mappedLead = {
          id: uuid,
          name: lead.name || "Unknown",
          mobile: lead.mobile || "",
          email: lead.email || "",
          service: lead.service || "Dr. Nandani Dadu Consultation",
          appointment_date: lead.appointmentDate ? new Date(lead.appointmentDate).toISOString() : new Date().toISOString(),
          message: lead.message || "",
          status: lead.status || "new",
          notes: lead.notes || "",
          created_at: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
          updated_at: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : new Date().toISOString()
        };

        const { error: leadErr } = await supabase
          .from("about_dr_nandani_leads")
          .upsert(mappedLead, { onConflict: "id" });

        if (leadErr) {
          console.error(`❌ Error migrating lead ID "${lead._id}":`, leadErr.message);
          leadsErrors++;
        } else {
          leadsMigrated++;
        }
      }
      console.log(`✅ Leads Migration Complete. Successfully migrated: ${leadsMigrated}, Errors: ${leadsErrors}`);
    } else {
      console.log("⚠️ No lead records found to migrate.");
    }

    console.log("\n========================================");
    console.log(`🎉 DR. NANDANI MIGRATION STATUS`);
    console.log(`   Page Settings Status : ${settingsSuccess ? "SUCCESS" : "SKIPPED/FAILED"}`);
    console.log(`   Leads Migrated Count : ${leadsMigrated}`);
    console.log(`   Leads Migration Errs : ${leadsErrors}`);
    console.log("========================================\n");

  } catch (err) {
    console.error("❌ Fatal error during migration:", err.message);
    console.error(err);
  } finally {
    await mongoClient.close();
    console.log("🔌 MongoDB connection closed.");
  }
};

migrate();
