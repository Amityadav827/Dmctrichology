const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Role = require("../models/Role");
const Service = require("../models/Service");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");
const Callback = require("../models/Callback");
const Appointment = require("../models/Appointment");
const ServiceCategory = require("../models/ServiceCategory");
const SecondCategory = require("../models/SecondCategory");
const ServiceFaq = require("../models/ServiceFaq");
const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");
const ResultCategory = require("../models/ResultCategory");
const ResultInner = require("../models/ResultInner");
const VideoCategory = require("../models/VideoCategory");
const Video = require("../models/Video");
const Menu = require("../models/Menu");
const Operation = require("../models/Operation");
const MenuOperation = require("../models/MenuOperation");
const { ensureAdminRole, ensureDefaultUserRole } = require("./roleHelpers");
const { ALL_PERMISSIONS } = require("./permissions");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function bootstrap() {
  await connectDB();

  const adminRole = await ensureAdminRole();
  let editorRole = await Role.findOne({ name: "editor" });

  if (!editorRole) {
    editorRole = await Role.create({
      name: "editor",
      permissions: ["dashboard", "services", "blog", "gallery", "testimonial"],
    });
  } else {
    editorRole.permissions = Array.from(new Set([...editorRole.permissions, "dashboard"]));
    await editorRole.save();
  }

  await ensureDefaultUserRole();

  let adminUser = await User.findOne({ email: "admin@dmc.com" }).select("+password");
  if (!adminUser) {
    adminUser = await User.create({
      name: "Admin User",
      email: "admin@dmc.com",
      phone: "9876543210",
      password: "admin123",
      role: adminRole._id,
      status: "active",
    });
  } else {
    adminUser.role = adminRole._id;
    adminUser.status = "active";
    await adminUser.save();
  }

  const counts = await Promise.all([
    Service.countDocuments(),
    Blog.countDocuments(),
    Contact.countDocuments(),
    Callback.countDocuments(),
    Appointment.countDocuments(),
    ServiceCategory.countDocuments(),
    SecondCategory.countDocuments(),
    ServiceFaq.countDocuments(),
    Testimonial.countDocuments(),
    Gallery.countDocuments(),
    ResultCategory.countDocuments(),
    ResultInner.countDocuments(),
    VideoCategory.countDocuments(),
    Video.countDocuments(),
    Menu.countDocuments(),
    Operation.countDocuments(),
    MenuOperation.countDocuments(),
  ]);

  if (counts[0] === 0) {
    await Service.insertMany([
      {
        title: "Hair Fall Treatment",
        description: "Advanced scalp and hair fall management program.",
        image: "https://example.com/service-hair-fall.jpg",
      },
      {
        title: "PRP Therapy",
        description: "Platelet-rich plasma therapy for stronger hair regrowth.",
        image: "https://example.com/service-prp.jpg",
      },
      {
        title: "Hair Transplant Consultation",
        description: "Personalized restoration planning and diagnosis.",
        image: "https://example.com/service-transplant.jpg",
      },
    ]);
  }

  if (counts[1] === 0) {
    await Blog.insertMany([
      {
        title: "Top Causes of Hair Thinning",
        content: "A practical guide to identifying common scalp and lifestyle triggers.",
        image: "https://example.com/blog-1.jpg",
        author: "DMC Editorial",
      },
      {
        title: "Foods That Support Hair Growth",
        content: "Nutrition strategies and ingredients that support healthy follicles.",
        image: "https://example.com/blog-2.jpg",
        author: "DMC Editorial",
      },
    ]);
  }

  if (counts[2] === 0) {
    await Contact.insertMany([
      {
        name: "Riya Sharma",
        email: "riya@example.com",
        mobile: "9876501234",
        message: "Please share treatment pricing and consultation slots.",
        status: "new",
      },
      {
        name: "Karan Malhotra",
        email: "karan@example.com",
        mobile: "9876505678",
        message: "I need more details about PRP sessions and recovery time.",
        status: "replied",
      },
    ]);
  }

  if (counts[3] === 0) {
    await Callback.insertMany([
      { name: "Anjali Verma", mobile: "9898989898", status: "new" },
      { name: "Deepak Singh", mobile: "9797979797", status: "contacted" },
      { name: "Neha Kapoor", mobile: "9696969696", status: "converted" },
    ]);
  }

  if (counts[4] === 0) {
    await Appointment.insertMany([
      {
        name: "Aman Arora",
        email: "aman@example.com",
        mobile: "9890011223",
        service: "Hair Fall Treatment",
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        message: "Need an early morning appointment if available.",
        status: "new",
      },
      {
        name: "Sonia Gupta",
        email: "sonia@example.com",
        mobile: "9890011224",
        service: "PRP Therapy",
        appointmentDate: new Date(),
        message: "Looking for consultation and treatment package details.",
        status: "confirmed",
      },
      {
        name: "Rahul Jain",
        email: "rahul@example.com",
        mobile: "9890011225",
        service: "Hair Transplant Consultation",
        appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        message: "Please review my prior reports during the meeting.",
        status: "completed",
      },
    ]);
  }

  if (counts[5] === 0) {
    const categories = await ServiceCategory.insertMany([
      { name: "Hair Treatment", slug: "hair-treatment", order: 1, status: "active" },
      { name: "Scalp Care", slug: "scalp-care", order: 2, status: "active" },
    ]);

    const secondCategories = await SecondCategory.insertMany([
      {
        categoryId: categories[0]._id,
        name: "PRP Therapy",
        slug: "prp-therapy",
        order: 1,
        status: "active",
      },
      {
        categoryId: categories[1]._id,
        name: "Dandruff Management",
        slug: "dandruff-management",
        order: 1,
        status: "active",
      },
    ]);

    await ServiceFaq.insertMany([
      {
        serviceId: secondCategories[0]._id,
        question: "How many PRP sessions are usually recommended?",
        answer: "Most patients start with 3 to 6 sessions depending on the diagnosis.",
        order: 1,
        status: "active",
      },
      {
        serviceId: secondCategories[1]._id,
        question: "Can dandruff treatment reduce scalp itching quickly?",
        answer: "A targeted treatment plan can help reduce irritation and scaling within weeks.",
        order: 1,
        status: "active",
      },
    ]);
  }

  if (counts[8] === 0) {
    await Testimonial.insertMany([
      {
        source: "google",
        name: "Pooja Mehra",
        designation: "Patient",
        message: "Very professional team and visible improvement after treatment.",
        rating: 5,
        status: "active",
      },
      {
        source: "manual",
        name: "Vikas Arora",
        designation: "Patient",
        message: "Consultation was detailed and the suggested treatment plan felt clear.",
        rating: 4,
        status: "active",
      },
    ]);
  }

  if (counts[9] === 0) {
    await Gallery.insertMany([
      {
        image: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80",
        title: "Clinic Session",
        order: 1,
        status: "active",
      },
      {
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
        title: "Hair Analysis",
        order: 2,
        status: "active",
      },
    ]);
  }

  if (counts[10] === 0) {
    const resultCategories = await ResultCategory.insertMany([
      { name: "Hair Restoration", description: "Before and after transformations", order: 1 },
      { name: "Scalp Care", description: "Visible scalp recovery results", order: 2 },
    ]);

    await ResultInner.insertMany([
      {
        categoryId: resultCategories[0]._id,
        title: "6 Month PRP Result",
        image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
        order: 1,
        status: "active",
      },
      {
        categoryId: resultCategories[1]._id,
        title: "Scalp Treatment Recovery",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
        order: 2,
        status: "active",
      },
    ]);
  }

  if (counts[12] === 0) {
    const videoCategories = await VideoCategory.insertMany([
      { name: "Patient Stories", description: "Testimonials and journeys", order: 1 },
      { name: "Doctor Advice", description: "Educational explainers", order: 2 },
    ]);

    await Video.insertMany([
      {
        categoryId: videoCategories[0]._id,
        title: "Patient Recovery Story",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        order: 1,
        status: "active",
      },
      {
        categoryId: videoCategories[1]._id,
        title: "Doctor Talks About Hair Fall",
        videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        order: 2,
        status: "active",
      },
    ]);
  }

  if (counts[14] === 0) {
    const menus = await Menu.insertMany([
      { name: "Dashboard", url: "/dashboard", order: 1, status: "active" },
      { name: "Services", url: "/services", order: 2, status: "active" },
      { name: "Contacts", url: "/contacts", order: 3, status: "active" },
    ]);

    const operations = await Operation.insertMany([
      { name: "View", url: "view", order: 1, status: "active" },
      { name: "Create", url: "create", order: 2, status: "active" },
      { name: "Update", url: "update", order: 3, status: "active" },
    ]);

    await MenuOperation.insertMany([
      { menuId: menus[0]._id, operationId: operations[0]._id },
      { menuId: menus[1]._id, operationId: operations[1]._id },
      { menuId: menus[2]._id, operationId: operations[2]._id },
    ]);
  }

  const refreshedAdminRole = await Role.findById(adminRole._id);
  refreshedAdminRole.permissions = Array.from(new Set([...(refreshedAdminRole.permissions || []), ...ALL_PERMISSIONS]));
  await refreshedAdminRole.save();

  console.log("Demo data bootstrapped successfully");
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
