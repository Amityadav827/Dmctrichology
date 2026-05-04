require('dotenv').config();
const supabase = require('./config/supabase');

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) {
      console.error('SUPABASE TEST ERROR:', error);
    } else {
      console.log('SUPABASE TEST SUCCESS:', data);
    }
  } catch (err) {
    console.error('SUPABASE TEST EXCEPTION:', err.message);
  }
};

testConnection();
