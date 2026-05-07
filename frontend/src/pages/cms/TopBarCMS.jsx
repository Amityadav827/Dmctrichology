import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function TopBarCMS() {
  const [topBar, setTopBar] = useState({
    isVisible: true,
    phone1: "",
    phone2: "",
    email: "",
    announcementText: "",
    socialLinks: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTopBar();
  }, []);

  const fetchTopBar = async () => {
    try {
      const { data } = await axios.get("/topbar");
      if (data.success && data.data) {
        setTopBar(data.data);
      }
    } catch (error) {
      toast.error("Failed to load top bar settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTopBar((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialChange = (index, field, value) => {
    const updatedSocials = [...topBar.socialLinks];
    updatedSocials[index][field] = value;
    setTopBar({ ...topBar, socialLinks: updatedSocials });
  };

  const addSocialLink = () => {
    setTopBar({
      ...topBar,
      socialLinks: [...topBar.socialLinks, { name: "", link: "", iconUrl: "" }],
    });
  };

  const removeSocialLink = (index) => {
    const updatedSocials = topBar.socialLinks.filter((_, i) => i !== index);
    setTopBar({ ...topBar, socialLinks: updatedSocials });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/topbar", {
          ...topBar,
          socialLinks: topBar.socialLinks // JSON.stringify not needed here since it's JSON body, not FormData
      });
      if (data.success) {
        toast.success("Top Bar updated successfully");
        setTopBar(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update top bar");
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
        <h1 className="text-2xl font-bold text-gray-800">Top Bar CMS</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Visibility */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Top Bar Visibility</h2>
            <p className="text-sm text-gray-500">Enable or disable the top bar across the website.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isVisible"
              checked={topBar.isVisible}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Announcement */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">1. Announcement</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
            <input
              type="text"
              name="announcementText"
              value={topBar.announcementText}
              onChange={handleChange}
              placeholder="e.g. Get 20% off your first consultation!"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">2. Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone1"
                value={topBar.phone1}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
              <input
                type="text"
                name="phone2"
                value={topBar.phone2}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={topBar.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">3. Social Links & Icons</h2>
            <button
              onClick={addSocialLink}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" /> Add Social
            </button>
          </div>
          <div className="space-y-4">
            {topBar.socialLinks.map((social, index) => (
              <div key={index} className="flex gap-4 items-start border p-4 rounded-lg bg-gray-50 relative">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Platform Name (e.g. facebook)</label>
                      <input
                        type="text"
                        value={social.name}
                        onChange={(e) => handleSocialChange(index, "name", e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex-2 w-2/3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Profile Link</label>
                      <input
                        type="url"
                        value={social.link}
                        onChange={(e) => handleSocialChange(index, "link", e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon URL (Cloudinary image URL)</label>
                    <input
                      type="url"
                      value={social.iconUrl}
                      onChange={(e) => handleSocialChange(index, "iconUrl", e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {social.iconUrl && (
                    <img src={social.iconUrl} alt="icon" className="w-8 h-8 object-contain bg-white border p-1 rounded" />
                  )}
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700 p-1 mt-1"
                    title="Remove social link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
