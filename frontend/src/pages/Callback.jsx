import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ExportButton from "../components/ExportButton";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Table from "../components/Table";
import CustomDropdown from "../components/CustomDropdown";
import {
  deleteCallback,
  bulkDeleteCallbacks,
  exportCallbacksCsv,
  getCallbacks,
  updateCallbackStatus,
} from "../api/services";
import { 
  AlertTriangle, 
  Trash2, 
  Inbox, 
  Calendar, 
  Search, 
  CheckSquare, 
  Square, 
  Loader2, 
  X 
} from "lucide-react";

const statusOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Converted", value: "converted" },
];

const getStatusTheme = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return { dot: '#2563eb', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' }; // Blue
    case 'contacted':
      return { dot: '#d97706', bg: '#fffbeb', text: '#92400e', border: '#fde68a' }; // Gold
    case 'converted':
      return { dot: '#16a34a', bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }; // Green
    default:
      return { dot: '#64748b', bg: '#f8fafc', text: '#334155', border: '#e2e8f0' };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = date.getDate();
    const month = date.toLocaleDateString("en-IN", { month: "short" });
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;
    
    return `${day} ${month} ${year} • ${timeStr}`;
  } catch (err) {
    return "Invalid Date";
  }
};

function Callback() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getCallbacks({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        status,
        startDate,
        endDate,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setItems(response.data);
      setPagination(response.pagination);
      // Clean selected IDs that are no longer in the list
      const currentIds = response.data.map(i => i._id);
      setSelectedIds(prev => prev.filter(id => currentIds.includes(id)));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load callback leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, [debouncedSearch, status, startDate, endDate]);

  const handleStatusChange = async (id, value) => {
    setActionId(id);
    
    // Optimistic UI update
    const previousItems = [...items];
    setItems(prev => prev.map(item => item._id === id ? { ...item, status: value } : item));

    try {
      await updateCallbackStatus(id, { status: value });
      toast.success("Lead status updated successfully");
    } catch (error) {
      setItems(previousItems); // Rollback
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this callback lead?")) {
      return;
    }

    setActionId(id);
    
    // Optimistic UI update
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item._id !== id));
    setSelectedIds(prev => prev.filter(x => x !== id));

    try {
      await deleteCallback(id);
      toast.success("Lead deleted successfully");
      fetchItems(pagination.page);
    } catch (error) {
      setItems(previousItems); // Rollback
      toast.error(error.response?.data?.message || "Unable to delete lead");
    } finally {
      setActionId("");
    }
  };

  const handleSelectId = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const pageIds = items.map(item => item._id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionId("bulk");

    const previousItems = [...items];
    // Optimistic UI update
    setItems(prev => prev.filter(item => !selectedIds.includes(item._id)));

    try {
      await bulkDeleteCallbacks({ ids: selectedIds });
      toast.success("Selected leads deleted successfully");
      setSelectedIds([]);
      setShowModal(false);
      fetchItems(1);
    } catch (error) {
      setItems(previousItems); // Rollback
      toast.error(error.response?.data?.message || "Unable to delete selected leads");
    } finally {
      setActionId("");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCallbacksCsv({
        search: debouncedSearch,
        status,
        startDate,
        endDate
      });
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Header */}
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col md:flex-row gap-4 items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Request A Callback List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Track callback leads with date filters, statuses and exports.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium text-sm border border-red-200 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <ExportButton onClick={handleExport} loading={exporting} />
          </div>
        </div>

        <div className="mt-5">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            statusOptions={statusOptions}
          />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading callback leads..." />
      ) : items.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white/50 backdrop-blur-md rounded-[28px] border border-gray-100 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
            <Inbox className="h-8 w-8 text-blue-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">No callback requests yet</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            New website leads will appear here automatically.
          </p>
        </div>
      ) : (
        /* Dynamic Table */
        <>
          <div className="overflow-x-auto rounded-[28px] bg-white border border-gray-100 shadow-panel">
            <Table
              columns={[
                {
                  key: "select",
                  label: (
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    >
                      {items.length > 0 && items.every(item => selectedIds.includes(item._id)) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  ),
                },
                { key: "name", label: "Name" },
                { key: "mobile", label: "Mobile" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Created Date" },
                { key: "actions", label: "Actions" },
              ]}
            >
              {items.map((item) => {
                const theme = getStatusTheme(item.status);
                const isSelected = selectedIds.includes(item._id);
                return (
                  <tr 
                    key={item._id} 
                    className={`text-sm text-slate-600 transition-colors duration-200 border-b border-gray-50 hover:bg-gray-50/50 ${
                      isSelected ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="px-5 py-4 w-10">
                      <button
                        type="button"
                        onClick={() => handleSelectId(item._id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">{item.name}</td>
                    <td className="px-5 py-4 font-mono text-xs">{item.mobile}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300"
                          style={{ backgroundColor: theme.dot, boxShadow: `0 0 8px ${theme.dot}50` }}
                        />
                        <div className="min-w-[125px]">
                          <CustomDropdown
                            value={item.status}
                            onChange={(val) => handleStatusChange(item._id, val)}
                            options={statusOptions}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={actionId === item._id}
                        className="btn-danger hover:scale-[1.02] active:scale-[0.98] transition-transform text-xs font-semibold px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </div>

          <Pagination pagination={pagination} onPageChange={fetchItems} />
        </>
      )}

      {/* Enterprise Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Delete Selected Leads?</h4>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              This action cannot be undone. You are about to permanently delete <strong>{selectedIds.length} lead{selectedIds.length > 1 ? 's' : ''}</strong> from the database.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={actionId === "bulk"}
                className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {actionId === "bulk" && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({ pagination, onPageChange }) {
  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-[24px]">
      <p className="text-sm text-slate-500">
        Showing page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="btn-secondary px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="btn-secondary px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Callback;
