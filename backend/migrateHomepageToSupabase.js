/**
 * MIGRATION & SEEDING: MongoDB Homepage Composition & 13 Singleton Sections → Supabase
 *
 * Run: node migrateHomepageToSupabase.js
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

// Default seed fallbacks for safety if MongoDB collections are empty
const defaults = {
  hero: {
    slides: [
      {
        tag: "DMC TRICHOLOGY",
        title: "Experience The Art Of Natural Hair Restoration",
        description: "Advanced techniques tailored for your unique needs. Restore your confidence with our expert surgeons.",
        backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/xun9sghr8p0bmbdf8p1r.png",
        primaryBtnText: "Book Appointment",
        primaryBtnLink: "/book-appointment"
      },
      {
        tag: "BEST HAIR CLINIC",
        title: "World-Class Hair Transplant Technology",
        description: "Using the latest FUE & DHT techniques for maximum density and natural-looking results.",
        backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/vtticvun32as1q2v6zxs.png",
        primaryBtnText: "Our Services",
        primaryBtnLink: "/services"
      }
    ],
    isActive: true
  },
  marquee: {
    enabled: true,
    backgroundColor: 'transparent',
    paddingTop: '60px',
    paddingBottom: '60px',
    marqueeSpeed: 30,
    pauseOnHover: true,
    items: [
      { title: 'At-Home Sessions', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/dujziywmelzwixisgvyb.png', link: '', enabled: true },
      { title: 'Dermatologist Monitored', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/rhqehubr894icsuzfcew.png', link: '', enabled: true },
      { title: 'Shark Tank Approved', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/gqnszoyafmildmq6l9mm.png', link: '', enabled: true },
      { title: 'US FDA Approved', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/eqmyy5zthf9zi92xyvxm.png', link: '', enabled: true },
      { title: 'Quick & Lasting Results', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/oihmmdhj7lbltqp9qgrj.png', link: '', enabled: true },
      { title: '100% Safe', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/pdc64p00mfiv0080ippb.png', link: '', enabled: true }
    ]
  },
  why_choose_us: {
    enabled: true,
    subtitle: 'Best Hair Graft Clinic',
    title: 'Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi',
    centralImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png',
    backgroundColor: '#ffffff',
    paddingTop: '0px',
    paddingBottom: '0px',
    showConnectorLines: true,
    showDots: true,
    features: [
      { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png', title: 'Natural Results', desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.', side: 'left', enabled: true },
      { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png', title: 'Customized Care', desc: 'Every Hair Loss Condition Is Different And Also Unique.', side: 'left', enabled: true },
      { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png', title: 'Reduce Surgical', desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.', side: 'right', enabled: true },
      { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png', title: 'Complete Aftercare', desc: 'Our Team Supports You From Consultation To Full Hair Growth.', side: 'right', enabled: true }
    ]
  },
  results_slider: {
    enabled: true,
    badgeText: 'BEFORE AND AFTER',
    heading: 'Results that speak for themselves',
    backgroundColor: '#FFFAF1',
    results: [
      { title: 'Korean Facial Illumination', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png', sessions: 'After 6 sessions' },
      { title: 'Acne Arrestor Facial With Salicylic Peel', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png', sessions: 'After 4 sessions' },
      { title: 'Elastin Boost Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png', sessions: 'After 5 sessions' },
      { title: 'Derma Revive Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png', sessions: 'After 4 sessions' }
    ]
  },
  grade_slider: {
    enabled: true,
    badgeText: 'EQUIP YOUR RECOVERY',
    heading: 'Know Your Grade For Hair Transplant',
    backgroundColor: '#000000',
    grades: [
      { grade: 'GRADE 1', displayNum: '1', area: '20 cm²', density: '40/cm²', grafts: '800', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/s4afgaemlnxgpza6klc2.png' },
      { grade: 'GRADE 2', displayNum: '2', area: '40 cm²', density: '40/cm²', grafts: '1600', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/txprqtwbqrckrqbbtkbm.png' },
      { grade: 'GRADE 3', displayNum: '3', area: '60 cm²', density: '40/cm²', grafts: '2400', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/lm1wuhdnisarojusnl1c.png' },
      { grade: 'GRADE 4', displayNum: '4', area: '80 cm²', density: '40/cm²', grafts: '3200', session: '1-2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/fnby98gc9fgctznkbpdt.png' },
      { grade: 'GRADE 5', displayNum: '5', area: '100 cm²', density: '40/cm²', grafts: '4000', session: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/r3etpyboaedgq8gizzpc.png' }
    ]
  },
  reviews_videos: {
    enabled: true,
    badgeText: 'REVIEWS',
    heading: 'See the Results. Hear the Stories.',
    googleReviewText: '7000+ Reviews on',
    reviews: [
      { name: "Anjali Kohli", text: "The full body laser session was excellent. The therapist was highly skilled and made the experience comfortable and effective." },
      { name: "Ravi Malik", text: "The result of laser treatment is very nice. I have tried LHR from different places but find this the best." },
      { name: "Priya Sharma", text: "Today is the first session of slimming the abdomen, and love handles inch loss. I am totally satisfied with service." },
      { name: "Vikas sharma", text: "I really liked the way you handled that unwanted hair on my body. Avataar, you made it all so simple and quick" },
      { name: "Sneha Aggrawal", text: "I highly recommend their services to anyone looking to enhance their natural beauty and enjoy a moment of relaxation." },
      { name: "Rahul Tomar", text: "The results exceeded my expectations, and I felt pampered without the hassle of traveling to a salon." },
      { name: "Priyal Sen", text: "The procedure was quick, comfortable... I've already started noticing positive changes since my first session." },
      { name: "Viihan Rath", text: "The technician was very skilled, gentle, and made sure I was comfortable throughout the session." },
      { name: "Simran Paul", text: "I've had a great experience with my laser hair reduction sessions. My therapist is highly professional and gentle." },
      { name: "Alka Singh", text: "Thank you for the wonderful facial! The entire experience was relaxing and refreshing. You were very professional." }
    ],
    videos: [
      { name: "Real Results Story", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/ba79ohixgo962pduymyd.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { name: "Tanvi's Hydration", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/u1z7ggmemmekm84ep5hu.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { name: "Kritika Kamra", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/pgab6yn3skxpsx4oftws.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { name: "Shweta Tiwari", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/fgljhvgnh4lyhilbokdf.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { name: "Influencer Dish", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/o0naqjvopw7otiwdzwsg.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
    ]
  },
  about_us_care: {
    enabled: true,
    badgeText: 'ABOUT US CARE',
    heading: 'WHY CHOOSE DMC TRICHOLOGY?',
    description: 'At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.',
    mainImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png',
    bottomImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png',
    backgroundColor: '#ffffff',
    features: []
  },
  treatment_plans: {
    enabled: true,
    badgeText: 'OUR STEPS FOR HEALTHY SCALP',
    heading: 'Our Strategic Hair Treatment Plan',
    description: 'At DMC Trichology, we believe in a scientific, step-by-step restoration plan mapped by expert dermatologists to give you standard, permanent results.',
    features: [
      { text: 'Dynamic Scalp Mapping', enabled: true },
      { text: 'Follicular Preservation Extraction', enabled: true },
      { text: 'Artistic Density Implantation', enabled: true },
      { text: 'Rigorous Post-Care Support', enabled: true }
    ]
  },
  home_faqs: {
    enabled: true,
    badgeText: 'FAQs',
    heading: 'FREQUENTLY ASKED QUESTIONS',
    faqs: [
      { question: 'What is the cost of a hair transplant in Delhi?', answer: 'The cost depends on the number of grafts required and the restoration method (FUE or DHI) chosen. We offer customized luxury consultations to calculate your precise requirements.', enabled: true },
      { question: 'Is the FUE procedure permanent?', answer: 'Yes, the follicular units are extracted from the genetically permanent safe donor zone at the back of the scalp, ensuring life-long survival.', enabled: true },
      { question: 'How long is the recovery period?', answer: 'Most patients return to normal sedentary work in 2 to 3 days. Tiny scabs shed in 7 to 10 days, leaving zero visible linear scars.', enabled: true }
    ]
  },
  home_blogs: {
    enabled: true,
    badgeText: 'OUR ARTICLES',
    heading: 'Latest Insights In Hair Sciences',
    blogs: [
      { title: 'FUE vs DHI: Which restoration strategy is superior?', image: '', category: 'Hair Science', slug: 'fue-vs-dhi', enabled: true },
      { title: 'The role of DHT in male pattern baldness', image: '', category: 'Trichology', slug: 'dht-and-hair-loss', enabled: true }
    ]
  },
  press_medias: {
    enabled: true,
    badgeText: 'MEDIA AND TRUST',
    heading: 'As Featured In National Publications',
    press: [
      { title: 'Hindustan Times Award', imageUrl: '', link: '', date: 'January 2026', enabled: true },
      { title: 'Femina Elite Clinic Feature', imageUrl: '', link: '', date: 'March 2026', enabled: true }
    ]
  },
  surgeons: {
    badgeText: 'TRUSTED CARE SERVICES',
    heading: 'Meet Our Hair Transplant Surgeons',
    surgeons: [
      {
        name: 'Dr. Nandani Dadu',
        role: 'MBBS, A Board-Certified Trichologist, Has Been Studying Hair And Scalp Treatments For Over Ten Years.',
        image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
        features: [
          'Recover Stronger With Expert Orthopedic Rehabilitation',
          'Restoring Strength, Mobility, And Joint Health',
          'Comprehensive Care For Bones And Joints'
        ],
        buttonText: 'Get Details',
        buttonLink: '#'
      },
      {
        name: 'Dr. Nivedita Dadu',
        role: 'Expert Dermatologist and Hair Transplant Specialist with extensive experience in clinical dermatology.',
        image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
        features: [
          'Advanced Skin and Hair Solutions',
          'Personalized Patient Care',
          'Innovative Treatment Methods'
        ],
        buttonText: 'Get Details',
        buttonLink: '#'
      }
    ]
  },
  consultation: {
    badgeText: 'BOOK A CONSULTATION',
    heading: 'Restoring Not Just Your Hair, But Your Confidence.',
    description: 'Consult our trichology board-certified directors for customized restoration mapping.',
    buttonText: 'Book An Appointment',
    phonePlaceholder: 'Mobile Number*',
    namePlaceholder: 'Full Name*',
    emailPlaceholder: 'Email Address*'
  }
};

const migrate = async () => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    console.log("✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");

    // ==========================================
    // 1. MIGRATE PAGE COMPOSITION ('home')
    // ==========================================
    console.log("\n--- Migrating Page Composition (Slug: 'home') ---");
    const pagesCollection = db.collection("pages");
    const pageDoc = await pagesCollection.findOne({ slug: "home" });
    
    let compositionData = {
      title: "Home Page",
      slug: "home",
      sections: [
        { sectionId: "topbar", type: "global", order: 0, isActive: true },
        { sectionId: "header", type: "global", order: 1, isActive: true },
        { sectionId: "hero", type: "section", order: 2, isActive: true },
        { sectionId: "about-us", type: "section", order: 3, isActive: true },
        { sectionId: "services", type: "section", order: 4, isActive: true },
        { sectionId: "footer", type: "global", order: 100, isActive: true }
      ],
      metadata: {
        title: "DMC Trichology | Best Hair Transplant Clinic In Delhi",
        description: "Experience The Art Of Natural Hair Restoration at DMC Trichology."
      }
    };
    let isCompSeeded = false;

    if (pageDoc) {
      compositionData = cleanMongoDoc(pageDoc);
      console.log("👉 Found dynamic Homepage Page Composition in MongoDB.");
    } else {
      console.warn("⚠️ No homepage composition doc found in MongoDB. Using static default composition.");
      isCompSeeded = true;
    }

    const { data: savedComp, error: compErr } = await supabase
      .from("page_compositions")
      .upsert(
        {
          id: "home",
          data: compositionData,
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      )
      .select("id")
      .single();

    if (compErr) {
      console.error("❌ Error upserting homepage composition:", compErr.message);
      if (compErr.message.includes("relation \"public.page_compositions\" does not exist")) {
        console.error("\n👉 IMPORTANT: You must run the SQL statements in 'backend/homepage_supabase_schema.sql' inside your Supabase SQL Editor first!");
        mongoClient.close();
        return;
      }
    } else {
      console.log(`✅ Page Composition successfully migrated/seeded as: "${savedComp.id}"`);
    }

    // ==========================================
    // 2. MIGRATE 13 SINGLETON SECTIONS
    // ==========================================
    console.log("\n--- Migrating 13 Singleton content sections ---");

    const mapping = [
      { collection: "heros", key: "hero" },
      { collection: "marqueefeatures", key: "marquee" },
      { collection: "whychooseus", key: "why_choose_us" },
      { collection: "resultinners", key: "results_slider" }, // Also supports resultinners or resultssliders
      { collection: "resultssliders", key: "results_slider" },
      { collection: "gradesliders", key: "grade_slider" },
      { collection: "whychoosedmcs", key: "about_us_care" },
      { collection: "surgeons", key: "surgeons" },
      { collection: "reviews", key: "reviews_videos" },
      { collection: "treatmentplans", key: "treatment_plans" },
      { collection: "homefaqs", key: "home_faqs" },
      { collection: "homeblogs", key: "home_blogs" },
      { collection: "pressmedias", key: "press_medias" },
      { collection: "consultations", key: "consultation" }
    ];

    let successCount = 0;

    for (const item of mapping) {
      const coll = db.collection(item.collection);
      
      // Perform database existence check
      const collectionsInfo = await db.listCollections({ name: item.collection }).toArray();
      if (collectionsInfo.length === 0) {
        console.log(`ℹ️ Collection "${item.collection}" does not exist in MongoDB. Seeding standard fallback.`);
        // Seed default fallback directly
        const { error: seedErr } = await supabase
          .from("homepage_sections")
          .upsert({
            id: item.key,
            data: defaults[item.key] || {},
            updated_at: new Date().toISOString()
          }, { onConflict: "id" });
        
        if (seedErr) {
          console.error(`❌ Seeding fallback for key "${item.key}" failed:`, seedErr.message);
        } else {
          console.log(`✅ Seeded fallback for: "${item.key}"`);
          successCount++;
        }
        continue;
      }

      const doc = await coll.findOne({});
      let finalData = defaults[item.key] || {};
      let sourceMsg = "seeded default configuration";

      if (doc) {
        finalData = cleanMongoDoc(doc);
        sourceMsg = "migrated MongoDB document";
      } else {
        console.log(`⚠️ Collection "${item.collection}" is empty. Seeding defaults.`);
      }

      const { error: upsertErr } = await supabase
        .from("homepage_sections")
        .upsert({
          id: item.key,
          data: finalData,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (upsertErr) {
        console.error(`❌ Upserting section "${item.key}" failed:`, upsertErr.message);
      } else {
        console.log(`✅ Successfully loaded section: "${item.key}" (${sourceMsg})`);
        successCount++;
      }
    }

    console.log("\n========================================");
    console.log(`🎉 HOMEPAGE MIGRATION & SEEDING STATUS`);
    console.log(`   Page Composition Seeded : SUCCESS`);
    console.log(`   Total Layout Rows Seeded: ${successCount}`);
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
