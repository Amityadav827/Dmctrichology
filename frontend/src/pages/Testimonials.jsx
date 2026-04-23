import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { 
  Plus, Edit2, Trash2, Search, Star, MessageSquare, 
  ExternalLink, User, Filter, X, ChevronRight,
  MoreVertical, CheckCircle, XCircle, ChevronDown, Check,
  Star as StarIcon
} from "lucide-react";
import Loader from "../components/Loader";
import StarRating from "../components/StarRating";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  toggleTestimonialStatus,
  updateTestimonial,
} from "../api/services";

const initialForm = {
  showType: "Inside",
  serviceName: "",
  source: "manual",
  name: "",
  shortName: "",
  designation: "",
  message: "",
  rating: 5,
  status: "active",
};

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const sourceOptions = [
  { label: "All Sources", value: "" },
  { label: "Google", value: "google" },
  { label: "Practo", value: "practo" },
  { label: "Manual", value: "manual" },
];

const ratingOptions = [
  { label: "All Ratings", value: "" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

const statusOptionsFilter = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CustomDropdown = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 outline-none hover:bg-white hover:border-slate-200 transition-all duration-200 cursor-pointer h-[46px]"
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={16} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selectedOption ? selectedOption.label : label}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-full mt-2 w-full min-w-[180px] bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in">
            <div className="p-1.5 space-y-0.5">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={14} className="text-blue-600" />}
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

function Testimonials() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [view, setView] = useState("list"); // "list" or "form"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  // Filters
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getTestimonials({
        page,
        limit: pagination.limit,
        search,
        source: filterSource || undefined,
        rating: filterRating || undefined,
        status: filterStatus || undefined,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filterSource, filterRating, filterStatus]);

  const handleAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setView("form");
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      showType: item.showType || "Inside",
      serviceName: item.serviceName || "",
      source: item.source || "manual",
      name: item.name || "",
      shortName: item.shortName || "",
      designation: item.designation || "",
      message: item.message || "",
      rating: item.rating || 5,
      status: item.status || "active",
    });
    setView("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message || !form.rating) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(form);
        toast.success("Testimonial created");
      }
      setView("list");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial permanently?")) return;
    setActionId(id);
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleTestimonialStatus(id);
      toast.success("Status updated");
      setItems(items.map(item => 
        item._id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
      ));
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setActionId("");
    }
  };

  const getAvatarColor = (name) => {
    if (!name) return '#3B82F6';
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (view === "form") {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView("list")}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {editingId ? "Edit Testimonial" : "Create Testimonial"}
              </h3>
              <p className="text-sm text-slate-500">
                {editingId ? "Modify existing customer feedback" : "Add a new customer review to the system"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Review Content</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Short Name / Nickname</label>
                  <input
                    type="text"
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Rahul"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Designation / Role</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Verified Customer / Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Testimonial Message</label>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <ReactQuill
                    theme="snow"
                    value={form.message}
                    onChange={(val) => setForm({ ...form, message: val })}
                    modules={quillModules}
                    placeholder="Write the customer's testimonial here..."
                    className="h-64 mb-12"
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-[10px] text-slate-400 font-medium">Rich text formatting enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-6">
            <div className="card-glass p-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Status & Source</h4>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Show Type</label>
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showType: "Inside" })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      form.showType === "Inside" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Inside
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showType: "Outside" })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      form.showType === "Outside" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Outside
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Service Name</label>
                <input
                  type="text"
                  value={form.serviceName}
                  onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Hair Transplant"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Review Source</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="form-input"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="google">Google Review</option>
                  <option value="practo">Practo Review</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-slate-700">Star Rating</label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed flex justify-center">
                  <StarRating 
                    value={form.rating} 
                    interactive 
                    onChange={(rating) => setForm({ ...form, rating })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <div 
                  onClick={() => setForm({ ...form, status: form.status === 'active' ? 'inactive' : 'active' })}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                    form.status === 'active' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {form.status === 'active' ? <CheckCircle size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-slate-400" />}
                    <span className={`text-sm font-bold ${form.status === 'active' ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {form.status === 'active' ? 'Published' : 'Draft / Hidden'}
                    </span>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${form.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.status === 'active' ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Testimonials</h3>
          <p className="text-sm text-slate-500 mt-1">Manage and curate your customer success stories</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
        <CustomDropdown
          label="All Sources"
          value={filterSource}
          options={sourceOptions}
          onChange={setFilterSource}
          icon={Filter}
        />
        <CustomDropdown
          label="All Ratings"
          value={filterRating}
          options={ratingOptions}
          onChange={setFilterRating}
          icon={StarIcon}
        />
        <CustomDropdown
          label="All Status"
          value={filterStatus}
          options={statusOptionsFilter}
          onChange={setFilterStatus}
          icon={CheckCircle}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 card-glass">
          <Loader />
          <p className="text-slate-500 font-medium mt-4">Curating testimonials...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 card-glass border-dashed border-2">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-slate-300" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">No testimonials found</h4>
          <p className="text-slate-500 text-sm max-w-xs text-center mt-2">
            We couldn't find any reviews matching your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="group bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                {/* Profile Section */}
                <div className="flex items-start gap-4 lg:w-64 flex-shrink-0">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-inner"
                    style={{ backgroundColor: getAvatarColor(item.name) }}
                  >
                    {getInitials(item.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium truncate mb-2">{item.designation || "Customer"}</p>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      item.source === 'google' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      item.source === 'practo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {item.source}
                    </div>
                    {item.serviceName && (
                      <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {item.serviceName}
                      </div>
                    )}
                    <div className="h-1 w-1 rounded-full bg-slate-300 mx-1"></div>
                    <StarRating value={item.rating} />
                  </div>
                  <div 
                    className="text-sm text-slate-600 leading-relaxed line-clamp-2 italic"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </div>

                {/* Actions Section */}
                <div className="flex lg:flex-col items-center justify-end gap-2 lg:w-32 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(item._id)}
                    disabled={actionId === item._id}
                    className={`flex-1 lg:w-full py-2 px-4 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-2 ${
                      item.status === 'active' 
                        ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {item.status === 'active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    {item.status === 'active' ? 'Hide' : 'Publish'}
                  </button>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={actionId === item._id}
                      className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center border border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 px-6 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Page {pagination.page} <span className="mx-2 text-slate-200">/</span> {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchItems(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => fetchItems(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonials;
