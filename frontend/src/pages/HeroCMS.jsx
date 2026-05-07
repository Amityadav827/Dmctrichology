import React, { useState, useEffect } from "react";
import { Monitor, Save, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import Loader from "../components/Loader";

const HeroCMS = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    heading: "",
    subheading: "",
    buttonText: "",
    buttonLink: "",
    trustedText: "",
    formTitle: "",
    isActive: true,
  });
  const [bgImage, setBgImage] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState("");

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data } = await api.get("/hero");
      if (data.success && data.data) {
        setFormData({
          _id: data.data._id,
          heading: data.data.heading,
          subheading: data.data.subheading,
          buttonText: data.data.buttonText,
          buttonLink: data.data.buttonLink,
          trustedText: data.data.trustedText,
          formTitle: data.data.formTitle,
          isActive: data.data.isActive,
        });
        setBgImagePreview(data.data.backgroundImage);
      }
    } catch (error) {
      toast.error("Failed to fetch Hero section data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(file);
      setBgImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      if (bgImage) {
        payload.append("backgroundImage", bgImage);
      }

      let response;
      if (formData._id) {
        response = await api.put(`/hero/${formData._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post("/hero", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success("Hero section updated successfully");
        setFormData((prev) => ({ ...prev, _id: response.data.data._id }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Hero section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading Hero CMS..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Monitor className="text-blue-600" size={32} /> Hero CMS
          </h2>
          <p style={{ color: "#64748B", marginTop: "0.5rem" }}>Manage the main hero section of your website.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem" }}
        >
          {saving ? "Saving Changes..." : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
        {/* Main Content Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card-glass" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Main Heading</label>
                <textarea
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  placeholder="Enter main heading..."
                  rows="3"
                  className="form-input"
                  style={{ fontSize: "1.125rem", fontWeight: 600 }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subheading</label>
                <textarea
                  name="subheading"
                  value={formData.subheading}
                  onChange={handleInputChange}
                  placeholder="Enter subheading..."
                  rows="3"
                  className="form-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="e.g. GET FREE CONSULTATION"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    placeholder="e.g. #contact"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Trusted Text (Small)</label>
                  <input
                    type="text"
                    name="trustedText"
                    value={formData.trustedText}
                    onChange={handleInputChange}
                    placeholder="e.g. Trusted by 10k+ Patients"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Form Title</label>
                  <input
                    type="text"
                    name="formTitle"
                    value={formData.formTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Book Your Consultation"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Background Image Upload */}
          <div className="card-glass" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ImageIcon size={16} /> Background Image
            </h3>
            
            <div 
              style={{ 
                width: "100%", 
                height: "200px", 
                borderRadius: "12px", 
                border: "2px dashed #CBD5E1", 
                background: "#F8FAFC", 
                overflow: "hidden", 
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }}
              />
              {bgImagePreview ? (
                <img src={bgImagePreview} alt="Hero Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", color: "#94A3B8" }}>
                  <ImageIcon size={40} style={{ marginBottom: "0.5rem" }} />
                  <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Click to upload hero image</p>
                </div>
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "1rem" }}>
              <AlertCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
              Recommended size: 1920x1080px (JPEG/PNG)
            </p>
          </div>

          {/* Visibility Toggle */}
          <div className="card-glass" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", margin: 0 }}>Section Active</h3>
                <p style={{ fontSize: "0.8125rem", color: "#64748B", margin: 0 }}>Enable or disable hero section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Live Preview Hint */}
          <div style={{ padding: "1.5rem", borderRadius: "12px", background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", border: "1px solid #BFDBFE" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <CheckCircle className="text-blue-600" size={24} />
              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1E3A8A", margin: "0 0 0.25rem 0" }}>CMS Ready</h4>
                <p style={{ fontSize: "0.8125rem", color: "#3B82F6", margin: 0 }}>Changes will be reflected instantly on the live website after saving.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCMS;
