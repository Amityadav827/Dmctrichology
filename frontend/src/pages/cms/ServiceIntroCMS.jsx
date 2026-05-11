import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function ServiceIntroCMS() {
  const [data, setData] = useState({
    badge: "FOR UNWANTED HAIR",
    title: "Follicular Unit Extraction (FUE)",
    rating: "4.85",
    duration: "180 mins",
    subTitle: "",
    description: "",
    closingText: "",
    videoUrl: "",
    galleryImages: [],
    bulletPoints: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const intro = res.data?.data?.intro || {};
        setData(prev => ({ ...prev, ...intro }));
      })
      .catch(() => toast.error("Failed to load intro data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));

  // Gallery Images
  const addImage = () => updateField("galleryImages", [...(data.galleryImages || []), ""]);
  const updateImage = (i, val) => {
    const imgs = [...(data.galleryImages || [])];
    imgs[i] = val;
    updateField("galleryImages", imgs);
  };
  const removeImage = (i) => updateField("galleryImages", (data.galleryImages || []).filter((_, idx) => idx !== i));

  // Bullet Points
  const addBullet = () => updateField("bulletPoints", [...(data.bulletPoints || []), ""]);
  const updateBullet = (i, val) => {
    const pts = [...(data.bulletPoints || [])];
    pts[i] = val;
    updateField("bulletPoints", pts);
  };
  const removeBullet = (i) => updateField("bulletPoints", (data.bulletPoints || []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { intro: data });
      toast.success("Service intro saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Details Page — Service Intro</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the service details section (left gallery + right content)</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Fields */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Category Badge</label>
              <input type="text" value={data.badge} onChange={e => updateField("badge", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="FOR UNWANTED HAIR" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Rating</label>
              <input type="text" value={data.rating} onChange={e => updateField("rating", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" placeholder="4.85" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Service Title</label>
              <input type="text" value={data.title} onChange={e => updateField("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Follicular Unit Extraction (FUE)" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Duration</label>
              <input type="text" value={data.duration} onChange={e => updateField("duration", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" placeholder="180 mins" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Video URL (optional)</label>
              <input type="text" value={data.videoUrl} onChange={e => updateField("videoUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" placeholder="YouTube embed URL" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Sub-title (optional, supports line breaks)</label>
              <textarea value={data.subTitle} onChange={e => updateField("subTitle", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[80px] resize-none" placeholder="Bold sub-heading under the title..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Main Description</label>
              <textarea value={data.description} onChange={e => updateField("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[120px] resize-none" placeholder="Main descriptive text..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Closing Text (optional)</label>
              <textarea value={data.closingText} onChange={e => updateField("closingText", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[80px] resize-none" placeholder="Closing statement after bullet points..." />
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Gallery Images</h2>
            <button onClick={addImage} className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
              <Plus size={13} /> Add Image
            </button>
          </div>
          <div className="space-y-3">
            {(data.galleryImages || []).map((img, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="text-[10px] font-black text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                <input type="text" value={img} onChange={e => updateImage(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder={`Image URL ${i + 1}`} />
                {img ? <img src={img} alt="" className="w-14 h-10 object-cover rounded-lg border flex-shrink-0" /> : <div className="w-14 h-10 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0"><ImageIcon size={14} className="text-gray-300" /></div>}
                <button onClick={() => removeImage(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            ))}
            {(data.galleryImages || []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No gallery images yet. Click "Add Image".</p>
            )}
          </div>
        </div>

        {/* Bullet Points */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Bullet Points</h2>
            <button onClick={addBullet} className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
              <Plus size={13} /> Add Point
            </button>
          </div>
          <div className="space-y-3">
            {(data.bulletPoints || []).map((point, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="text-[10px] font-black text-gray-300 w-4">•</span>
                <input type="text" value={point} onChange={e => updateBullet(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                  placeholder={`Bullet point ${i + 1}`} />
                <button onClick={() => removeBullet(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            ))}
            {(data.bulletPoints || []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No bullet points. Click "Add Point".</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
