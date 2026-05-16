require("dotenv").config();
const supabase = require("./config/supabase");

async function checkFaqs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, faqs')
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching blogs:", error);
    process.exit(1);
  }

  console.log("Last 5 updated blogs FAQ count:");
  data.forEach(blog => {
    const faqCount = Array.isArray(blog.faqs) ? blog.faqs.length : (blog.faqs ? "Not an array" : 0);
    console.log(`ID: ${blog.id} | Title: ${blog.title} | FAQs Count: ${faqCount}`);
    if (faqCount > 0) {
      console.log("FAQs:", JSON.stringify(blog.faqs, null, 2));
    }
  });
  process.exit(0);
}

checkFaqs();
