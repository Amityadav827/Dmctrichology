import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/client";
import { 
  Users, UserCheck, UserPlus, 
  Calendar, CalendarCheck, CalendarDays,
  TrendingUp, Activity
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/dashboard");
        setStats(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  const cards = [
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: Users, color: "from-blue-500 to-cyan-400" },
    { label: "Today's Leads", value: stats?.todaysLeads ?? 0, icon: UserPlus, color: "from-purple-500 to-indigo-400" },
    { label: "Converted Leads", value: stats?.convertedLeads ?? 0, icon: UserCheck, color: "from-emerald-500 to-teal-400" },
    { label: "Total Appointments", value: stats?.totalAppointments ?? 0, icon: CalendarDays, color: "from-orange-500 to-amber-400" },
    { label: "Today's Bookings", value: stats?.todaysAppointments ?? 0, icon: Calendar, color: "from-pink-500 to-rose-400" },
    { label: "Completed Bookings", value: stats?.completedAppointments ?? 0, icon: CalendarCheck, color: "from-blue-600 to-indigo-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between card-glass p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your clinic today.</p>
        </div>
        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity size={24} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-glass p-6 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{card.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-glow group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
                <TrendingUp size={14} className="text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium mr-1">+0%</span> from last month
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users Section */}
      <div className="card-glass p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Users</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {stats?.recentUsers && stats.recentUsers.length > 0 ? (
            stats.recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {user.role?.name || "user"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No recent users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
