const AboutDrNivedita = require('../models/AboutDrNivedita');
const AboutDrNiveditaLead = require('../models/AboutDrNiveditaLead');
const uploadToSupabase = require('../utils/uploadToSupabase');
const supabase = require('../config/supabase');

// Feature Flag Check
const useSupabase = () => {
  return process.env.USE_SUPABASE_FOR_NIVEDITA === 'true';
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

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
    doctorName: 'Dr. Nivedita Dadu',
    degreeText: 'MBBS, MD (Dermatology)',
    descriptionParagraph: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    emailPlaceholder: 'E-Mail Address*',
    datePlaceholder: 'Select Preferred Date*',
    messagePlaceholder: 'Enter Your Message Here',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Schedule Your Visit',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.45
  },
  breadcrumb: {
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'About Dr Nivedita Dadu',
    backgroundColor: '#f8f9fa'
  },
  specialist: {
    heading: 'Best Dermatologist & Hair Specialist in Delhi',
    description1: 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.',
    description2: 'Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.',
    highlightedText: 'She specializes in cutting-edge treatments including:',
    bullets: [
      'Advanced PRP & GFC Therapy',
      'FUE Hair Transplant Surgery',
      'Scalp Micropigmentation',
      'LLLT (Laser Hair Therapy)',
      'Custom Trichological Protocols'
    ],
    sectionBgColor: '#ffffff',
    cardBgColor: '#3b5998'
  },
  membership: {
    sectionHeading: 'MEMBERSHIP',
    sectionBgColor: '#ffffff',
    paddingTop: '60px',
    paddingBottom: '60px',
    logos: [
      { id: 1, title: 'EADV', imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'IAM', imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'IADVL', imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'Trichology Society', imageUrl: '', link: '', enabled: true },
      { id: 5, title: 'ISOINEL', imageUrl: '', link: '', enabled: true }
    ]
  },
  educationExperience: {
    sectionBgColor: '#FFFFFF',
    educationTitle: 'EDUCATION',
    experienceTitle: 'EXPERIENCE',
    educationItems: [
      { degree: 'MBBS', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2000' },
      { degree: 'MD (Dermatology)', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2004' }
    ],
    experienceItems: [
      { role: 'Senior Dermatologist', hospital: 'Dr. Ram Manohar Lohia Hospital, New Delhi', duration: '2004 - 2008' },
      { role: 'Fellowship In Hair Science & Trichology', hospital: 'King Edward Memorial Hospital, Mumbai', duration: '2008 - 2010' },
      { role: 'Consultant Dermatologist', hospital: 'Primus Hospital, New Delhi', duration: '2010 - 2012' },
      { role: 'Co-Founder & Senior Dermatologist', hospital: 'DMC Trichology, New Delhi', duration: '2012 - Present' }
    ]
  },
  credentialsSection: {
    bannerImage: '',
    overlayOpacity: 0.35,
    heading: 'Credentials',
    credentialsList: [
      { text: 'Fellowship In Aesthetic Dermatology' },
      { text: 'Fellowship In Hair Science' },
      { text: 'Member — IADVL (Indian Association of Dermatologists)' }
    ],
    leftHeading: 'EXPERTISE IN DERMATOLOGY & HAIR TREATMENT',
    leftText: '<p>Dr. Nivedita Dadu\'s cutting-edge Hair Loss Treatment techniques have made a significant difference. She is recognized as a <strong>leading dermatologist and trichologist in Delhi</strong> available at DMC Trichology.</p>',
    rightHeading: 'COMMITMENT TO PATIENT CARE',
    rightText: '<p>Dr. Nivedita Dadu places a high value on the doctor-patient relationship, ensuring springboard care at every step of the treatment journey.</p>',
    paddingBottom: '80px'
  },
  otherSpecialitiesSection: {
    heading: 'Other Specialities',
    introParagraph: 'Apart from being a leading expert in Trichological Sciences, Dr. Nivedita Dadu is also a diligent specialist in advanced dermatology, performing a number of cosmetic procedures such as:',
    specialitiesList: [
      { title: 'Laser Skin Resurfacing & Rejuvenation,' },
      { title: 'Chemical Peels & Advanced Facials,' },
      { title: 'Botox, Fillers & Anti-Ageing Treatments,' },
      { title: 'Pigmentation & Melasma Management,' },
      { title: 'Acne & Scar Treatment Protocols.' }
    ],
    conclusionParagraph: 'For more information, contact the **best dermatologist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).',
    image: '',
    imageAlt: 'Dr. Nivedita Other Specialities',
    backgroundColor: '#ffffff',
    cardBackgroundColor: '#3b5998',
    contentMaxWidth: '1200px',
    paddingTop: '100px',
    paddingBottom: '100px',
    gridGap: '70px'
  },
  featuredInSection: {
    sectionHeading: 'As Featured In',
    descriptionText: 'For her strong focus on the doctor-patient relationship, Dr. Nivedita Dadu has become the most sought-after Dermatology expert and also featured in various national and regional publications including:',
    sectionBgColor: '#ffffff',
    paddingTop: '72px',
    paddingBottom: '72px',
    publications: [
      { id: 1, title: 'Dainik Bhaskar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dainik_Bhaskar_logo.svg/320px-Dainik_Bhaskar_logo.svg.png', link: '', enabled: true },
      { id: 2, title: 'NDTV', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/NDTV_logo.svg/320px-NDTV_logo.svg.png', link: '', enabled: true },
      { id: 3, title: 'Femina', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Femina_magazine_logo.svg/320px-Femina_magazine_logo.svg.png', link: '', enabled: true },
      { id: 4, title: 'Deccan Herald', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Deccan_Herald_logo.svg/320px-Deccan_Herald_logo.svg.png', link: '', enabled: true },
      { id: 5, title: "Woman's Era", imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Woman%27s_Era_magazine_logo.svg/320px-Woman%27s_Era_magazine_logo.svg.png', link: '', enabled: true },
      { id: 6, title: 'Hindustan Times', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hindustan_times_logo.svg/320px-hindustan_times_logo.svg.png', link: '', enabled: true },
      { id: 7, title: 'Stayfit', imageUrl: '', link: '', enabled: true },
      { id: 8, title: 'Practo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Practo_Logo.svg/320px-Practo_Logo.svg.png', link: '', enabled: true },
      { id: 9, title: 'Mail Today', imageUrl: '', link: '', enabled: true }
    ]
  },
  patientCareSection: {
    sectionBgColor: '#f8f9fa',
    paddingTop: '80px',
    paddingBottom: '80px',
    maxWidth: '1200px',
    cardBorderRadius: '0px',
    cardShadowIntensity: '0 6px 32px rgba(0,0,0,0.07)',
    gridGap: '32px',
    leftCardTitle: 'Patient Centred Care',
    leftCardBgColor: '#ffffff',
    leftCardContent: '<p>Dr. Nivedita Dadu offers professional-grade, most personalised skin & hair care treatments to each individual patient. She, along with her team of dermatologists & aestheticians, has treated over 100 thousands critical cases throughout her career with optimal results. She is always available to her patients, offering compassionate care and utmost respect to ensure healthy skin & hair for all.</p><p>Dr. Nivedita takes the practice of skin & hair care seriously and will make sure you receive the care you deserve.</p>',
    rightCardTitle: 'Professionalism',
    rightCardBgColor: '#ffffff',
    rightCardContent: '<p>Dr. Nivedita Dadu maintains a highly professional environment to offer quality clinical care. She is one of the most recognised and respected skin & hair specialist professionals making her the best dermatologist giving customised treatment solutions that work- not just today, but for life.</p>'
  },
  associationsSection: {
    sectionHeading:  'ASSOCIATIONS',
    sectionBgColor:  '#ffffff',
    paddingTop:      '72px',
    paddingBottom:   '72px',
    logoSpacing:     '24px',
    logoHeight:      '90px',
    logoCardPadding: '20px 28px',
    associations: [
      { id: 1, title: 'IADVL',                          imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'World Trichology Society',        imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'AAM MMI',                         imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'EADV',                            imageUrl: '', link: '', enabled: true },
      { id: 5, title: 'Association of Cutaneous Surgeons', imageUrl: '', link: '', enabled: true }
    ]
  },
  seo: {
    metaTitle: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi',
    metaDescription: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and dermatological care.',
    ogImage: ''
  }
};

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

// Get settings
exports.getSettings = async (req, res) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [Dr. Nivedita API] Routing GET settings request to SUPABASE");
      
      const { data: rows, error } = await supabase
        .from('about_dr_nivedita')
        .select('id, data, created_at, updated_at')
        .eq('id', 1)
        .limit(1);

      if (error) {
        console.error('Supabase fetch error for Dr. Nivedita settings:', error.message);
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
    console.log("🍃 [Dr. Nivedita API] Routing GET settings request to MONGODB");
    const settings = await AboutDrNivedita.findOne();
    if (!settings) {
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: settings });

  } catch (error) {
    console.error('Error fetching Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// Update settings (upsert single document)
exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;

    if (useSupabase()) {
      console.log("⚡ [Dr. Nivedita API] Routing UPDATE settings request to SUPABASE");

      // Deep-merge payload with pre-existing settings inside JSONB column
      let existingData = {};
      const { data: existingRows, error: fetchErr } = await supabase
        .from('about_dr_nivedita')
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
        .from('about_dr_nivedita')
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
        console.error('Supabase upsert settings error for Dr. Nivedita:', upsertErr.message);
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
        message: "Settings updated successfully on Supabase"
      });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Dr. Nivedita API] Routing UPDATE settings request to MONGODB");
    const settings = await AboutDrNivedita.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });

  } catch (error) {
    console.error('Error updating Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

// Upload media helper
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const publicUrl = await uploadToSupabase(req.file, 'dr_nivedita_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Dr. Nivedita asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API
// ==========================================

// Create new lead
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
      console.log("⚡ [Dr. Nivedita API] Routing CREATE lead request to SUPABASE");

      // Duplicate screening: screen for submissions in the last 2 minutes from same mobile
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data: duplicateRows, error: checkErr } = await supabase
        .from('about_dr_nivedita_leads')
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
        .from('about_dr_nivedita_leads')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: trimmedMobile,
          service: service ? service.trim() : 'Dr. Nivedita Consultation',
          appointment_date: new Date(appointmentDate).toISOString(),
          message: message ? message.trim() : '',
          status: 'new',
          notes: ''
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Supabase lead insertion failure for Dr. Nivedita:', insertErr.message);
        return res.status(500).json({ success: false, message: 'Failed to record lead in Supabase', error: insertErr.message });
      }

      const formattedResponse = mapLeadToMongooseFormat(insertedLead);

      return res.status(201).json({
        success: true,
        data: formattedResponse,
        message: 'Lead created successfully in Dr. Nivedita leads (Supabase)'
      });
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Dr. Nivedita API] Routing CREATE lead request to MONGODB");
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await AboutDrNiveditaLead.findOne({
      mobile: trimmedMobile,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a consultation request. Please wait a moment.'
      });
    }

    const lead = await AboutDrNiveditaLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: trimmedMobile,
      service: service ? service.trim() : 'Dr. Nivedita Dadu Consultation',
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : '',
      status: 'new',
      notes: ''
    });

    return res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully in Dr. Nivedita leads'
    });
  } catch (error) {
    console.error('Error creating Dr. Nivedita lead:', error);
    next(error);
  }
};

