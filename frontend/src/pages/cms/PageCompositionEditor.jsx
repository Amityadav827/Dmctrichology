import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit3, 
  Plus, 
  Loader2, 
  Save, 
  ChevronRight,
  Monitor,
  Settings as SettingsIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageCompositionEditor({ slug = "home" }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const { data } = await axios.get(`/page-compositions/${slug}`);
      if (data.success) {
        setPage(data.data);
      }
    } catch (error) {
      toast.error("Failed to load page composition");
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionVisibility = (index) => {
    const updatedSections = [...page.sections];
    updatedSections[index].isActive = !updatedSections[index].isActive;
    setPage({ ...page, sections: updatedSections });
  };

  const moveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= page.sections.length) return;
    
    const updatedSections = [...page.sections];
    const [movedSection] = updatedSections.splice(index, 1);
    updatedSections.splice(newIndex, 0, movedSection);
    
    // Update order property
    updatedSections.forEach((s, i) => s.order = i);
    
    setPage({ ...page, sections: updatedSections });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`/page-compositions/${slug}`, page);
      if (data.success) {
        toast.success("Page composition saved");
        setPage(data.data);
      }
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const getSectionIcon = (sectionId) => {
    switch(sectionId) {
      case 'topbar': return <LayoutDashboard size={18} className="text-blue-500" />;
      case 'header': return <Monitor size={18} className="text-indigo-500" />;
      case 'hero': return <LayoutDashboard size={18} className="text-purple-500" />;
      default: return <SettingsIcon size={18} className="text-gray-500" />;
    }
  };

  const handleEditSection = (sectionId) => {
    // Mapping sectionId to CMS routes
    const routeMap = {
      'topbar': '/cms/topbar',
      'header': '/cms/header',
      'hero': '/cms/hero'
    };
    if (routeMap[sectionId]) {
      navigate(routeMap[sectionId]);
    } else {
      toast.error("CMS Editor for this section is coming soon");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading Page Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Page Builder</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{page.title}</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Compose and manage sections for your {page.title}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.open(`https://dmctrichology-mkm4.vercel.app/${slug === 'home' ? '' : slug}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            <Eye size={16} /> View Live
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all text-sm shadow-lg shadow-blue-200"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Composition"}
          </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sections List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Sections</h3>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{page.sections.length} Sections</span>
          </div>

          <div className="space-y-3">
            {page.sections.sort((a,b) => a.order - b.order).map((section, index) => (
              <div 
                key={section._id || index}
                className={`group relative flex items-center gap-4 bg-white p-4 rounded-2xl border-2 transition-all hover:shadow-md ${section.isActive ? 'border-transparent shadow-sm' : 'border-slate-100 opacity-60 grayscale'}`}
              >
                {/* Drag Handle (Visual for now) */}
                <div className="text-slate-300 cursor-grab group-hover:text-slate-400 transition-colors">
                  <GripVertical size={20} />
                </div>

                {/* Section Icon & Info */}
                <div className={`p-3 rounded-xl ${section.isActive ? 'bg-slate-50' : 'bg-slate-100'}`}>
                  {getSectionIcon(section.sectionId)}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                    {section.sectionId.replace(/-/g, ' ')}
                    {section.type === 'global' && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Global</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">{section.isActive ? 'Rendering on live site' : 'Hidden from public'}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronRight size={18} className="-rotate-90" />
                  </button>
                  <button 
                    onClick={() => moveSection(index, 1)}
                    disabled={index === page.sections.length - 1}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronRight size={18} className="rotate-90" />
                  </button>
                  <div className="w-[1px] h-6 bg-slate-100 mx-1"></div>
                  <button 
                    onClick={() => toggleSectionVisibility(index)}
                    className={`p-1.5 rounded-lg transition-all ${section.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-amber-600 bg-amber-50'}`}
                    title={section.isActive ? "Hide Section" : "Show Section"}
                  >
                    {section.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button 
                    onClick={() => handleEditSection(section.sectionId)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Content"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Section Button */}
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group">
              <div className="bg-slate-100 p-1 rounded-lg group-hover:bg-blue-100 transition-all">
                <Plus size={16} />
              </div>
              Add New Section
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LayoutDashboard size={20} className="text-blue-400" />
              Page Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-xs">Total Sections</span>
                <span className="font-bold">{page.sections.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-xs">Global Sections</span>
                <span className="font-bold text-amber-400">{page.sections.filter(s => s.type === 'global').length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-xs">Page Status</span>
                <span className="px-2 py-0.5 bg-green-500 text-[10px] rounded font-black uppercase">{page.status}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Pro Tip</p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">Reorder sections to change how they appear on the live site. Global sections are shared across all pages.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center gap-3 w-full p-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Plus size={16} /></div>
                Duplicate Page
              </button>
              <button className="flex items-center gap-3 w-full p-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><SettingsIcon size={16} /></div>
                Page Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
