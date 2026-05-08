const Footer = require('../models/Footer');

const defaultColumns = [
  {
    id: 'col1',
    title: 'Hair Transplant',
    links: [
      { id: 'l1', label: 'FUE Hair Transplant', url: '/services/fue' },
      { id: 'l2', label: 'DHI Hair Transplant', url: '/services/dhi' },
      { id: 'l3', label: 'Beard Transplant', url: '/services/beard' }
    ]
  },
  {
    id: 'col2',
    title: 'Hair Treatments',
    links: [
      { id: 'l4', label: 'PRP Therapy', url: '/treatments/prp' },
      { id: 'l5', label: 'Meso Therapy', url: '/treatments/meso' },
      { id: 'l6', label: 'Hair Growth Factors', url: '/treatments/growth-factors' }
    ]
  }
];

const defaultSocials = [
  { id: 's1', icon: 'facebook', url: 'https://facebook.com/dmctrichology' },
  { id: 's2', icon: 'instagram', url: 'https://instagram.com/dmctrichology' },
  { id: 's3', icon: 'youtube', url: 'https://youtube.com/dmctrichology' }
];

exports.getFooter = async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) {
      data = await Footer.create({
        columns: defaultColumns,
        socials: defaultSocials
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) data = new Footer();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.columns !== undefined) data.columns = u.columns;
    if (u.contact !== undefined) data.contact = u.contact;
    if (u.disclaimer !== undefined) data.disclaimer = u.disclaimer;
    if (u.newsletter !== undefined) data.newsletter = u.newsletter;
    if (u.branding !== undefined) data.branding = u.branding;
    if (u.socials !== undefined) data.socials = u.socials;
    if (u.bottomFooter !== undefined) data.bottomFooter = u.bottomFooter;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
