import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, ChevronUp, ChevronDown, X } from "lucide-react";
import Loader from "../components/Loader";
import {
  createVideoCategory,
  deleteVideoCategory,
  getVideoCategories,
  toggleVideoCategoryStatus,
  updateVideoCategory,
  updateVideoCategoryOrder,
} from "../api/services";

const emptyForm = { name: "", description: "", order: 0, status: "active" };

export default function VideoCategory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});

  // Panel state (right side or modal)
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("order");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getVideoCategories({ page: 1, limit: 200 });
      setItems(res.data || []);
      setOrderMap((res.data || []).reduce((acc, i) => { acc[i._id] = i.order; return acc; }, {}));
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) list = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (sortBy === "order") list.sort((a, b) => a.order - b.order);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [items, search, statusFilter, sortBy]);

  const openAdd = () => { setEditingItem(null); setForm(emptyForm); setPanelOpen(true); };
  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description || "", order: item.order, status: item.status });
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setEditingItem(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Category name is required"); return; }
    setSaving(true);
    try {
      if (editingItem) {
        await updateVideoCategory(editingItem._id, form);
        toast.success("Category updated");
      } else {
        await createVideoCategory(form);
        toast.success("Category created");
      }
      closePanel();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setActionId(id);
    try {
      await deleteVideoCategory(id);
      toast.success("Category deleted");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally { setActionId(""); }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleVideoCategoryStatus(id);
      setItems(prev => prev.map(i => i._id === id ? { ...i, status: i.status === "active" ? "inactive" : "active" } : i));
      toast.success("Status updated");
    } catch (e) {
      toast.error("Status update failed");
    } finally { setActionId(""); }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateVideoCategoryOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order saved");
      fetchItems();
    } catch (e) {
      toast.error("Order update failed");
    } finally { setOrderSavingId(""); }
  };

  if (loading) return <Loader label="Loading video categories..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Video Categories</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>{filtered.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Category</button>
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: panelOpen ? "1fr 360px" : "1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT: Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Filters */}
          <div className="card" style={{ padding: "0.875rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
              <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input type="text" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: "2.25rem" }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 130 }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 140 }}>
              <option value="order">Sort: Order</option>
              <option value="name">Sort: Name</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                  {["Category Name", "Description", "Order", "Status", "Actions"].map(col => (
                    <th key={col} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>No categories found.</td></tr>
                ) : filtered.map(item => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#0F172A" }}>{item.name}</td>
                    <td style={{ padding: "0.875rem 1.25rem", color: "#64748B", fontSize: "0.85rem", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description || "—"}</td>
                    <td style={{ padding: "0.875rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <input type="number" value={orderMap[item._id] ?? item.order}
                          onChange={e => setOrderMap(prev => ({ ...prev, [item._id]: e.target.value }))}
                          style={{ width: 60, padding: "0.3rem 0.5rem", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: "0.825rem", textAlign: "center" }} />
                        <button onClick={() => handleOrderSave(item._id)} disabled={orderSavingId === item._id}
                          style={{ padding: "0.3rem 0.6rem", borderRadius: 6, background: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>
                          {orderSavingId === item._id ? "…" : "Set"}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "0.875rem 1.25rem" }}>
                      <button onClick={() => handleToggle(item._id)} disabled={actionId === item._id}
                        style={{ padding: "0.2rem 0.6rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", border: "none", background: item.status === "active" ? "#D1FAE5" : "#FEF3C7", color: item.status === "active" ? "#065F46" : "#92400E" }}>
                        {actionId === item._id ? "…" : item.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td style={{ padding: "0.875rem 1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => openEdit(item)} style={{ padding: "0.375rem", borderRadius: 6, background: "#FFFFFF", border: "1px solid #E2E8F0", cursor: "pointer", color: "#2563EB", display: "flex" }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item._id)} disabled={actionId === item._id} style={{ padding: "0.375rem", borderRadius: 6, background: "#FEF2F2", border: "1px solid #FECACA", cursor: "pointer", color: "#DC2626", display: "flex" }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Add/Edit Panel */}
        {panelOpen && (
          <div style={{ position: "sticky", top: 80 }}>
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  {editingItem ? "Edit Category" : "New Category"}
                </h3>
                <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="form-label">Category Name <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" placeholder="e.g. Hair Transplant Videos" required />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" placeholder="Optional description" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">Order</label>
                    <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} className="form-input" min={0} />
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="form-input">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.625rem", paddingTop: "0.5rem" }}>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1 }}>
                    {saving ? "Saving…" : editingItem ? "Update Category" : "Create Category"}
                  </button>
                  <button type="button" onClick={closePanel} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
