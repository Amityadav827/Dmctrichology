const mongoose = require('mongoose');

const AboutDrNandaniSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { type: String, default: "" },
    doctorImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    mainHeading: { type: String, default: "BEST HAIR TRANSPLANT SURGEON IN DELHI" },
    doctorName: { type: String, default: "Dr. Nandani Dadu" },
    degreeText: { type: String, default: "MD (Dermatology)" },
    descriptionParagraph: { type: String, default: "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi." },
    namePlaceholder: { type: String, default: "Name*" },
    phonePlaceholder: { type: String, default: "Mobile Number*" },
    emailPlaceholder: { type: String, default: "E-Mail Address*" },
    datePlaceholder: { type: String, default: "Select Preferred Date*" },
    messagePlaceholder: { type: String, default: "Enter Your Message Here" },
    captchaPlaceholder: { type: String, default: "Code*" },
    submitButtonText: { type: String, default: "Schedule Your Visit" },
    backgroundColor: { type: String, default: "#3b5998" },
    overlayOpacity: { type: Number, default: 0.4 }
  },
  
  intro: {
    heading: { type: String, default: "Delhi's Premier Hair Specialist & Clinical Director" },
    description: { 
      type: String, 
      default: "<p>Dr. Nandani Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each patient's physiological profile.</p>" 
    },
    bulletList: {
      type: [String],
      default: [
        "Clinical expertise with 15+ years of specialized hair treatment experience.",
        "Customized high-density hairline designs backed by medical science.",
        "State-of-the-art clinical theater with advanced sterile protocols.",
        "Comprehensive pre-and-post care guidance for long-term retention."
      ]
    },
    ctaText: { type: String, default: "Discover Signature Treatments" }
  },

  formSettings: {
    title: { type: String, default: "Request Private Consultation" },
    subtitle: { type: String, default: "Reserve your bespoke scalp assessment and consultation session." },
    successMessage: { type: String, default: "Your consultation request has been successfully submitted to Dr. Nandani Dadu's private desk. Our concierge team will reach out to you shortly." }
  },

  seo: {
    metaTitle: { type: String, default: "Dr. Nandani Dadu | Best Hair Restoration Specialist & Trichologist" },
    metaDescription: { type: String, default: "Consult Delhi's premier hair restoration specialist, Dr. Nandani Dadu. Experience luxury clinical consultations, high-density transplants, and customized scalp treatments." },
    ogImage: { type: String, default: "" }
  },

  breadcrumb: {
    title: { type: String, default: "Hair Specialist in Delhi" },
    parentLabel: { type: String, default: "Home" },
    parentUrl: { type: String, default: "/" },
    currentPageText: { type: String, default: "Hair Specialist in Delhi" },
    backgroundColor: { type: String, default: "#f8f9fa" }
  },

  specialist: {
    heading: { type: String, default: "Best Hair Specialist in Delhi" },
    description1: { type: String, default: "Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments." },
    description2: { type: String, default: "Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology." },
    highlightedText: { type: String, default: "She employs cutting-edge knowledge in Hair & Scalp Treatments with:" },
    bullets: { type: [String], default: ["MESOGROW", "ADVANCED HGP", "ADVANCED HGP 2.0", "RRT (ROOT RESTORE THERAPY)", "FUE TECHNIQUE (Follicular Hair Transplant)"] },
    sectionBgColor: { type: String, default: "#F6F1E7" },
    cardBgColor: { type: String, default: "#FFFFFF" }
  },

  timeline: {
    heading: { type: String, default: "What Makes Dr. Nandini Dadu the Best Hair Transplant Surgeon in Delhi?" },
    sectionBgColor: { type: String, default: "#F6F1E7" },
    steps: [{
      title: { type: String },
      description: { type: String },
      numberLabel: { type: String },
      colorMode: { type: String, enum: ['gold', 'navy'], default: 'gold' },
      iconName: { type: String }
    }]
  },

  educationExperience: {
    sectionBgColor: { type: String, default: "#F6F1E7" },
    educationTitle: { type: String, default: "EDUCATION" },
    experienceTitle: { type: String, default: "EXPERIENCE" },
    educationItems: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: String }
    }],
    experienceItems: [{
      role: { type: String },
      hospital: { type: String },
      duration: { type: String }
    }]
  }
}, { timestamps: true, collection: 'aboutdrnandani' });

module.exports = mongoose.model('AboutDrNandani', AboutDrNandaniSchema);
