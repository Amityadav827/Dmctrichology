import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, Link as LinkIcon, ExternalLink, Shield, CheckCircle, XCircle, X } from "lucide-react";
import Loader from "../components/Loader";
import {
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus
} from "../api/services";

const initialForm = {
  sourceUrl: "",
  destinationUrl: "",
  type: "301",
  status: "active",
};

function RedirectList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getRedirects();
      setItems(response.data || []);
    } catch (error) {
      toast.error("Unable to load redirects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => 
      item.sourceUrl.toLowerCase().includes(search.toLowerCase()) || 
      item.destinationUrl.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      sourceUrl: item.sourceUrl,
      destinationUrl: item.destinationUrl,
      type: item.type || "301",
      status: item.status || "active",
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
    
    // Normalize sourceUrl: ensure it starts with / and remove whitespace
    let normalizedSource = form.sourceUrl.trim();
    if (normalizedSource && !normalizedSource.startsWith('/')) {
      normalizedSource = '/' + normalizedSource;
    }

    if (!normalizedSource || normalizedSource === '/') {
      toast.error("Source path cannot be empty or just /");
      return;
    }

    const payload = {
      ...form,
      sourceUrl: normalizedSource.toLowerCase()
    };
    
    setSaving(true);
    try {
      if (editingItem) {
        await updateRedirect(editingItem._id, payload);
        toast.success("Redirect updated");
      } else {
        await createRedirect(payload);
        toast.success("Redirect created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save redirect");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this redirect rule?")) return;
    setActionId(id);
    try {
      await deleteRedirect(id);
      toast.success("Redirect deleted");
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
      await toggleRedirectStatus(id);
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

  if (loading) return <Loader label="Analyzing redirect rules..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Redirect Management</h3>
          <p className="text-sm text-slate-500 mt-1">Manage 301 and 302 URL redirects for SEO health</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add Redirect</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by source or destination URL..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Routing Rule</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No redirect rules found</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <LinkIcon size={12} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 truncate max-w-xs">{item.sourceUrl}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-8">
                          <ArrowRight size={14} className="text-slate-300" />
                          <span className="text-xs font-medium text-blue-600 truncate max-w-xs">{item.destinationUrl}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        item.type === '301' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                      }`}>
                        {item.type} Permanent
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => handleToggle(item._id)}
                        className={`w-11 h-5.5 rounded-full relative cursor-pointer transition-colors duration-200 ${
                          item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                          item.status === 'active' ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={actionId === item._id}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Redirect Rule" : "Create Redirect"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Source Path (From)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">/</span>
                  <input
                    type="text"
                    value={form.sourceUrl}
                    onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                    className="form-input pl-7"
                    placeholder="old-service-page"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Relative path starting after the domain name</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Destination URL (To)</label>
                <input
                  type="text"
                  value={form.destinationUrl}
                  onChange={(e) => setForm({ ...form, destinationUrl: e.target.value })}
                  className="form-input"
                  placeholder="e.g. /new-services or https://external.com"
                  required
                />
                <p className="text-[10px] text-slate-400 font-medium">Internal path starting with / or full external URL</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Redirect Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="301">301 (Permanent)</option>
                    <option value="302">302 (Temporary)</option>
                  </select>
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
                  {saving ? "Saving..." : editingItem ? "Update Rule" : "Create Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowRight({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default RedirectList;
