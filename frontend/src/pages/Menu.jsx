import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { 
  Plus, Edit2, Trash2, Search, X, 
  Menu as MenuIcon, ChevronRight, Layout, 
  Eye, EyeOff, CheckCircle, Move, 
  ArrowUp, ArrowDown, ExternalLink
} from "lucide-react";
import Loader from "../components/Loader";
import {
  createMenu,
  deleteMenu,
  getMenus,
  toggleMenuStatus,
  updateMenu,
  updateMenuOrder,
} from "../api/services";

const initialForm = {
  name: "",
  url: "",
  order: 0,
  status: "active",
};

function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  // Filters
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getMenus();
      // Sort by order ascending
      const sorted = (response.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sorted);
    } catch (error) {
      toast.error("Unable to load navigation menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...initialForm, order: items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 0 });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      url: item.url,
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
        await updateMenu(editingItem._id, form);
        toast.success("Menu item updated");
      } else {
        await createMenu(form);
        toast.success("New menu item created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save menu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this menu item?")) return;
    setActionId(id);
    try {
      await deleteMenu(id);
      toast.success("Menu item removed");
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
      await toggleMenuStatus(id);
      toast.success("Visibility updated");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
      ));
    } catch (error) {
      toast.error("Toggle failed");
    } finally {
      setActionId("");
    }
  };

  const handleMove = async (item, direction) => {
    const currentIndex = items.findIndex(i => i._id === item._id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === items.length - 1) return;

    const neighborIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const neighbor = items[neighborIndex];

    setOrderSavingId(item._id);
    try {
      // Swap orders
      await Promise.all([
        updateMenuOrder(item._id, { order: neighbor.order }),
        updateMenuOrder(neighbor._id, { order: item.order })
      ]);
      
      toast.success("Menu reordered");
      fetchItems();
    } catch (error) {
      toast.error("Failed to reorder");
    } finally {
      setOrderSavingId("");
    }
  };

  if (loading) return <Loader label="Building navigation structure..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Menu Builder</h3>
          <p className="text-sm text-slate-500 mt-1">Design and organize your dashboard navigation links</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative md:col-span-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter menu items by name or path..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
          />
        </div>
      </div>

      {/* Menu Tree / List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-20 rounded-[32px] border border-slate-100 border-dashed text-center">
            <MenuIcon size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 italic">No menu items configured yet</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div 
              key={item._id}
              className={`group bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center gap-4 ${
                item.status === 'inactive' ? 'opacity-60' : ''
              }`}
            >
              {/* Drag Handle Decoration */}
              <div className="flex flex-col gap-1 text-slate-300 group-hover:text-blue-200 transition-colors">
                <Move size={20} />
              </div>

              {/* Order Controls */}
              <div className="flex flex-col gap-1 pr-4 border-r border-slate-50">
                <button 
                  onClick={() => handleMove(item, 'up')}
                  disabled={index === 0 || orderSavingId === item._id}
                  className="p-1 rounded-md hover:bg-slate-50 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition"
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  onClick={() => handleMove(item, 'down')}
                  disabled={index === filteredItems.length - 1 || orderSavingId === item._id}
                  className="p-1 rounded-md hover:bg-slate-50 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              {/* Icon & Info */}
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Layout size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  {item.status === 'inactive' && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Hidden</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <ExternalLink size={10} />
                  {item.url}
                </div>
              </div>

              {/* Quick Status Toggle */}
              <button 
                onClick={() => handleToggle(item._id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}
              >
                {item.status === 'active' ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.status}</span>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 pl-4 border-l border-slate-50">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={actionId === item._id}
                  className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Configure Menu Item" : "New Menu Item"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Testimonials"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Navigation Route / URL</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">/</div>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="form-input pl-7"
                    placeholder="testimonials"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Initial Visibility</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
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
                  {saving ? "Saving..." : editingItem ? "Update Item" : "Add to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
