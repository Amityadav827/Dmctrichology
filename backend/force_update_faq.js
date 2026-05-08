const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const HomeFAQSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: "TRUSTED CARE SERVICES" },
  heading: { type: String, default: "Frequently Asked Question?" },
  categories: [
    {
      title: String,
      faqs: [
        {
          question: String,
          answer: String,
          icon: String
        }
      ]
    }
  ],
  buttonText: { type: String, default: "View All Questions" },
  buttonLink: { type: String, default: "#" }
}, { timestamps: true });

let HomeFAQ;
try {
  HomeFAQ = mongoose.model('HomeFAQ');
} catch (e) {
  HomeFAQ = mongoose.model('HomeFAQ', HomeFAQSchema);
}

const fullData = {
  badgeText: "TRUSTED CARE SERVICES",
  heading: "Frequently Asked Question?",
  enabled: true,
  buttonText: "View All Questions",
  buttonLink: "#",
  categories: [
    {
      title: 'General',
      faqs: [
        { 
          question: "What Is The DMC-Golden Touch Technique?", 
          answer: "The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.", 
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png" 
        },
        { 
          question: "What Types Of Hair Treatments Are Available At DMC Trichology?", 
          answer: "Yes, We Provide Home Visits When Needed. Ideal For Post-Surgery Or Limited Mobility Patients. Call Us To Check Availability In Your Area.", 
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/uwcoyjbmka6mtnpxif4t.png" 
        },
        { 
          question: "Who Performs The Hair Transplants At DMC Trichology?", 
          answer: "We Help With Joint Pain, Sports Injuries, Back Issues, And More. Each Treatment Is Personalized To Your Needs. Our Goal Is To Restore Comfort And Movement.", 
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/ju0yj4temj3aalwa1xna.png" 
        },
        { 
          question: "What Should I Wear To My Appointment?", 
          answer: "Wear loose, comfortable clothes. Gym wear or stretchable outfits are ideal. Avoid tight or formal clothing.", 
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png" 
        },
        {
          question: "Can Both Men And Women Undergo Hair Transplant Procedures At DMC Trichology?",
          answer: "Sessions Typically Run Between 30 To 60 Minutes. Your Duration Depends On Your Treatment Plan. We Focus On Quality Care, Not The Clock.",
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/uwcoyjbmka6mtnpxif4t.png"
        },
        {
          question: "How Can I Book A Consultation At DMC Trichology?",
          answer: "Most Insurance Plans Include Coverage. Bring Your Insurance Details During Your First Visit. We'll Help You With The Paperwork.",
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/ju0yj4temj3aalwa1xna.png"
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      faqs: [
        {
          question: "What Is The Average Cost Of A Hair Transplant?",
          answer: "Cost varies based on the number of grafts and technique used. We provide a detailed estimate during your initial consultation.",
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png"
        }
      ]
    },
    {
      title: 'Our Treatments',
      faqs: [
        {
          question: "Is The Procedure Painful?",
          answer: "We use local anesthesia to ensure minimal discomfort. Most patients feel very relaxed throughout the session.",
          icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/faxp8cvrttxpt3w38asw.png"
        }
      ]
    }
  ]
};

async function forceUpdate() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(process.env.MONGO_URI);
    await HomeFAQ.deleteMany({});
    await HomeFAQ.create(fullData);
    console.log('FAQ DATA FORCED UPDATE SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

forceUpdate();
