import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function HeaderCMS() {
  const [header, setHeader] = useState({
    logoUrl: "",
    isSticky: true,
    appointmentButtonText: "",
    appointmentButtonLink: "",
    menuItems: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    try {
      const { data } = await axios.get("/header");
      if (data.success && data.data) {
        setHeader(data.data);
      }
    } catch (error) {
      toast.error("Failed to load header settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeader((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMenuItemChange = (index, field, value) => {
    const updated = [...header.menuItems];
    updated[index][field] = value;
    setHeader({ ...header, menuItems: updated });
  };

  const addMenuItem = () => {
    setHeader({
      ...header,
      menuItems: [...header.menuItems, { label: "", link: "#", hasDropdown: false, submenu: [] }],
    });
  };

  const removeMenuItem = (index) => {
    const updated = header.menuItems.filter((_, i) => i !== index);
    setHeader({ ...header, menuItems: updated });
  };

  const addSubmenuItem = (index) => {
    const updated = [...header.menuItems];
    if (!updated[index].submenu) updated[index].submenu = [];
    updated[index].submenu.push({ label: "", link: "" });
    updated[index].hasDropdown = true;
    setHeader({ ...header, menuItems: updated });
  };

  const removeSubmenuItem = (menuIndex, subIndex) => {
    const updated = [...header.menuItems];
    updated[menuIndex].submenu = updated[menuIndex].submenu.filter((_, i) => i !== subIndex);
    if (updated[menuIndex].submenu.length === 0) updated[menuIndex].hasDropdown = false;
    setHeader({ ...header, menuItems: updated });
  };

  const handleSubmenuChange = (menuIndex, subIndex, field, value) => {
    const updated = [...header.menuItems];
    updated[menuIndex].submenu[subIndex][field] = value;
    setHeader({ ...header, menuItems: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/header", header);
      if (data.success) {
        toast.success("Header updated successfully");
        setHeader(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update header");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Header CMS</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Branding & Logo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">1. Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  name="logoUrl"
                  value={header.logoUrl}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {header.logoUrl && (
                  <img src={header.logoUrl} alt="Logo" className="h-12 bg-gray-50 p-2 rounded border" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isSticky"
                id="isSticky"
                checked={header.isSticky}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="isSticky" className="text-sm font-medium text-gray-700">Sticky Header</label>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">2. Call To Action (Header Button)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                name="appointmentButtonText"
                value={header.appointmentButtonText}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                name="appointmentButtonLink"
                value={header.appointmentButtonLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-semibold text-gray-800">3. Navigation Menu</h2>
            <button
              onClick={addMenuItem}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" /> Add Menu Item
            </button>
          </div>
          
          <div className="space-y-4">
            {header.menuItems.map((menu, index) => (
              <div key={index} className="border rounded-lg bg-gray-50 overflow-hidden">
                <div className="p-4 flex gap-4 items-center">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Label (e.g. Services)"
                      value={menu.label}
                      onChange={(e) => handleMenuItemChange(index, "label", e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Link (e.g. /services)"
                      value={menu.link}
                      onChange={(e) => handleMenuItemChange(index, "link", e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addSubmenuItem(index)}
                      className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      + Submenu
                    </button>
                    <button
                      onClick={() => removeMenuItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Submenu Items */}
                {menu.submenu && menu.submenu.length > 0 && (
                  <div className="px-4 pb-4 pt-0 space-y-2 border-t mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Submenu Items</p>
                    {menu.submenu.map((sub, subIdx) => (
                      <div key={subIdx} className="flex gap-4 items-center ml-6">
                        <input
                          type="text"
                          placeholder="Submenu Label"
                          value={sub.label}
                          onChange={(e) => handleSubmenuChange(index, subIdx, "label", e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Submenu Link"
                          value={sub.link}
                          onChange={(e) => handleSubmenuChange(index, subIdx, "link", e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        />
                        <button
                          onClick={() => removeSubmenuItem(index, subIdx)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
