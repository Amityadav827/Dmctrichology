import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";

export default function FaqEnquiryCMS() {
  const [data, setData] = useState({
    faqTitle: "Few Of The Common Concerns",
    faqSubtitle: "",
    faqItems: [],
    formTitle: "Enquiry Here Below!",
    buttonText: "Schedule Your Visit",
    serviceOptions: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/details-page")
      .then(res => {
        const fe = res.data?.data?.faqEnquiry || {};
        setData(prev => ({ ...prev, ...fe }));
      })
      .catch(() => toast.error("Failed to load FAQ & Enquiry data"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, val) => setData(d => ({ ...d, [field]: val }));

  // FAQ Items
  const addFaq = () => updateField("faqItems", [...(data.faqItems || []), { question: "", answer: "" }]);
  const updateFaq = (i, field, val) => {
    const items = [...(data.faqItems || [])];
    items[i][field] = val;
    updateField("faqItems", items);
  };
  const removeFaq = (i) => updateField("faqItems", (data.faqItems || []).filter((_, idx) => idx !== i));

  // Service Options
  const addOption = () => updateField("serviceOptions", [...(data.serviceOptions || []), ""]);
  const updateOption = (i, val) => {
    const opts = [...(data.serviceOptions || [])];
    opts[i] = val;
    updateField("serviceOptions", opts);
  };
  const removeOption = (i) => updateField("serviceOptions", (data.serviceOptions || []).filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/details-page", { faqEnquiry: data });
      toast.success("FAQ & Enquiry section saved successfully");
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
          <h1 className="text-2xl font-black text-gray-900">Details Page — FAQ & Enquiry</h1>
          <p className="text-sm text-gray-400 mt-1">Manage the FAQ accordion and right-side enquiry form</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: FAQ Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">FAQ Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">FAQ Title</label>
                <input type="text" value={data.faqTitle} onChange={e => updateField("faqTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">FAQ Subtitle</label>
                <textarea value={data.faqSubtitle} onChange={e => updateField("faqSubtitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none min-h-[80px] resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">FAQ Items</h2>
              <button onClick={addFaq} className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
                <Plus size={13} /> Add FAQ
              </button>
            </div>
            
            <div className="space-y-4">
              {(data.faqItems || []).map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <GripVertical size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">FAQ {i + 1}</span>
                    </div>
                    <button onClick={() => removeFaq(i)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <div className="space-y-3">
                    <input type="text" value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" placeholder="Question" />
                    <textarea value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none min-h-[60px] resize-none" placeholder="Answer" />
                  </div>
                </div>
              ))}
              {(data.faqItems || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No FAQs added.</p>}
            </div>
          </div>
        </div>

        {/* Right: Form Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Form Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Form Title</label>
                <input type="text" value={data.formTitle} onChange={e => updateField("formTitle", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Submit Button Text</label>
                <input type="text" value={data.buttonText} onChange={e => updateField("buttonText", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Service Dropdown Options</h2>
              <button onClick={addOption} className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-all">
                <Plus size={13} /> Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {(data.serviceOptions || []).map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-300 w-4 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                  <input type="text" value={opt} onChange={e => updateOption(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" placeholder="e.g. Hair Transplant" />
                  <button onClick={() => removeOption(i)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
              {(data.serviceOptions || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No options added.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
