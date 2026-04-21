import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Search, Eye, Filter } from "lucide-react";
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
    setImagePreview(item.blogImage ? `${api.defaults.baseURL.replace('/api', '')}${item.blogImage}` : null);
    setBannerPreview(item.bannerImage ? `${api.defaults.baseURL.replace('/api', '')}${item.bannerImage}` : null);
    
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
      <div className="animate-fade-in space-y-6 pb-12">
        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-darkCard w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl flex flex-col relative">
              <div className="sticky top-0 bg-white/90 dark:bg-darkCard/90 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-ink dark:text-white">Preview: {formData.title || "Untitled Blog"}</h2>
                <button onClick={() => setShowPreviewModal(false)} className="btn-primary">Close Preview</button>
              </div>
              <div className="p-8">
                {bannerPreview && (
                  <img src={bannerPreview} alt="Banner" className="w-full h-64 object-cover rounded-xl mb-8" />
                )}
                <h1 className="text-4xl font-bold text-ink dark:text-white mb-4">{formData.title}</h1>
                <div className="flex items-center gap-4 text-slate-500 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <span>By {formData.author}</span>
                  <span>•</span>
                  <span>{new Date(formData.blogDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="bg-coral/10 text-coral px-2 py-1 rounded-md text-xs">{formData.showType}</span>
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt={formData.altTag} className="float-left w-1/3 rounded-xl mr-6 mb-4" />
                )}
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formData.fullDescription }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-ink dark:bg-darkCard dark:text-slate-400 dark:hover:bg-darkHover dark:hover:text-slate-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-ink dark:text-white">
              {editingId ? "Edit Blog" : "Add New Blog"}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-ink flex items-center gap-2 dark:border-slate-800 dark:bg-darkCard dark:text-slate-300 dark:hover:bg-darkHover"
            >
              <Eye size={16} /> Preview
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={submitting}
              className="rounded-xl border border-coral text-coral bg-coral/5 px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-coral/10"
            >
              Save as Draft
            </button>
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Saving..." : editingId ? "Update & Publish" : "Publish Blog"}
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-glass p-6">
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-white">Basic Information</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Author Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Date</label>
                  <input
                    type="date"
                    name="blogDate"
                    value={formData.blogDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Type</label>
                  <select
                    name="showType"
                    value={formData.showType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  >
                    <option value="Inside">Inside</option>
                    <option value="Outside">Outside</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Layout Type</label>
                  <select
                    name="layoutType"
                    value={formData.layoutType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  >
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-white">Content Details</h3>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Full Description <span className="text-red-500">*</span></label>
                  <div className="bg-white dark:bg-darkBg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <ReactQuill 
                      theme="snow" 
                      modules={modules}
                      value={formData.fullDescription} 
                      onChange={(val) => handleQuillChange('fullDescription', val)} 
                      className="h-64"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-12">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Short Description</label>
                  <div className="bg-white dark:bg-darkBg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <ReactQuill 
                      theme="snow" 
                      modules={modules}
                      value={formData.shortDescription} 
                      onChange={(val) => handleQuillChange('shortDescription', val)} 
                      className="h-32"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-12">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin Description</label>
                  <div className="bg-white dark:bg-darkBg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <ReactQuill 
                      theme="snow" 
                      modules={modules}
                      value={formData.adminDescription} 
                      onChange={(val) => handleQuillChange('adminDescription', val)} 
                      className="h-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="card-glass p-6">
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-white">Publishing</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-darkBg rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-transparent text-sm font-semibold text-ink outline-none dark:text-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-white">Media Assets</h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blog Image</label>
                  <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-darkBg dark:hover:bg-darkHover flex justify-center items-center h-40 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setImageFile, setImagePreview)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-coral transition-colors">
                        <ImageIcon size={28} className="mb-2" />
                        <span className="text-sm font-medium">Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Banner Image</label>
                  <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-darkBg dark:hover:bg-darkHover flex justify-center items-center h-28 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setBannerFile, setBannerPreview)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-coral transition-colors">
                        <span className="text-sm font-medium">Upload Banner Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image Alt Tag</label>
                  <input
                    type="text"
                    name="altTag"
                    value={formData.altTag}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>
              </div>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-white">SEO & Taxonomy</h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags (Comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="hair loss, transplant, care"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Tag</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Meta Keyword</label>
                  <textarea
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    rows="2"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  ></textarea>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Canonical URL</label>
                  <input
                    type="text"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>URL Slug</span>
                    <span className="text-xs text-slate-400 font-normal">Auto-generates if empty</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="my-awesome-blog-post"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 transition focus:border-coral focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-darkBg dark:text-slate-100 dark:focus:border-coral"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-ink dark:text-white">Blogs</h2>
        <button onClick={handleAddNew} className="btn-primary">
          <Plus size={20} />
          Create New Blog
        </button>
      </div>
      
      <div className="card-glass p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-coral text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-coral text-sm transition-colors w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <Table
          columns={[
            { key: "image", label: "Image" },
            { key: "title", label: "Title" },
            { key: "author", label: "Author" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
          ]}
        >
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td className="px-5 py-4">
                {item.blogImage ? (
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img src={`${api.defaults.baseURL.replace('/api', '')}${item.blogImage}`} alt={item.altTag || "blog"} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <ImageIcon size={20} />
                  </div>
                )}
              </td>
              <td className="px-5 py-4 font-semibold text-ink dark:text-white max-w-[200px] truncate" title={item.title}>
                {item.title}
              </td>
              <td className="px-5 py-4">{item.author}</td>
              <td className="px-5 py-4 whitespace-nowrap">
                {item.blogDate ? new Date(item.blogDate).toLocaleDateString() : "-"}
              </td>
              <td className="px-5 py-4">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                  {item.status || 'Published'}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-slate-400 transition-colors hover:text-coral dark:hover:text-primary bg-white dark:bg-darkBg rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm"
                    title="Edit Blog"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-400 transition-colors hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-darkBg rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm"
                    title="Delete Blog"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-darkBg rounded-full">
                    <Search size={24} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p>No blogs found matching your criteria.</p>
                </div>
              </td>
            </tr>
          )}
        </Table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-coral text-white' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-darkBg dark:border-slate-700 dark:text-slate-300 dark:hover:bg-darkHover'
                  }`}
                >
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
