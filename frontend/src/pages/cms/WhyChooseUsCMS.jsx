import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Plus, Trash2, Copy,
  Image as ImageIcon, ChevronUp, ChevronDown
} from "lucide-react";

export default function WhyChooseUsCMS() {
  const [data, setData] = useState({
    enabled: true,
    subtitle: "",
    title: "",
    centralImage: "",
    backgroundColor: "#ffffff",
    paddingTop: "0px",
    paddingBottom: "0px",
    showConnectorLines: true,
    showDots: true,
    features: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get("/why-choose-us");
      if (res.success && res.data) {
        setData({
          ...res.data,
          features: Array.isArray(res.data.features) ? res.data.features : []
        });
      }
    } catch (error) {
      toast.error("Failed to load Why Choose Us settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Safe features array
  const safeFeatures = Array.isArray(data.features) ? data.features : [];

  const handleFeatureChange = (index, field, value) => {
    const updated = [...safeFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, features: updated });
  };

  const addFeature = () => {
    setData({
      ...data,
      features: [...safeFeatures, { icon: "", title: "", desc: "", side: "left", enabled: true }]
    });
  };

  const duplicateFeature = (index) => {
    const copy = { ...safeFeatures[index], title: safeFeatures[index].title + " (copy)" };
    const updated = [...safeFeatures];
    updated.splice(index + 1, 0, copy);
    setData({ ...data, features: updated });
  };

  const removeFeature = (index) => {
    setData({ ...data, features: safeFeatures.filter((_, i) => i !== index) });
  };

  const moveFeature = (index, direction) => {
    const updated = [...safeFeatures];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= updated.length) return;
    [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
    setData({ ...data, features: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        enabled: data.enabled,
        subtitle: data.subtitle,
        title: data.title,
        centralImage: data.centralImage,
        backgroundColor: data.backgroundColor,
        paddingTop: data.paddingTop,
        paddingBottom: data.paddingBottom,
        showConnectorLines: data.showConnectorLines,
        showDots: data.showDots,
        features: safeFeatures,
      };
      const { data: res } = await axios.put("/why-choose-us", payload);
      if (res.success) {
        toast.success("Why Choose Us saved successfully");
        setData({
          ...res.data,
          features: Array.isArray(res.data.features) ? res.data.features : []
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save Why Choose Us");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Why Choose Us CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the "Why DMC Trichology" feature section</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-200"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ── Section Settings ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            1. Section Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Enable */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input type="checkbox" id="enabled" name="enabled" checked={!!data.enabled} onChange={handleChange} className="w-5 h-5 accent-blue-600 cursor-pointer" />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700 cursor-pointer">Section Enabled (visible on website)</label>
            </div>

            {/* Badge Text */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text (Subtitle)</label>
              <input type="text" name="subtitle" value={data.subtitle} onChange={handleChange} placeholder="e.g. Best Hair Graft Clinic" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Main Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
              <textarea rows={2} name="title" value={data.title} onChange={handleChange} placeholder="e.g. Why DMC Trichology Is The Best..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>

            {/* Center Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Center Image URL</label>
              <div className="flex gap-3 items-start">
                <input type="text" name="centralImage" value={data.centralImage} onChange={handleChange} placeholder="Paste Cloudinary image URL" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                {data.centralImage ? (
                  <img src={data.centralImage} alt="preview" className="w-16 h-16 object-contain rounded-lg border bg-gray-50 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* BG Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input type="color" name="backgroundColor" value={data.backgroundColor || '#ffffff'} onChange={handleChange} className="w-10 h-10 rounded border cursor-pointer" />
                <input type="text" name="backgroundColor" value={data.backgroundColor} onChange={handleChange} placeholder="#ffffff" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Padding Top */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding Top</label>
              <input type="text" name="paddingTop" value={data.paddingTop} onChange={handleChange} placeholder="0px" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Padding Bottom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding Bottom</label>
              <input type="text" name="paddingBottom" value={data.paddingBottom} onChange={handleChange} placeholder="0px" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="showConnectorLines" name="showConnectorLines" checked={!!data.showConnectorLines} onChange={handleChange} className="w-5 h-5 accent-blue-600 cursor-pointer" />
              <label htmlFor="showConnectorLines" className="text-sm font-medium text-gray-700 cursor-pointer">Show Connector Lines</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="showDots" name="showDots" checked={!!data.showDots} onChange={handleChange} className="w-5 h-5 accent-blue-600 cursor-pointer" />
              <label htmlFor="showDots" className="text-sm font-medium text-gray-700 cursor-pointer">Show Floating Dots</label>
            </div>
          </div>
        </div>

        {/* ── Feature Cards Repeater ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              2. Feature Cards ({safeFeatures.length})
            </h2>
            <button
              onClick={addFeature}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium"
            >
              <Plus className="h-4 w-4" /> Add Card
            </button>
          </div>

          <div className="space-y-4">
            {safeFeatures.map((feat, index) => (
              <div key={index} className="border rounded-xl bg-gray-50 overflow-hidden">
                {/* Card header */}
                <div className="flex justify-between items-center px-5 py-3 bg-white border-b">
                  <span className="text-sm font-semibold text-gray-600">
                    #{index + 1} — {feat.title || <span className="text-gray-300 italic">untitled</span>}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${feat.side === 'right' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {feat.side === 'right' ? 'Right' : 'Left'}
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveFeature(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move up"><ChevronUp size={16} /></button>
                    <button onClick={() => moveFeature(index, 1)} disabled={index === safeFeatures.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move down"><ChevronDown size={16} /></button>
                    <button onClick={() => duplicateFeature(index)} className="p-1.5 text-gray-400 hover:text-blue-500" title="Duplicate"><Copy size={16} /></button>
                    <button onClick={() => removeFeature(index)} className="p-1.5 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Enable + Side */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`feat-enabled-${index}`} checked={feat.enabled !== false} onChange={e => handleFeatureChange(index, "enabled", e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                    <label htmlFor={`feat-enabled-${index}`} className="text-xs font-medium text-gray-500 cursor-pointer">Card Enabled</label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Position</label>
                    <select value={feat.side || 'left'} onChange={e => handleFeatureChange(index, "side", e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="left">Left Side</option>
                      <option value="right">Right Side</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Title</label>
                    <input type="text" value={feat.title || ""} onChange={e => handleFeatureChange(index, "title", e.target.value)} placeholder="e.g. Natural Results" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Description</label>
                    <textarea rows={2} value={feat.desc || ""} onChange={e => handleFeatureChange(index, "desc", e.target.value)} placeholder="e.g. Every Hairline Is Designed To Match..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>

                  {/* Icon URL + preview */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon / Image URL</label>
                    <div className="flex gap-3 items-start">
                      <input type="text" value={feat.icon || ""} onChange={e => handleFeatureChange(index, "icon", e.target.value)} placeholder="Paste Cloudinary icon URL" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      {feat.icon ? (
                        <img src={feat.icon} alt="preview" className="w-14 h-14 object-contain rounded-lg border bg-amber-50 flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {safeFeatures.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">No feature cards yet. Click "Add Card" to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
