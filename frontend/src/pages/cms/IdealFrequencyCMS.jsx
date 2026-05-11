import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function IdealFrequencyCMS() {
  const [data, setData] = useState({
    frequencyTitle: "Ideal frequency",
    frequencyDescription: "After 6-8 sessions, 80% - 90% hair reduction can be seen",
    idealForPoints: [],
    notIdealForPoints: [],
    ctaTitle: "Not sure which treatment is right for YOU?",
    ctaDescription: "We can help with that!",
    ctaButtonText: "Book a free online consultation",
    ctaImage: "",
    ctaButtonLink: "/contact"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const ifreq = res.data?.data?.idealFrequency || {};
        setData(prev => ({ ...prev, ...ifreq }));
      })
      .catch(() => toast.error("Failed to load ideal frequency data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));

  // Ideal Points
  const addIdealPoint = () => updateField("idealForPoints", [...(data.idealForPoints || []), ""]);
  const updateIdealPoint = (i, val) => {
    const pts = [...(data.idealForPoints || [])];
    pts[i] = val;
    updateField("idealForPoints", pts);
  };
  const removeIdealPoint = (i) => updateField("idealForPoints", (data.idealForPoints || []).filter((_, idx) => idx !== i));

  // Not Ideal Points
  const addNotIdealPoint = () => updateField("notIdealForPoints", [...(data.notIdealForPoints || []), ""]);
  const updateNotIdealPoint = (i, val) => {
    const pts = [...(data.notIdealForPoints || [])];
    pts[i] = val;
    updateField("notIdealForPoints", pts);
  };
  const removeNotIdealPoint = (i) => updateField("notIdealForPoints", (data.notIdealForPoints || []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { idealFrequency: data });
      toast.success("Ideal Frequency section saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Details Page — Ideal Frequency</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the left frequency info and right CTA</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Frequency Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Top Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Title</label>
                <input type="text" value={data.frequencyTitle} onChange={e => updateField("frequencyTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Description</label>
                <textarea value={data.frequencyDescription} onChange={e => updateField("frequencyDescription", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[80px] resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Ideal For Points</h2>
              <button onClick={addIdealPoint} className="flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-all">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2 mb-8">
              {(data.idealForPoints || []).map((point, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={point} onChange={e => updateIdealPoint(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
                  <button onClick={() => removeIdealPoint(i)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              ))}
              {(data.idealForPoints || []).length === 0 && <p className="text-xs text-gray-400">No points added.</p>}
            </div>

            <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Not Ideal For Points</h2>
              <button onClick={addNotIdealPoint} className="flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-all">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(data.notIdealForPoints || []).map((point, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={point} onChange={e => updateNotIdealPoint(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
                  <button onClick={() => removeNotIdealPoint(i)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              ))}
              {(data.notIdealForPoints || []).length === 0 && <p className="text-xs text-gray-400">No points added.</p>}
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Call to Action (CTA)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">CTA Title</label>
                <input type="text" value={data.ctaTitle} onChange={e => updateField("ctaTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Image URL</label>
                <div className="flex gap-3 items-center">
                  <input type="text" value={data.ctaImage} onChange={e => updateField("ctaImage", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" placeholder="Image URL..." />
                  {data.ctaImage
                    ? <img src={data.ctaImage} alt="" className="w-16 h-12 object-cover rounded-lg border flex-shrink-0" />
                    : <div className="w-16 h-12 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0"><ImageIcon size={14} className="text-gray-300" /></div>
                  }
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">CTA Description</label>
                <textarea value={data.ctaDescription} onChange={e => updateField("ctaDescription", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[80px] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Button Text</label>
                  <input type="text" value={data.ctaButtonText} onChange={e => updateField("ctaButtonText", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Button Link</label>
                  <input type="text" value={data.ctaButtonLink} onChange={e => updateField("ctaButtonLink", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
