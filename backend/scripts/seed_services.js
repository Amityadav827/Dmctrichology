require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function seedServices() {
  console.log("🚀 Seeding Services...");

  // Get categories
  const { data: categories } = await supabase.from('service_categories').select('id, name');
  const { data: subCats } = await supabase.from('second_categories').select('id, name, category_id');

  if (!categories || !subCats) {
    console.error("Categories not found. Please run seed_data.js first.");
    return;
  }

  const services = [
    {
      category_id: categories.find(c => c.name === 'Hair Transplant')?.id,
      subcategory_id: subCats.find(s => s.name === 'FUE Method')?.id,
      name: 'Advanced FUE Hair Transplant',
      slug: 'advanced-fue-hair-transplant',
      description: 'The most popular minimally invasive hair restoration technique.',
      status: 'active',
      order: 1
    },
    {
      category_id: categories.find(c => c.name === 'Hair Transplant')?.id,
      subcategory_id: subCats.find(s => s.name === 'DHI Technique')?.id,
      name: 'DHI Sapphire Hair Transplant',
      slug: 'dhi-sapphire-hair-transplant',
      description: 'Direct Hair Implantation using Sapphire blades for maximum density.',
      status: 'active',
      order: 2
    },
    {
      category_id: categories.find(c => c.name === 'Non-Surgical Treatments')?.id,
      subcategory_id: subCats.find(s => s.name === 'PRP Therapy')?.id,
      name: 'GFC Therapy (Advanced PRP)',
      slug: 'gfc-therapy-advanced-prp',
      description: 'Growth Factor Concentrate therapy for thinning hair.',
      status: 'active',
      order: 1
    }
  ];

  const { data, error } = await supabase.from('services').insert(services.filter(s => s.category_id && s.subcategory_id));
  
  if (error) {
    console.error("Services Seeding Error:", error.message);
  } else {
    console.log("✅ Services Seeded Successfully!");
  }
}

seedServices();
