const HairTransplantClinic = require('../models/HairTransplantClinic');
const HairTransplantClinicLead = require('../models/HairTransplantClinicLead');
const uploadToSupabase = require('../utils/uploadToSupabase');

// Standard premium fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'PREMIUM HAIR TRANSPLANT CLINIC IN DELHI',
    doctorName: 'DMC Trichology',
    degreeText: 'Advanced Hair Restoration Sciences',
    descriptionParagraph: 'Transform your confidence with Delhi’s most advanced, premium hair transplant procedures. Combining world-class US-FDA approved technologies with the artistic precision of board-certified clinical specialists, DMC Trichology delivers natural-looking, high-density results that last a lifetime.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    emailPlaceholder: 'E-Mail Address*',
    datePlaceholder: 'Select Preferred Date*',
    messagePlaceholder: 'Enter Your Message Here',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Request A Call Back',
    backgroundColor: '#0b132b',
    overlayOpacity: 0.6
  },
  breadcrumb: {
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'Hair Transplant Clinic',
    backgroundColor: '#f8f9fa'
  },
  intro: {
    heading: 'Welcome to DMC Trichology',
    welcomeText: '<p>At DMC Trichology, we believe that hair restoration is as much an art as it is a science. As one of Delhi’s most elite trichology clinics, we offer a dedicated suite of cutting-edge hair transplant techniques, custom-tailored to the unique physiological profile and aesthetic goals of every patient.</p><p>Under the guidance of our clinical directors, our highly trained team of surgeons utilizes state-of-the-art medical innovations to ensure high-density hair graft survival rates, absolute safety, and virtually seamless blending with your natural hairline.</p>',
    directorQuote: 'Our mission is simple: to combine surgical precision with visual artistry to restore not just your hair, but your self-assurance.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    readMoreText: '',
    isVisible: true
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

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

exports.getSettings = async (req, res) => {
  try {
    const settings = await HairTransplantClinic.findOne();
    if (!settings) {
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching Hair Transplant Clinic settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    const settings = await HairTransplantClinic.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating Hair Transplant Clinic settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const publicUrl = await uploadToSupabase(req.file, 'hair_transplant_clinic_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Hair Transplant Clinic asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API
// ==========================================

exports.createLead = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number.' });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: 'Please select a preferred appointment date.' });
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await HairTransplantClinicLead.findOne({
      mobile: trimmedMobile,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a consultation request. Please wait a moment.'
      });
    }

    const lead = await HairTransplantClinicLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: trimmedMobile,
      service: service ? service.trim() : 'Hair Transplant Clinic Consultation',
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : '',
      status: 'new',
      notes: ''
    });

    return res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Error creating Hair Transplant Clinic lead:', error);
    next(error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const queryObj = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      queryObj.$or = [
        { name: searchRegex }, { email: searchRegex },
        { mobile: searchRegex }, { service: searchRegex }
      ];
    }
    if (req.query.status) queryObj.status = req.query.status.trim();
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) queryObj.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
    }

    const sortObj = {};
    sortObj[req.query.sortBy || 'createdAt'] = req.query.sortOrder === 'asc' ? 1 : -1;

    const total = await HairTransplantClinicLead.countDocuments(queryObj);
    const leads = await HairTransplantClinicLead.find(queryObj).sort(sortObj).skip(skip).limit(limit);

    return res.status(200).json({
      success: true, count: leads.length, data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching Hair Transplant Clinic leads:', error);
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await HairTransplantClinicLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching single lead:', error);
    next(error);
  }
};

exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    const lead = await HairTransplantClinicLead.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead status:', error);
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await HairTransplantClinicLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    next(error);
  }
};

exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid lead IDs to delete' });
    }
    await HairTransplantClinicLead.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const queryObj = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      queryObj.$or = [
        { name: searchRegex }, { email: searchRegex },
        { mobile: searchRegex }, { service: searchRegex }
      ];
    }
    if (req.query.status) queryObj.status = req.query.status.trim();
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) queryObj.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
    }

    const leads = await HairTransplantClinicLead.find(queryObj).sort({ createdAt: -1 });
    let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
    leads.forEach(row => {
      const apptDateStr = row.appointmentDate ? new Date(row.appointmentDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? new Date(row.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row._id}","${(row.name||'').replace(/"/g,'""')}","${row.email}","${row.mobile}","${(row.service||'').replace(/"/g,'""')}","${apptDateStr}","${row.status}","${(row.notes||'').replace(/"/g,'""')}","${createdStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=hair-transplant-clinic-leads.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    next(error);
  }
};
