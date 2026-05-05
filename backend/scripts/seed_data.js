require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function seed() {
  console.log("🚀 Starting Comprehensive Seeding Process...");

  // 1. Blog Categories
  const blogCatsData = [
    { name: 'Hair Transplant Tips', slug: 'hair-transplant-tips', status: 'active' },
    { name: 'Scalp Care', slug: 'scalp-care', status: 'active' },
    { name: 'PRP & Biologicals', slug: 'prp-biologicals', status: 'active' },
    { name: 'Patient Stories', slug: 'patient-stories', status: 'active' },
    { name: 'Product Reviews', slug: 'product-reviews', status: 'active' }
  ];
  const { data: blogCats } = await supabase.from('blog_categories').upsert(blogCatsData, { onConflict: 'slug' }).select();

  // 2. Video Categories
  const videoCatsData = [
    { name: 'Surgery Walkthroughs', order: 1, status: 'active' },
    { name: 'Expert Interviews', order: 2, status: 'active' },
    { name: 'Patient Testimonials', order: 3, status: 'active' },
    { name: 'Pre-Post Care', order: 4, status: 'active' },
    { name: 'Technology Overviews', order: 5, status: 'active' }
  ];
  const { data: videoCats } = await supabase.from('video_categories').upsert(videoCatsData, { onConflict: 'name' }).select();

  // 3. Service Categories
  const serviceCatsData = [
    { name: 'Hair Transplant', slug: 'hair-transplant', order: 1, status: 'active' },
    { name: 'Non-Surgical Treatments', slug: 'non-surgical', order: 2, status: 'active' },
    { name: 'Scalp Treatments', slug: 'scalp-treatments', order: 3, status: 'active' },
    { name: 'Advanced Diagnostics', slug: 'diagnostics', order: 4, status: 'active' },
    { name: 'Beard & Brow', slug: 'beard-brow', order: 5, status: 'active' }
  ];
  const { data: serviceCats } = await supabase.from('service_categories').upsert(serviceCatsData, { onConflict: 'slug' }).select();

  // 4. Result Categories
  const resultCatsData = [
    { name: 'Male Transplant', order: 1, status: 'active' },
    { name: 'Female Transplant', order: 2, status: 'active' },
    { name: 'Beard & Mustache', order: 3, status: 'active' },
    { name: 'Eyebrow Restoring', order: 4, status: 'active' },
    { name: 'Scalp Micropigmentation', order: 5, status: 'active' }
  ];
  const { data: resultCats } = await supabase.from('result_categories').upsert(resultCatsData, { onConflict: 'name' }).select();

  console.log("Seeding Items...");

  if (blogCats && blogCats.length > 0) {
    await supabase.from('blogs').insert([
      { title: 'Choosing the Right Surgeon', slug: 'choosing-surgeon', category_id: blogCats[0].id, author: 'Admin', content: 'Detailed post content...', status: 'Published' },
      { title: 'Post-Op Care Guide', slug: 'post-op-care', category_id: blogCats[1].id, author: 'Admin', content: 'Recovery tips...', status: 'Published' }
    ]);
  }

  if (videoCats && videoCats.length > 0) {
    await supabase.from('videos').insert([
      { title: 'Patient Interview: 1 Year Later', category_id: videoCats[2].id, video_url: 'https://youtube.com/watch?v=xyz123', status: 'active', order: 1 },
      { title: 'New Sapphire Technology', category_id: videoCats[4].id, video_url: 'https://youtube.com/watch?v=abc456', status: 'active', order: 2 }
    ]);
  }

  if (resultCats && resultCats.length > 0) {
    await supabase.from('result_inner').insert([
      { title: 'Frontal Hairline Restoration', category_id: resultCats[0].id, description: 'Natural looking hairline after 9 months.', status: 'active', order: 1 },
      { title: 'Beard Density Improvement', category_id: resultCats[2].id, description: 'Patchy beard fixed with DHI.', status: 'active', order: 2 }
    ]);
  }

  if (serviceCats && serviceCats.length > 0) {
    await supabase.from('services').insert([
      { title: 'Robotic Hair Transplant', slug: 'robotic-hair-transplant', category_id: serviceCats[0].id, short_description: 'Precision robotic surgery.', status: 'active', order: 1 },
      { title: 'Low Level Laser Therapy', slug: 'lllt', category_id: serviceCats[1].id, short_description: 'Non-invasive light therapy.', status: 'active', order: 2 }
    ]);
  }

  console.log("✅ Seeding completed with extended dummy data.");
}

seed();
