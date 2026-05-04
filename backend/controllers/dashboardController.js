const supabase = require("../config/supabase");

const getDashboardStats = async (req, res, next) => {
  try {
    const tables = [
      'services',
      'blogs',
      'testimonials',
      'gallery',
      'appointments',
      'callbacks',
      'contacts',
      'users'
    ];

    const counts = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        return { table, count: count || 0 };
      })
    );

    const stats = {};
    counts.forEach(item => {
      stats[item.table] = item.count;
    });

    // Special stats for recent items
    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentCallbacks } = await supabase
      .from('callbacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        counts: stats,
        recent: {
          appointments: recentAppointments || [],
          callbacks: recentCallbacks || [],
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
