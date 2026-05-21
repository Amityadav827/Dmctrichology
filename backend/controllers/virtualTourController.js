const VirtualTour = require('../models/VirtualTour');

const defaultTourCards = [
  {
    id: '1',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg', // Placeholder, user can update via CMS
    title: 'Reception & Waiting Area',
    description: 'A warm, welcoming space designed for your comfort before treatment.',
    buttonText: 'View Space',
    buttonLink: '#',
    isVisible: true,
    order: 0
  },
  {
    id: '2',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    title: 'Consultation Room',
    description: 'Private and comfortable space for detailed discussion with our experts.',
    buttonText: 'View Space',
    buttonLink: '#',
    isVisible: true,
    order: 1
  },
  {
    id: '3',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    title: 'Treatment Room',
    description: 'State-of-the-art facilities equipped with latest technology.',
    buttonText: 'View Space',
    buttonLink: '#',
    isVisible: true,
    order: 2
  }
];

exports.getVirtualTour = async (req, res) => {
  try {
    let data = await VirtualTour.findOne();
    if (!data) {
      data = await VirtualTour.create({
        tourCards: defaultTourCards
      });
    }
    if (!data.tourCards || data.tourCards.length === 0) {
        data.tourCards = defaultTourCards;
        await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVirtualTour = async (req, res) => {
  try {
    let data = await VirtualTour.findOne();
    if (!data) data = new VirtualTour();

    const u = req.body;

    if (u.hero !== undefined) data.hero = { ...data.hero.toObject?.() ?? data.hero, ...u.hero };
    if (u.tourCards !== undefined) data.tourCards = u.tourCards;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
