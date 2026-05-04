const supabase = require("../config/supabase");

const createOperation = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    if (!name || !url) return res.status(400).json({ success: false, message: "Name and URL are required" });

    const { data, error } = await supabase
      .from('operations')
      .insert([{ name, url, order: order || 0, status: status || 'active' }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getOperations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('order', { ascending: true });

    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const getOperationById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('operations').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Operation not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateOperation = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    const { data, error } = await supabase.from('operations').update({ name, url, order, status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Operation not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deleteOperation = async (req, res, next) => {
  try {
    const { error } = await supabase.from('operations').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Operation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleOperationStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('operations').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Operation not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('operations').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOperation,
  getOperations,
  getOperationById,
  updateOperation,
  deleteOperation,
  toggleOperationStatus,
};
