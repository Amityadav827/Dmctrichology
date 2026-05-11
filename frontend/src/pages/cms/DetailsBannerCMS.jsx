import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";

export default function DetailsBannerCMS() {
  const [data, setData] = useState({
    bannerImage: "",
    pageTitle: "Service Details",
    breadcrumbText: "Details",
    overlayOpacity: 0.3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const banner = res.data?.data?.banner || {};
        setData(prev => ({ ...prev, ...banner }));
      })
      .catch(() => toast.error("Failed to load banner data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { banner: data });
      toast.success("Banner saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Details Page — Banner</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the top banner of the /details page</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Page Title</label>
          <input type="text" value={data.pageTitle} onChange={e => setData({ ...data, pageTitle: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Service Details" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Breadcrumb Text</label>
          <input type="text" value={data.breadcrumbText} onChange={e => setData({ ...data, breadcrumbText: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Details" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Banner Image URL</label>
          <div className="flex gap-4 items-start">
            <input type="text" value={data.bannerImage} onChange={e => setData({ ...data, bannerImage: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste image URL..." />
            {data.bannerImage
              ? <img src={data.bannerImage} alt="" className="w-20 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
              : <div className="w-20 h-14 bg-gray-100 rounded-xl border flex items-center justify-center flex-shrink-0"><ImageIcon size={20} className="text-gray-300" /></div>
            }
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Overlay Opacity (0–1)</label>
          <input type="number" step="0.05" min="0" max="1" value={data.overlayOpacity} onChange={e => setData({ ...data, overlayOpacity: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" />
        </div>
      </div>
    </div>
  );
}
