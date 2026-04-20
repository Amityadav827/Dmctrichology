import { useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getAuthUser } from "../utils/auth";
import { LogOut, Sun, Moon, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const titles = {
  "/dashboard": "Dashboard",
  "/seo": "SEO",
  "/services": "Services",
  "/results": "Results",
  "/videos": "Videos",
  "/users": "User List",
  "/menu": "Menu List",
  "/contacts": "Contact Us List",
  "/appointment": "Appointment List",
  "/blogs": "Blogs",
  "/services/categories": "List Services Category",
  "/services/second-categories": "Second Category",
  "/services/faqs": "Service FAQ",
  "/results/categories": "Result Category List",
  "/results/list": "Result List",
  "/videos/categories": "Video Category List",
  "/videos/list": "Video List",
  "/gallery": "Gallery List",
  "/testimonials": "Testimonials List",
  "/users/list": "User List",
  "/users/roles": "Role List",
  "/users/permissions": "Permission Menu",
  "/users/menus": "Menu List",
  "/users/operations": "Operation List",
  "/users/menu-operations": "Manage Menu Operation",
  "/leads/callback": "Request A Callback",
  "/leads/contact": "Contact Us List",
  "/leads/appointment": "Appointment List",
};

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-darkCard/80 p-5 shadow-panel backdrop-blur-xl transition-colors duration-300 md:flex-row md:items-center md:justify-between z-10 sticky top-0">
      
      {/* Title Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
          Admin Panel
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {titles[location.pathname] || "Services"}
        </h2>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-all shadow-sm hover:scale-105"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* User Info Card */}
        <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-darkBg/50 py-2 px-3 shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-gradientStart to-gradientEnd flex items-center justify-center text-white shadow-glow">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {user?.email || "admin@dmc.com"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkCard px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:scale-[1.02] hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:scale-95"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;