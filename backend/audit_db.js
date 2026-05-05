require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function auditDatabase() {
  console.log("--- DATABASE AUDIT ---");
  
  // Tables to check
  const tableNames = [
    'video_categories',
    'service_categories',
    'second_categories',
    'result_categories',
    'blog_categories', // Might not exist
    'videos',
    'blogs',
    'services',
    'results'
  ];

  for (const tableName of tableNames) {
    try {
      const { data, error } = await supabase.from(tableName).select('*').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ Table '${tableName}' does NOT exist.`);
        } else {
          console.error(`⚠️ Error checking table '${tableName}':`, error.message);
        }
      } else {
        console.log(`✅ Table '${tableName}' exists.`);
        // List columns
        if (data.length > 0) {
            console.log(`   Sample record keys: ${Object.keys(data[0]).join(', ')}`);
        } else {
            console.log(`   Table exists but is empty.`);
        }
      }
    } catch (e) {
      console.error(`Unexpected error for table '${tableName}':`, e.message);
    }
  }
}

auditDatabase();
