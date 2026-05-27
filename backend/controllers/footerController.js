const Footer = require('../models/Footer');
const { useSupabaseGlobals, getGlobalSetting, updateGlobalSetting } = require('../utils/supabaseGlobalHelper');

const defaultColumns = [
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
];

const defaultSocials = [
  { id: 's1', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png', url: '#' },
  { id: 's2', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png', url: '#' },
  { id: 's3', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png', url: '#' },
  { id: 's4', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png', url: '#' },
  { id: 's5', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png', url: '#' }
];

const defaultFooterData = {
  columns: defaultColumns,
  socials: defaultSocials,
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
};

exports.getFooter = async (req, res) => {
  try {
    if (useSupabaseGlobals()) {
      const footer = await getGlobalSetting('footer', defaultFooterData);
      return res.json({ success: true, data: footer });
    }

    let data = await Footer.findOne();
    if (!data) {
      data = await Footer.create(defaultFooterData);
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const u = req.body;

    // Update in MongoDB first (rollback backup)
    let dataMongo = await Footer.findOne();
    if (!dataMongo) dataMongo = new Footer();

    if (u.enabled !== undefined) dataMongo.enabled = u.enabled;
    if (u.columns !== undefined) dataMongo.columns = u.columns;
    if (u.contact !== undefined) dataMongo.contact = u.contact;
    if (u.disclaimer !== undefined) dataMongo.disclaimer = u.disclaimer;
    if (u.newsletter !== undefined) dataMongo.newsletter = u.newsletter;
    if (u.branding !== undefined) dataMongo.branding = u.branding;
    if (u.socials !== undefined) dataMongo.socials = u.socials;
    if (u.bottomFooter !== undefined) dataMongo.bottomFooter = u.bottomFooter;
    await dataMongo.save();

    // Update in Supabase if active
    if (useSupabaseGlobals()) {
      const footerSupa = await updateGlobalSetting('footer', defaultFooterData, u);
      return res.json({ success: true, data: footerSupa });
    }

    res.json({ success: true, data: dataMongo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
