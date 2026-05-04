require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const tablesToCheck = [
  'roles', 'users', 'services', 'service_categories', 'testimonials', 'blogs', 
  'gallery', 'result_categories', 'result_inner', 'appointments', 'callbacks', 
  'contacts', 'menus', 'operations', 'menu_operations', 'pages', 'redirects', 
  'seo_pages', 'service_faqs', 'second_categories', 'robots', 'sitemaps', 
  'video_categories', 'videos'
];

async function check() {
  console.log("Checking Supabase Tables...");
  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('not find the table')) {
        console.log(`❌ ${table}: MISSING`);
      } else {
        console.log(`✅ ${table}: EXISTS (${error.message})`);
      }
    } else {
      console.log(`✅ ${table}: EXISTS`);
    }
  }
}

check();
