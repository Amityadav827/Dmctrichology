const axios = require('axios');

async function mockSubmit() {
  const blogId = "25987437-5258-4c80-8dfd-d2c67a55f5a9";
  const url = `http://localhost:10000/api/blogs/${blogId}`;
  
  // Create multi-part form data
  const FormData = require('form-data');
  const form = new FormData();
  
  const faqs = [
    { question: "Mock Q1", answer: "Mock A1" },
    { question: "Mock Q2", answer: "Mock A2" }
  ];
  
  form.append('title', 'PRP Hair Treatment – How Many Sessions Needed?');
  form.append('author', 'Admin');
  form.append('fullDescription', '<p>Test</p>');
  form.append('faqs', JSON.stringify(faqs));

  try {
    console.log("Sending MOCK PUT request to backend...");
    const response = await axios.put(url, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    console.log("Response Status:", response.status);
    console.log("Response Data FAQs:", JSON.stringify(response.data.data.faqs, null, 2));
  } catch (error) {
    if (error.response) {
      console.error("Mock Request Failed with Status:", error.response.status);
      console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Mock Request Failed:", error.message);
    }
  }
}

mockSubmit();
