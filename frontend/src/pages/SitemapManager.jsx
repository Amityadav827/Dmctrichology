import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  Globe, FileCode, ExternalLink, RefreshCw, 
  Download, Copy, Check, Layout, List, 
  Plus, Trash2, Search, Link as LinkIcon, ChevronDown, CheckCircle 
} from "lucide-react";
import Loader from "../components/Loader";
import { 
  getSitemapEntries, 
  createSitemapEntry, 
  deleteSitemapEntry, 
  getSitemapXml 
} from "../api/services";

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
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 rounded-[10px] text-sm font-semibold text-slate-600 outline-none hover:bg-slate-50 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 h-[44px] shadow-sm ${isOpen ? 'bg-white border-blue-500 ring-4 ring-blue-500/10' : ''}`}
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
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-[10px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-[100] overflow-hidden animate-fade-in">
          <div className="p-1.5 max-h-[180px] overflow-y-auto scrollbar-hide space-y-0.5">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-[8px] transition-all duration-200 ${
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

function SitemapManager() {
  const [entries, setEntries] = useState([]);
  const [xmlContent, setXmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("xml"); // xml | html
  const [copied, setCopied] = useState(false);
  
  const [newEntry, setNewEntry] = useState({ url: "", priority: "0.8", changefreq: "weekly" });
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesRes, xmlRes] = await Promise.all([
        getSitemapEntries(),
        getSitemapXml()
      ]);
      setEntries(entriesRes.data || []);
      setXmlContent(xmlRes);
    } catch (error) {
      toast.error("Failed to load sitemap data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const xml = await getSitemapXml();
      setXmlContent(xml);
      toast.success("Sitemap XML refreshed");
    } catch (error) {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sitemap.xml");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.url) return;
    setAdding(true);
    try {
      await createSitemapEntry(newEntry);
      toast.success("URL added to sitemap");
      setNewEntry({ url: "", priority: "0.8", changefreq: "weekly" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add URL");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteSitemapEntry(id);
      toast.success("URL removed");
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader label="Mapping site architecture..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Sitemap Manager</h3>
          <p className="text-sm text-slate-500 mt-1">Control search engine visibility and site structure</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
            Generate XML
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition shadow-lg"
          >
            <Download size={14} />
            Download XML
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("xml")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "xml" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileCode size={16} />
          Sitemap XML
        </button>
        <button
          onClick={() => setActiveTab("html")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "html" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layout size={16} />
          Visual HTML
        </button>
      </div>

      {activeTab === "xml" ? (
        <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-800 relative group">
          <div className="absolute right-6 top-6 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md text-slate-300 hover:text-white transition border border-slate-700"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>
          <div className="p-8 max-h-[600px] overflow-auto scrollbar-hide">
            <pre className="text-blue-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {xmlContent}
            </pre>
          </div>
          <div className="px-8 py-4 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live XML Feed</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Standard: Sitemap.org 0.9</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add URL Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Add Manual Entry</h4>
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL Path</label>
                  <input
                    type="text"
                    value={newEntry.url}
                    onChange={(e) => setNewEntry({...newEntry, url: e.target.value})}
                    placeholder="/custom-page"
                    className="form-input"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</label>
                    <CustomDropdown
                      value={newEntry.priority}
                      onChange={(val) => setNewEntry({...newEntry, priority: val})}
                      options={[
                        { label: "1.0 (Highest)", value: "1.0" },
                        { label: "0.8 (Standard)", value: "0.8" },
                        { label: "0.5 (Low)", value: "0.5" }
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Freq</label>
                    <CustomDropdown
                      value={newEntry.changefreq}
                      onChange={(val) => setNewEntry({...newEntry, changefreq: val})}
                      options={[
                        { label: "Daily", value: "daily" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Monthly", value: "monthly" }
                      ]}
                      placeholder="Select"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                  {adding ? "Adding..." : "Add to Sitemap"}
                </button>
              </form>
            </div>
          </div>

          {/* URL List */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Registered URLs</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entries.length} Links</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-auto">
              {entries.map((entry) => (
                <div key={entry._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <LinkIcon size={14} />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-slate-700 truncate">{entry.url}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Priority: {entry.priority}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">•</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.changefreq}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={entry.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="p-20 text-center text-slate-400 italic text-sm">
                  No custom URLs added to sitemap yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SitemapManager;
