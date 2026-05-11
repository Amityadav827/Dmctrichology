import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function BeforeAfterCMS() {
  const [data, setData] = useState({
    beforeTitle: "Before Treatment",
    afterTitle: "After Treatment",
    beforePoints: [],
    afterPoints: [],
    sectionBackground: "#EAEAF2"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const beforeAfter = res.data?.data?.beforeAfter || {};
        setData(prev => ({ ...prev, ...beforeAfter }));
      })
      .catch(() => toast.error("Failed to load before/after data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));

  // Before Points
  const addBeforePoint = () => updateField("beforePoints", [...(data.beforePoints || []), ""]);
  const updateBeforePoint = (i, val) => {
    const pts = [...(data.beforePoints || [])];
    pts[i] = val;
    updateField("beforePoints", pts);
  };
  const removeBeforePoint = (i) => updateField("beforePoints", (data.beforePoints || []).filter((_, idx) => idx !== i));

  // After Points
  const addAfterPoint = () => updateField("afterPoints", [...(data.afterPoints || []), ""]);
  const updateAfterPoint = (i, val) => {
    const pts = [...(data.afterPoints || [])];
    pts[i] = val;
    updateField("afterPoints", pts);
  };
  const removeAfterPoint = (i) => updateField("afterPoints", (data.afterPoints || []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { beforeAfter: data });
      toast.success("Before/After section saved successfully");
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
          <h1 className="text-2xl font-black text-gray-900">Details Page — Before / After</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the 2-column treatment guidelines section</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Section Background Color</label>
          <input type="text" value={data.sectionBackground} onChange={e => updateField("sectionBackground", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
            placeholder="#EAEAF2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Treatment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Left Column (Before)</h2>
            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Title</label>
              <input type="text" value={data.beforeTitle} onChange={e => updateField("beforeTitle", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-700">Bullet Points</h3>
              <button onClick={addBeforePoint} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-all">
                <Plus size={13} /> Add Point
              </button>
            </div>
            <div className="space-y-3">
              {(data.beforePoints || []).map((point, i) => (
                <div key={i} className="flex gap-2">
                  <textarea value={point} onChange={e => updateBeforePoint(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none min-h-[60px] resize-none"
                    placeholder="Enter point..." />
                  <button onClick={() => removeBeforePoint(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors self-start"><Trash2 size={16} /></button>
                </div>
              ))}
              {(data.beforePoints || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No points added.</p>}
            </div>
          </div>

          {/* After Treatment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Right Column (After)</h2>
            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Title</label>
              <input type="text" value={data.afterTitle} onChange={e => updateField("afterTitle", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-700">Bullet Points</h3>
              <button onClick={addAfterPoint} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-all">
                <Plus size={13} /> Add Point
              </button>
            </div>
            <div className="space-y-3">
              {(data.afterPoints || []).map((point, i) => (
                <div key={i} className="flex gap-2">
                  <textarea value={point} onChange={e => updateAfterPoint(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none min-h-[60px] resize-none"
                    placeholder="Enter point..." />
                  <button onClick={() => removeAfterPoint(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors self-start"><Trash2 size={16} /></button>
                </div>
              ))}
              {(data.afterPoints || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No points added.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
