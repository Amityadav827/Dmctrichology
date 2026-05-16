// Copied logic from blogController.js
const mapToSupabase = (data) => {
  const result = {
    title: data.title,
    author: data.author,
    show_type: data.show_type || data.showType,
    layout_type: data.layout_type || data.layoutType,
    admin_description: data.admin_description || data.adminDescription,
    short_description: data.short_description || data.shortDescription,
    full_description: data.full_description || data.fullDescription,
    blog_image: data.blog_image || data.blogImage,
    banner_image: data.banner_image || data.bannerImage,
    alt_tag: data.alt_tag || data.altTag,
    tags: data.tags,
    slug: data.slug,
    meta_title: data.meta_title || data.metaTitle,
    meta_keywords: data.meta_keywords || data.metaKeywords,
    meta_description: data.meta_description || data.metaDescription,
    canonical_url: data.canonical_url || data.canonicalUrl,
    blog_date: data.blog_date || data.blogDate,
    status: data.status,
    category_id: data.category_id || data.categoryId || null,
  };

  if (data.faqs !== undefined) {
    result.faqs = (() => {
      try {
        return typeof data.faqs === 'string' ? JSON.parse(data.faqs) : (data.faqs || []);
      } catch (e) {
        console.error("[mapToSupabase] FAQ Parse Error:", e.message);
        return [];
      }
    })();
  }

  return result;
};

async function testLogic() {
  console.log("Testing mapToSupabase logic...");
  
  const mockFaqs = [
    { question: "Q1", answer: "A1" },
    { question: "Q2", answer: "A2" }
  ];
  
  // Simulation 1: data.faqs is a JSON string (from Multer/Frontend)
  const data1 = {
    title: "Test Blog",
    faqs: JSON.stringify(mockFaqs)
  };
  
  const result1 = mapToSupabase(data1);
  console.log("\nSimulation 1 (String):");
  console.log("Result FAQs Count:", result1.faqs?.length);
  console.log("Result FAQs:", JSON.stringify(result1.faqs, null, 2));

  // Simulation 2: data.faqs is already an array
  const data2 = {
    title: "Test Blog",
    faqs: mockFaqs
  };
  
  const result2 = mapToSupabase(data2);
  console.log("\nSimulation 2 (Array):");
  console.log("Result FAQs Count:", result2.faqs?.length);
  
  if (result1.faqs?.length === 2 && result2.faqs?.length === 2) {
    console.log("\n✅ Logic is CORRECT. It correctly parses multiple FAQs.");
  } else {
    console.log("\n❌ Logic is INCORRECT.");
  }
}

testLogic();
