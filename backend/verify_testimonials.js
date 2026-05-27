require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function verifyTestimonials() {
  console.log("=== VERIFYING TESTIMONIALS SCHEMA AND CMS FLOW ===");

  // 1. Verify schema
  console.log("\n1. Fetching a testimonial to check columns...");
  const { data: testimonials, error: fetchErr } = await supabase
    .from("testimonials")
    .select("*")
    .limit(5);

  if (fetchErr) {
    console.error("❌ Failed to fetch testimonials:", fetchErr.message);
    process.exit(1);
  }

  if (testimonials.length === 0) {
    console.log("⚠️ No testimonials found in the table. We will insert a test one first to check schema.");
  } else {
    console.log(`✅ Fetched ${testimonials.length} testimonials.`);
    const firstItem = testimonials[0];
    const columns = Object.keys(firstItem);
    console.log("Columns found in database:", columns);

    const requiredColumns = ["show_type", "service_name", "short_name", "source"];
    let allColumnsPresent = true;
    for (const col of requiredColumns) {
      if (columns.includes(col)) {
        console.log(`  ✅ Column '${col}' exists.`);
      } else {
        console.error(`  ❌ Column '${col}' is MISSING!`);
        allColumnsPresent = false;
      }
    }

    if (!allColumnsPresent) {
      console.error("❌ Schema verification failed: missing new columns.");
      process.exit(1);
    }
  }

  // 2. Verify Testimonial CMS Save/Update Flow
  console.log("\n2. Verifying CMS save/update flow with backend logic...");
  
  // Let's create a test testimonial
  const testPayload = {
    name: "Verification Test User",
    message: "This is a test testimonial message for validation.",
    rating: 5,
    status: "inactive", // inactive so it doesn't show on live frontend
    show_type: "service",
    service_name: "Verification Service Name",
    short_name: "verification-short",
    source: "Google Reviews"
  };

  console.log("Inserting test testimonial:", testPayload);
  const { data: inserted, error: insertErr } = await supabase
    .from("testimonials")
    .insert([testPayload])
    .select();

  if (insertErr) {
    console.error("❌ Insert failed:", insertErr.message);
    process.exit(1);
  }

  console.log("✅ Insert successful:", inserted);
  const insertedItem = inserted[0];
  const testId = insertedItem.id; // Get the generated UUID


  // Verify all fields are preserved
  let fieldsOk = true;
  for (const [key, val] of Object.entries(testPayload)) {
    if (insertedItem[key] !== val) {
      console.error(`❌ Field loss/mismatch for key '${key}': expected '${val}', got '${insertedItem[key]}'`);
      fieldsOk = false;
    }
  }

  if (fieldsOk) {
    console.log("✅ CMS insert flow verified: NO field loss occurred.");
  } else {
    console.error("❌ Field loss occurred during insert.");
    process.exit(1);
  }

  // Update flow
  console.log("\nUpdating the test testimonial to verify update flow...");
  const updatePayload = {
    message: "Updated test message.",
    rating: 4,
    show_type: "all",
    service_name: "Updated Service Name",
    short_name: "updated-short",
    source: "Direct Submission"
  };

  const { data: updated, error: updateErr } = await supabase
    .from("testimonials")
    .update(updatePayload)
    .eq("id", testId)
    .select();

  if (updateErr) {
    console.error("❌ Update failed:", updateErr.message);
    process.exit(1);
  }

  console.log("✅ Update successful:", updated);
  const updatedItem = updated[0];

  let updateFieldsOk = true;
  for (const [key, val] of Object.entries(updatePayload)) {
    if (updatedItem[key] !== val) {
      console.error(`❌ Field loss/mismatch for key '${key}' during update: expected '${val}', got '${updatedItem[key]}'`);
      updateFieldsOk = false;
    }
  }

  // Ensure other fields (like name, status) were NOT lost/modified
  if (updatedItem.name !== testPayload.name || updatedItem.status !== testPayload.status) {
    console.error("❌ Unexpected field change on update.");
    updateFieldsOk = false;
  }

  if (updateFieldsOk) {
    console.log("✅ CMS update flow verified: NO field loss occurred.");
  } else {
    console.error("❌ Field loss occurred during update.");
    process.exit(1);
  }

  // 3. Verify backward compatibility
  console.log("\n3. Verifying backward compatibility...");
  console.log("Inserting a minimal testimonial (no new fields) to ensure backward compatibility...");
  
  const minimalPayload = {
    name: "Minimal Test User",
    message: "Minimal test testimonial message.",
    rating: 4,
    status: "inactive"
  };

  const { data: insertedBackward, error: backInsertErr } = await supabase
    .from("testimonials")
    .insert([minimalPayload])
    .select();

  if (backInsertErr) {
    console.error("❌ Minimal insert failed:", backInsertErr.message);
    process.exit(1);
  }

  console.log("✅ Minimal insert successful:", insertedBackward);
  const backwardItem = insertedBackward[0];
  const backwardId = backwardItem.id;
  console.log("Inserted values for new columns (should be default values):");

  console.log(`  show_type: ${backwardItem.show_type} (expected 'all' or default)`);
  console.log(`  service_name: ${backwardItem.service_name} (expected empty string or default)`);
  console.log(`  short_name: ${backwardItem.short_name} (expected empty string or default)`);
  console.log(`  source: ${backwardItem.source} (expected empty string or default)`);

  // Clean up
  console.log("\nCleaning up test testimonials from database...");
  const { error: deleteErr } = await supabase
    .from("testimonials")
    .delete()
    .in("id", [testId, backwardId]);

  if (deleteErr) {
    console.error("⚠️ Cleanup failed:", deleteErr.message);
  } else {
    console.log("✅ Cleanup successful.");
  }

  console.log("\n🎉 TESTIMONIALS SCHEMA & CMS FLOW VERIFICATION PASSED SUCCESSFULLY!");
}

verifyTestimonials().catch(err => {
  console.error("❌ Fatal error in verification script:", err);
  process.exit(1);
});
