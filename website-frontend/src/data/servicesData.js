const generateServiceData = (title, slug) => {
  return {
    slug,
    banner: {
      badgeText: "PREMIUM TREATMENT",
      title: title,
      subtitle: `Experience our advanced ${title} treatment for optimal results.`,
      duration: "45 mins",
      rating: "4.8",
      buttonText: "Book Consultation",
      backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png"
    },
    intro: {
      badgeText: "ABOUT THE TREATMENT",
      heading: `What is ${title}?`,
      paragraph1: `${title} is a specialized treatment designed to address specific concerns safely and effectively. Our expert team ensures a comfortable experience with visible results.`,
      paragraph2: `Using state-of-the-art technology, the ${title} procedure focuses on long-term benefits while maintaining the highest safety standards in the industry.`,
      benefitsHeading: "Key Benefits",
      benefitsList: [
        { text: "Clinically proven results" },
        { text: "Minimal downtime required" },
        { text: "Customized to your specific needs" }
      ],
      images: [
        { url: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" },
        { url: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" }
      ]
    },
    process: {
      badgeText: "STEP BY STEP",
      heading: "How It Works",
      steps: [
        {
          title: "Initial Consultation",
          description: "We assess your needs to create a personalized plan."
        },
        {
          title: "Preparation",
          description: "The targeted area is prepped for the procedure."
        },
        {
          title: "The Treatment",
          description: `Our experts perform the ${title} using advanced techniques.`
        },
        {
          title: "Post-Care",
          description: "You'll receive instructions for optimal recovery and results."
        }
      ]
    },
    idealFrequency: {
      badgeText: "TREATMENT PLAN",
      heading: "Ideal Frequency",
      description: "For best results, we recommend a series of sessions tailored to your individual goals.",
      sessions: "3-6 Sessions",
      interval: "Every 4 Weeks",
      maintenance: "As Needed"
    },
    beforeAfter: {
      badgeText: "REAL RESULTS",
      heading: "Before & After",
      description: `See the transformative effects of ${title}.`,
      images: [
        {
          before: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png",
          after: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png"
        }
      ]
    },
    faqEnquiry: {
      faqs: [
        {
          question: `Is ${title} safe?`,
          answer: "Yes, it is completely safe when performed by our certified experts using FDA-approved technology."
        },
        {
          question: "How long does it take?",
          answer: "A typical session takes about 45 to 60 minutes depending on the targeted area."
        },
        {
          question: "Are there any side effects?",
          answer: "Minor redness or swelling may occur but typically subsides within a few hours."
        }
      ],
      enquiry: {
        heading: "Have More Questions?",
        description: "Reach out to our experts for a personalized consultation.",
        buttonText: "Contact Us"
      }
    }
  };
};

export const servicesData = [
  generateServiceData("Soprano Titanium Laser", "soprano-titanium-laser"),
  generateServiceData("FUE Hair Transplant", "fue-hair-transplant"),
  generateServiceData("Advanced GFC Therapy", "advanced-gfc-therapy"),
  generateServiceData("PRP Plus+", "prp-plus"),
  generateServiceData("DMC Signature Facial", "dmc-signature-facial"),
  generateServiceData("Beard Shaping Laser", "beard-shaping-laser"),
  generateServiceData("Underarms Smoothness", "underarms-smoothness"),
  generateServiceData("Full Legs Silk", "full-legs-silk"),
  generateServiceData("Bikini Line Precision", "bikini-line-precision"),
  generateServiceData("Back Hair Removal", "back-hair-removal"),
  generateServiceData("Hair Repair Mask", "hair-repair-mask"),
  generateServiceData("Women’s Thinning Fix", "women-s-thinning-fix"),
  generateServiceData("DHT Blocker Therapy", "dht-blocker-therapy"),
  generateServiceData("Full Face Rejuvenation", "full-face-rejuvenation"),
  generateServiceData("Arm & Forearm Smooth", "arm-forearm-smooth"),
  generateServiceData("Chest & Front Laser", "chest-front-laser"),
  generateServiceData("Scalp Micro-Pigmentation", "scalp-micro-pigmentation")
];
