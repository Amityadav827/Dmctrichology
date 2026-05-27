/**
 * MIGRATION & SEEDING: MongoDB hairtransplantclinic & hairtransplantclinicleads → Supabase
 *
 * Run: node migrateDrClinicToSupabase.js
 *
 * What it does:
 *  1. Connects to MongoDB and fetches the singleton document from 'hairtransplantclinic' collection
 *  2. Connects to MongoDB and fetches all documents from 'hairtransplantclinicleads' collection
 *  3. Upserts page settings into Supabase 'hair_transplant_clinic' with id: 1 (seeds fallbacks if Mongo is empty)
 *  4. Inserts/upserts all lead records into Supabase 'hair_transplant_clinic_leads'
 *  5. Logs the final status and record counts
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

// Converts a 24-character hex MongoDB ObjectId to a valid v4 UUID structure
const convertMongoIdToUuid = (mongoId) => {
  if (!mongoId) return null;
  const str = mongoId.toString();
  if (str.length !== 24) return null;
  const part1 = str.slice(0, 8);
  const part2 = str.slice(8, 12);
  const part3 = str.slice(12, 16);
  const part4 = str.slice(16, 20);
  const part5 = str.slice(20, 24) + "00000000"; // pad 8 zeroes to make it 12 chars
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

// Standard premium fallback data for absolute SSR safety & seeding
const fallbackData = {
  hero: {
    backgroundImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'About Clinic',
    eyebrowText: '',
    breadcrumbText: 'Hair Transplant Clinic in Delhi',
    doctorName: 'DMC Trichology',
    degreeText: 'Advanced Hair Restoration Sciences',
    descriptionParagraph: '',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    emailPlaceholder: 'E-Mail Address*',
    datePlaceholder: 'Select Preferred Date*',
    messagePlaceholder: 'Enter Your Message Here',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Request A Call Back',
    backgroundColor: '#3b5998',
    gradientColor: '#3b5998',
    overlayOpacity: 0.55,
    showFloatingShapes: true,
    paddingTop: '170px',
    paddingBottom: '100px',
    bannerHeight: '420px',
    mobileTitleSize: '40px',
    mobileDescSize: '14px'
  },
  breadcrumb: {
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'Hair Transplant Clinic',
    backgroundColor: '#f8f9fa'
  },
  intro: {
    heading: 'BEST HAIR TRANSPLANT CLINIC IN DELHI',
    welcomeText: '<p>DMC Trichology is Delhi\'s premier flagship clinic for <strong>high-density, advanced hair restoration</strong>. Under the direct guidance of our board-certified clinical specialists, we offer customized FUE and DHI procedures tailored to your unique hairline biology.</p><p>We combine <strong>cutting-edge US-FDA approved technologies</strong> with refined artistic hairline mapping. Our surgeons meticulously calculate exact follicular spacing and density vectors, ensuring natural blending and a <strong>98%+ graft survival rate</strong> for permanent, life-changing results.</p>',
    directorQuote: 'Our mission is simple: to combine surgical precision with visual artistry to restore not just your hair, but your self-assurance.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    backgroundColor: '#ffffff',
    textColor: '#475569',
    paddingTop: '80px',
    paddingBottom: '80px',
    readMoreText: '',
    isVisible: true,
    headingSize: '38px',
    headingFontFamily: 'Marcellus',
    bodySize: '16px',
    bodyFontFamily: 'Lato',
    mobilePaddingTop: '60px',
    mobilePaddingBottom: '60px',
    mobileHeadingSize: '30px'
  },
  whyChoose: {
    heading: 'WHY CHOOSE OUR HAIR CLINIC IN DELHI?',
    description: 'At DMC Trichology, patient comfort, meticulous hygiene, and long-term result quality are our primary directives.',
    highlightedText: 'Elite Care & Technology',
    backgroundColor: '#0b132b',
    gradientColor: '#1e293b',
    titleColor: '#ffffff',
    textColor: '#e2e8f0',
    paddingTop: '80px',
    paddingBottom: '80px',
    isVisible: true,
    headingSize: '38px',
    headingFontFamily: 'Marcellus',
    bodySize: '14.5px',
    bodyFontFamily: 'Lato',
    mobilePaddingTop: '60px',
    mobilePaddingBottom: '60px',
    mobileHeadingSize: '30px',
    items: [
      { title: 'US-FDA Approved Tech', content: 'Utilizing world-class automated follicular extraction systems and microscopic implanters for maximum survival rates.', isVisible: true },
      { title: 'Board-Certified Surgeons', content: 'Our procedures are strictly led by highly trained and certified hair restoration experts with decades of scalp mapping expertise.', isVisible: true },
      { title: 'Class-100 Sterile Suites', content: 'Experience absolute safety inside our state-of-the-art cleanroom surgical theatres designed to minimize any contamination risks.', isVisible: true }
    ]
  },
  procedures: {
    heading: 'Our Elite Hair Restoration Procedures',
    introText: 'We leverage state-of-the-art US-FDA approved technologies to deliver dense, natural, and permanent results.',
    items: [
      { id: 1, title: 'Advanced FUE Hair Transplant', description: 'Follicular Unit Extraction utilizing micro-punches to carefully extract individual hair units with zero linear scarring.', image: '', link: '/details/fue-hair-transplant', enabled: true },
      { id: 2, title: 'DHI Hair Transplant', description: 'Direct Hair Implantation using specialized Choi Implanter Pens for precise control of graft depth, angle, and direction.', image: '', link: '/details/dhi-hair-transplant', enabled: true },
      { id: 3, title: 'Robotic Hair Transplant', description: 'Computer-guided follicular extraction providing absolute mathematical precision and minimizing donor graft wastage.', image: '', link: '/details/robotic-hair-transplant', enabled: true },
      { id: 4, title: 'Scalp Micropigmentation', description: 'Non-surgical medical tattooing that mimics active follicular density, ideal for diffuse thinning and scar concealment.', image: '', link: '/details/scalp-micropigmentation', enabled: true }
    ],
    isVisible: true
  },
  timeline: {
    heading: 'Milestones in Clinical Excellence',
    timelineTitle: 'Our Journey',
    timelineItems: [
      { year: '2012', title: 'Founding of DMC Trichology', description: 'Established with a vision to redefine standard hair restoration services in Delhi by providing elite, premium care.', enabled: true },
      { year: '2015', title: '1,000+ Successful Restorations', description: 'Crossed the milestone of 1,000 dense-graft hair transplants with a 98% graft survival rate.', enabled: true },
      { year: '2018', title: 'International Accreditations', description: 'Inducted into leading global hair restoration associations and awarded best clinical practices in trichology.', enabled: true },
      { year: '2022', title: 'State-of-the-Art Robotic Lab', description: 'Equipped our main luxury Vasant Vihar suite with high-precision computer-guided extraction systems.', enabled: true }
    ],
    isVisible: true
  },
  patientCare: {
    heading: 'Expertise & Premium Patient Care',
    introText: 'At DMC Trichology, patient comfort, meticulous hygiene, and long-term result quality are our primary directives.',
    items: [
      { title: 'Personalized Graft Mapping', content: 'Our surgeons pre-calculate exact density vectors and angle alignments to mimic your natural growth pattern.', isVisible: true },
      { title: 'Ultra-Sterile Surgical Suites', content: 'We maintain positive pressure, class 100 laminar flow filtration cleanrooms for absolute safety and zero risk of infection.', isVisible: true },
      { title: 'Rigorous Post-Care Support', content: 'Receive comprehensive follow-up checkups, specialized low-level laser therapy (LLLT) sessions, and custom hair washes.', isVisible: true }
    ],
    isVisible: true
  },
  associations: {
    heading: 'GLOBAL MEMBERSHIPS & TRUST CERTIFICATIONS',
    sectionBgColor: '#ffffff',
    logos: [
      { id: 1, title: 'World Trichology Society', imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'IADVL Member', imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'European Society of Hair Restoration', imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'US-FDA Clinical Standards', imageUrl: '', link: '', enabled: true }
    ],
    isVisible: true
  },
  reviews: {
    heading: 'What Our Premium Patients Say',
    googleRating: '4.9',
    count: '15,000+',
    reviewsList: [
      { author: 'Amit Sharma', rating: 5, text: 'Fantastic experience at DMC. The density achieved is absolutely mind-blowing and the recovery was completely seamless. Highly recommended!', verified: true, date: '1 month ago' },
      { author: 'Rohan Malhotra', rating: 5, text: 'The surgical team was highly professional and meticulous. The luxury suite and custom care made it feel like a premier clinical retreat.', verified: true, date: '3 months ago' },
      { author: 'Vikram Mehta', rating: 5, text: 'After consulting multiple doctors, I chose DMC. Their graft calculation was scientifically precise and my results are completely natural.', verified: true, date: '6 months ago' }
    ],
    isVisible: true
  },
  faq: {
    heading: 'Frequently Asked Questions',
    description: 'Explore comprehensive expert insights on hair restoration, grafting, and timeline expectations.',
    faqsList: [
      { question: 'How long does a hair transplant procedure take?', answer: 'Typically, a standard FUE session takes between 6 to 8 hours depending on the number of grafts required. Our luxury patient suites ensure complete relaxation throughout the day.', isVisible: true },
      { question: 'Is the procedure painful?', answer: 'We utilize advanced local anesthetics and microscopic needles to make the process virtually painless. Most patients comfortably watch movies or read during their transplant.', isVisible: true },
      { question: 'When will I see the final results?', answer: 'Initial active shedding occurs in the first month. New, permanent follicles begin growing around month 3, with complete, high-density maturation fully visible by months 10 to 12.', isVisible: true },
      { question: 'Are the transplanted hairs permanent?', answer: 'Yes. Hair grafts are extracted from the permanent safe donor zone at the back or sides of the scalp, which are genetically resistant to DHT-induced thinning.', isVisible: true }
    ],
    isVisible: true
  },
  cta: {
    heading: 'Begin Your Hair Restoration Journey Today',
    subheading: 'Schedule a private clinical assessment with our trichology directors.',
    buttonText: 'Book A Luxury Consultation',
    buttonLink: '#appointment-form',
    isVisible: true
  },
  seo: {
    metaTitle: 'Best Hair Transplant Clinic in Delhi | DMC Trichology',
    metaDescription: 'DMC Trichology is Delhi’s premium flagship clinic for high-density, advanced FUE and DHI hair transplants. Consult our board-certified clinical specialists today.',
    ogImage: ''
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
    // 1. MIGRATE PAGE CONFIGURATION
    // ==========================================
    console.log("\n--- Migrating Page Settings ---");
    const settingsCollection = db.collection("hairtransplantclinic");
    let settingsDoc = await settingsCollection.findOne({});
    let settingsSuccess = false;
    let settingsToSave;
    let isSeeded = false;

    if (!settingsDoc) {
      console.warn("⚠️ No Hair Transplant Clinic page settings found in MongoDB! Seeding default fallbackSettings configuration directly.");
      settingsToSave = fallbackData;
      isSeeded = true;
    } else {
      settingsToSave = cleanMongoDoc(settingsDoc);
    }
    
    const { data: savedSettings, error: settingsErr } = await supabase
      .from("hair_transplant_clinic")
      .upsert(
        {
          id: 1,
          data: settingsToSave,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "id",
          ignoreDuplicates: false
        }
      )
      .select("id, updated_at")
      .single();

    if (settingsErr) {
      console.error("❌ Error upserting page settings to Supabase:", settingsErr.message);
      if (settingsErr.message.includes("relation \"public.hair_transplant_clinic\" does not exist")) {
        console.error("\n👉 IMPORTANT: You must run the SQL statements in 'backend/dr_clinic_supabase_schema.sql' inside your Supabase SQL Editor first!");
        mongoClient.close();
        return;
      }
    } else {
      console.log(`✅ Page settings successfully migrated/seeded to Supabase. Row ID: ${savedSettings.id} (Seeded: ${isSeeded})`);
      settingsSuccess = true;
    }

    // ==========================================
    // 2. MIGRATE CONSULTATION LEADS
    // ==========================================
    console.log("\n--- Migrating Consultation Leads ---");
    const leadsCollection = db.collection("hairtransplantclinicleads");
    const allLeads = await leadsCollection.find({}).toArray();
    console.log(`📦 Found ${allLeads.length} leads in MongoDB.`);

    let leadsMigrated = 0;
    let leadsErrors = 0;

    if (allLeads.length > 0) {
      for (const lead of allLeads) {
        const uuid = convertMongoIdToUuid(lead._id);
        
        const mappedLead = {
          id: uuid,
          name: lead.name || "Unknown",
          mobile: lead.mobile || "",
          email: lead.email || "",
          service: lead.service || "Hair Transplant Clinic Consultation",
          appointment_date: lead.appointmentDate ? new Date(lead.appointmentDate).toISOString() : new Date().toISOString(),
          message: lead.message || "",
          status: lead.status || "new",
          notes: lead.notes || "",
          created_at: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
          updated_at: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : new Date().toISOString()
        };

        const { error: leadErr } = await supabase
          .from("hair_transplant_clinic_leads")
          .upsert(mappedLead, { onConflict: "id" });

        if (leadErr) {
          console.error(`❌ Error migrating lead ID "${lead._id}":`, leadErr.message);
          leadsErrors++;
        } else {
          leadsMigrated++;
        }
      }
      console.log(`✅ Leads Migration Complete. Successfully migrated: ${leadsMigrated}, Errors: ${leadsErrors}`);
    } else {
      console.log("⚠️ No lead records found to migrate.");
    }

    console.log("\n========================================");
    console.log(`🎉 HAIR TRANSPLANT CLINIC MIGRATION STATUS`);
    console.log(`   Page Settings Status : ${settingsSuccess ? "SUCCESS" : "SKIPPED/FAILED"}`);
    console.log(`   Page Settings Seeded : ${isSeeded ? "YES (Fallback Seeding)" : "NO (Migrated)"}`);
    console.log(`   Leads Migrated Count : ${leadsMigrated}`);
    console.log(`   Leads Migration Errs : ${leadsErrors}`);
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