// Fetch Leads (Search, filter status, date range, pagination, sorts)
exports.getLeads = async (req, res, next) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [Dr. Nivedita API] Routing FETCH leads request to SUPABASE");
      
      let query = supabase
        .from('about_dr_nivedita_leads')
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
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder || "desc";
      const mappedSortBy = sortBy === 'appointmentDate' ? 'appointment_date' : (sortBy === 'createdAt' ? 'created_at' : sortBy);

      query = query.order(mappedSortBy, { ascending: sortOrder === 'asc' });

      // Pagination bounds
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      query = query.range(skip, skip + limit - 1);

      const { data: rows, count, error } = await query;

      if (error) {
        console.error('Supabase fetch leads error for Dr. Nivedita:', error.message);
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
    console.log("🍃 [Dr. Nivedita API] Routing FETCH leads request to MONGODB");
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

    const total = await AboutDrNiveditaLead.countDocuments(queryObj);
    const leads = await AboutDrNiveditaLead.find(queryObj).sort(sortObj).skip(skip).limit(limit);

    return res.status(200).json({
      success: true, count: leads.length, data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching Dr. Nivedita leads:', error);
    next(error);
  }
};

// Fetch single lead by id
exports.getLeadById = async (req, res, next) => {
  try {
    if (useSupabase()) {
      console.log(`⚡ [Dr. Nivedita API] Fetching single lead ${req.params.id} from SUPABASE`);
      const { data: row, error } = await supabase
        .from('about_dr_nivedita_leads')
        .select('*')
        .eq('id', req.params.id)
        .limit(1)
        .single();

      if (error) {
        console.error('Supabase fetch lead error:', error.message);
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      return res.status(200).json({ success: true, data: mapLeadToMongooseFormat(row) });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Dr. Nivedita API] Fetching single lead ${req.params.id} from MONGODB`);
    const lead = await AboutDrNiveditaLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching single lead:', error);
    next(error);
  }
};

// Update lead status & notes
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    if (useSupabase()) {
      console.log(`⚡ [Dr. Nivedita API] Updating lead ${req.params.id} on SUPABASE`);
      
      const mappedUpdates = { ...updates };
      
      const { data: updatedLead, error } = await supabase
        .from('about_dr_nivedita_leads')
        .update(mappedUpdates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update lead error:', error.message);
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      return res.status(200).json({
        success: true,
        data: mapLeadToMongooseFormat(updatedLead),
        message: "Lead updated successfully"
      });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Dr. Nivedita API] Updating lead ${req.params.id} on MONGODB`);
    const lead = await AboutDrNiveditaLead.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead status:', error);
    next(error);
  }
};

// Delete single lead
exports.deleteLead = async (req, res, next) => {
  try {
    if (useSupabase()) {
      console.log(`⚡ [Dr. Nivedita API] Deleting lead ${req.params.id} from SUPABASE`);
      
      const { error } = await supabase
        .from('about_dr_nivedita_leads')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        console.error('Supabase delete lead error:', error.message);
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Dr. Nivedita API] Deleting lead ${req.params.id} from MONGODB`);
    const lead = await AboutDrNiveditaLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    next(error);
  }
};

// Bulk Delete leads
exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid lead IDs to delete' });
    }

    if (useSupabase()) {
      console.log(`⚡ [Dr. Nivedita API] Bulk deleting ${ids.length} leads from SUPABASE`);

      const { error } = await supabase
        .from('about_dr_nivedita_leads')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Supabase bulk delete error for Dr. Nivedita:', error.message);
        return res.status(500).json({ success: false, message: "Bulk delete failed", error: error.message });
      }

      return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
    }

    // --- MongoDB legacy path ---
    console.log(`🍃 [Dr. Nivedita API] Bulk deleting ${ids.length} leads from MONGODB`);
    await AboutDrNiveditaLead.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    next(error);
  }
};

// Export to CSV format
exports.exportCsv = async (req, res, next) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [Dr. Nivedita API] Exporting leads to CSV from SUPABASE");

      let query = supabase
        .from('about_dr_nivedita_leads')
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
        console.error('Supabase CSV export leads error for Dr. Nivedita:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to export leads', error: error.message });
      }

      let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
      (rows || []).forEach(row => {
        const idStr = row.id.toString();
        const nameStr = row.name.replace(/"/g, '""');
        const emailStr = row.email.replace(/"/g, '""');
        const serviceStr = (row.service || "").replace(/"/g, '""');
        const notesStr = (row.notes || "").replace(/"/g, '""');
        
        const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
        const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
        
        csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=dr-nivedita-leads.csv');
      return res.status(200).send(csv);
    }

    // --- MongoDB legacy path ---
    console.log("🍃 [Dr. Nivedita API] Exporting leads to CSV from MONGODB");
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

    const leads = await AboutDrNiveditaLead.find(queryObj).sort({ createdAt: -1 });
    let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
    leads.forEach(row => {
      const apptDateStr = row.appointmentDate ? new Date(row.appointmentDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? new Date(row.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row._id}","${(row.name||'').replace(/"/g,'""')}","${row.email}","${row.mobile}","${(row.service||'').replace(/"/g,'""')}","${apptDateStr}","${row.status}","${(row.notes||'').replace(/"/g,'""')}","${createdStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dr-nivedita-leads.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    next(error);
  }
};
