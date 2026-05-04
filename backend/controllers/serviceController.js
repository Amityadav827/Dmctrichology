const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const createService = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.serviceImage && req.files.serviceImage[0]) {
        body.service_image = await uploadToSupabase(req.files.serviceImage[0], 'services');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.banner_image = await uploadToSupabase(req.files.bannerImage[0], 'services');
      }
    }

    // Ensure camelCase to snake_case mapping for DB if needed, 
    // but the body might already have some snake_case from frontend or need mapping.
    const supabaseData = {
      category_id: body.categoryId,
      title: body.title,
      slug: body.slug,
      short_description: body.shortDescription,
      full_description: body.fullDescription,
      service_image: body.service_image || body.serviceImage,
      banner_image: body.banner_image || body.bannerImage,
      order: body.order,
      status: body.status,
      meta_title: body.metaTitle,
      meta_description: body.metaDescription,
      meta_keywords: body.metaKeywords,
    };

    const { data, error } = await supabase
      .from('services')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.serviceImage && req.files.serviceImage[0]) {
        body.service_image = await uploadToSupabase(req.files.serviceImage[0], 'services');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.banner_image = await uploadToSupabase(req.files.bannerImage[0], 'services');
      }
    }

    const updates = {
      category_id: body.categoryId,
      title: body.title,
      slug: body.slug,
      short_description: body.shortDescription,
      full_description: body.fullDescription,
      service_image: body.service_image,
      banner_image: body.banner_image,
      order: body.order,
      status: body.status,
      meta_title: body.metaTitle,
      meta_description: body.metaDescription,
      meta_keywords: body.metaKeywords,
    };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
