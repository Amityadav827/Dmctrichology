const supabase = require("../config/supabase");

const getRobotsContent = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('robots').select('*').single();
    
    if (error || !data) {
      return res.status(200).json({ success: true, data: { content: "User-agent: *\nAllow: /" } });
    }

    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateRobotsContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    const { data: existing } = await supabase.from('robots').select('id').single();

    let result;
    if (existing) {
      result = await supabase.from('robots').update({ content }).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('robots').insert([{ content }]).select().single();
    }

    if (result.error) return res.status(500).json({ success: false, message: result.error.message });

    return res.status(200).json({ success: true, data: { ...result.data, _id: result.data.id } });
  } catch (error) {
    next(error);
  }
};

const serveRobotsTxt = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('robots').select('content').single();
    const content = (error || !data) ? "User-agent: *\nAllow: /" : data.content;
    res.header("Content-Type", "text/plain");
    return res.status(200).send(content);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRobotsContent,
  updateRobotsContent,
  serveRobotsTxt,
};
