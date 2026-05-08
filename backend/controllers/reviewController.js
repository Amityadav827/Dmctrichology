const Review = require('../models/Review');

const defaultReviews = [
  { name: "Anjali Kohli", text: "The full body laser session was excellent. The therapist was highly skilled and made the experience comfortable and effective." },
  { name: "Ravi Malik", text: "The result of laser treatment is very nice. I have tried LHR from different places but find this the best." },
  { name: "Priya Sharma", text: "Today is the first session of slimming the abdomen, and love handles inch loss. I am totally satisfied with service." },
  { name: "Vikas sharma", text: "I really liked the way you handled that unwanted hair on my body. Avataar, you made it all so simple and quick" },
  { name: "Sneha Aggrawal", text: "I highly recommend their services to anyone looking to enhance their natural beauty and enjoy a moment of relaxation." },
  { name: "Rahul Tomar", text: "The results exceeded my expectations, and I felt pampered without the hassle of traveling to a salon." },
  { name: "Priyal Sen", text: "The procedure was quick, comfortable... I've already started noticing positive changes since my first session." },
  { name: "Viihan Rath", text: "The technician was very skilled, gentle, and made sure I was comfortable throughout the session." },
  { name: "Simran Paul", text: "I've had a great experience with my laser hair reduction sessions. My therapist is highly professional and gentle." },
  { name: "Alka Singh", text: "Thank you for the wonderful facial! The entire experience was relaxing and refreshing. You were very professional." }
];

const defaultVideos = [
  { name: "Real Results Story", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/ba79ohixgo962pduymyd.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { name: "Tanvi's Hydration", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/u1z7ggmemmekm84ep5hu.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { name: "Kritika Kamra", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/pgab6yn3skxpsx4oftws.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { name: "Shweta Tiwari", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716930/dmc-trichology/fgljhvgnh4lyhilbokdf.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { name: "Influencer Dish", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777716929/dmc-trichology/o0naqjvopw7otiwdzwsg.png", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
];

exports.getReviews = async (req, res) => {
  try {
    let data = await Review.findOne();
    if (!data) {
      data = await Review.create({
        badgeText: 'REVIEWS',
        heading: 'See the Results. Hear the Stories.',
        googleReviewText: '7000+ Reviews on',
        reviews: defaultReviews,
        videos: defaultVideos
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReviews = async (req, res) => {
  try {
    let data = await Review.findOne();
    if (!data) data = new Review();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.googleReviewText !== undefined) data.googleReviewText = u.googleReviewText;
    if (u.reviews !== undefined) data.reviews = u.reviews;
    if (u.videos !== undefined) data.videos = u.videos;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
