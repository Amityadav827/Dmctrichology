const supabase = require("../config/supabase");

const getSitemapEntries = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('sitemaps').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      lastModified: item.last_modified,
      changeFreq: item.change_freq
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const addSitemapEntry = async (req, res, next) => {
  try {
    const { url, priority, changeFreq } = req.body;
    const { data, error } = await supabase
      .from('sitemaps')
      .insert([{
        url,
        priority: priority || 0.5,
        change_freq: changeFreq || 'weekly',
        last_modified: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        lastModified: data.last_modified,
        changeFreq: data.change_freq
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateSitemapEntry = async (req, res, next) => {
  try {
    const updates = {
      url: req.body.url,
      priority: req.body.priority,
      change_freq: req.body.changeFreq,
      last_modified: new Date().toISOString()
    };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('sitemaps').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Sitemap entry not found" });

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        lastModified: data.last_modified,
        changeFreq: data.change_freq
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteSitemapEntry = async (req, res, next) => {
  try {
    const { error } = await supabase.from('sitemaps').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Sitemap entry removed successfully" });
  } catch (error) {
    next(error);
  }
};

const generateSitemapXml = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('sitemaps').select('*');
    if (error) return res.status(500).json({ success: false, message: error.message });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    data.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${item.url}</loc>\n`;
      xml += `    <lastmod>${new Date(item.last_modified).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${item.change_freq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';

    res.header("Content-Type", "application/xml");
    return res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSitemapEntry,
  getSitemapEntries,
  updateSitemapEntry,
  deleteSitemapEntry,
  generateSitemapXml,
};
