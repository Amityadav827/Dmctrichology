const mongoose = require('mongoose');

const HairTransplantClinicSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { type: String, default: '' },
    doctorImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png' },
    mainHeading: { type: String, default: 'About Clinic' },
    eyebrowText: { type: String, default: '' },
    breadcrumbText: { type: String, default: 'Hair Transplant Clinic in Delhi' },
    doctorName: { type: String, default: 'DMC Trichology' },
    degreeText: { type: String, default: 'Advanced Hair Restoration Sciences' },
    descriptionParagraph: { type: String, default: '' },
    namePlaceholder: { type: String, default: 'Name*' },
    phonePlaceholder: { type: String, default: 'Mobile Number*' },
    emailPlaceholder: { type: String, default: 'E-Mail Address*' },
    datePlaceholder: { type: String, default: 'Select Preferred Date*' },
    messagePlaceholder: { type: String, default: 'Enter Your Message Here' },
    captchaPlaceholder: { type: String, default: 'Code*' },
    submitButtonText: { type: String, default: 'Request A Call Back' },
    backgroundColor: { type: String, default: '#3b5998' },
    gradientColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.55 },
    showFloatingShapes: { type: Boolean, default: true },
    paddingTop: { type: String, default: '170px' },
    paddingBottom: { type: String, default: '100px' },
    bannerHeight: { type: String, default: '420px' },
    mobileTitleSize: { type: String, default: '40px' },
    mobileDescSize: { type: String, default: '14px' }
  },
  breadcrumb: {
    parentLabel: { type: String, default: 'Home' },
    parentUrl: { type: String, default: '/' },
    currentPageText: { type: String, default: 'Hair Transplant Clinic' },
    backgroundColor: { type: String, default: '#f8f9fa' }
  },
  intro: {
    heading: { type: String, default: 'Welcome to DMC Trichology' },
    welcomeText: { type: String, default: '<p>At DMC Trichology, we believe that hair restoration is as much an art as it is a science. As one of Delhi’s most elite trichology clinics, we offer a dedicated suite of cutting-edge hair transplant techniques, custom-tailored to the unique physiological profile and aesthetic goals of every patient.</p><p>Under the guidance of our clinical directors, our highly trained team of surgeons utilizes state-of-the-art medical innovations to ensure high-density hair graft survival rates, absolute safety, and virtually seamless blending with your natural hairline.</p>' },
    directorQuote: { type: String, default: 'Our mission is simple: to combine surgical precision with visual artistry to restore not just your hair, but your self-assurance.' },
    image: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png' },
    readMoreText: { type: String, default: '' },
    isVisible: { type: Boolean, default: true }
  },
  procedures: {
    heading: { type: String, default: 'Our Elite Hair Restoration Procedures' },
    introText: { type: String, default: 'We leverage state-of-the-art US-FDA approved technologies to deliver dense, natural, and permanent results.' },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 1, title: 'Advanced FUE Hair Transplant', description: 'Follicular Unit Extraction utilizing micro-punches to carefully extract individual hair units with zero linear scarring.', image: '', link: '/details/fue-hair-transplant', enabled: true },
        { id: 2, title: 'DHI Hair Transplant', description: 'Direct Hair Implantation using specialized Choi Implanter Pens for precise control of graft depth, angle, and direction.', image: '', link: '/details/dhi-hair-transplant', enabled: true },
        { id: 3, title: 'Robotic Hair Transplant', description: 'Computer-guided follicular extraction providing absolute mathematical precision and minimizing donor graft wastage.', image: '', link: '/details/robotic-hair-transplant', enabled: true },
        { id: 4, title: 'Scalp Micropigmentation', description: 'Non-surgical medical tattooing that mimics active follicular density, ideal for diffuse thinning and scar concealment.', image: '', link: '/details/scalp-micropigmentation', enabled: true }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  timeline: {
    heading: { type: String, default: 'Milestones in Clinical Excellence' },
    timelineTitle: { type: String, default: 'Our Journey' },
    timelineItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { year: '2012', title: 'Founding of DMC Trichology', description: 'Established with a vision to redefine standard hair restoration services in Delhi by providing elite, premium care.', enabled: true },
        { year: '2015', title: '1,000+ Successful Restorations', description: 'Crossed the milestone of 1,000 dense-graft hair transplants with a 98% graft survival rate.', enabled: true },
        { year: '2018', title: 'International Accreditations', description: 'Inducted into leading global hair restoration associations and awarded best clinical practices in trichology.', enabled: true },
        { year: '2022', title: 'State-of-the-Art Robotic Lab', description: 'Equipped our main luxury Vasant Vihar suite with high-precision computer-guided extraction systems.', enabled: true }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  patientCare: {
    heading: { type: String, default: 'Expertise & Premium Patient Care' },
    introText: { type: String, default: 'At DMC Trichology, patient comfort, meticulous hygiene, and long-term result quality are our primary directives.' },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { title: 'Personalized Graft Mapping', content: 'Our surgeons pre-calculate exact density vectors and angle alignments to mimic your natural growth pattern.', isVisible: true },
        { title: 'Ultra-Sterile Surgical Suites', content: 'We maintain positive pressure, class 100 laminar flow filtration cleanrooms for absolute safety and zero risk of infection.', isVisible: true },
        { title: 'Rigorous Post-Care Support', content: 'Receive comprehensive follow-up checkups, specialized low-level laser therapy (LLLT) sessions, and custom hair washes.', isVisible: true }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  associations: {
    heading: { type: String, default: 'GLOBAL MEMBERSHIPS & TRUST CERTIFICATIONS' },
    sectionBgColor: { type: String, default: '#ffffff' },
    logos: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 1, title: 'World Trichology Society', imageUrl: '', link: '', enabled: true },
        { id: 2, title: 'IADVL Member', imageUrl: '', link: '', enabled: true },
        { id: 3, title: 'European Society of Hair Restoration', imageUrl: '', link: '', enabled: true },
        { id: 4, title: 'US-FDA Clinical Standards', imageUrl: '', link: '', enabled: true }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  reviews: {
    heading: { type: String, default: 'What Our Premium Patients Say' },
    googleRating: { type: String, default: '4.9' },
    count: { type: String, default: '15,000+' },
    reviewsList: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { author: 'Amit Sharma', rating: 5, text: 'Fantastic experience at DMC. The density achieved is absolutely mind-blowing and the recovery was completely seamless. Highly recommended!', verified: true, date: '1 month ago' },
        { author: 'Rohan Malhotra', rating: 5, text: 'The surgical team was highly professional and meticulous. The luxury suite and custom care made it feel like a premier clinical retreat.', verified: true, date: '3 months ago' },
        { author: 'Vikram Mehta', rating: 5, text: 'After consulting multiple doctors, I chose DMC. Their graft calculation was scientifically precise and my results are completely natural.', verified: true, date: '6 months ago' }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  faq: {
    heading: { type: String, default: 'Frequently Asked Questions' },
    description: { type: String, default: 'Explore comprehensive expert insights on hair restoration, grafting, and timeline expectations.' },
    faqsList: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { question: 'How long does a hair transplant procedure take?', answer: 'Typically, a standard FUE session takes between 6 to 8 hours depending on the number of grafts required. Our luxury patient suites ensure complete relaxation throughout the day.', isVisible: true },
        { question: 'Is the procedure painful?', answer: 'We utilize advanced local anesthetics and microscopic needles to make the process virtually painless. Most patients comfortably watch movies or read during their transplant.', isVisible: true },
        { question: 'When will I see the final results?', answer: 'Initial active shedding occurs in the first month. New, permanent follicles begin growing around month 3, with complete, high-density maturation fully visible by months 10 to 12.', isVisible: true },
        { question: 'Are the transplanted hairs permanent?', answer: 'Yes. Hair grafts are extracted from the permanent safe donor zone at the back or sides of the scalp, which are genetically resistant to DHT-induced thinning.', isVisible: true }
      ]
    },
    isVisible: { type: Boolean, default: true }
  },
  cta: {
    heading: { type: String, default: 'Begin Your Hair Restoration Journey Today' },
    subheading: { type: String, default: 'Schedule a private clinical assessment with our trichology directors.' },
    buttonText: { type: String, default: 'Book A Luxury Consultation' },
    buttonLink: { type: String, default: '#appointment-form' },
    isVisible: { type: Boolean, default: true }
  },
  seo: {
    metaTitle: { type: String, default: 'Best Hair Transplant Clinic in Delhi | DMC Trichology' },
    metaDescription: { type: String, default: 'DMC Trichology is Delhi’s premium flagship clinic for high-density, advanced FUE and DHI hair transplants. Consult our board-certified clinical specialists today.' },
    ogImage: { type: String, default: '' }
  }
}, { timestamps: true, collection: 'hairtransplantclinic' });

module.exports = mongoose.model('HairTransplantClinic', HairTransplantClinicSchema);
