const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        role:roles (
          name,
          permissions
        )
      `)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedUsers = users.map(user => ({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      createdAt: user.created_at,
    }));

    return res.status(200).json({ success: true, count: formattedUsers.length, data: formattedUsers });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role_id, status } = req.body;
    
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        phone: phone || "",
        role_id,
        status: status || 'active'
      }])
      .select(`*, role:roles(name, permissions)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`*, role:roles(name, permissions)`)
      .eq('id', req.params.id)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role_id, status, password } = req.body;
    const updates = { name, email, phone, role_id, status };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Remove undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select(`*, role:roles(name, permissions)`)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('users').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "User not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data: user, error } = await supabase.from('users').update({ status: newStatus }).eq('id', req.params.id).select(`*, role:roles(name, permissions)`).single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
