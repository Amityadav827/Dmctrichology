import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function HeroCMS() {
  const [hero, setHero] = useState({
    slides: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await axios.get("/hero");
      if (data.success && data.data) {
        setHero(data.data);
      }
    } catch (error) {
      toast.error("Failed to load hero settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...hero.slides];
    updatedSlides[index][field] = value;
    setHero({ ...hero, slides: updatedSlides });
  };

  const addSlide = () => {
    setHero({
      ...hero,
      slides: [
        ...hero.slides,
        {
          tag: "DMC TRICHOLOGY",
          title: "",
          description: "",
          backgroundImage: "",
          primaryBtnText: "Book Appointment",
          primaryBtnLink: "/book-appointment",
        },
      ],
    });
  };

  const removeSlide = (index) => {
    const updatedSlides = hero.slides.filter((_, i) => i !== index);
    setHero({ ...hero, slides: updatedSlides });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put("/hero", hero);
      if (data.success) {
        toast.success("Hero section updated successfully");
        setHero(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update hero");
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hero Section CMS</h1>
          <p className="text-sm text-gray-500">Manage your homepage sliders and banners</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={addSlide}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Slide
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {hero.slides.map((slide, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
              <span className="font-semibold text-gray-700">Slide #{index + 1}</span>
              <button
                onClick={() => removeSlide(index)}
                className="text-red-500 hover:text-red-700 p-1 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Content Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Slide Tag</label>
                  <input
                    type="text"
                    value={slide.tag}
                    onChange={(e) => handleSlideChange(index, "tag", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. DMC TRICHOLOGY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                  <textarea
                    rows={2}
                    value={slide.title}
                    onChange={(e) => handleSlideChange(index, "title", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Enter hero title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={slide.description}
                    onChange={(e) => handleSlideChange(index, "description", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Enter slide description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Button Text</label>
                    <input
                      type="text"
                      value={slide.primaryBtnText}
                      onChange={(e) => handleSlideChange(index, "primaryBtnText", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Button Link</label>
                    <input
                      type="text"
                      value={slide.primaryBtnLink}
                      onChange={(e) => handleSlideChange(index, "primaryBtnLink", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Background Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slide.backgroundImage}
                      onChange={(e) => handleSlideChange(index, "backgroundImage", e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Paste image URL here"
                    />
                  </div>
                </div>
                <div className="aspect-video w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {slide.backgroundImage ? (
                    <img
                      src={slide.backgroundImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {hero.slides.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
            <p className="text-gray-500">No slides found. Click "Add Slide" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
