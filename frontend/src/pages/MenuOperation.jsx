import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Layout, Settings, X, Save, ArrowRight, Layers, Link } from "lucide-react";
import Loader from "../components/Loader";
import {
  createMenuOperation,
  deleteMenuOperation,
  getMenuOperations,
  getMenus,
  getOperations,
  updateMenuOperation,
} from "../api/services";

const initialForm = {
  menuId: "",
  operationId: "",
};

function MenuOperation() {
  const [menus, setMenus] = useState([]);
  const [operations, setOperations] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [menusRes, operationsRes, mappingsRes] = await Promise.all([
        getMenus(),
        getOperations(),
        getMenuOperations(),
      ]);
      setMenus(menusRes.data);
      setOperations(operationsRes.data);
      setItems(mappingsRes.data);
    } catch (error) {
      toast.error("Unable to load access mappings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      menuId: menus[0]?._id || "",
      operationId: operations[0]?._id || "",
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
        await updateMenuOperation(editingItem._id, form);
        toast.success("Mapping updated");
      } else {
        await createMenuOperation(form);
        toast.success("Operation mapped to menu");
      }
      closeModal();
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save mapping");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this mapping?")) return;
    setActionId(id);
    try {
      await deleteMenuOperation(id);
      toast.success("Mapping removed");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleInlineUpdate = async (id, menuId, operationId) => {
    setActionId(id);
    try {
      await updateMenuOperation(id, { menuId, operationId });
      toast.success("Assignment updated");
      // Update local state instead of refetching all
      setItems(prev => prev.map(item => 
        item._id === id ? { 
          ...item, 
          menuId: menus.find(m => m._id === menuId), 
          operationId: operations.find(o => o._id === operationId) 
        } : item
      ));
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setActionId("");
    }
  };

  if (loading) return <Loader label="Mapping menu access logic..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Menu Access Mapping</h3>
          <p className="text-sm text-slate-500 mt-1">Bind system operations to specific navigation menus</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Mapping Grid */}
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Menu Module</th>
                <th className="px-6 py-4 text-center w-20"></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Allowed Operation</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No access mappings defined</td>
                </tr>
              ) : (
                items.map((item) => (
                  <MenuOperationRow 
                    key={item._id} 
                    item={item} 
                    menus={menus} 
                    operations={operations}
                    onUpdate={handleInlineUpdate}
                    onDelete={handleDelete}
                    isUpdating={actionId === item._id}
                  />
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
              <h4 className="text-xl font-bold text-slate-900">Create Access Mapping</h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 mb-2">
                <Link size={18} className="text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 font-medium">
                  Select a menu item and the specific operation (action) you want to enable for it.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Menu Item</label>
                <div className="relative">
                  <Layout size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.menuId}
                    onChange={(e) => setForm({ ...form, menuId: e.target.value })}
                    className="form-input pl-11"
                    required
                  >
                    <option value="">Select Menu...</option>
                    {menus.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Assign Operation</label>
                <div className="relative">
                  <Settings size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.operationId}
                    onChange={(e) => setForm({ ...form, operationId: e.target.value })}
                    className="form-input pl-11"
                    required
                  >
                    <option value="">Select Operation...</option>
                    {operations.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
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
                  {saving ? "Mapping..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuOperationRow({ item, menus, operations, onUpdate, onDelete, isUpdating }) {
  const [selectedMenu, setSelectedMenu] = useState(item.menuId?._id || "");
  const [selectedOp, setSelectedOp] = useState(item.operationId?._id || "");

  const hasChanges = selectedMenu !== (item.menuId?._id || "") || selectedOp !== (item.operationId?._id || "");

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <select 
          value={selectedMenu}
          onChange={(e) => setSelectedMenu(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-900 border-none focus:ring-0 cursor-pointer p-0 w-full"
        >
          {menus.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
          <Link size={10} />
          Navigation Parent
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <ArrowRight size={18} className="text-slate-200 mx-auto" />
      </td>
      <td className="px-6 py-4">
        <select 
          value={selectedOp}
          onChange={(e) => setSelectedOp(e.target.value)}
          className="bg-transparent text-sm font-bold text-blue-600 border-none focus:ring-0 cursor-pointer p-0 w-full"
        >
          {operations.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
        </select>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
          <Settings size={10} />
          System Capability
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {hasChanges && (
            <button
              onClick={() => onUpdate(item._id, selectedMenu, selectedOp)}
              disabled={isUpdating}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition border border-emerald-100 animate-in fade-in zoom-in"
            >
              <Save size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(item._id)}
            disabled={isUpdating}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default MenuOperation;
