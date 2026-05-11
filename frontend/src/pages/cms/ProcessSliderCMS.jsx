import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

export default function ProcessSliderCMS() {
  const [sectionTitle, setSectionTitle] = useState("How Full Body Laser Hair Reduction works?");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const process = res.data?.data?.process || {};
        if (process.sectionTitle) setSectionTitle(process.sectionTitle);
        if (Array.isArray(process.processSteps)) setSteps(process.processSteps);
      })
      .catch(() => toast.error("Failed to load process data"))
      .finally(() => setLoading(false));
  }, []);

  const addStep = () => setSteps(s => [...s, { image: "", stepNumber: `STEP ${s.length + 1}`, title: "", description: "" }]);
  const removeStep = (i) => setSteps(s => s.filter((_, idx) => idx !== i));
  const updateStep = (i, field, val) => {
    setSteps(s => s.map((step, idx) => idx === i ? { ...step, [field]: val } : step));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { process: { sectionTitle, processSteps: steps } });
      toast.success("Process slider saved successfully");
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
          <h1 className="text-2xl font-black text-gray-900">Details Page — Process Slider</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the blue process steps slider section</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Section Title */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Section Title</label>
          <input type="text" value={sectionTitle} onChange={e => setSectionTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How Full Body Laser Hair Reduction works?" />
        </div>

        {/* Steps Repeater */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Process Steps</h2>
            <button onClick={addStep} className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
              <Plus size={13} /> Add Step
            </button>
          </div>

          {steps.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400">No steps yet. Click "Add Step" to begin.</p>
            </div>
          )}

          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-gray-50 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-gray-300" />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Step {i + 1}</span>
                  </div>
                  <button onClick={() => removeStep(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-widest">Step Number Label</label>
                    <input type="text" value={step.stepNumber} onChange={e => updateStep(i, "stepNumber", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white"
                      placeholder="STEP 1" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-widest">Step Title (optional)</label>
                    <input type="text" value={step.title} onChange={e => updateStep(i, "title", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white"
                      placeholder="e.g. Consultation" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-widest">Image URL</label>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={step.image} onChange={e => updateStep(i, "image", e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white"
                        placeholder="Paste Cloudinary/Supabase image URL" />
                      {step.image
                        ? <img src={step.image} alt="" className="w-16 h-12 object-cover rounded-lg border flex-shrink-0" />
                        : <div className="w-16 h-12 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0"><ImageIcon size={14} className="text-gray-300" /></div>
                      }
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-widest">Short Description</label>
                    <textarea value={step.description} onChange={e => updateStep(i, "description", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white resize-none min-h-[70px]"
                      placeholder="Area is marked, cleansed and shaved" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
