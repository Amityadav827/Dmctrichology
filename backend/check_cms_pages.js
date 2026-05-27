require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkPages() {
  console.log("=== FETCHING CMS PAGES ===");
  const { data: pages, error } = await supabase
    .from("pages")
    .select("id, title, slug, status");

  if (error) {
    console.error("❌ Failed to fetch pages:", error.message);
  } else {
    console.log(`✅ Found ${pages.length} pages in CMS:`);
    console.table(pages);
  }
}

checkPages().catch(err => {
  console.error("❌ Fatal error:", err);
});
