const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/.env' });

const HomeFAQSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: "TRUSTED CARE SERVICES" },
  heading: { type: String, default: "Frequently Asked Question?" },
  categories: [
    {
      title: String,
      faqs: [
        {
          question: String,
          answer: String,
          icon: String
        }
      ]
    }
  ],
  buttonText: { type: String, default: "View All Questions" },
  buttonLink: { type: String, default: "#" }
}, { timestamps: true });

const HomeFAQ = mongoose.model('HomeFAQ', HomeFAQSchema);

async function checkData() {
  await mongoose.connect(process.env.MONGO_URI);
  const data = await HomeFAQ.findOne();
  console.log('FAQ DATA:', JSON.stringify(data, null, 2));
  await mongoose.disconnect();
}

checkData();
