import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/client";
import {
  Users, UserCheck, UserPlus,
  Calendar, CalendarCheck, CalendarDays,
  TrendingUp, Activity,
} from "lucide-react";

const cardColors = [
  { bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE" },
  { bg: "#F5F3FF", icon: "#7C3AED", border: "#DDD6FE" },
  { bg: "#ECFDF5", icon: "#059669", border: "#A7F3D0" },
  { bg: "#FFF7ED", icon: "#D97706", border: "#FDE68A" },
  { bg: "#FDF2F8", icon: "#DB2777", border: "#FBCFE8" },
  { bg: "#EFF6FF", icon: "#1D4ED8", border: "#93C5FD" },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/dashboard");
        console.group("📊 Dashboard Data Audit");
        console.log("Full API Response:", data);
        console.log("Total Leads (Real):", data.data.totalLeads);
        console.log("Today's Leads (Real):", data.data.todaysLeads);
        console.log("Converted Leads (Real):", data.data.convertedLeads);
        console.log("Total Appointments (Real):", data.data.totalAppointments);
        console.log("Today's Bookings (Real):", data.data.todaysAppointments);
        console.log("Completed Bookings (Real):", data.data.completedAppointments);
        console.groupEnd();
        setStats(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: Users },
    { label: "Today's Leads", value: stats?.todaysLeads ?? 0, icon: UserPlus },
    { label: "Converted Leads", value: stats?.convertedLeads ?? 0, icon: UserCheck },
    { label: "Total Appointments", value: stats?.totalAppointments ?? 0, icon: CalendarDays },
    { label: "Today's Bookings", value: stats?.todaysAppointments ?? 0, icon: Calendar },
    { label: "Completed Bookings", value: stats?.completedAppointments ?? 0, icon: CalendarCheck },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          borderRadius: "12px",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            Welcome back! 👋
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
            Here's what's happening with your clinic today.
          </p>
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Activity size={24} color="#FFFFFF" />
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const palette = cardColors[idx % cardColors.length];
          return (
            <div
              key={card.label}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${palette.border}`,
                borderRadius: "12px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", margin: 0 }}>
                  {card.label}
                </p>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: palette.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={palette.icon} />
                </div>
              </div>
              <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1 }}>
                {card.value}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#64748B" }}>
                <TrendingUp size={13} color="#16A34A" />
                <span style={{ color: "#16A34A", fontWeight: 600 }}>+0%</span>
                <span>from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Recent Users</h3>
        </div>
        <div>
          {stats?.recentUsers && stats.recentUsers.length > 0 ? (
            stats.recentUsers.map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid #F1F5F9",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#EFF6FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      flexShrink: 0,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#0F172A", margin: 0, fontSize: "0.875rem" }}>{user.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: 0 }}>{user.email}</p>
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "#F1F5F9",
                    color: "#475569",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {user.role?.name || "user"}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>
              No recent users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
