const supabase = require("../config/supabase");
// const Role = require("../models/Role");
const { ALL_PERMISSIONS } = require("./permissions");

const ensureAdminRole = async () => {
  // let adminRole = await Role.findOne({ name: "admin" });
  let { data: adminRole, error: fetchError } = await supabase
    .from('roles')
    .select('*')
    .eq('name', 'admin')
    .single();

  if (fetchError || !adminRole) {
    const { data: newRole, error: createError } = await supabase
      .from('roles')
      .insert([{ name: 'admin', permissions: ALL_PERMISSIONS }])
      .select()
      .single();
    
    if (createError) throw createError;
    adminRole = newRole;
  } else {
    const currentPermissions = adminRole.permissions || [];
    const mergedPermissions = Array.from(new Set([...currentPermissions, ...ALL_PERMISSIONS]));

    if (mergedPermissions.length !== currentPermissions.length) {
      const { data: updatedRole, error: updateError } = await supabase
        .from('roles')
        .update({ permissions: mergedPermissions })
        .eq('id', adminRole.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      adminRole = updatedRole;
    }
  }

  return adminRole;
};

const ensureDefaultUserRole = async () => {
  // let userRole = await Role.findOne({ name: "user" });
  let { data: userRole, error: fetchError } = await supabase
    .from('roles')
    .select('*')
    .eq('name', 'user')
    .single();

  if (fetchError || !userRole) {
    const { data: newRole, error: createError } = await supabase
      .from('roles')
      .insert([{ name: 'user', permissions: ['dashboard'] }])
      .select()
      .single();
    
    if (createError) throw createError;
    userRole = newRole;
  }

  return userRole;
};

module.exports = {
  ensureAdminRole,
  ensureDefaultUserRole,
};
