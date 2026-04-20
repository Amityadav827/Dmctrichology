const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Service = require("../models/Service");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");

dotenv.config({ path: path.join(__dirname, "../.env") });

const users = [
  {
    name: "Admin User",
    email: "admin@dmc.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Riya Sharma",
    email: "riya@example.com",
    password: "user12345",
    role: "user",
  },
  {
    name: "Arjun Verma",
    email: "arjun@example.com",
    password: "user12345",
    role: "user",
  },
];

const services = [
  {
    title: "Hair Transplant Consultation",
    description: "Detailed diagnosis and treatment planning for hair restoration.",
    image: "https://example.com/images/service-1.jpg",
  },
  {
    title: "Scalp Analysis",
    description: "Advanced scalp analysis for trichology assessment and follow-up care.",
    image: "https://example.com/images/service-2.jpg",
  },
];

const blogs = [
  {
    title: "How To Stop Hair Fall Naturally",
    content: "Practical trichology-backed methods to reduce hair fall and strengthen roots.",
    image: "https://example.com/images/blog-1.jpg",
    author: "DMC Team",
  },
  {
    title: "Best Foods For Hair Growth",
    content: "A nutrition-focused guide to improving scalp health and hair quality.",
    image: "https://example.com/images/blog-2.jpg",
    author: "Dr. Mehta",
  },
];

const testimonials = [
  {
    name: "Neha Kapoor",
    feedback: "Professional consultation and excellent treatment results.",
    rating: 5,
  },
  {
    name: "Rohit Saini",
    feedback: "The scalp analysis process was detailed and very helpful.",
    rating: 4,
  },
];

const galleryItems = [
  {
    image: "https://example.com/images/gallery-1.jpg",
    category: "before-after",
  },
  {
    image: "https://example.com/images/gallery-2.jpg",
    category: "clinic",
  },
];

const contacts = [
  {
    name: "Sneha Jain",
    email: "sneha@example.com",
    message: "I want to know more about PRP hair treatment.",
  },
  {
    name: "Karan Malhotra",
    email: "karan@example.com",
    message: "Please share consultation charges and available slots.",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Service.deleteMany(),
      Blog.deleteMany(),
      Testimonial.deleteMany(),
      Gallery.deleteMany(),
      Contact.deleteMany(),
    ]);

    await User.insertMany(users);
    await Service.insertMany(services);
    await Blog.insertMany(blogs);
    await Testimonial.insertMany(testimonials);
    await Gallery.insertMany(galleryItems);
    await Contact.insertMany(contacts);

    console.log("Sample data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
