const HairTransplantClinic = require('../models/HairTransplantClinic');
const HairTransplantClinicLead = require('../models/HairTransplantClinicLead');
const uploadToSupabase = require('../utils/uploadToSupabase');
const supabase = require('../config/supabase');

// Feature Flag Check
const useSupabase = () => {
  return process.env.USE_SUPABASE_FOR_CLINIC === 'true';
};

// Mappings from PostgreSQL snake_case to Mongoose camelCase for Leads dashboard compatibility
const mapLeadToMongooseFormat = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    service: row.service,
    appointmentDate: row.appointment_date,
    message: row.message,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// Standard premium fallback data for absolute SSR safety
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

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

exports.getSettings = async (req, res) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [Hair Transplant Clinic API] Routing GET settings request to SUPABASE");
      
      const { data: rows, error } = await supabase
        .from('hair_transplant_clinic')
        .select('id, data, created_at, updated_at')
        .eq('id', 1)
        .limit(1);

      if (error) {
        console.error('Supabase fetch error for Hair Transplant Clinic settings:', error.message);
        return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
      }

      if (!rows || rows.length === 0) {
        console.log("⚠️ No settings record found in Supabase. Returning fallbacks.");
        return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
      }

      const row = rows[0];
      // Self-healing merge baseline: fallbackData defaults are overwritten by actual saved DB fields
      const responseData = {
        ...fallbackData,
        ...row.data,
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      return res.status(200).json({ success: true, data: responseData });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Hair Transplant Clinic API] Routing GET settings request to MONGODB");
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

    if (useSupabase()) {
      console.log("⚡ [Hair Transplant Clinic API] Routing UPDATE settings request to SUPABASE");

      // Deep-merge payload with pre-existing settings inside JSONB column
      let existingData = {};
      const { data: existingRows, error: fetchErr } = await supabase
        .from('hair_transplant_clinic')
        .select('data')
        .eq('id', 1)
        .limit(1);

      if (!fetchErr && existingRows && existingRows.length > 0) {
        existingData = existingRows[0].data || {};
      }

      // Self-healing merge baseline: fallbackData + existingData + updateData
      const mergedData = { ...fallbackData, ...existingData, ...updateData };
      delete mergedData.id;
      delete mergedData.createdAt;
      delete mergedData.updatedAt;

      const { data: savedRow, error: upsertErr } = await supabase
        .from('hair_transplant_clinic')
        .upsert(
          {
            id: 1,
            data: mergedData,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'id',
            ignoreDuplicates: false
          }
        )
        .select('id, data, updated_at')
        .single();

      if (upsertErr) {
        console.error('Supabase upsert settings error for Hair Transplant Clinic:', upsertErr.message);
        return res.status(500).json({ success: false, message: 'Failed to save to Supabase', error: upsertErr.message });
      }

      const responseData = {
        ...savedRow.data,
        id: savedRow.id,
        updatedAt: savedRow.updated_at
      };

      return res.status(200).json({
        success: true,
        data: responseData,
        message: 'Settings updated successfully on Supabase'
      });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Hair Transplant Clinic API] Routing UPDATE settings request to MONGODB");
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

    if (useSupabase()) {
      console.log("⚡ [Hair Transplant Clinic API] Routing CREATE lead request to SUPABASE");

      // Duplicate screening: screen for submissions in the last 2 minutes from same mobile
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data: duplicateRows, error: checkErr } = await supabase
        .from('hair_transplant_clinic_leads')
        .select('id')
        .eq('mobile', trimmedMobile)
        .gte('created_at', twoMinutesAgo)
        .limit(1);

      if (!checkErr && duplicateRows && duplicateRows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted a consultation request. Please wait a moment.'
        });
      }

      const { data: insertedLead, error: insertErr } = await supabase
        .from('hair_transplant_clinic_leads')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: trimmedMobile,
          service: service ? service.trim() : 'Hair Transplant Clinic Consultation',
          appointment_date: new Date(appointmentDate).toISOString(),
          message: message ? message.trim() : '',
          status: 'new',
          notes: ''
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Supabase lead insertion failure for Hair Transplant Clinic:', insertErr.message);
        return res.status(500).json({ success: false, message: 'Failed to record lead in Supabase', error: insertErr.message });
      }

      const formattedResponse = mapLeadToMongooseFormat(insertedLead);

      return res.status(201).json({
        success: true,
        data: formattedResponse,
        message: 'Lead created successfully in Hair Transplant Clinic leads (Supabase)'
      });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Hair Transplant Clinic API] Routing CREATE lead request to MONGODB");
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
    if (useSupabase()) {
      console.log("⚡ [Hair Transplant Clinic API] Routing FETCH leads request to SUPABASE");
      
      let query = supabase
        .from('hair_transplant_clinic_leads')
        .select('*', { count: 'exact' });

      // Live search keywords (or block)
      if (req.query.search) {
        const searchVal = req.query.search.trim();
        query = query.or(`name.ilike.%${searchVal}%,email.ilike.%${searchVal}%,mobile.ilike.%${searchVal}%,service.ilike.%${searchVal}%`);
      }

      // Status filter
      if (req.query.status) {
        query = query.eq('status', req.query.status.trim());
      }

      // Date range filter
      if (req.query.startDate) {
        query = query.gte('created_at', new Date(req.query.startDate).toISOString());
      }
      if (req.query.endDate) {
        query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
      }

      // Sorting
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'desc';
      const mappedSortBy = sortBy === 'appointmentDate' ? 'appointment_date' : (sortBy === 'createdAt' ? 'created_at' : sortBy);

      query = query.order(mappedSortBy, { ascending: sortOrder === 'asc' });

      // Pagination bounds
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      query = query.range(skip, skip + limit - 1);

      const { data: rows, count, error } = await query;

      if (error) {
        console.error('Supabase fetch leads error for Hair Transplant Clinic:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch leads', error: error.message });
      }

      const mongooseRows = (rows || []).map(row => mapLeadToMongooseFormat(row));

      return res.status(200).json({
        success: true,
        count: mongooseRows.length,
        data: mongooseRows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Hair Transplant Clinic API] Routing FETCH leads request to MONGODB");
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
    if (useSupabase()) {
      console.log(`⚡ [Hair Transplant Clinic API] Fetching single lead ${req.params.id} from SUPABASE`);
      const { data: row, error } = await supabase
        .from('hair_transplant_clinic_leads')
        .select('*')
        .eq('id', req.params.id)
        .limit(1)
        .single();

      if (error) {
        console.error('Supabase fetch lead error:', error.message);
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      return res.status(200).json({ success: true, data: mapLeadToMongooseFormat(row) });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Hair Transplant Clinic API] Fetching single lead ${req.params.id} from MONGODB`);
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

    if (useSupabase()) {
      console.log(`⚡ [Hair Transplant Clinic API] Updating lead ${req.params.id} on SUPABASE`);
      
      const mappedUpdates = { ...updates };
      
      const { data: updatedLead, error } = await supabase
        .from('hair_transplant_clinic_leads')
        .update(mappedUpdates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update lead error:', error.message);
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      return res.status(200).json({
        success: true,
        data: mapLeadToMongooseFormat(updatedLead),
        message: 'Lead updated successfully'
      });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Hair Transplant Clinic API] Updating lead ${req.params.id} on MONGODB`);
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
    if (useSupabase()) {
      console.log(`⚡ [Hair Transplant Clinic API] Deleting lead ${req.params.id} from SUPABASE`);
      
      const { error } = await supabase
        .from('hair_transplant_clinic_leads')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        console.error('Supabase delete lead error:', error.message);
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Hair Transplant Clinic API] Deleting lead ${req.params.id} from MONGODB`);
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

    if (useSupabase()) {
      console.log(`⚡ [Hair Transplant Clinic API] Bulk deleting ${ids.length} leads from SUPABASE`);

      const { error } = await supabase
        .from('hair_transplant_clinic_leads')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Supabase bulk delete error for Hair Transplant Clinic:', error.message);
        return res.status(500).json({ success: false, message: 'Bulk delete failed', error: error.message });
      }

      return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Hair Transplant Clinic API] Bulk deleting ${ids.length} leads from MONGODB`);
    await HairTransplantClinicLead.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [Hair Transplant Clinic API] Exporting leads to CSV from SUPABASE");

      let query = supabase
        .from('hair_transplant_clinic_leads')
        .select('*');

      if (req.query.search) {
        const searchVal = req.query.search.trim();
        query = query.or(`name.ilike.%${searchVal}%,email.ilike.%${searchVal}%,mobile.ilike.%${searchVal}%,service.ilike.%${searchVal}%`);
      }

      if (req.query.status) {
        query = query.eq('status', req.query.status.trim());
      }

      if (req.query.startDate) {
        query = query.gte('created_at', new Date(req.query.startDate).toISOString());
      }
      if (req.query.endDate) {
        query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
      }

      query = query.order('created_at', { ascending: false });

      const { data: rows, error } = await query;

      if (error) {
        console.error('Supabase CSV export leads error for Hair Transplant Clinic:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to export leads', error: error.message });
      }

      let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
      (rows || []).forEach(row => {
        const idStr = row.id.toString();
        const nameStr = row.name.replace(/"/g, '""');
        const emailStr = row.email.replace(/"/g, '""');
        const serviceStr = (row.service || '').replace(/"/g, '""');
        const notesStr = (row.notes || '').replace(/"/g, '""');
        
        const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
        const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
        
        csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=hair-transplant-clinic-leads.csv');
      return res.status(200).send(csv);
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Hair Transplant Clinic API] Exporting leads to CSV from MONGODB");
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
