import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

export const fetchSiteSettings = async () => {
  try {
    const res = await api.get('/api/site-settings');
    return res.data;
  } catch (error) {
    console.error('Error fetching site settings', error);
    return null;
  }
};

export const fetchTopBar = async () => {
  try {
    const res = await api.get(`/api/topbar?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching topbar', error);
    return null;
  }
};

export const fetchMenu = async () => {
  try {
    const res = await api.get('/api/menu');
    return res.data;
  } catch (error) {
    console.error('Error fetching menu', error);
    return null;
  }
};

export const fetchHeroSlides = async () => {
  try {
    const res = await api.get('/api/hero');
    return res.data;
  } catch (error) {
    console.error('Error fetching hero slides', error);
    return null;
  }
};

export const submitLead = async (data) => {
  try {
    const res = await api.post('/api/lead', data);
    return res.data;
  } catch (error) {
    console.error('Error submitting lead', error);
    throw error;
  }
};

export default api;
