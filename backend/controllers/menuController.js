const supabase = require("../config/supabase");

const createMenu = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    if (!name || !url) return res.status(400).json({ success: false, message: "Name and URL are required" });

    const { data, error } = await supabase
      .from('menus')
      .insert([{ name, url, order: order || 0, status: status || 'active' }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getMenus = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('order', { ascending: true });

    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const getMenuById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('menus').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Menu not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    const { data, error } = await supabase.from('menus').update({ name, url, order, status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Menu not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const { error } = await supabase.from('menus').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleMenuStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('menus').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Menu not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('menus').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateMenuOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('menus').update({ order }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Menu not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  updateMenuOrder,
};
