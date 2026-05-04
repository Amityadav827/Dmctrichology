const supabase = require("../config/supabase");

const createTestimonial = async (req, res, next) => {
  try {
    const { source, name, message, rating } = req.body;

    if (!source || !name || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: "source, name, message and rating are required"
      });
    }

    const supabaseData = {
      show_type: req.body.showType,
      service_name: req.body.serviceName,
      source: req.body.source,
      name: req.body.name,
      short_name: req.body.shortName,
      designation: req.body.designation,
      message: req.body.message,
      rating: req.body.rating,
      status: req.body.status,
    };

    const { data, error } = await supabase
      .from('testimonials')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const formattedData = {
      _id: data.id,
      id: data.id,
      showType: data.show_type,
      serviceName: data.service_name,
      source: data.source,
      name: data.name,
      shortName: data.short_name,
      designation: data.designation,
      message: data.message,
      rating: data.rating,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return res.status(201).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const source = String(req.query.source || "").trim().toLowerCase();
    const status = String(req.query.status || "").trim();
    const rating = parseInt(req.query.rating, 10);

    let query = supabase.from('testimonials').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,message.ilike.%${search}%,service_name.ilike.%${search}%`);
    }
    if (source) query = query.eq('source', source);
    if (status) query = query.eq('status', status);
    if (!isNaN(rating)) query = query.eq('rating', rating);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const formattedData = data.map(item => ({
      _id: item.id,
      id: item.id,
      showType: item.show_type,
      serviceName: item.service_name,
      source: item.source,
      name: item.name,
      shortName: item.short_name,
      designation: item.designation,
      message: item.message,
      rating: item.rating,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(Math.ceil(count / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTestimonialById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Testimonial not found"
      });
    }

    const formattedData = {
      _id: data.id,
      id: data.id,
      showType: data.show_type,
      serviceName: data.service_name,
      source: data.source,
      name: data.name,
      shortName: data.short_name,
      designation: data.designation,
      message: data.message,
      rating: data.rating,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.showType !== undefined) updates.show_type = req.body.showType;
    if (req.body.serviceName !== undefined) updates.service_name = req.body.serviceName;
    if (req.body.source !== undefined) updates.source = req.body.source;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.shortName !== undefined) updates.short_name = req.body.shortName;
    if (req.body.designation !== undefined) updates.designation = req.body.designation;
    if (req.body.message !== undefined) updates.message = req.body.message;
    if (req.body.rating !== undefined) updates.rating = req.body.rating;
    if (req.body.status !== undefined) updates.status = req.body.status;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Testimonial not found"
      });
    }

    const formattedData = {
      _id: data.id,
      id: data.id,
      showType: data.show_type,
      serviceName: data.service_name,
      source: data.source,
      name: data.name,
      shortName: data.short_name,
      designation: data.designation,
      message: data.message,
      rating: data.rating,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('testimonials')
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
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleTestimonialStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from('testimonials')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    const newStatus = current.status === "active" ? "inactive" : "active";
    
    const { data, error } = await supabase
      .from('testimonials')
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
};
