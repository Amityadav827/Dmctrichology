import { NavLink } from "react-router-dom";
import { hasPermission } from "../utils/auth";
import { 
  LayoutDashboard, Search, Star, PhoneCall, Mail, CalendarCheck, 
  FileText, Scissors, Layers, HelpCircle, Activity, List, 
  Video, PlayCircle, Image as ImageIcon, Users, Shield, 
  Key, Menu as MenuIcon, Settings, Wrench 
} from "lucide-react";

// Premium Active/Inactive State Logic
const getNavClass = ({ isActive }) =>
  isActive
    ? "flex items-center gap-3 rounded-xl bg-gradient-to-r from-gradientStart/20 to-gradientEnd/20 border border-gradientStart/30 px-3 py-2.5 text-sm font-semibold text-primary shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
    : "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-600 hover hover hover transition-all duration-300";

function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-xl shadow-panel transition-colors duration-300">
      
      {/* Brand Logo Header */}
      <div className="m-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-gradientStart to-gradientEnd shadow-glow">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">DMC Admin</h1>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">Trichology</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-1">
        
        {hasPermission("dashboard") && (
          <NavLink to="/dashboard" className={getNavClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        )}
        
        {hasPermission("seo") && (
          <NavLink to="/seo" className={getNavClass}>
            <Search size={18} /> SEO
          </NavLink>
        )}
        
        {hasPermission("testimonial") && (
          <NavLink to="/testimonials" className={getNavClass}>
            <Star size={18} /> Testimonials
          </NavLink>
        )}

        {hasPermission("users") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Leads & Contact</p>
            <div className="space-y-1">
              <NavLink to="/leads/callback" className={getNavClass}><PhoneCall size={18} /> Request Callback</NavLink>
              <NavLink to="/leads/contact" className={getNavClass}><Mail size={18} /> Contact Leads</NavLink>
              <NavLink to="/leads/appointment" className={getNavClass}><CalendarCheck size={18} /> Appointments</NavLink>
            </div>
          </div>
        )}

        {hasPermission("blog") && (
          <div className="pt-2">
            <NavLink to="/blogs" className={getNavClass}><FileText size={18} /> Blogs</NavLink>
          </div>
        )}

        {hasPermission("services") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Services</p>
            <div className="space-y-1">
              <NavLink to="/services/categories" className={getNavClass}><Scissors size={18} /> View Category</NavLink>
              <NavLink to="/services/second-categories" className={getNavClass}><Layers size={18} /> Second Category</NavLink>
              <NavLink to="/services/faqs" className={getNavClass}><HelpCircle size={18} /> Service FAQ</NavLink>
            </div>
          </div>
        )}

        {hasPermission("result") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Results</p>
            <div className="space-y-1">
              <NavLink to="/results/categories" className={getNavClass}><Activity size={18} /> Result Category</NavLink>
              <NavLink to="/results/list" className={getNavClass}><List size={18} /> Result List</NavLink>
            </div>
          </div>
        )}

        {hasPermission("video") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Videos</p>
            <div className="space-y-1">
              <NavLink to="/videos/categories" className={getNavClass}><Video size={18} /> Video Category</NavLink>
              <NavLink to="/videos/list" className={getNavClass}><PlayCircle size={18} /> Video List</NavLink>
            </div>
          </div>
        )}

        {hasPermission("gallery") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Media</p>
            <div className="space-y-1">
              <NavLink to="/gallery" className={getNavClass}><ImageIcon size={18} /> Gallery</NavLink>
            </div>
          </div>
        )}

        {hasPermission("users") && (
          <div className="pt-4 pb-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">System & Users</p>
            <div className="space-y-1">
              <NavLink to="/users/list" className={getNavClass}><Users size={18} /> User List</NavLink>
              <NavLink to="/users/roles" className={getNavClass}><Shield size={18} /> Role List</NavLink>
              <NavLink to="/users/permissions" className={getNavClass}><Key size={18} /> Permissions</NavLink>
              <NavLink to="/users/menus" className={getNavClass}><MenuIcon size={18} /> Menu List</NavLink>
              <NavLink to="/users/operations" className={getNavClass}><Wrench size={18} /> Operations</NavLink>
              <NavLink to="/users/menu-operations" className={getNavClass}><Settings size={18} /> Menu Operations</NavLink>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;

