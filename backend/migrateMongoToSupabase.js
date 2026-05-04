require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log("Starting FINAL PATCHED migration process...");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const idMap = new Map();

const migrateCollection = async (db, collectionName, tableName, transformFn) => {
  console.log(`\n--- Migrating ${collectionName} -> ${tableName} ---`);
  try {
    const mongoData = await db.collection(collectionName).find({}).toArray();
    console.log(`Fetched ${mongoData.length} records from MongoDB collection: ${collectionName}`);

    if (mongoData.length === 0) return 0;

    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (const item of mongoData) {
      try {
        let transformed = transformFn(item);
        let currentData = { ...transformed };
        let attemptSuccess = false;
        let attempts = 0;

        while (!attemptSuccess && attempts < 20) {
          attempts++;
          const { data, error } = await supabase.from(tableName).insert([currentData]).select().single();

          if (!error) {
            idMap.set(item._id.toString(), data.id);
            successCount++;
            attemptSuccess = true;
          } else {
            const errMsg = error.message;
            if (error.code === '23505') { 
              duplicateCount++;
              attemptSuccess = true;
            } else if (errMsg.includes("column") && (errMsg.includes("does not exist") || errMsg.includes("Could not find"))) {
              const missingCol = errMsg.match(/column "(.+?)"/)?.[1] || errMsg.match(/find the '(.+?)' column/)?.[1];
              if (missingCol && currentData.hasOwnProperty(missingCol)) {
                console.warn(`⚠️ Removing missing column '${missingCol}' from '${tableName}'`);
                delete currentData[missingCol];
                if (Object.keys(currentData).length === 0) {
                  attemptSuccess = true;
                  errorCount++;
                }
              } else {
                console.error(`❌ Column error in ${tableName}: "${errMsg}"`);
                attemptSuccess = true;
                errorCount++;
              }
            } else if (errMsg.includes("violates not-null constraint")) {
               const missingCol = errMsg.match(/column "(.+?)"/)?.[1];
               if (missingCol) {
                 console.warn(`⚠️ Fallback for NOT NULL '${missingCol}' in '${tableName}'`);
                 currentData[missingCol] = ".";
               } else {
                 attemptSuccess = true;
                 errorCount++;
               }
            } else {
              console.error(`❌ Error in ${tableName}:`, errMsg);
              errorCount++;
              attemptSuccess = true;
            }
          }
        }
      } catch (innerErr) {
        console.error(`❌ Fatal item error in ${tableName}:`, innerErr.message);
        errorCount++;
      }
    }
    console.log(`✅ Finished ${tableName}: ${successCount} success, ${duplicateCount} skipped duplicates, ${errorCount} errors.`);
    return successCount;
  } catch (err) {
    console.error(`❌ Fatal collection error ${tableName}:`, err.message);
    return 0;
  }
};

const runMigration = async () => {
  const mongoClient = new MongoClient(process.env.MONGO_URI);
  try {
    await mongoClient.connect();
    console.log("✅ MongoDB connection success");
    const db = mongoClient.db("dmctrichology");
    console.log("Using Database:", db.databaseName);

    // Only run for failed ones or all (skipped duplicates will handle it)
    await migrateCollection(db, 'services', 'services', (item) => ({
      title: item.title,
      slug: item.slug,
      short_description: item.shortDescription || "",
      full_description: item.fullDescription || "",
      service_image: item.serviceImage || "",
      banner_image: item.bannerImage || "",
      order: item.order || 0,
      status: item.status || "active",
      category_id: idMap.get(item.categoryId?.toString()) || null
    }));

    await migrateCollection(db, 'galleries', 'gallery', (item) => ({
      title: item.title,
      image_url: item.imageUrl || (item.images && item.images[0]) || "",
      status: item.status || "active",
      order: item.order || 0
    }));

    await migrateCollection(db, 'appointments', 'appointments', (item) => ({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      service: item.service,
      appointment_date: item.appointmentDate,
      message: item.message || "",
      status: item.status || "active",
      notes: item.notes || ""
    }));

    console.log(`\n🎉 FINAL PATCHED MIGRATION FINISHED.`);

  } catch (err) {
    console.error("❌ Fatal failure:", err);
  } finally {
    await mongoClient.close();
    process.exit(0);
  }
};

runMigration();
