const supabase = require("../config/supabase");

const createServiceFaq = async (req, res, next) => {
  try {
    const { serviceId, question, answer, order, status } = req.body;
    if (!serviceId || !question || !answer) return res.status(400).json({ success: false, message: "Required fields missing" });

    const { data, error } = await supabase
      .from('service_faqs')
      .insert([{ service_id: serviceId, question, answer, order: order || 0, status: status || 'active' }])
      .select(`*, service:second_categories(name)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id, serviceId: data.service ? { ...data.service, _id: data.service_id } : data.service_id } });
  } catch (error) {
    next(error);
  }
};

const getServiceFaqs = async (req, res, next) => {
  try {
    let query = supabase.from('service_faqs').select(`*, service:second_categories(name)`);
    if (req.query.serviceId) query = query.eq('service_id', req.query.serviceId);

    const { data, error } = await query.order('order', { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      serviceId: item.service ? { ...item.service, _id: item.service_id } : item.service_id
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateServiceFaq = async (req, res, next) => {
  try {
    const { serviceId, question, answer, order, status } = req.body;
    const { data, error } = await supabase
      .from('service_faqs')
      .update({ service_id: serviceId, question, answer, order, status })
      .eq('id', req.params.id)
      .select(`*, service:second_categories(name)`)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "FAQ not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id, serviceId: data.service ? { ...data.service, _id: data.service_id } : data.service_id } });
  } catch (error) {
    next(error);
  }
};

const deleteServiceFaq = async (req, res, next) => {
  try {
    const { error } = await supabase.from('service_faqs').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleServiceFaqStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('service_faqs').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "FAQ not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('service_faqs').update({ status: newStatus }).eq('id', req.params.id).select(`*, service:second_categories(name)`).single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id, serviceId: data.service ? { ...data.service, _id: data.service_id } : data.service_id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createServiceFaq,
  getServiceFaqs,
  updateServiceFaq,
  deleteServiceFaq,
  toggleServiceFaqStatus,
};
