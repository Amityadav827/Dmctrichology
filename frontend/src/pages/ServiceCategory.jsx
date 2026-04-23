import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, Filter, X, CheckCircle, XCircle, ChevronDown, Check } from "lucide-react";
import Loader from "../components/Loader";
import {
  createServiceCategory,
  deleteServiceCategory,
  getServiceCategories,
  toggleServiceCategoryStatus,
  updateServiceCategory,
  updateServiceCategoryOrder,
} from "../api/services";

const initialForm = {
  name: "",
  slug: "",
  order: 0,
  status: "active",
};

const FilterDropdown = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex items-center justify-between gap-2.5 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:bg-white hover:border-slate-200 transition-all duration-300 cursor-pointer h-[46px] shadow-sm"
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={16} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : label}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-full mt-2 w-full min-w-[160px] bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
            <div className="p-1.5 max-h-[200px] overflow-y-auto scrollbar-hide space-y-0.5">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                  value === "" 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{label}</span>
                {value === "" && <Check size={14} />}
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

function ServiceCategory() {
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
      const response = await getServiceCategories({ page: 1, limit: 1000 });
      setItems(response.data);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.slug.toLowerCase().includes(search.toLowerCase());
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
      slug: item.slug,
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
        await updateServiceCategory(editingItem._id, form);
        toast.success("Category updated");
      } else {
        await createServiceCategory(form);
        toast.success("Category created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category permanently?")) return;
    setActionId(id);
    try {
      await deleteServiceCategory(id);
      toast.success("Category deleted");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleServiceCategoryStatus(id);
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
      await updateServiceCategoryOrder(id, { order: Number(orderMap[id]) });
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

  if (loading) return <Loader label="Loading categories..." />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Service Categories</h3>
          <p className="text-sm text-slate-500 mt-1">Manage primary service categories and hierarchies</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
        <FilterDropdown
          label="All Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          icon={Filter}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Category Detail</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Display Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No categories found</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{item.slug}</div>
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

      {/* Modal */}
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
                  placeholder="e.g. Hair Care"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="form-input"
                  placeholder="e.g. hair-care"
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

export default ServiceCategory;
