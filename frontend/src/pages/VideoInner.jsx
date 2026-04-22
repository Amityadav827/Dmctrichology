import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Play, X, Image as ImageIcon } from "lucide-react";
import Loader from "../components/Loader";
import {
  createVideo,
  deleteVideo,
  getVideoCategories,
  getVideos,
  toggleVideoStatus,
  updateVideo,
  updateVideoOrder,
} from "../api/services";

const getImgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "");
  return `${base}${path}`;
};

// Extract YouTube video ID for auto-thumbnail
const getYtId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m ? m[1] : null;
};

const emptyForm = { categoryId: "", title: "", videoUrl: "", order: 0, status: "active", thumbnail: null };

export default function VideoInner() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form panel
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbPreview, setThumbPreview] = useState("");
  const fileRef = useRef();

  // Preview modal
  const [previewVideo, setPreviewVideo] = useState(null); // { url, title }

  const fetchCategories = async () => {
    try {
      const res = await getVideoCategories({ page: 1, limit: 200 });
      setCategories(res.data || []);
    } catch (e) { toast.error("Unable to load categories"); }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = categoryFilter ? { categoryId: categoryFilter } : {};
      const res = await getVideos(params);
      setItems(res.data || []);
      setOrderMap((res.data || []).reduce((acc, i) => { acc[i._id] = i.order; return acc; }, {}));
    } catch (e) {
      toast.error("Unable to load videos");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchVideos(); }, [categoryFilter]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter(i => i.status === statusFilter);
  }, [items, statusFilter]);

  // ── Panel handlers ────────────────────────────────────
  const openAdd = () => {
    setEditingItem(null);
    setForm({ ...emptyForm, categoryId: categoryFilter || categories[0]?._id || "" });
    setThumbPreview("");
    setPanelOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ categoryId: item.categoryId?._id || "", title: item.title, videoUrl: item.videoUrl, order: item.order, status: item.status, thumbnail: null });
    setThumbPreview(getImgUrl(item.thumbnail));
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setEditingItem(null); setForm(emptyForm); setThumbPreview(""); };

  // Auto-generate YT thumbnail when URL changes
  const handleVideoUrlChange = (url) => {
    setForm(p => ({ ...p, videoUrl: url }));
    const ytId = getYtId(url);
    if (ytId && !thumbPreview) {
      setThumbPreview(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
    }
  };

  const handleThumbFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Image files only"); return; }
    setForm(p => ({ ...p, thumbnail: file }));
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.title.trim() || !form.videoUrl.trim()) {
      toast.error("Category, title, and video URL are required");
      return;
    }
    if (!editingItem && !form.thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("categoryId", form.categoryId);
      fd.append("title", form.title);
      fd.append("videoUrl", form.videoUrl);
      fd.append("order", form.order);
      fd.append("status", form.status);
      if (form.thumbnail instanceof File) fd.append("thumbnail", form.thumbnail);

      if (editingItem) {
        await updateVideo(editingItem._id, fd);
        toast.success("Video updated");
      } else {
        await createVideo(fd);
        toast.success("Video added");
      }
      closePanel();
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    setActionId(id);
    try {
      await deleteVideo(id);
      toast.success("Video deleted");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e) { toast.error("Delete failed"); } finally { setActionId(""); }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleVideoStatus(id);
      setItems(prev => prev.map(i => i._id === id ? { ...i, status: i.status === "active" ? "inactive" : "active" } : i));
      toast.success("Status updated");
    } catch (e) { toast.error("Status update failed"); } finally { setActionId(""); }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateVideoOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order saved");
      fetchVideos();
    } catch (e) { toast.error("Order update failed"); } finally { setOrderSavingId(""); }
  };

  if (loading) return <Loader label="Loading videos..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div onClick={() => setPreviewVideo(null)} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <button onClick={() => setPreviewVideo(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={18} /></button>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 900, background: "#000", borderRadius: 12, overflow: "hidden" }}>
            <p style={{ color: "#fff", padding: "0.75rem 1rem", margin: 0, fontSize: "0.9rem", fontWeight: 600, background: "rgba(255,255,255,0.08)" }}>{previewVideo.title}</p>
            {getYtId(previewVideo.url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYtId(previewVideo.url)}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
              />
            ) : (
              <video src={previewVideo.url} controls autoPlay style={{ width: "100%", aspectRatio: "16/9", background: "#000" }} />
            )}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Video List</h2>
          <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>{filtered.length} video{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Video</button>
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: panelOpen ? "1fr 380px" : "1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT: Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Filters */}
          <div className="card" style={{ padding: "0.875rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 180 }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 130 }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                  {["Thumbnail", "Title", "Category", "Order", "Status", "Actions"].map(col => (
                    <th key={col} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>No videos found.</td></tr>
                ) : filtered.map(item => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    {/* Thumbnail */}
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <div onClick={() => setPreviewVideo({ url: item.videoUrl, title: item.title })}
                        style={{ position: "relative", width: 80, height: 52, borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#0F172A" }}>
                        {item.thumbnail ? (
                          <img src={getImgUrl(item.thumbnail)} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={20} color="#475569" /></div>
                        )}
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Play size={12} fill="#0F172A" color="#0F172A" style={{ marginLeft: 2 }} />
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Title */}
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "0.875rem" }}>{item.title}</div>
                      <a href={item.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#2563EB", textDecoration: "none" }}>Open link ↗</a>
                    </td>
                    {/* Category */}
                    <td style={{ padding: "0.75rem 1.25rem", color: "#64748B", fontSize: "0.85rem" }}>{item.categoryId?.name || "—"}</td>
                    {/* Order */}
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <input type="number" value={orderMap[item._id] ?? item.order}
                          onChange={e => setOrderMap(prev => ({ ...prev, [item._id]: e.target.value }))}
                          style={{ width: 56, padding: "0.3rem 0.5rem", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: "0.825rem", textAlign: "center" }} />
                        <button onClick={() => handleOrderSave(item._id)} disabled={orderSavingId === item._id}
                          style={{ padding: "0.3rem 0.6rem", borderRadius: 6, background: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: "#475569" }}>
                          {orderSavingId === item._id ? "…" : "Set"}
                        </button>
                      </div>
                    </td>
                    {/* Status */}
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <button onClick={() => handleToggle(item._id)} disabled={actionId === item._id}
                        style={{ padding: "0.2rem 0.6rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", border: "none", background: item.status === "active" ? "#D1FAE5" : "#FEF3C7", color: item.status === "active" ? "#065F46" : "#92400E" }}>
                        {actionId === item._id ? "…" : item.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "0.75rem 1.25rem" }}>
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
                  {editingItem ? "Edit Video" : "Add Video"}
                </h3>
                <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <label className="form-label">Category <span style={{ color: "#EF4444" }}>*</span></label>
                  <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} className="form-input" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Video Title <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="form-input" placeholder="e.g. Hair Transplant Overview" required />
                </div>
                <div>
                  <label className="form-label">Video URL <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="url" value={form.videoUrl} onChange={e => handleVideoUrlChange(e.target.value)} className="form-input" placeholder="YouTube or hosted video URL" required />
                  {getYtId(form.videoUrl) && <p style={{ fontSize: "0.72rem", color: "#2563EB", margin: "0.25rem 0 0 0" }}>✓ YouTube detected — thumbnail auto-generated</p>}
                </div>

                {/* Thumbnail upload */}
                <div>
                  <label className="form-label">Thumbnail {!editingItem && <span style={{ color: "#EF4444" }}>*</span>}</label>
                  <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #CBD5E1", borderRadius: 10, background: "#F8FAFC", cursor: "pointer", overflow: "hidden", height: thumbPreview ? "auto" : 80, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                    {thumbPreview ? (
                      <img src={thumbPreview} alt="Thumbnail" style={{ width: "100%", height: 130, objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94A3B8", padding: "0.75rem" }}>
                        <ImageIcon size={22} style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: "0.78rem" }}>Click to upload thumbnail</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbFile} />
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
                    {saving ? "Saving…" : editingItem ? "Update Video" : "Add Video"}
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
