import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Eye, 
  Settings, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Globe,
  Sliders
} from "lucide-react";

export default function AboutDrNandaniCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/about-dr-nandani");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Failed to load page settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/about-dr-nandani", data);
      if (res.success) {
        toast.success("Dr. Nandani Dadu CMS saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const { data: res } = await axios.post("/about-dr-nandani/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success && res.url) {
        updateSectionField(section, field, res.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Dr. Nandani CMS...</p>
        </div>
      </div>
    );
  }

  const SectionTab = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-center gap-2 px-3 py-4 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap flex-1 ${
        activeSection === id 
        ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header Panel */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">About Dr. Nandani Dadu CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Section 1 isolated builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/about-dr-nandani-dadu', '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} />
              Live Preview
            </button>
            <button
              onClick={() => window.open('/cms/visual-builder/about-dr-nandani-dadu', '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-xl font-bold text-sm hover:bg-cyan-100 transition-all shadow-sm"
            >
              <Sparkles size={16} />
              Visual Builder
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {/* Section Tabs - Strictly Isolated for Section 1 */}
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between overflow-x-auto border-t border-slate-100 bg-white scrollbar-hide">
          <SectionTab id="hero" label="HERO DESIGN & COPY" icon={User} />
          <SectionTab id="form" label="CONSULTATION FORM DESIGN" icon={ShieldCheck} />
          <SectionTab id="seo" label="SEO & METADATA" icon={Globe} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {/* HERO CORE DESIGN & COPY */}
        {activeSection === "hero" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                Hero Content & Spacing Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Eyebrow Heading</label>
                  <input 
                    type="text" 
                    value={data.hero?.mainHeading || ""} 
                    onChange={e => updateSectionField("hero", "mainHeading", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Name</label>
                  <input 
                    type="text" 
                    value={data.hero?.doctorName || ""} 
                    onChange={e => updateSectionField("hero", "doctorName", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Degree Badge Text</label>
                  <input 
                    type="text" 
                    value={data.hero?.degreeText || ""} 
                    onChange={e => updateSectionField("hero", "degreeText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Hero Background Color (Default: #3b5998)</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={data.hero?.backgroundColor || "#3b5998"} 
                      onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={data.hero?.backgroundColor || ""} 
                      onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Editorial Doctor Description Paragraph</label>
                  <textarea 
                    rows={4} 
                    value={data.hero?.descriptionParagraph || ""} 
                    onChange={e => updateSectionField("hero", "descriptionParagraph", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Doctor Portrait Image</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.hero?.doctorImage || ""} 
                      onChange={e => updateSectionField("hero", "doctorImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "hero", "doctorImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Section Hero Background Image (Optional)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.hero?.backgroundImage || ""} 
                      onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "hero", "backgroundImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Background Overlay Opacity</label>
                    <span className="text-xs font-black text-indigo-600">{data.hero?.overlayOpacity ?? 0.4}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={data.hero?.overlayOpacity ?? 0.4} 
                    onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONSULTATION FORM DESIGN */}
        {activeSection === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Sliders size={18} />
                </div>
                Form Headings & Success Messages
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Title</label>
                  <input 
                    type="text" 
                    value={data.formSettings?.title || ""} 
                    onChange={e => updateSectionField("formSettings", "title", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Form Section Subtitle</label>
                  <input 
                    type="text" 
                    value={data.formSettings?.subtitle || ""} 
                    onChange={e => updateSectionField("formSettings", "subtitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Successful Submit Notification Message</label>
                  <textarea 
                    rows={4} 
                    value={data.formSettings?.successMessage || ""} 
                    onChange={e => updateSectionField("formSettings", "successMessage", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                Form Input Placeholders & CTA Text
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Name Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.namePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "namePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Email Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.emailPlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "emailPlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Mobile Number Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.phonePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "phonePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Preferred Date Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.datePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "datePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Captcha Code Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.captchaPlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "captchaPlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Submit Button CTA Text</label>
                  <input 
                    type="text" 
                    value={data.hero?.submitButtonText || ""} 
                    onChange={e => updateSectionField("hero", "submitButtonText", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Message Input Placeholder</label>
                  <input 
                    type="text" 
                    value={data.hero?.messagePlaceholder || ""} 
                    onChange={e => updateSectionField("hero", "messagePlaceholder", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO SETTINGS CONFIG */}
        {activeSection === "seo" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <h3 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Globe size={18} />
                </div>
                Search Engine Optimization & Social Sharing
              </h3>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={data.seo?.metaTitle || ""} 
                    onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">SEO Meta Description</label>
                  <textarea 
                    rows={4} 
                    value={data.seo?.metaDescription || ""} 
                    onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">OG Shared Preview Image (Social Link Image)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={data.seo?.ogImage || ""} 
                      onChange={e => updateSectionField("seo", "ogImage", e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                    />
                    <label className="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-all aspect-square shrink-0">
                      {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "seo", "ogImage")} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
