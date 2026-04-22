import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { 
  Calendar, Search, Mail, Phone, MessageSquare, 
  Trash2, Eye, Download, Filter, ChevronLeft, 
  ChevronRight, CalendarDays, Clock, User
} from "lucide-react";
import Loader from "../components/Loader";
import {
  deleteAppointment,
  exportAppointmentsCsv,
  getAppointments,
  updateAppointment,
} from "../api/services";

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
  const [messageModal, setMessageModal] = useState({ open: false, item: null });

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

  const handleDelete = async (id) => {
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

  const openMessage = (item) => setMessageModal({ open: true, item });
  const closeMessage = () => setMessageModal({ open: false, item: null });

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
        <div>
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:bg-white transition appearance-none cursor-pointer"
          >
            <option value="createdAt-desc">Latest Created</option>
            <option value="createdAt-asc">Oldest Created</option>
            <option value="appointmentDate-desc">Latest Appt.</option>
            <option value="appointmentDate-asc">Upcoming Appt.</option>
          </select>
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
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Message</th>
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
                items.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        #{item._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
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
                      <button
                        onClick={() => openMessage(item)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100 transition"
                      >
                        <MessageSquare size={12} />
                        View Message
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openMessage(item)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition border border-transparent hover:border-blue-100"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={actionId === item._id}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={18} />
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

      {/* Message Modal */}
      {messageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Patient Inquiry</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submitted on {new Date(messageModal.item?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={closeMessage} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400">
                <Eye size={20} className="rotate-45" style={{ transform: 'rotate(45deg)' }} />
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</label>
                  <p className="text-sm font-bold text-slate-900">{messageModal.item?.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</label>
                  <p className="text-sm font-bold text-slate-900">{messageModal.item?.mobile}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <p className="text-sm font-bold text-slate-900">{messageModal.item?.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requested Date</label>
                  <p className="text-sm font-bold text-indigo-600">{new Date(messageModal.item?.appointmentDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message / Requirement</label>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {messageModal.item?.message || "No additional message provided by the patient."}
                  </p>
                </div>
              </div>

              <button
                onClick={closeMessage}
                className="w-full py-4 rounded-2xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition shadow-lg"
              >
                Close Inquiry
              </button>
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
