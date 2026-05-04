require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function inspect() {
  console.log("Inspecting columns for 'services'...");
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'services' });
  if (error) {
    console.log("RPC failed, trying raw query via PostgREST...");
    const { data: sample, error: sampleError } = await supabase.from('services').select('*').limit(1);
    if (sampleError) {
      console.error("Error fetching sample:", sampleError.message);
    } else {
      console.log("Sample keys:", Object.keys(sample[0] || {}));
    }
  } else {
    console.log("Columns:", data);
  }
}

inspect();
