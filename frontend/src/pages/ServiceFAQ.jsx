import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { 
  Plus, Edit2, Trash2, Search, Filter, X, 
  ChevronDown, ChevronUp, CheckCircle, HelpCircle,
  Layers, Tag
} from "lucide-react";
import Loader from "../components/Loader";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createServiceFaq,
  deleteServiceFaq,
  getSecondCategories,
  getServiceCategories,
  getServiceFaqs,
  toggleServiceFaqStatus,
  updateServiceFaq,
} from "../api/services";

const initialForm = {
  serviceId: "",
  question: "",
  answer: "",
  order: 0,
  status: "active",
};

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

function ServiceFAQ() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [expandedId, setExpandedId] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [search, setSearch] = useState("");

  // Form Specific
  const [modalCategory, setModalCategory] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, subsRes, faqsRes] = await Promise.all([
        getServiceCategories({ page: 1, limit: 100 }),
        getSecondCategories(),
        getServiceFaqs({}),
      ]);
      setCategories(catsRes.data);
      setServices(subsRes.data);
      setFaqs(faqsRes.data);
    } catch (error) {
      toast.error("Unable to load FAQ data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = useMemo(() => {
    if (!categoryFilter) return services;
    return services.filter(s => s.categoryId?._id === categoryFilter);
  }, [services, categoryFilter]);

  const modalServices = useMemo(() => {
    if (!modalCategory) return services;
    return services.filter(s => s.categoryId?._id === modalCategory);
  }, [services, modalCategory]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = categoryFilter ? faq.serviceId?.categoryId?._id === categoryFilter : true;
      const matchesService = serviceFilter ? faq.serviceId?._id === serviceFilter : true;
      const matchesSearch = 
        faq.question.toLowerCase().includes(search.toLowerCase()) || 
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesService && matchesSearch;
    });
  }, [faqs, categoryFilter, serviceFilter, search]);

  const openAddModal = () => {
    setEditingItem(null);
    setModalCategory(categoryFilter || "");
    setForm({ 
      ...initialForm, 
      serviceId: serviceFilter || "" 
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalCategory(item.serviceId?.categoryId?._id || "");
    setForm({
      serviceId: item.serviceId?._id || "",
      question: item.question,
      answer: item.answer,
      order: item.order,
      status: item.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.question || !form.answer) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await updateServiceFaq(editingItem._id, form);
        toast.success("FAQ updated successfully");
      } else {
        await createServiceFaq(form);
        toast.success("FAQ created successfully");
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ permanently?")) return;
    setActionId(id);
    try {
      await deleteServiceFaq(id);
      toast.success("FAQ deleted");
      setFaqs(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleServiceFaqStatus(id);
      toast.success("Status updated");
      setFaqs(prev => prev.map(faq => 
        faq._id === id ? { ...faq, status: faq.status === 'active' ? 'inactive' : 'active' } : faq
      ));
    } catch (error) {
      toast.error("Toggle failed");
    } finally {
      setActionId("");
    }
  };

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <Loader label="Curating FAQ content..." />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Service FAQs</h3>
          <p className="text-sm text-slate-500 mt-1">Manage frequently asked questions for specific services</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <select 
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setServiceFilter("");
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 outline-none focus:bg-white transition"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <select 
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 outline-none focus:bg-white transition"
          >
            <option value="">All Services</option>
            {filteredServices.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in questions or answers..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-20 rounded-[28px] border border-slate-100 border-dashed text-center">
            <HelpCircle size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 italic">No FAQs found matching your filters</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div 
              key={faq._id}
              className={`bg-white rounded-[24px] border transition-all duration-200 overflow-hidden ${
                expandedId === faq._id ? 'border-blue-200 shadow-lg shadow-blue-50' : 'border-slate-100 shadow-sm'
              }`}
            >
              <div 
                onClick={() => toggleAccordion(faq._id)}
                className="p-5 flex items-start justify-between cursor-pointer group hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      <Tag size={10} />
                      {faq.serviceId?.categoryId?.name || "Main Category"}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      <Layers size={10} />
                      {faq.serviceId?.name || "Service"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 ml-auto uppercase tracking-widest">Order: {faq.order}</span>
                  </div>
                  <h4 className={`text-base font-bold transition-colors ${expandedId === faq._id ? 'text-blue-600' : 'text-slate-900'}`}>
                    {faq.question}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  {expandedId === faq._id ? <ChevronUp size={20} className="text-blue-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === faq._id && (
                <div className="p-5 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
                  <div 
                    className="text-sm text-slate-600 leading-relaxed mb-6 prose max-w-none prose-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(faq._id);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                        faq.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {faq.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span className="text-xs font-bold uppercase tracking-widest">{faq.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(faq);
                        }}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(faq._id);
                        }}
                        disabled={actionId === faq._id}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit FAQ" : "Add Service FAQ"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Service Category</label>
                  <select
                    value={modalCategory}
                    onChange={(e) => {
                      setModalCategory(e.target.value);
                      setForm({ ...form, serviceId: "" });
                    }}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Service</label>
                  <select
                    value={form.serviceId}
                    onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Choose Service...</option>
                    {modalServices.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Question</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="form-input"
                  placeholder="e.g. How long does the procedure take?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Answer</label>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <ReactQuill 
                    theme="snow"
                    value={form.answer}
                    onChange={(val) => setForm({ ...form, answer: val })}
                    modules={quillModules}
                    className="h-48 mb-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-50">
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
                  {saving ? "Saving..." : editingItem ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceFAQ;
