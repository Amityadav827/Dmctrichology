import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Shield, Check, Lock, X, Info } from "lucide-react";
import Loader from "../components/Loader";
import { createRole, deleteRole, getRoles, updateRole } from "../api/services";

const permissionOptions = [
  { label: "Dashboard", value: "dashboard" },
  { label: "SEO", value: "seo" },
  { label: "Services", value: "services" },
  { label: "Result", value: "result" },
  { label: "Video", value: "video" },
  { label: "Gallery", value: "gallery" },
  { label: "Testimonial", value: "testimonial" },
  { label: "Blog", value: "blog" },
  { label: "Users", value: "users" },
];

const initialForm = {
  name: "",
  permissions: [],
};

function RoleList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setItems(response.data);
    } catch (error) {
      toast.error("Unable to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      permissions: item.permissions || [],
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
        await updateRole(editingItem._id, form);
        toast.success("Role updated");
      } else {
        await createRole(form);
        toast.success("Role created");
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
    if (!window.confirm("Delete this role? This will affect all assigned users.")) return;
    setActionId(id);
    try {
      await deleteRole(id);
      toast.success("Role deleted");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const togglePermission = (value) => {
    setForm(prev => {
      const permissions = prev.permissions.includes(value)
        ? prev.permissions.filter(p => p !== value)
        : [...prev.permissions, value];
      return { ...prev, permissions };
    });
  };

  if (loading) return <Loader label="Analyzing role permissions..." />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Roles & Permissions</h3>
          <p className="text-sm text-slate-500 mt-1">Define access levels and system capabilities for users</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          <span>Create Role</span>
        </button>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((role) => (
          <div 
            key={role._id} 
            className="group bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Icon Decor */}
            <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Shield size={160} />
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Shield size={24} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(role)}
                  className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition"
                >
                  <Edit2 size={18} />
                </button>
                {role.name !== 'admin' && (
                  <button
                    onClick={() => handleDelete(role._id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight relative z-10">
              {role.name}
            </h4>
            
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {role.permissions?.length || 0} Modules Enabled
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 relative z-10">
              {(role.permissions || []).slice(0, 4).map(p => (
                <span key={p} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {p}
                </span>
              ))}
              {(role.permissions?.length || 0) > 4 && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  +{(role.permissions.length - 4)} More
                </span>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check size={14} />
                Active
              </div>
              {role.name === 'admin' && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Lock size={12} />
                  System Role
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h4 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Role Access" : "Create New Role"}
              </h4>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Content Manager"
                  required
                  disabled={editingItem?.name === 'admin'}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Module Permissions</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {form.permissions.length} Selected
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {permissionOptions.map((opt) => (
                    <div 
                      key={opt.value}
                      onClick={() => togglePermission(opt.value)}
                      className={`cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                        form.permissions.includes(opt.value) 
                          ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-50' 
                          : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className={`text-xs font-bold tracking-tight ${
                        form.permissions.includes(opt.value) ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {opt.label}
                      </span>
                      {form.permissions.includes(opt.value) && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                <Info size={20} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Roles define what modules a user can see and interact with. Be careful when removing permissions from active roles.
                </p>
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
                  {saving ? "Saving..." : editingItem ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleList;
