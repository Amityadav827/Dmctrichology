const ServiceCard = require("../models/ServiceCard");
const supabase = require("../config/supabase");

exports.getServices = async (req, res) => {
  try {
    const services = await ServiceCard.find().sort({ sortOrder: 1 });
    
    // Dynamically retrieve real-time rating, reviewCount, and duration from corresponding ServiceDetail in Supabase
    const populatedServices = await Promise.all(
      services.map(async (service) => {
        let detail = null;
        try {
          const { data: rows, error } = await supabase
            .from('service_details')
            .select('data')
            .eq('slug', service.slug)
            .limit(1);
          
          if (!error && rows && rows.length > 0) {
            detail = rows[0].data;
          }
        } catch (dbErr) {
          console.error(`Error fetching service detail from Supabase for slug ${service.slug}:`, dbErr);
        }
        
        // Merge values cleanly with safe backward compatibility fallbacks
        const ratingVal = detail?.banner?.rating ?? 4.8;
        const reviewCountVal = detail?.banner?.reviewCount ?? 1250;
        const durationVal = detail?.banner?.duration || detail?.intro?.duration || service.duration || '45 mins';
        
        return {
          ...service.toObject(),
          rating: ratingVal,
          reviewCount: reviewCountVal,
          duration: durationVal
        };
      })
    );

    res.status(200).json({ success: true, data: populatedServices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await ServiceCard.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await ServiceCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await ServiceCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
    try {
        const { services } = req.body;
        for (const s of services) {
            await ServiceCard.findByIdAndUpdate(s._id, { sortOrder: s.sortOrder });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
