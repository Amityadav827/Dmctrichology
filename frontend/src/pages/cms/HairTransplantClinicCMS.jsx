import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { 
  Save, Loader2, Image as ImageIcon, Eye, Settings, User, 
  Globe, Plus, Trash2, Award, BookOpen, Briefcase, Star, Layout, HelpCircle
} from "lucide-react";

export default function HairTransplantClinicCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/hair-transplant-clinic-in-delhi");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error("Failed to load Hair Transplant clinic settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (path, value) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = isNaN(parts[i + 1]) ? {} : [];
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handleImageUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const { data: res } = await axios.post("/hair-transplant-clinic-in-delhi/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success && res.url) {
        updateNestedField(path, res.url);
        toast.success("Image uploaded successfully", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/hair-transplant-clinic-in-delhi", data);
      if (res.success) {
        toast.success("Settings saved successfully");
        setData(res.data);
      }
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const s = {
    page: { padding: "24px", fontFamily: "'Inter', sans-serif", maxWidth: "1100px" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
    headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
    iconBox: { width: 40, height: 40, borderRadius: "10px", background: "linear-gradient(135deg,#3b5998,#2a4080)", display: "flex", alignItems: "center", justifyContent: "center" },
    title: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 },
    subtitle: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" },
    saveBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: "#3b5998", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
    saveBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
    previewBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", fontWeight: "500", cursor: "pointer", fontSize: "13px", textDecoration: "none" },
    tabsContainer: { display: "flex", gap: "4px", marginBottom: "24px", background: "#f8fafc", padding: "6px", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap" },
    tab: (active) => ({ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: active ? "600" : "400", fontSize: "12px", background: active ? "#fff" : "transparent", color: active ? "#3b5998" : "#64748b", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s", whiteSpace: "nowrap" }),
    card: { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" },
    cardTitle: { fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" },
    label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    textarea: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", resize: "vertical", minHeight: "90px", boxSizing: "border-box", fontFamily: "inherit" },
    fieldGroup: { marginBottom: "18px" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
    imgPreviewBox: { marginTop: "10px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", maxWidth: "220px", maxHeight: "180px" },
    uploadLabel: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "12px", fontWeight: "500", marginTop: "8px" },
    bulletRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
    bulletInput: { flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "inherit" },
    removeBtn: { padding: "6px 10px", borderRadius: "6px", background: "#fff0f0", color: "#e53e3e", border: "1px solid #feb2b2", cursor: "pointer", display: "flex", alignItems: "center" },
    addBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#f0f7ff", color: "#3b5998", border: "1px solid #bfdbfe", cursor: "pointer", fontSize: "13px", fontWeight: "500", marginTop: "8px" },
    colorRow: { display: "flex", alignItems: "center", gap: "10px" },
    sectionDivider: { borderTop: "1px dashed #e2e8f0", marginTop: "20px", paddingTop: "20px" }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
      <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#3b5998" }} />
    </div>
  );

  if (!data) return <div style={{ color: "#e53e3e", padding: "24px" }}>Failed to load settings. Please refresh.</div>;

  const hero = data.hero || {};
  const breadcrumb = data.breadcrumb || {};
  const intro = data.intro || {};
  const procedures = data.procedures || {};
  const timeline = data.timeline || {};
  const patientCare = data.patientCare || {};
  const associations = data.associations || {};
  const reviews = data.reviews || {};
  const faq = data.faq || {};
  const cta = data.cta || {};
  const seo = data.seo || {};

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.iconBox}><Layout size={20} color="#fff" /></div>
          <div>
            <p style={s.title}>Hair Transplant Clinic CMS</p>
            <p style={s.subtitle}>Full premium redesign — /hair-transplant-clinic-in-delhi</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a href="https://dmctrichology-mkm4.vercel.app/hair-transplant-clinic-in-delhi" target="_blank" rel="noopener noreferrer" style={s.previewBtn}>
            <Eye size={14} /> Live Preview
          </a>
          <button style={{ ...s.saveBtn, ...(saving ? s.saveBtnDisabled : {}) }} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Container */}
      <div style={s.tabsContainer}>
        {[
          { id: "hero", label: "Hero Slider" },
          { id: "breadcrumb", label: "Breadcrumbs" },
          { id: "intro", label: "Welcome / Intro" },
          { id: "procedures", label: "Procedures" },
          { id: "timeline", label: "Journey Timeline" },
          { id: "patientCare", label: "Patient Care" },
          { id: "associations", label: "Associations" },
          { id: "reviews", label: "Testimonials" },
          { id: "faq", label: "FAQ Accordion" },
          { id: "cta", label: "CTA Callout" },
          { id: "seo", label: "SEO Settings" }
        ].map(tab => (
          <button 
            key={tab.id} 
            style={s.tab(activeSection === tab.id)} 
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      {activeSection === "hero" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Layout size={16} color="#3b5998" /> Centered Banner Hero Settings</p>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Eyebrow Badge Text</label>
              <input style={s.input} value={hero.eyebrowText || ""} onChange={e => updateSectionField("hero", "eyebrowText", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Main Heading</label>
              <input style={s.input} value={hero.mainHeading || ""} onChange={e => updateSectionField("hero", "mainHeading", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Breadcrumb Active Text</label>
              <input style={s.input} value={hero.breadcrumbText || ""} onChange={e => updateSectionField("hero", "breadcrumbText", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Overlay Darkening Opacity (0 to 1)</label>
              <input type="number" step="0.05" min="0" max="1" style={s.input} value={hero.overlayOpacity === undefined ? 0.6 : hero.overlayOpacity} onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))} />
            </div>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Supporting Paragraph Text</label>
            <textarea style={s.textarea} value={hero.descriptionParagraph || ""} onChange={e => updateSectionField("hero", "descriptionParagraph", e.target.value)} rows={3} />
          </div>

          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Background Base Color (Solid / Gradient End)</label>
              <div style={s.colorRow}>
                <input type="color" value={hero.backgroundColor || "#0b132b"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input style={{ ...s.input, flex: 1 }} value={hero.backgroundColor || "#0b132b"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} />
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Background Gradient Start Accent Color</label>
              <div style={s.colorRow}>
                <input type="color" value={hero.gradientColor || "#3b5998"} onChange={e => updateSectionField("hero", "gradientColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input style={{ ...s.input, flex: 1 }} value={hero.gradientColor || "#3b5998"} onChange={e => updateSectionField("hero", "gradientColor", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Padding Top (Spacing)</label>
              <input style={s.input} value={hero.paddingTop || "170px"} onChange={e => updateSectionField("hero", "paddingTop", e.target.value)} placeholder="e.g. 170px" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Padding Bottom (Spacing)</label>
              <input style={s.input} value={hero.paddingBottom || "100px"} onChange={e => updateSectionField("hero", "paddingBottom", e.target.value)} placeholder="e.g. 100px" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Banner Standard Height</label>
              <input style={s.input} value={hero.bannerHeight || "420px"} onChange={e => updateSectionField("hero", "bannerHeight", e.target.value)} placeholder="e.g. 420px" />
            </div>
            <div style={{ ...s.fieldGroup, marginTop: "24px" }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={hero.showFloatingShapes !== false} onChange={e => updateSectionField("hero", "showFloatingShapes", e.target.checked)} /> Enable Floating Circle Shapes
              </label>
            </div>
          </div>

          <p style={{ ...s.cardTitle, marginTop: "20px" }}><Layout size={16} color="#3b5998" /> Mobile Sizing Configuration</p>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Mobile Title Size</label>
              <input style={s.input} value={hero.mobileTitleSize || "40px"} onChange={e => updateSectionField("hero", "mobileTitleSize", e.target.value)} placeholder="e.g. 40px" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Mobile Description Size</label>
              <input style={s.input} value={hero.mobileDescSize || "14px"} onChange={e => updateSectionField("hero", "mobileDescSize", e.target.value)} placeholder="e.g. 14px" />
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Cinematic Background Image (Optional Overlay)</label>
            <input style={s.input} value={hero.backgroundImage || ""} onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} placeholder="https://..." />
            <label style={s.uploadLabel}>
              <ImageIcon size={12} /> Upload Banner Background
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => handleImageUpload(e, "hero.backgroundImage")} />
            </label>
            {hero.backgroundImage && <div style={s.imgPreviewBox}><img src={hero.backgroundImage} alt="Hero Bkg" style={{ width: "100%", display: "block" }} /></div>}
          </div>
        </div>
      )}

      {/* ── BREADCRUMB SECTION ─────────────────────────────────── */}
      {activeSection === "breadcrumb" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Globe size={16} color="#3b5998" /> Breadcrumbs Configuration</p>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Root Anchor Text</label>
              <input style={s.input} value={breadcrumb.parentLabel || ""} onChange={e => updateSectionField("breadcrumb", "parentLabel", e.target.value)} placeholder="Home" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Root Anchor Destination</label>
              <input style={s.input} value={breadcrumb.parentUrl || ""} onChange={e => updateSectionField("breadcrumb", "parentUrl", e.target.value)} placeholder="/" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Current Active Page Title</label>
              <input style={s.input} value={breadcrumb.currentPageText || ""} onChange={e => updateSectionField("breadcrumb", "currentPageText", e.target.value)} placeholder="Hair Transplant Clinic" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Breadcrumb Block Fill Color</label>
              <div style={s.colorRow}>
                <input type="color" value={breadcrumb.backgroundColor || "#f8f9fa"} onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input style={{ ...s.input, flex: 1 }} value={breadcrumb.backgroundColor || "#f8f9fa"} onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INTRO / WELCOME SECTION ──────────────────────────────── */}
      {activeSection === "intro" && (
        <div style={s.card}>
          <p style={s.cardTitle}><User size={16} color="#3b5998" /> Welcome & Clinical Director Quote</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={intro.isVisible !== false} onChange={e => updateSectionField("intro", "isVisible", e.target.checked)} /> Enable Welcome Section
            </label>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Section Heading</label>
            <input style={s.input} value={intro.heading || ""} onChange={e => updateSectionField("intro", "heading", e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Intro welcome HTML body</label>
            <textarea style={{ ...s.textarea, minHeight: 140 }} value={intro.welcomeText || ""} onChange={e => updateSectionField("intro", "welcomeText", e.target.value)} rows={6} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Director Quote Callout Block</label>
            <input style={s.input} value={intro.directorQuote || ""} onChange={e => updateSectionField("intro", "directorQuote", e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Featured Welcoming Banner Photo</label>
            <input style={s.input} value={intro.image || ""} onChange={e => updateSectionField("intro", "image", e.target.value)} placeholder="https://..." />
            <label style={s.uploadLabel}>
              <ImageIcon size={12} /> Upload Welcoming Photo
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => handleImageUpload(e, "intro.image")} />
            </label>
            {intro.image && <div style={s.imgPreviewBox}><img src={intro.image} alt="Intro Bkg" style={{ width: "100%", display: "block" }} /></div>}
          </div>
        </div>
      )}

      {/* ── PROCEDURES SECTION ──────────────────────────────────── */}
      {activeSection === "procedures" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Layout size={16} color="#3b5998" /> Procedures Setup</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={procedures.isVisible !== false} onChange={e => updateSectionField("procedures", "isVisible", e.target.checked)} /> Enable Procedures Section
              </label>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Title</label>
              <input style={s.input} value={procedures.heading || ""} onChange={e => updateSectionField("procedures", "heading", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Intro Paragraph</label>
              <input style={s.input} value={procedures.introText || ""} onChange={e => updateSectionField("procedures", "introText", e.target.value)} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Layout size={16} color="#3b5998" /> Manage Service Card Grid</p>
            {(procedures.items || []).map((proc, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Procedure Card #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={proc.enabled !== false} onChange={e => updateNestedField(`procedures.items.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const updated = [...(procedures.items || [])]; updated.splice(idx, 1); updateSectionField("procedures", "items", updated); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Card Title</label>
                    <input style={s.input} value={proc.title || ""} onChange={e => updateNestedField(`procedures.items.${idx}.title`, e.target.value)} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Target Slug URL</label>
                    <input style={s.input} value={proc.link || ""} onChange={e => updateNestedField(`procedures.items.${idx}.link`, e.target.value)} placeholder="/details/slug" />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Short Description Details</label>
                  <textarea style={s.textarea} value={proc.description || ""} onChange={e => updateNestedField(`procedures.items.${idx}.description`, e.target.value)} rows={2} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Cover Image URL</label>
                  <input style={s.input} value={proc.image || ""} onChange={e => updateNestedField(`procedures.items.${idx}.image`, e.target.value)} />
                  <label style={s.uploadLabel}>
                    <ImageIcon size={12} /> Upload Cover
                    <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => handleImageUpload(e, `procedures.items.${idx}.image`)} />
                  </label>
                  {proc.image && <div style={{ ...s.imgPreviewBox, maxWidth: 120 }}><img src={proc.image} alt={proc.title} style={{ width: "100%", display: "block" }} /></div>}
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("procedures", "items", [...(procedures.items || []), { id: Date.now(), title: "New Hair Treatment", description: "", image: "", link: "", enabled: true }])}>
              <Plus size={14} /> Add Service Card
            </button>
          </div>
        </>
      )}

      {/* ── TIMELINE SECTION ───────────────────────────────────── */}
      {activeSection === "timeline" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><BookOpen size={16} color="#3b5998" /> Clinical Journey Setup</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={timeline.isVisible !== false} onChange={e => updateSectionField("timeline", "isVisible", e.target.checked)} /> Enable Journey Timeline
              </label>
            </div>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={timeline.heading || ""} onChange={e => updateSectionField("timeline", "heading", e.target.value)} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Subtitle Tracker</label>
                <input style={s.input} value={timeline.timelineTitle || ""} onChange={e => updateSectionField("timeline", "timelineTitle", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><BookOpen size={16} color="#3b5998" /> Manage Timeline Milestones</p>
            {(timeline.timelineItems || []).map((tItem, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Timeline Item #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={tItem.enabled !== false} onChange={e => updateNestedField(`timeline.timelineItems.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const updated = [...(timeline.timelineItems || [])]; updated.splice(idx, 1); updateSectionField("timeline", "timelineItems", updated); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Milestone Marker (e.g. Year / Metric)</label>
                    <input style={s.input} value={tItem.year || ""} onChange={e => updateNestedField(`timeline.timelineItems.${idx}.year`, e.target.value)} placeholder="2018" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Milestone Title</label>
                    <input style={s.input} value={tItem.title || ""} onChange={e => updateNestedField(`timeline.timelineItems.${idx}.title`, e.target.value)} />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Milestone Brief Summary</label>
                  <textarea style={s.textarea} value={tItem.description || ""} onChange={e => updateNestedField(`timeline.timelineItems.${idx}.description`, e.target.value)} rows={2} />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("timeline", "timelineItems", [...(timeline.timelineItems || []), { year: "2026", title: "New Milestone Achieve", description: "", enabled: true }])}>
              <Plus size={14} /> Add Timeline Item
            </button>
          </div>
        </>
      )}

      {/* ── PATIENT CARE / EXPERTISE SECTION ──────────────────────── */}
      {activeSection === "patientCare" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Briefcase size={16} color="#3b5998" /> Patient Care & Clinical Quality Setup</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={patientCare.isVisible !== false} onChange={e => updateSectionField("patientCare", "isVisible", e.target.checked)} /> Enable Patient Care Section
              </label>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Heading</label>
              <input style={s.input} value={patientCare.heading || ""} onChange={e => updateSectionField("patientCare", "heading", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Introductory Callout text</label>
              <input style={s.input} value={patientCare.introText || ""} onChange={e => updateSectionField("patientCare", "introText", e.target.value)} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Briefcase size={16} color="#3b5998" /> Manage Philosophy / Quality Items</p>
            {(patientCare.items || []).map((item, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Card #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={item.isVisible !== false} onChange={e => updateNestedField(`patientCare.items.${idx}.isVisible`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const updated = [...(patientCare.items || [])]; updated.splice(idx, 1); updateSectionField("patientCare", "items", updated); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Philosophy Title</label>
                  <input style={s.input} value={item.title || ""} onChange={e => updateNestedField(`patientCare.items.${idx}.title`, e.target.value)} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Philosophy Detailed Text Description</label>
                  <textarea style={s.textarea} value={item.content || ""} onChange={e => updateNestedField(`patientCare.items.${idx}.content`, e.target.value)} rows={3} />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("patientCare", "items", [...(patientCare.items || []), { title: "New Care Pillar", content: "", isVisible: true }])}>
              <Plus size={14} /> Add Philosophy Card
            </button>
          </div>
        </>
      )}

      {/* ── ASSOCIATIONS / TRUST LOGOBAR SECTION ────────────────── */}
      {activeSection === "associations" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Award size={16} color="#3b5998" /> Certifications & Associations Panel</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={associations.isVisible !== false} onChange={e => updateSectionField("associations", "isVisible", e.target.checked)} /> Enable Certifications Logobar
              </label>
            </div>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Bar Heading Label</label>
                <input style={s.input} value={associations.heading || ""} onChange={e => updateSectionField("associations", "heading", e.target.value)} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Hex Color</label>
                <input style={s.input} value={associations.sectionBgColor || ""} onChange={e => updateSectionField("associations", "sectionBgColor", e.target.value)} placeholder="#ffffff" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Manage Trust & Certification Logos</p>
            {(associations.logos || []).map((logo, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Logo Card #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={logo.enabled !== false} onChange={e => updateNestedField(`associations.logos.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const updated = [...(associations.logos || [])]; updated.splice(idx, 1); updateSectionField("associations", "logos", updated); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Affiliation Title</label>
                    <input style={s.input} value={logo.title || ""} onChange={e => updateNestedField(`associations.logos.${idx}.title`, e.target.value)} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Affiliation External Link (optional)</label>
                    <input style={s.input} value={logo.link || ""} onChange={e => updateNestedField(`associations.logos.${idx}.link`, e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Logo Image Address</label>
                  <input style={s.input} value={logo.imageUrl || ""} onChange={e => updateNestedField(`associations.logos.${idx}.imageUrl`, e.target.value)} />
                  <label style={s.uploadLabel}>
                    <ImageIcon size={12} /> Upload Logo
                    <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => handleImageUpload(e, `associations.logos.${idx}.imageUrl`)} />
                  </label>
                  {logo.imageUrl && <div style={{ ...s.imgPreviewBox, maxWidth: 100 }}><img src={logo.imageUrl} alt={logo.title} style={{ width: "100%", display: "block" }} /></div>}
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("associations", "logos", [...(associations.logos || []), { id: Date.now(), title: "New Certified Affiliation", imageUrl: "", link: "", enabled: true }])}>
              <Plus size={14} /> Add Affiliation Logo
            </button>
          </div>
        </>
      )}

      {/* ── TESTIMONIALS SECTION ─────────────────────────────────── */}
      {activeSection === "reviews" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Star size={16} color="#3b5998" /> Patient Testimonies Panel Settings</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={reviews.isVisible !== false} onChange={e => updateSectionField("reviews", "isVisible", e.target.checked)} /> Enable Reviews Carousel
              </label>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Main Title</label>
              <input style={s.input} value={reviews.heading || ""} onChange={e => updateSectionField("reviews", "heading", e.target.value)} />
            </div>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Google Stars Rating Average</label>
                <input style={s.input} value={reviews.googleRating || ""} onChange={e => updateSectionField("reviews", "googleRating", e.target.value)} placeholder="4.9" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Total Verified patient reviews text count</label>
                <input style={s.input} value={reviews.count || ""} onChange={e => updateSectionField("reviews", "count", e.target.value)} placeholder="15,000+" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Star size={16} color="#3b5998" /> Manage Patient Review Cards</p>
            {(reviews.reviewsList || []).map((review, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Review Card #{idx + 1}</span>
                  <button style={s.removeBtn} onClick={() => { const updated = [...(reviews.reviewsList || [])]; updated.splice(idx, 1); updateSectionField("reviews", "reviewsList", updated); }}><Trash2 size={13} /></button>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Patient Name</label>
                    <input style={s.input} value={review.author || ""} onChange={e => updateNestedField(`reviews.reviewsList.${idx}.author`, e.target.value)} />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Stars Rating (1 to 5)</label>
                    <input type="number" min="1" max="5" style={s.input} value={review.rating || 5} onChange={e => updateNestedField(`reviews.reviewsList.${idx}.rating`, parseInt(e.target.value))} />
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Date / Time label</label>
                    <input style={s.input} value={review.date || ""} onChange={e => updateNestedField(`reviews.reviewsList.${idx}.date`, e.target.value)} placeholder="2 weeks ago" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "flex", gap: 6, alignItems: "center", cursor: "pointer", marginTop: 24 }}>
                      <input type="checkbox" checked={review.verified !== false} onChange={e => updateNestedField(`reviews.reviewsList.${idx}.verified`, e.target.checked)} /> Verified Patient Badge
                    </label>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Review Content Comment</label>
                  <textarea style={s.textarea} value={review.text || ""} onChange={e => updateNestedField(`reviews.reviewsList.${idx}.text`, e.target.value)} rows={3} />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("reviews", "reviewsList", [...(reviews.reviewsList || []), { author: "New Patient Reviewer", rating: 5, date: "Just now", verified: true, text: "" }])}>
              <Plus size={14} /> Add Review Card
            </button>
          </div>
        </>
      )}

      {/* ── FAQ SECTION ─────────────────────────────────────────── */}
      {activeSection === "faq" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><HelpCircle size={16} color="#3b5998" /> FAQ Section Settings</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={faq.isVisible !== false} onChange={e => updateSectionField("faq", "isVisible", e.target.checked)} /> Enable FAQs Accordion
              </label>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Heading</label>
              <input style={s.input} value={faq.heading || ""} onChange={e => updateSectionField("faq", "heading", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Sub-Description</label>
              <input style={s.input} value={faq.description || ""} onChange={e => updateSectionField("faq", "description", e.target.value)} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><HelpCircle size={16} color="#3b5998" /> Manage FAQs Accordion List</p>
            {(faq.faqsList || []).map((faqItem, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "16px", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Accordion Item #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={faqItem.isVisible !== false} onChange={e => updateNestedField(`faq.faqsList.${idx}.isVisible`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const updated = [...(faq.faqsList || [])]; updated.splice(idx, 1); updateSectionField("faq", "faqsList", updated); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Question Text</label>
                  <input style={s.input} value={faqItem.question || ""} onChange={e => updateNestedField(`faq.faqsList.${idx}.question`, e.target.value)} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Answer Details (HTML allowed)</label>
                  <textarea style={s.textarea} value={faqItem.answer || ""} onChange={e => updateNestedField(`faq.faqsList.${idx}.answer`, e.target.value)} rows={3} />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("faq", "faqsList", [...(faq.faqsList || []), { question: "New FAQ Question?", answer: "", isVisible: true }])}>
              <Plus size={14} /> Add Accordion Question
            </button>
          </div>
        </>
      )}

      {/* ── CTA CONVERSION CALLOUT ─────────────────────────────── */}
      {activeSection === "cta" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Settings size={16} color="#3b5998" /> CTA callout Section Settings</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={cta.isVisible !== false} onChange={e => updateSectionField("cta", "isVisible", e.target.checked)} /> Enable CTA conversion Section
            </label>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Main Callout Heading</label>
            <input style={s.input} value={cta.heading || ""} onChange={e => updateSectionField("cta", "heading", e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Sub-Callout Text Description</label>
            <input style={s.input} value={cta.subheading || ""} onChange={e => updateSectionField("cta", "subheading", e.target.value)} />
          </div>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Action Button Label</label>
              <input style={s.input} value={cta.buttonText || ""} onChange={e => updateSectionField("cta", "buttonText", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Action Button Target URL</label>
              <input style={s.input} value={cta.buttonLink || ""} onChange={e => updateSectionField("cta", "buttonLink", e.target.value)} placeholder="#appointment-form" />
            </div>
          </div>
        </div>
      )}

      {/* ── SEO SECTION ────────────────────────────────────────── */}
      {activeSection === "seo" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Globe size={16} color="#3b5998" /> SEO & Page Metadata</p>
          <div style={s.fieldGroup}>
            <label style={s.label}>Meta Title tag</label>
            <input style={s.input} value={seo.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} placeholder="Best Hair Transplant Clinic in Delhi | DMC Trichology" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Meta Description Tag</label>
            <textarea style={s.textarea} value={seo.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} rows={3} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>OpenGraph Og:Image Url Link</label>
            <input style={s.input} value={seo.ogImage || ""} onChange={e => updateSectionField("seo", "ogImage", e.target.value)} />
          </div>
          {seo.ogImage && <div style={s.imgPreviewBox}><img src={seo.ogImage} alt="OG Thumbnail" style={{ width: "100%", display: "block" }} /></div>}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
