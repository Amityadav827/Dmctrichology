import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, Filter, X, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import Loader from "../components/Loader";
import {
  createResultCategory,
  deleteResultCategory,
  getResultCategories,
  toggleResultCategoryStatus,
  updateResultCategory,
  updateResultCategoryOrder,
} from "../api/services";

const initialForm = {
  name: "",
  description: "",
  order: 0,
  status: "active",
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

function ResultCategory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Fetch all for local filtering as per premium SaaS standard for categories
      const response = await getResultCategories({ page: 1, limit: 1000 });
      setItems(response.data);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load result categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
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
    setSaving(true);
    try {
      if (editingItem) {
        await updateResultCategory(editingItem._id, form);
        toast.success("Result category updated");
      } else {
        await createResultCategory(form);
        toast.success("Result category created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save result category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result category permanently?")) return;
    setActionId(id);
    try {
      await deleteResultCategory(id);
      toast.success("Result category deleted");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleResultCategoryStatus(id);
      toast.success("Status updated");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
      ));
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setActionId("");
    }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateResultCategoryOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order updated");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, order: Number(orderMap[id]) } : item
      ));
    } catch (error) {
      toast.error("Order update failed");
    } finally {
      setOrderSavingId("");
    }
  };

  if (loading) return <Loader label="Curating categories..." />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Result Categories</h3>
          <p className="text-sm text-slate-500 mt-1">Manage and organize result sections for before-after display</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <CustomDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Status", value: "" },
              { label: "Active Only", value: "active" },
              { label: "Inactive Only", value: "inactive" }
            ]}
            placeholder="All Status"
            icon={Filter}
          />
        </div>
      </div>

      {/* List Table Card */}
      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">
                    No result categories found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">{item.description || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={orderMap[item._id] ?? item.order}
                          onChange={(e) => setOrderMap({ ...orderMap, [item._id]: e.target.value })}
                          className="w-16 px-2 py-1 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                        <button
                          onClick={() => handleOrderSave(item._id)}
                          disabled={orderSavingId === item._id}
                          className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => handleToggle(item._id)}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                          item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                          item.status === 'active' ? 'right-1' : 'left-1'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Category" : "New Category"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Hair Transplant"
                  required
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-input"
                  placeholder="Enter a brief description..."
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
              <div className="flex gap-3 pt-2">
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
                  {saving ? "Saving..." : editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultCategory;
