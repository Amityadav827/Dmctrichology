const supabase = require("../config/supabase");
const fs = require("fs");
const path = require("path");

const removeUploadedFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    const filename = imagePath.split("/").pop();
    if (!filename) return;

    const absolutePath = path.join(__dirname, "..", "uploads", "gallery", filename);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("Error removing file:", err);
  }
};

const normalizeImagePath = (req, file) => {
  if (!file) return "";
  
  const filePath = file.secure_url || file.path || "";
  
  if (typeof filePath === "string" && filePath.startsWith("http")) {
    return filePath;
  }
  
  if (file.filename) {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBaseUrl}/uploads/gallery/${file.filename}`;
  }
  
  return filePath;
};

const transformItem = (req, item) => {
  // item is already a plain object from Supabase
  const doc = { ...item };
  let finalUrl = doc.image_url || doc.image || "";
  
  if (finalUrl && typeof finalUrl === "string" && !finalUrl.startsWith("http")) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    
    finalUrl = finalUrl.startsWith("/") 
      ? `${normalizedBaseUrl}${finalUrl}` 
      : `${normalizedBaseUrl}/${finalUrl}`;
  }
  
  return {
    _id: doc.id,
    id: doc.id,
    imageUrl: finalUrl,
    image: finalUrl,
    title: doc.title,
    altText: doc.alt_text,
    description: doc.description,
    order: doc.order,
    status: doc.status,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
};

const createGalleryItem = async (req, res, next) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required"
      });
    }

    const title = req.body.title || "";
    const altText = req.body.altText || "";
    const description = req.body.description || "";
    
    const itemsToInsert = files.map((file, index) => {
      const fullUrl = normalizeImagePath(req, file);
      return {
        image_url: fullUrl,
        image: fullUrl,
        title,
        alt_text: altText,
        description,
        order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) + index : index,
        status: req.body.status || "active",
      };
    });

    // const galleryItems = await Gallery.insertMany(items);
    const { data, error } = await supabase
      .from('gallery')
      .insert(itemsToInsert)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const transformedItems = data.map(item => transformItem(req, item));

    return res.status(201).json({
      success: true,
      data: transformedItems,
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryItems = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    /*
    const filter = search
      ? {
          title: { $regex: search, $options: "i" },
        }
      : {};
    */

    let query = supabase.from('gallery').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, count, error } = await query
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const transformedItems = data.map(item => transformItem(req, item));

    return res.status(200).json({
      success: true,
      count: transformedItems.length,
      data: transformedItems,
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

const getGalleryItemById = async (req, res, next) => {
  try {
        const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Gallery item not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: transformItem(req, data),
    });
  } catch (error) {
    next(error);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
        const { data: galleryItem, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !galleryItem) {
      if (req.files?.length) {
        req.files.forEach((file) => removeUploadedFile(normalizeImagePath(req, file)));
      }
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    const updates = {};
    if (req.files?.length) {
      removeUploadedFile(galleryItem.image_url || galleryItem.image);
      const newFullUrl = normalizeImagePath(req, req.files[0]);
      updates.image_url = newFullUrl;
      updates.image = newFullUrl;
    }

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.altText !== undefined) updates.alt_text = req.body.altText;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.order !== undefined && Number.isFinite(Number(req.body.order))) {
      updates.order = Number(req.body.order);
    }
    if (req.body.status !== undefined) updates.status = req.body.status;

    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
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
      data: transformItem(req, data),
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
        const { data: galleryItem, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    removeUploadedFile(galleryItem.image_url || galleryItem.image);
    // await galleryItem.deleteOne();
    const { error } = await supabase
      .from('gallery')
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
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleGalleryItemStatus = async (req, res, next) => {
  try {
        const { data: current, error: fetchError } = await supabase
      .from('gallery')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    const newStatus = current.status === "active" ? "inactive" : "active";
    
    const { data, error } = await supabase
      .from('gallery')
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
      data: transformItem(req, data),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
};
