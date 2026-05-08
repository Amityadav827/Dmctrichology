const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const FooterSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  columns: [ { id: String, title: String, links: [ { id: String, label: String, url: String } ] } ],
  contact: {
    heading: { type: String, default: "CONTACT US" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    phone1: { type: String, default: "" },
    phone2: { type: String, default: "" },
    email: { type: String, default: "" }
  },
  disclaimer: { type: String, default: "" },
  newsletter: {
    heading: { type: String, default: "" },
    description: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    checkboxLabel: { type: String, default: "" }
  },
  branding: {
    logo: { type: String, default: "" },
    aboutText: { type: String, default: "" }
  },
  socials: [ { id: String, icon: String, url: String } ],
  bottomFooter: {
    copyright: { type: String, default: "" },
    termsText: { type: String, default: "" },
    termsLink: { type: String, default: "" },
    privacyText: { type: String, default: "" },
    privacyLink: { type: String, default: "" }
  }
}, { timestamps: true });

let Footer;
try { Footer = mongoose.model('Footer'); } catch (e) { Footer = mongoose.model('Footer', FooterSchema); }

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Footer.deleteMany({});
    await Footer.create({
      disclaimer: "Content is for awareness and education only, not medical advice. Consult a qualified trichologist or dermatologist for proper diagnosis and treatment. Results may vary for each individual.",
      columns: [
        {
          id: 'col1',
          title: "HAIR TRANSPLANT",
          links: [
            { id: "ht1", label: "Hair Transplant In Delhi", url: "#" },
            { id: "ht2", label: "Hair Transplant Cost In Delhi", url: "#" },
            { id: "ht3", label: "FUE Hair Transplant", url: "#" },
            { id: "ht4", label: "Body Hair Transplant", url: "#" },
            { id: "ht5", label: "Beard Hair Transplant", url: "#" },
            { id: "ht6", label: "Women Hair Transplant", url: "#" },
            { id: "ht7", label: "Repair Hair Transplant", url: "#" },
            { id: "ht8", label: "DMC – Golden Touch", url: "#" },
            { id: "ht9", label: "Hair Transplant In India", url: "#" },
            { id: "ht10", label: "Hair Transplant Cost In India", url: "#" }
          ]
        },
        {
          id: 'col2',
          title: "HAIR TREATMENTS",
          links: [
            { id: "tr1", label: "DMC-Mesogrow", url: "#" },
            { id: "tr2", label: "DMC- Root Restore therapy®", url: "#" },
            { id: "tr3", label: "DMC- Advance HGP®", url: "#" },
            { id: "tr4", label: "DMC-Advanced HGP 2.0 ®", url: "#" },
            { id: "tr5", label: "DMC- Keravive Hair", url: "#" },
            { id: "tr6", label: "DMC- Hair Rituals", url: "#" },
            { id: "tr7", label: "GFC Hair Restoration", url: "#" }
          ]
        }
      ],
      contact: {
        heading: "CONTACT US",
        address1: "Vasant Vihar A 2/6 Vasant Vihar, New delhi 110057, India",
        address2: "Rajouri Garden J-12/25, First Floor, Rajouri Garden New Delhi 110027, India",
        phone1: "+91-8527830194",
        phone2: "+91-9810939319",
        email: "info@dadumedicalcentre.com"
      },
      newsletter: {
        heading: "Stay Connected With Expert Care Support",
        description: "We're Here For You Monday To Friday With Tailored Treatments, Hands And A Commitment To Your Recovery Every Step Of The Way.",
        placeholder: "Your Email Adress",
        buttonText: "Submit",
        checkboxLabel: "Subscribe For Health Tips & Updates"
      },
      branding: {
        logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777702974/dmc-trichology/ecj7tvcjxbkqhzixfdql.png",
        aboutText: "One of the best Skin and Hair treatment centres in India, DMC-TRICHOLOGY® provides an array of both cosmetological and trichological treatment procedures."
      },
      socials: [
        { id: 's1', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png", url: "#" },
        { id: 's2', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png", url: "#" },
        { id: 's3', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png", url: "#" },
        { id: 's4', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png", url: "#" },
        { id: 's5', icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png", url: "#" }
      ],
      bottomFooter: {
        copyright: "© 2024 . All Rights Reserved.",
        termsText: "Terms And Condition",
        termsLink: "#",
        privacyText: "Privacy Policy",
        privacyLink: "#"
      }
    });

    console.log('FOOTER RESET SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reset();
