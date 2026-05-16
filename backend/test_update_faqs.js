require("dotenv").config();
const supabase = require("./config/supabase");

async function testUpdate() {
  const blogId = "25987437-5258-4c80-8dfd-d2c67a55f5a9"; // The one we know has 1 FAQ
  const testFaqs = [
    { question: "Q1?", answer: "A1" },
    { question: "Q2?", answer: "A2" }
  ];

  console.log("Updating blog with 2 FAQs...");
  const { data, error } = await supabase
    .from('blogs')
    .update({ faqs: testFaqs })
    .eq('id', blogId)
    .select();

  if (error) {
    console.error("Update Error:", error);
    process.exit(1);
  }

  console.log("Successfully updated. Current FAQs in DB:");
  console.log(JSON.stringify(data[0].faqs, null, 2));
  process.exit(0);
}

testUpdate();
