const supabase = require("../config/supabase");
const fs = require("fs");
const path = require("path");

const removeUploadedFile = (imagePath) => {
  if (!imagePath) return;
  const absolutePath = path.join(__dirname, "..", imagePath.replace(/^(https?:\/\/[^\/]+)?\//, ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const normalizeImagePath = (req, file) => {
  if (!file) return "";
  return file.path || file.secure_url;
};

const createResultInner = async (req, res, next) => {
  try {
    const { categoryId, title, order, status } = req.body;

    if (!categoryId || !title) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: "categoryId and title are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Check category exists
    const { data: category, error: catError } = await supabase
      .from('result_categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (catError || !category) {
      removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: "Result category not found" });
    }

    /*
    const item = await ResultInner.create({
      categoryId,
      title,
      image: normalizeImagePath(req, req.file),
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });
    */
    const { data: item, error } = await supabase
      .from('result_items')
      .insert([{
        category_id: categoryId,
        title,
        image: normalizeImagePath(req, req.file),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        status: status || "active",
      }])
      .select(`
        *,
        category:result_categories (
          name,
          description,
          status
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      data: {
        ...item,
        _id: item.id,
        categoryId: item.category ? { ...item.category, _id: item.category_id } : item.category_id
      },
    });
  } catch (error) {
    next(error);
  }
};

const getResultInners = async (req, res, next) => {
  try {
    let query = supabase.from('result_items').select(`
      *,
      category:result_categories (
        name,
        description,
        status
      )
    `);

    if (req.query.categoryId) {
      query = query.eq('category_id', req.query.categoryId);
    }

    const { data: items, error } = await query
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const formattedData = items.map(item => ({
      ...item,
      _id: item.id,
      categoryId: item.category ? { ...item.category, _id: item.category_id } : item.category_id
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const updateResultInner = async (req, res, next) => {
  try {
    const { categoryId, title, order, status } = req.body;
    
    const { data: item, error: fetchError } = await supabase
      .from('result_items')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !item) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const updates = {};
    if (categoryId) {
      const { data: cat } = await supabase.from('result_categories').select('id').eq('id', categoryId).single();
      if (!cat) {
        if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
        return res.status(404).json({ success: false, message: "Result category not found" });
      }
      updates.category_id = categoryId;
    }

    if (req.file) {
      removeUploadedFile(item.image);
      updates.image = normalizeImagePath(req, req.file);
    }

    if (title) updates.title = title;
    if (order !== undefined) updates.order = Number.isFinite(Number(order)) ? Number(order) : item.order;
    if (status) updates.status = status;

    const { data: updatedItem, error } = await supabase
      .from('result_items')
      .update(updates)
      .eq('id', req.params.id)
      .select(`
        *,
        category:result_categories (
          name,
          description,
          status
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...updatedItem,
        _id: updatedItem.id,
        categoryId: updatedItem.category ? { ...updatedItem.category, _id: updatedItem.category_id } : updatedItem.category_id
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteResultInner = async (req, res, next) => {
  try {
    const { data: item, error: fetchError } = await supabase
      .from('result_items')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !item) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    removeUploadedFile(item.image);
    const { error } = await supabase.from('result_items').delete().eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleResultInnerStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from('result_items')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data: updated, error } = await supabase
      .from('result_items')
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select(`
        *,
        category:result_categories (
          name,
          description,
          status
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...updated,
        _id: updated.id,
        categoryId: updated.category ? { ...updated.category, _id: updated.category_id } : updated.category_id
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateResultInnerOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Number.isFinite(Number(order))) {
      return res.status(400).json({ success: false, message: "Valid order is required" });
    }

    const { data: updated, error } = await supabase
      .from('result_items')
      .update({ order: Number(order) })
      .eq('id', req.params.id)
      .select(`
        *,
        category:result_categories (
          name,
          description,
          status
        )
      `)
      .single();

    if (error || !updated) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...updated,
        _id: updated.id,
        categoryId: updated.category ? { ...updated.category, _id: updated.category_id } : updated.category_id
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResultInner,
  getResultInners,
  updateResultInner,
  deleteResultInner,
  toggleResultInnerStatus,
  updateResultInnerOrder,
};
