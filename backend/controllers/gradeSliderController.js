const GradeSlider = require('../models/GradeSlider');

const defaultGrades = [
  { grade: 'GRADE 1', displayNum: '1', area: '20 cm²', density: '40/cm²', grafts: '800', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/s4afgaemlnxgpza6klc2.png' },
  { grade: 'GRADE 2', displayNum: '2', area: '40 cm²', density: '40/cm²', grafts: '1600', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/txprqtwbqrckrqbbtkbm.png' },
  { grade: 'GRADE 3', displayNum: '3', area: '60 cm²', density: '40/cm²', grafts: '2400', session: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/lm1wuhdnisarojusnl1c.png' },
  { grade: 'GRADE 4', displayNum: '4', area: '80 cm²', density: '40/cm²', grafts: '3200', session: '1-2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/fnby98gc9fgctznkbpdt.png' },
  { grade: 'GRADE 5', displayNum: '5', area: '100 cm²', density: '40/cm²', grafts: '4000', session: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/r3etpyboaedgq8gizzpc.png' }
];

exports.getGradeSlider = async (req, res) => {
  try {
    let data = await GradeSlider.findOne();
    if (!data) {
      data = await GradeSlider.create({
        enabled: true,
        badgeText: 'EQUIP YOUR RECOVERY',
        heading: 'Know Your Grade For Hair Transplant',
        backgroundColor: '#000000',
        grades: defaultGrades
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGradeSlider = async (req, res) => {
  try {
    let data = await GradeSlider.findOne();
    if (!data) data = new GradeSlider();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.backgroundColor !== undefined) data.backgroundColor = u.backgroundColor;

    if (u.grades !== undefined) {
      data.grades = u.grades;
      data.markModified('grades');
    }

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
