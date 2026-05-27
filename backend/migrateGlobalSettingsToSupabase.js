/**
 * MIGRATION & SEEDING: MongoDB Global Settings, Header, Footer, TopBar, and Menus → Supabase
 *
 * Run: node migrateGlobalSettingsToSupabase.js
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

// Fallback configs to seed if MongoDB has 0 records
const defaults = {
  header: {
    logoUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png",
    isSticky: true,
    appointmentButtonText: "Book Appointment",
    appointmentButtonLink: "/book-appointment",
    menuItems: [
      { label: "Home", link: "/" },
      { label: "About Us", link: "/about-us" },
      { 
        label: "Services", 
        link: "#", 
        hasDropdown: true,
        submenu: [
          { label: "Hair Transplant", link: "/services/hair-transplant" },
          { label: "Hair Treatments", link: "/services/hair-treatments" }
        ]
      },
      { label: "Results", link: "/results" },
      { label: "Testimonials", link: "/testimonials" },
      { label: "Blog", link: "/blog" },
      { label: "Contact Us", link: "/contact" }
    ]
  },
  footer: {
    columns: [
      {
        id: 'col1',
        title: 'HAIR TRANSPLANT',
        links: [
          { id: 'l1', label: 'FUE Hair Transplant', url: '#' },
          { id: 'l2', label: 'DHI Hair Transplant', url: '#' },
          { id: 'l3', label: 'Hair Restoration', url: '#' },
          { id: 'l4', label: 'Beard Transplant', url: '#' },
          { id: 'l5', label: 'Moustache Transplant', url: '#' },
          { id: 'l6', label: 'Eyebrow Transplant', url: '#' }
        ]
      },
      {
        id: 'col2',
        title: 'HAIR TREATMENTS',
        links: [
          { id: 'l7', label: 'DMC- Golden Touch', url: '#' },
          { id: 'l8', label: 'DMC- PRP Therapy', url: '#' },
          { id: 'l9', label: 'DMC- Meso Therapy', url: '#' },
          { id: 'l10', label: 'DMC- Keravive Hair', url: '#' },
          { id: 'l11', label: 'DMC- Hair Rituals', url: '#' },
          { id: 'l12', label: 'GFC Hair Restoration', url: '#' }
        ]
      }
    ],
    socials: [
      { id: 's1', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png', url: '#' },
      { id: 's2', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png', url: '#' },
      { id: 's3', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png', url: '#' },
      { id: 's4', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png', url: '#' },
      { id: 's5', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png', url: '#' }
    ],
    contact: {
      heading: "CONTACT US",
      address1: "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India",
      address2: "Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India",
      phone1: "+91-8527830194",
      phone2: "+91-9810939319",
      email: "info@dadumedicalcentre.com"
    },
    branding: {
      logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png",
      aboutText: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures."
    },
    bottomFooter: {
      copyright: "© 2024 . All Rights Reserved.",
      termsText: "Terms And Condition",
      termsLink: "#",
      privacyText: "Privacy Policy",
      privacyLink: "#"
    }
  },
  topbar: {
    isVisible: true,
    phone1: "+91-8527830194",
    phone2: "+91-9810939319",
    email: "info@dadumedicalcentre.com",
    announcementText: "",
    socialLinks: [
      { name: 'telegram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png' },
      { name: 'instagram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png' },
      { name: 'facebook', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png' },
      { name: 'youtube', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png' },
      { name: 'linkedin', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png' }
    ]
  },
  settings: {
    websiteName: "DMC Trichology",
    logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png",
    favicon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png",
    phone1: "+91-8527830194",
    phone2: "+91-9810939319",
    email: "info@dadumedicalcentre.com",
    address: "",
    primaryColor: "#C19A5B",
    secondaryColor: "#000000",
    appointmentButtonText: "Book Appointment",
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: ""
    },
    footerCopyright: "",
    patientCount: "225+ Patients",
    ratingStars: 5,
    ratingText: "★★★★★"
  },
  menus: []
};

const migrate = async () => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    console.log("✅ MongoDB Connected");

    const db = mongoClient.db("dmctrichology");

    const mapping = [
      { collection: "headers", key: "header", isArray: false },
      { collection: "footers", key: "footer", isArray: false },
      { collection: "topbars", key: "topbar", isArray: false },
      { collection: "sitesettings", key: "settings", isArray: false },
      { collection: "menus", key: "menus", isArray: true }
    ];

    let successCount = 0;

    for (const item of mapping) {
      console.log(`\n--- Loading Section: "${item.key}" ---`);
      const coll = db.collection(item.collection);

      // Perform existence check in MongoDB
      const collectionCheck = await db.listCollections({ name: item.collection }).toArray();
      
      let finalData;
      let sourceMsg = "seeded default configuration";

      if (collectionCheck.length === 0) {
        console.log(`ℹ️ Collection "${item.collection}" does not exist in MongoDB. Seeding fallbacks.`);
        finalData = defaults[item.key];
      } else {
        if (item.isArray) {
          const docs = await coll.find({}).toArray();
          if (docs.length > 0) {
            finalData = docs.map(d => {
              const clean = { ...d };
              clean.id = d._id.toString();
              delete clean._id;
              delete clean.__v;
              return clean;
            });
            sourceMsg = `migrated ${docs.length} list items from MongoDB`;
          } else {
            finalData = defaults[item.key];
          }
        } else {
          const doc = await coll.findOne({});
          if (doc) {
            finalData = cleanMongoDoc(doc);
            sourceMsg = "migrated MongoDB singleton document";
          } else {
            finalData = defaults[item.key];
          }
        }
      }

      const { error: upsertErr } = await supabase
        .from("global_settings")
        .upsert({
          id: item.key,
          data: finalData,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (upsertErr) {
        console.error(`❌ Upserting global setting "${item.key}" failed:`, upsertErr.message);
        if (upsertErr.message.includes("relation \"public.global_settings\" does not exist")) {
          console.error("\n👉 IMPORTANT: You must run the SQL statements in 'backend/global_settings_supabase_schema.sql' inside your Supabase SQL Editor first!");
          mongoClient.close();
          return;
        }
      } else {
        console.log(`✅ Successfully saved global setting: "${item.key}" (${sourceMsg})`);
        successCount++;
      }
    }

    console.log("\n========================================");
    console.log(`🎉 GLOBAL SETTINGS MIGRATION & SEEDING STATUS`);
    console.log(`   Total Global Settings Seeded: ${successCount}/5`);
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
