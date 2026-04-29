import { useEffect, useState, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { 
  Plus, Edit2, Trash2, Search, Filter, X, 
  CheckCircle, ImageIcon, ChevronRight, MoreVertical, ChevronDown 
} from "lucide-react";
import Loader from "../components/Loader";
import {
  createResult,
  deleteResult,
  getResultCategories,
  getResults,
  toggleResultStatus,
  updateResult,
  updateResultOrder,
} from "../api/services";

// Helper for dynamic image URLs
const getImgUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const apiBase = (import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:10000/api" : "https://dmctrichology-1.onrender.com/api")).replace(/\/api$/, "");
  
  return `${apiBase}${normalizedPath}`;
};

const initialForm = {
  categoryId: "",
  title: "",
  order: 0,
  status: "active",
  image: null,
};

const CustomDropdown = ({ value, onChange, options, label, icon: Icon, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = () => setIsOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-[12px] text-sm font-semibold text-slate-600 outline-none hover:bg-white hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 h-[44px] shadow-sm ${isOpen ? 'bg-white border-blue-500 ring-4 ring-blue-500/10' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={18} className="text-slate-400 flex-shrink-0" />}
          <span className={`truncate ${selected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-[12px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-[100] overflow-hidden animate-fade-in">
          <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide space-y-0.5">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={isSelected ? 'font-bold' : ''}>{opt.label}</span>
                  {isSelected && <CheckCircle size={16} className="text-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function ResultInner() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef();

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await getResultCategories({ page: 1, limit: 100 });
      setCategories(response.data);
    } catch (error) {
      toast.error("Unable to load categories");
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Fetch all for client-side advanced filtering
      const response = await getResults({});
      setItems(response.data);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error("Unable to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = categoryFilter ? item.categoryId?._id === categoryFilter : true;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [items, categoryFilter, search, statusFilter]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      ...initialForm,
      categoryId: categoryFilter || (categories[0]?._id || ""),
    });
    setPreviewUrl("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      categoryId: item.categoryId?._id || "",
      title: item.title,
      order: item.order,
      status: item.status,
      image: null,
    });
    setPreviewUrl(getImgUrl(item.image));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.title) {
      toast.error("Category and Title are required");
      return;
    }
    if (!editingItem && !form.image) {
      toast.error("Please upload an image");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", form.categoryId);
      formData.append("title", form.title);
      formData.append("order", form.order);
      formData.append("status", form.status);
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      if (editingItem) {
        await updateResult(editingItem._id, formData);
        toast.success("Result updated successfully");
      } else {
        await createResult(formData);
        toast.success("Result created successfully");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save result");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result permanently?")) return;
    setActionId(id);
    try {
      await deleteResult(id);
      toast.success("Result deleted successfully");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleResultStatus(id);
      toast.success("Status updated");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
      ));
    } catch (error) {
      toast.error("Toggle failed");
    } finally {
      setActionId("");
    }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateResultOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order updated");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, order: Number(orderMap[id]) } : item
      ));
    } catch (error) {
      toast.error("Order save failed");
    } finally {
      setOrderSavingId("");
    }
  };

  if (loading) return <Loader label="Loading results..." />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Results Gallery</h3>
          <p className="text-sm text-slate-500 mt-1">Manage before-after result cards and categorization</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add New Result</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="md:col-span-1">
          <CustomDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map(c => ({ label: c.name, value: c._id }))
            ]}
            placeholder="All Categories"
            icon={Filter}
          />
        </div>
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by heading..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
        <div>
          <CustomDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Any Status", value: "" },
              { label: "Active Only", value: "active" },
              { label: "Inactive Only", value: "inactive" }
            ]}
            placeholder="Any Status"
            icon={Filter}
          />
        </div>
      </div>

      {/* Grid of Results */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[28px] border border-slate-100 border-dashed">
          <ImageIcon size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium italic">No results found for current criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item._id}
              className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img 
                  src={getImgUrl(item.image)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Result+Image+Not+Found"; 
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest shadow-sm">
                  {item.categoryId?.name || "Uncategorized"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={orderMap[item._id] ?? item.order}
                        onChange={(e) => setOrderMap({ ...orderMap, [item._id]: e.target.value })}
                        className="w-12 px-2 py-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg outline-none"
                      />
                      <button 
                        onClick={() => handleOrderSave(item._id)}
                        disabled={orderSavingId === item._id}
                        className="p-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                      >
                        <CheckCircle size={12} />
                      </button>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleToggle(item._id)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${
                      item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                      item.status === 'active' ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={actionId === item._id}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Result Card" : "Add New Result"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <CustomDropdown
                    value={form.categoryId}
                    onChange={(val) => setForm({ ...form, categoryId: val })}
                    options={categories.map(c => ({ label: c.name, value: c._id }))}
                    placeholder="Select category"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Result Heading / Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g. 6 Months After Transplant"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <CustomDropdown
                  value={form.status}
                  onChange={(val) => setForm({ ...form, status: val })}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" }
                  ]}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Image Upload</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-all overflow-hidden"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-slate-300 mb-2" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Click to upload image</span>
                    </>
                  )}
                  {previewUrl && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="text-white rotate-45" size={32} />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {saving ? "Processing..." : editingItem ? "Update Result" : "Create Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultInner;
