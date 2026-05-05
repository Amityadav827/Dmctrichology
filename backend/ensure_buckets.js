require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function ensureBuckets() {
  const buckets = ['images', 'videos'];
  
  for (const bucketName of buckets) {
    console.log(`Checking bucket: ${bucketName}...`);
    const { data: bucket, error: getError } = await supabase.storage.getBucket(bucketName);
    
    if (getError) {
      console.log(`Bucket ${bucketName} not found, creating...`);
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB for videos
      });
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError.message);
      } else {
        console.log(`Bucket ${bucketName} created successfully.`);
      }
    } else {
      console.log(`Bucket ${bucketName} exists.`);
    }

    // Ensure it's public
    await supabase.storage.updateBucket(bucketName, { public: true });
    console.log(`Bucket ${bucketName} set to public.`);
  }
}

ensureBuckets();
