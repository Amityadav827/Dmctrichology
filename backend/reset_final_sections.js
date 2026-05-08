const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const PressMediaSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  heading: { type: String, default: "What The Press And Media Are Saying About Our Clinic" },
  ratingText: { type: String, default: "225+ Satisfied Patients" },
  patientCountText: { type: String, default: "5000+ Satisfied Patients" },
  button: {
    text: { type: String, default: "Get Free Consulting" },
    link: { type: String, default: "/media" }
  },
  avatars: [ { id: String, image: String } ],
  mediaLogos: [ { id: String, image: String, title: String, link: String } ]
}, { timestamps: true });

const FooterSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  columns: [ { id: String, title: String, links: [ { id: String, label: String, url: String } ] } ],
  contact: {
    heading: { type: String, default: "CONTACT US" },
    address1: { type: String, default: "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India" },
    address2: { type: String, default: "Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India" },
    phone1: { type: String, default: "+91-8527830194" },
    phone2: { type: String, default: "+91-9810939319" },
    email: { type: String, default: "info@dadumedicalcentre.com" }
  },
  disclaimer: { type: String, default: "" },
  newsletter: {
    heading: { type: String, default: "Stay Connected With Expert Care Support" },
    description: { type: String, default: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way." },
    placeholder: { type: String, default: "Your Email Adress" },
    buttonText: { type: String, default: "Submit" },
    checkboxLabel: { type: String, default: "Subscribe For Health Tips & Updates" }
  },
  branding: {
    logo: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png" },
    aboutText: { type: String, default: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures." }
  },
  socials: [ { id: String, icon: String, url: String } ],
  bottomFooter: {
    copyright: { type: String, default: "© 2024 . All Rights Reserved." },
    termsText: { type: String, default: "Terms And Condition" },
    termsLink: { type: String, default: "#" },
    privacyText: { type: String, default: "Privacy Policy" },
    privacyLink: { type: String, default: "#" }
  }
}, { timestamps: true });

const PressMedia = mongoose.model('PressMedia', PressMediaSchema);
const Footer = mongoose.model('Footer', FooterSchema);

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Footer Reset with EXACT original data
    await Footer.deleteMany({});
    await Footer.create({
      disclaimer: "Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.",
      columns: [
        {
          id: 'col1',
          title: "HAIR TRANSPLANT",
          links: [
            { id: 'l1', label: "FUE Hair Transplant", url: "#" },
            { id: 'l2', label: "DHI Hair Transplant", url: "#" },
            { id: 'l3', label: "Hair Restoration", url: "#" },
            { id: 'l4', label: "Beard Transplant", url: "#" },
            { id: 'l5', label: "Moustache Transplant", url: "#" },
            { id: 'l6', label: "Eyebrow Transplant", url: "#" }
          ]
        },
        {
          id: 'col2',
          title: "HAIR TREATMENTS",
          links: [
            { id: 'l7', label: "DMC- Golden Touch", url: "#" },
            { id: 'l8', label: "DMC- PRP Therapy", url: "#" },
            { id: 'l9', label: "DMC- Meso Therapy", url: "#" },
            { id: 'l10', label: "DMC- Keravive Hair", url: "#" },
            { id: 'l11', label: "DMC- Hair Rituals", url: "#" },
            { id: 'l12', label: "GFC Hair Restoration", url: "#" }
          ]
        }
      ],
      socials: [
        { id: 's1', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png", url: "#" },
        { id: 's2', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png", url: "#" },
        { id: 's3', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png", url: "#" },
        { id: 's4', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png", url: "#" },
        { id: 's5', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png", url: "#" }
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
    });

    console.log('RESET SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reset();
