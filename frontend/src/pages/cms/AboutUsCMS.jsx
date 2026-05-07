import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function AboutUsCMS() {
  const [data, setData] = useState({
    subtitle: "",
    title: "",
    description: "",
    icon: "",
    stats: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const { data: res } = await axios.get("/about-us");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Failed to load About Us settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...data.stats];
    updatedStats[index][field] = value;
    setData({ ...data, stats: updatedStats });
  };

  const addStat = () => {
    setData({
      ...data,
      stats: [...data.stats, { value: "", label: "", description: "", showDivider: true }],
    });
  };

  const removeStat = (index) => {
    const updatedStats = data.stats.filter((_, i) => i !== index);
    setData({ ...data, stats: updatedStats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: res } = await axios.put("/about-us", data);
      if (res.success) {
        toast.success("About Us updated successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update About Us");
    } finally {
      setSaving(false);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">About Us CMS</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">1. Header Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Icon URL</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="icon"
                  value={data.icon}
                  onChange={handleChange}
                  placeholder="Cloudinary icon URL"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {data.icon && <img src={data.icon} alt="icon" className="w-10 h-10 object-contain border p-1 rounded" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text (Subtitle)</label>
              <input
                type="text"
                name="subtitle"
                value={data.subtitle}
                onChange={handleChange}
                placeholder="e.g. ABOUT US CARE"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder="e.g. WELCOME TO DMC TRICHOLOGY®"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">2. Stats Cards (Repeater)</h2>
            <button
              onClick={addStat}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" /> Add Stat
            </button>
          </div>
          <div className="space-y-6">
            {data.stats.map((stat, index) => (
              <div key={index} className="border p-6 rounded-xl bg-gray-50 relative group">
                <button
                  onClick={() => removeStat(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stat Value (e.g. 2k+)</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, "value", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Label (e.g. Patients Healed)</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, "label", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Description</label>
                    <textarea
                      value={stat.description}
                      onChange={(e) => handleStatChange(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={stat.showDivider}
                        onChange={(e) => handleStatChange(index, "showDivider", e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Show Divider</label>
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
