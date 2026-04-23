import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { 
  Calendar, Search, Mail, Phone, MessageSquare, 
  Trash2, Eye, Download, Filter, ChevronLeft, 
  ChevronRight, CalendarDays, Clock, User,
  CheckCircle, PhoneOutgoing, ExternalLink, X, Save,
  Check, ChevronDown
} from "lucide-react";
import Loader from "../components/Loader";
import {
  deleteAppointment,
  exportAppointmentsCsv,
  getAppointments,
  updateAppointment,
} from "../api/services";

const statusOptions = [
  { label: "New Lead", value: "new", color: "bg-blue-100 text-blue-700" },
  { label: "Confirmed", value: "confirmed", color: "bg-amber-100 text-amber-700" },
  { label: "Completed", value: "completed", color: "bg-emerald-100 text-emerald-700" },
  { label: "Cancelled", value: "cancelled", color: "bg-red-100 text-red-700" },
];

const sortOptions = [
  { label: "Latest Created", value: "createdAt-desc" },
  { label: "Oldest Created", value: "createdAt-asc" },
  { label: "Latest Appt.", value: "appointmentDate-desc" },
  { label: "Upcoming Appt.", value: "appointmentDate-asc" },
];

function AppointmentList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // CRM Modal State
  const [crmModal, setCrmModal] = useState({ open: false, item: null });
  const [crmForm, setCrmForm] = useState({ status: "", notes: "" });
  const [savingCrm, setSavingCrm] = useState(false);

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getAppointments({
        page,
        limit: pagination.limit,
        search,
        status,
        startDate,
        sortBy,
        sortOrder,
      });
      setItems(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, totalPages: 1 });
    } catch (error) {
      toast.error("Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchItems(1), 500);
    return () => clearTimeout(timer);
  }, [search, status, startDate, sortBy, sortOrder]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    setActionId(id);
    try {
      await deleteAppointment(id);
      toast.success("Lead removed successfully");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleQuickConvert = async (id, e) => {
    if (e) e.stopPropagation();
    setActionId(id);
    try {
      await updateAppointment(id, { status: "completed" });
      toast.success("Lead marked as completed");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setActionId("");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAppointmentsCsv();
      toast.success("Leads exported successfully");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const openCRMModal = (item, e) => {
    if (e) e.stopPropagation();
    console.log("Opening CRM Modal for:", item.name, item._id);
    setCrmModal({ open: true, item });
    setCrmForm({ 
      status: item.status || "new", 
      notes: item.notes || "" 
    });
  };

  const closeCRMModal = () => {
    setCrmModal({ open: false, item: null });
  };

  const handleSaveCRM = async (e) => {
    e.preventDefault();
    setSavingCrm(true);
    try {
      await updateAppointment(crmModal.item._id, crmForm);
      toast.success("CRM data updated");
      closeCRMModal();
      fetchItems(pagination.page);
    } catch (error) {
      toast.error("Failed to save CRM data");
    } finally {
      setSavingCrm(false);
    }
  };

  if (loading && items.length === 0) return <Loader label="Retrieving appointment leads..." />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Appointment Leads</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage customer booking requests</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
        >
          {exporting ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none font-medium"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none font-medium"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-[12px] text-sm font-bold text-slate-600 outline-none hover:bg-white hover:border-slate-200 transition-all duration-200 cursor-pointer"
          >
            <span className="truncate">
              {sortOptions.find(opt => opt.value === `${sortBy}-${sortOrder}`)?.label || "Latest Created"}
            </span>
            <ChevronDown 
              size={18} 
              className={`text-slate-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isSortOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortOpen(false)}
              ></div>
              <div className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-[10px] shadow-xl z-20 overflow-hidden animate-fade-in">
                <div className="p-1.5 space-y-0.5">
                  {sortOptions.map((option) => {
                    const isSelected = `${sortBy}-${sortOrder}` === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const [field, order] = option.value.split("-");
                          setSortBy(field);
                          setSortOrder(order);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Appointment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic font-medium">
                    {loading ? "Refreshing records..." : "No appointment leads found matching your filters"}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr 
                    key={item._id} 
                    onClick={(e) => openCRMModal(item, e)}
                    className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        #{item._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                          <User size={14} className="text-blue-500" />
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <Mail size={12} className="text-slate-400" />
                          {item.email}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <Phone size={12} className="text-slate-400" />
                          {item.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500" />
                          {new Date(item.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                          <Clock size={12} />
                          Applied: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusOptions.find(o => o.value === item.status)?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        {statusOptions.find(o => o.value === item.status)?.label || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${item.mobile}`}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition border border-emerald-100"
                          title="Call Patient"
                        >
                          <PhoneOutgoing size={16} />
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </a>
                        <button
                          onClick={(e) => handleQuickConvert(item._id, e)}
                          className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition border border-indigo-100"
                          title="Mark Completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={(e) => openCRMModal(item, e)}
                          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition border border-slate-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item._id, e)}
                          disabled={actionId === item._id}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
                          title="Delete Lead"
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

        {/* Pagination */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchItems(pagination.page - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchItems(pagination.page + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CRM Detail Modal */}
      {crmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{crmModal.item?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lead ID: #{crmModal.item?._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={closeCRMModal} className="p-2 rounded-xl hover:bg-slate-200 transition text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* Left Column: Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</h5>
                  <div className="space-y-3">
                    <a href={`mailto:${crmModal.item?.email}`} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-white transition">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{crmModal.item?.email}</span>
                    </a>
                    <a href={`tel:${crmModal.item?.mobile}`} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-white transition">
                        <Phone size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{crmModal.item?.mobile}</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Logic</h5>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Requested Date</span>
                      <span className="text-sm font-bold text-indigo-600">{new Date(crmModal.item?.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Applied On</span>
                      <span className="text-sm font-bold text-slate-700">{new Date(crmModal.item?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Service</span>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg shadow-sm">{crmModal.item?.service}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inquiry Message</h5>
                  <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm text-slate-700 leading-relaxed italic font-medium">
                    "{crmModal.item?.message || "No additional message provided."}"
                  </div>
                </div>
              </div>

              {/* Right Column: CRM Actions */}
              <form onSubmit={handleSaveCRM} className="space-y-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Lead Status</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map(opt => (
                      <div 
                        key={opt.value}
                        onClick={() => setCrmForm({...crmForm, status: opt.value})}
                        className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          crmForm.status === opt.value 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
                        {crmForm.status === opt.value && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CRM Notes (Private)</h5>
                  <textarea
                    value={crmForm.notes}
                    onChange={(e) => setCrmForm({...crmForm, notes: e.target.value})}
                    placeholder="Add internal notes about this patient..."
                    className="w-full h-40 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-slate-50 flex gap-4">
                  <button
                    type="button"
                    onClick={closeCRMModal}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCrm}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingCrm ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>Update CRM</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RefreshCw({ size, className }) {
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
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

export default AppointmentList;
