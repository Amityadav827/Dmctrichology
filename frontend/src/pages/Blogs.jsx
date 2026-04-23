import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Search, Eye, Filter, ChevronDown, Check } from "lucide-react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

// Derive the uploads base URL from the API base URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = (import.meta.env.VITE_API_URL || 'https://dmctrichology-1.onrender.com/api')
    .replace(/\/api$/, '');
  return `${base}${path}`;
};

const FilterDropdown = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center justify-between gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-[12px] text-sm font-semibold text-slate-600 outline-none hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer min-w-[160px] h-[38px] shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={14} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : label}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-1.5 w-full min-w-[160px] bg-white border border-slate-100 rounded-[12px] shadow-xl z-20 overflow-hidden animate-fade-in">
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  onChange("All");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  value === "All" 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{label}</span>
                {value === "All" && <Check size={14} />}
              </button>
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SidebarDropdown = ({ label, value, onChange, options, name, variant = "vertical" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  if (variant === "horizontal") {
    return (
      <div className="relative flex items-center justify-between w-full p-1.5 px-3.5 bg-slate-50 border border-slate-100 rounded-xl">
        <span className="text-sm font-semibold text-slate-600 truncate mr-2">{label}</span>
        <div className="relative min-w-[120px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none hover:border-slate-300 transition-all duration-200"
          >
            <span className="truncate">{selected ? selected.label : value}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-2xl z-[70] overflow-hidden animate-fade-in">
                <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide">
                  {options.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange({ target: { name, value: opt.value } });
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                          isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 h-[44px] shadow-sm"
      >
        <span className="truncate">{selected ? selected.label : value}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-20 animate-fade-in">
            <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide space-y-0.5">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange({ target: { name, value: opt.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function Blogs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const initialFormState = {
    showType: "Inside",
    layoutType: "Left",
    title: "",
    author: "",
    adminDescription: "",
    shortDescription: "",
    fullDescription: "",
    altTag: "",
    tags: "",
    blogDate: new Date().toISOString().split("T")[0],
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    canonicalUrl: "",
    slug: "",
    status: "Published"
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) URL.revokeObjectURL(imagePreview);
      if (bannerPreview && !bannerPreview.startsWith('http')) URL.revokeObjectURL(bannerPreview);
    };
  }, [imagePreview, bannerPreview]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/blogs");
      setItems(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setBannerFile(null);
    setImagePreview(null);
    setBannerPreview(null);
    setEditingId(null);
    setView("form");
  };

  const handleEdit = (item) => {
    setFormData({
      showType: item.showType || "Inside",
      layoutType: item.layoutType || "Left",
      title: item.title || "",
      author: item.author || "",
      adminDescription: item.adminDescription || "",
      shortDescription: item.shortDescription || "",
      fullDescription: item.fullDescription || "",
      altTag: item.altTag || "",
      tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(", ") : item.tags) : "",
      blogDate: item.blogDate ? new Date(item.blogDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      metaTitle: item.metaTitle || "",
      metaKeywords: item.metaKeywords || "",
      metaDescription: item.metaDescription || "",
      canonicalUrl: item.canonicalUrl || "",
      slug: item.slug || "",
      status: item.status || "Published"
    });
    
    setImageFile(null);
    setBannerFile(null);
    setImagePreview(item.blogImage ? getImageUrl(item.blogImage) : null);
    setBannerPreview(item.bannerImage ? getImageUrl(item.bannerImage) : null);
    
    setEditingId(item._id);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete blog");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.fullDescription || !formData.author) {
      toast.error("Please fill in all required fields (Title, Author, Full Description)");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'status' && saveAsDraft) {
          formPayload.append('status', 'Draft');
        } else {
          formPayload.append(key, formData[key]);
        }
      });
      
      if (imageFile) formPayload.append("blogImage", imageFile);
      if (bannerFile) formPayload.append("bannerImage", bannerFile);

      if (editingId) {
        await api.put(`/blogs/${editingId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(saveAsDraft ? "Draft saved successfully" : "Blog updated successfully");
      } else {
        await api.post("/blogs", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(saveAsDraft ? "Draft created successfully" : "Blog published successfully");
      }
      
      setView("list");
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Table filtering and pagination
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <Loader label="Loading blogs..." />;
  }

  if (view === "form") {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "3rem" }}>
        {/* Preview Modal */}
        {showPreviewModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: "1rem" }}>
            <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "900px", maxHeight: "90vh", borderRadius: "16px", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", padding: "1rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Preview: {formData.title || "Untitled Blog"}</h2>
                <button onClick={() => setShowPreviewModal(false)} className="btn-primary">Close Preview</button>
              </div>
              <div style={{ padding: "2rem" }}>
                {bannerPreview && <img src={bannerPreview} alt="Banner" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }} />}
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>{formData.title}</h1>
                <div style={{ display: "flex", gap: "1rem", color: "#64748B", marginBottom: "2rem", fontSize: "0.875rem" }}>
                  <span>By {formData.author}</span><span>•</span>
                  <span>{new Date(formData.blogDate).toLocaleDateString()}</span>
                </div>
                {imagePreview && <img src={imagePreview} alt={formData.altTag} style={{ float: "left", width: "33%", borderRadius: "12px", marginRight: "1.5rem", marginBottom: "1rem" }} />}
                <div className="prose" dangerouslySetInnerHTML={{ __html: formData.fullDescription }} />
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setView("list")}
              style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}
            >
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {editingId ? "Edit Blog" : "Add New Blog"}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowPreviewModal(true)} className="btn-secondary">
              <Eye size={15} /> Preview
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={submitting}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", border: "1px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
              Save as Draft
            </button>
            <button onClick={(e) => handleSubmit(e, false)} disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : editingId ? "Update & Publish" : "Publish Blog"}
            </button>
          </div>
        </div>

        {/* WordPress-style 2-column layout */}
        <form style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT PANEL (main content) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Blog Title */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.625rem" }}>
                Blog Title <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your blog title here..."
                className="form-input"
                required
                style={{ fontSize: "1.125rem", fontWeight: 600, padding: "0.75rem 1rem" }}
              />
            </div>

            {/* Author + Date row */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.875rem" }}>
                Author &amp; Date
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Author Name <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Blog Date</label>
                  <input type="date" name="blogDate" value={formData.blogDate} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Blog Full Description <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.fullDescription} onChange={(val) => handleQuillChange('fullDescription', val)} style={{ minHeight: "280px" }} />
              </div>
            </div>

            {/* Short Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Blog Short Description
              </label>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.shortDescription} onChange={(val) => handleQuillChange('shortDescription', val)} style={{ minHeight: "160px" }} />
              </div>
            </div>

            {/* Admin Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Admin Description
              </label>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.adminDescription} onChange={(val) => handleQuillChange('adminDescription', val)} style={{ minHeight: "160px" }} />
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "80px" }}>

            {/* Publishing */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>Publishing</h3>
              <SidebarDropdown
                variant="horizontal"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: "Published", value: "Published" },
                  { label: "Draft", value: "Draft" }
                ]}
              />
            </div>

            {/* Media */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>Media</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Blog Image</label>
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", justifyContent: "center", alignItems: "center", height: "130px", cursor: "pointer" }}>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94A3B8" }}>
                        <ImageIcon size={26} style={{ marginBottom: "0.375rem" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Banner Image</label>
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", justifyContent: "center", alignItems: "center", height: "90px", cursor: "pointer" }}>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBannerFile, setBannerPreview)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94A3B8" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>Upload Banner</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Image Alt Tag</label>
                  <input type="text" name="altTag" value={formData.altTag} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* SEO & Taxonomy */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>SEO &amp; Taxonomy</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Tags <span style={{ color: "#94A3B8", fontWeight: 400 }}>(comma separated)</span></label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="hair loss, transplant" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Title Tag</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Keywords</label>
                  <textarea name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} rows="2" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Description</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Canonical URL</label>
                  <input type="text" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>
                    <span>URL Slug</span>
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 400 }}>Auto-generates if empty</span>
                  </label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="my-blog-post" className="form-input" />
                </div>

                {/* Show Type & Layout Type */}
                <SidebarDropdown
                  label="Show Type"
                  name="showType"
                  value={formData.showType}
                  onChange={handleChange}
                  options={[
                    { label: "Inside", value: "Inside" },
                    { label: "Outside", value: "Outside" }
                  ]}
                />
                <SidebarDropdown
                  label="Layout Type"
                  name="layoutType"
                  value={formData.layoutType}
                  onChange={handleChange}
                  options={[
                    { label: "Left", value: "Left" },
                    { label: "Right", value: "Right" }
                  ]}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Blogs</h2>
        <button onClick={handleAddNew} className="btn-primary">
          <Plus size={18} /> Create New Blog
        </button>
      </div>

      {/* Filters + Table card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} size={16} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.25rem", paddingRight: "0.875rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.875rem", width: "100%" }}
            />
          </div>
          <FilterDropdown
            label="All Statuses"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ]}
            icon={Filter}
          />
        </div>

        <Table columns={[
          { key: "image", label: "Image" },
          { key: "title", label: "Title" },
          { key: "author", label: "Author" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions", align: "right" },
        ]}>
          {currentItems.map((item) => (
            <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                {item.blogImage ? (
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "#F1F5F9" }}>
                    <img src={`${api.defaults.baseURL.replace('/api', '')}${item.blogImage}`} alt={item.altTag || "blog"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                    <ImageIcon size={18} />
                  </div>
                )}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#0F172A", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.title}>
                {item.title}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", fontSize: "0.875rem" }}>{item.author}</td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", whiteSpace: "nowrap", fontSize: "0.875rem" }}>
                {item.blogDate ? new Date(item.blogDate).toLocaleDateString() : "—"}
              </td>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: item.status === "Published" ? "#D1FAE5" : "#FEF3C7", color: item.status === "Published" ? "#065F46" : "#92400E" }}>
                  {item.status || "Published"}
                </span>
              </td>
              <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(item)} title="Edit"
                    style={{ padding: "0.375rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2E8F0", cursor: "pointer", color: "#475569", display: "flex" }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} title="Delete"
                    style={{ padding: "0.375rem", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", cursor: "pointer", color: "#DC2626", display: "flex" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>
                No blogs found matching your criteria.
              </td>
            </tr>
          )}
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748B" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid", borderColor: currentPage === i + 1 ? "#2563EB" : "#E2E8F0", background: currentPage === i + 1 ? "#2563EB" : "#FFFFFF", color: currentPage === i + 1 ? "#FFFFFF" : "#475569", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;




