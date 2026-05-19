import React, { useState, useEffect } from "react";
import { 
  getNewsletterSubscribers, 
  deleteNewsletterSubscriber, 
  bulkDeleteNewsletterSubscribers, 
  exportNewsletterSubscribersCsv 
} from "../api/services";
import { 
  Search, Calendar, Trash2, Download, ChevronLeft, 
  ChevronRight, Mail, Square, CheckSquare, AlertCircle, RefreshCw 
} from "lucide-react";

export default function NewsletterList() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // UI & Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getNewsletterSubscribers({
        search,
        startDate,
        endDate,
        page,
        limit
      });
      if (res?.success) {
        setSubscribers(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.pages || 1);
      } else {
        setError(res?.message || "Failed to load subscribers.");
      }
    } catch (err) {
      setError("Failed to load subscribers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [page, search, startDate, endDate]);

  // Format dynamic dates cleanly as 19 May 2026 • 10:42 AM
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const optionsDate = { day: "numeric", month: "short", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    return `${date.toLocaleDateString("en-IN", optionsDate)} • ${date.toLocaleTimeString("en-IN", optionsTime).toUpperCase()}`;
  };

  // Row selection helpers
  const handleSelectAll = () => {
    if (selectedIds.length === subscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscribers.map((s) => s._id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const handleDeleteSingle = async () => {
    if (!subscriberToDelete) return;
    try {
      const res = await deleteNewsletterSubscriber(subscriberToDelete._id);
      if (res?.success) {
        setSuccess("Subscriber deleted successfully.");
        setSelectedIds(selectedIds.filter(id => id !== subscriberToDelete._id));
        setSubscriberToDelete(null);
        fetchSubscribers();
      } else {
        setError(res?.message || "Failed to delete subscriber.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await bulkDeleteNewsletterSubscribers({ ids: selectedIds });
      if (res?.success) {
        setSuccess(`${selectedIds.length} subscribers deleted successfully.`);
        setSelectedIds([]);
        setShowBulkDeleteModal(false);
        fetchSubscribers();
      } else {
        setError(res?.message || "Failed to delete selected subscribers.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportNewsletterSubscribersCsv({ search, startDate, endDate });
    } catch (err) {
      setError("Failed to export CSV file.");
    }
  };

  // Clear filters
  const handleResetFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", margin: 0, fontFamily: "Marcellus, serif" }}>
            Newsletter Subscribers
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.25rem", fontFamily: "Lato, sans-serif" }}>
            Manage newsletter subscribers and health tip campaign signups
          </p>
        </div>

        {/* Counter Widget */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "10px 20px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
          textAlign: "right"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Marcellus, serif" }}>Total Subscribers</span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1E293B", margin: 0 }}>{total}</h3>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "1rem", borderRadius: "16px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>✓</span>
          <span style={{ fontSize: "14px", fontWeight: 500 }}>{success}</span>
          <button onClick={() => setSuccess("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#065F46", fontWeight: "bold", cursor: "pointer" }}>×</button>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "1rem", borderRadius: "16px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>{error}</span>
          <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#991B1B", fontWeight: "bold", cursor: "pointer" }}>×</button>
        </div>
      )}

      {/* Filters Area */}
      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "24px", 
        padding: "1.5rem", 
        border: "1px solid #E2E8F0", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center"
      }}>
        {/* Search */}
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input 
            type="text" 
            placeholder="Search by subscriber email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ 
              width: "100%", 
              padding: "12px 16px 12px 42px", 
              borderRadius: "30px", 
              border: "1px solid #E2E8F0", 
              fontSize: "14px",
              outline: "none",
              backgroundColor: "#F8FAFC",
              transition: "all 0.3s"
            }} 
          />
        </div>

        {/* Date Ranges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Calendar size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              style={{ padding: "10px 12px 10px 36px", borderRadius: "30px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", backgroundColor: "#F8FAFC" }} 
            />
          </div>
          <span style={{ color: "#94A3B8", fontSize: "13px" }}>to</span>
          <div style={{ position: "relative" }}>
            <Calendar size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              style={{ padding: "10px 12px 10px 36px", borderRadius: "30px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", backgroundColor: "#F8FAFC" }} 
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
          <button 
            onClick={handleResetFilters}
            style={{ 
              padding: "10px 20px", 
              borderRadius: "30px", 
              border: "1px solid #E2E8F0", 
              backgroundColor: "#fff", 
              fontSize: "13px", 
              fontWeight: 600,
              color: "#64748B",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <RefreshCw size={14} /> Clear
          </button>
          
          <button 
            onClick={handleExportCSV}
            style={{ 
              padding: "10px 20px", 
              borderRadius: "30px", 
              border: "none", 
              backgroundColor: "#2563EB", 
              fontSize: "13px", 
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(37,99,235,0.15)"
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Multi-Select Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{ 
          backgroundColor: "#1E293B", 
          color: "#fff", 
          borderRadius: "16px", 
          padding: "12px 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem",
          animation: "fadeInUp 0.3s ease",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}>
          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            {selectedIds.length} subscriber(s) selected
          </span>
          <button 
            onClick={() => setShowBulkDeleteModal(true)}
            style={{ 
              backgroundColor: "#EF4444", 
              color: "#fff", 
              border: "none", 
              padding: "8px 16px", 
              borderRadius: "30px", 
              fontWeight: 600, 
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.2s"
            }}
          >
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* List Table */}
      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "24px", 
        border: "1px solid #E2E8F0", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        overflow: "hidden"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1.25rem 1.5rem", width: "50px" }}>
                  <button onClick={handleSelectAll} style={{ background: "none", border: "none", padding: 0, color: "#475569", cursor: "pointer" }}>
                    {selectedIds.length === subscribers.length && subscribers.length > 0 ? (
                      <CheckSquare size={18} style={{ color: "#2563EB" }} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "#475569", letterSpacing: "1px", fontFamily: "Marcellus, serif" }}>Email Address</th>
                <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "#475569", letterSpacing: "1px", fontFamily: "Marcellus, serif" }}>Updates Subscription</th>
                <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "#475569", letterSpacing: "1px", fontFamily: "Marcellus, serif" }}>Source Widget</th>
                <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "#475569", letterSpacing: "1px", fontFamily: "Marcellus, serif" }}>Joined Date</th>
                <th style={{ padding: "1.25rem 1.5rem", width: "100px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: "4rem", textAlign: "center", color: "#64748B" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                      <span className="spinner" style={{ width: "20px", height: "20px", border: "2px solid #E2E8F0", borderTopColor: "#2563EB", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>
                      <span>Fetching newsletter subscribers...</span>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "5rem 2rem", textAlign: "center" }}>
                    <Mail size={40} style={{ color: "#CBD5E1", marginBottom: "1rem" }} />
                    <h4 style={{ fontSize: "16px", color: "#334155", fontWeight: 600, margin: 0 }}>No subscribers found</h4>
                    <p style={{ fontSize: "13px", color: "#64748B", marginTop: "0.5rem" }}>Modify search criteria or clear filters to start over.</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => {
                  const isSelected = selectedIds.includes(sub._id);
                  return (
                    <tr key={sub._id} style={{ 
                      borderBottom: "1px solid #F1F5F9", 
                      backgroundColor: isSelected ? "#F8FAFC" : "transparent",
                      transition: "background-color 0.2s"
                    }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <button onClick={() => handleSelectRow(sub._id)} style={{ background: "none", border: "none", padding: 0, color: isSelected ? "#2563EB" : "#94A3B8", cursor: "pointer" }}>
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", fontFamily: "Lato, sans-serif" }}>{sub.email}</span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ 
                          fontSize: "12px", 
                          fontWeight: 600, 
                          padding: "4px 10px", 
                          borderRadius: "30px",
                          backgroundColor: sub.subscribedToUpdates ? "#ECFDF5" : "#FFF5F5",
                          color: sub.subscribedToUpdates ? "#065F46" : "#991B1B"
                        }}>
                          {sub.subscribedToUpdates ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ fontSize: "13px", color: "#64748B", fontFamily: "Lato, sans-serif" }}>{sub.source}</span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>{formatDateTime(sub.createdAt)}</span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                        <button 
                          onClick={() => setSubscriberToDelete(sub)}
                          style={{ background: "none", border: "none", padding: "6px", color: "#EF4444", cursor: "pointer", transition: "color 0.2s" }}
                          title="Delete Subscriber"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderTop: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "13px", color: "#64748B" }}>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#fff",
                  color: page === 1 ? "#CBD5E1" : "#475569",
                  cursor: page === 1 ? "not-allowed" : "pointer"
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#fff",
                  color: page === totalPages ? "#CBD5E1" : "#475569",
                  cursor: page === totalPages ? "not-allowed" : "pointer"
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Glassmorphic Delete Confirmation Modals */}
      {subscriberToDelete && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "2rem",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            border: "1px solid #E2E8F0"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B", margin: 0, fontFamily: "Marcellus, serif" }}>Delete Subscriber</h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "1rem", lineHeight: 1.5 }}>
              Are you absolutely sure you want to delete <strong>{subscriberToDelete.email}</strong> from your campaign list? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "2rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setSubscriberToDelete(null)}
                style={{ padding: "10px 20px", borderRadius: "30px", border: "1px solid #E2E8F0", backgroundColor: "#fff", fontWeight: 600, fontSize: "13px", color: "#64748B", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSingle}
                style={{ padding: "10px 20px", borderRadius: "30px", border: "none", backgroundColor: "#EF4444", fontWeight: 600, fontSize: "13px", color: "#fff", cursor: "pointer" }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "2rem",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            border: "1px solid #E2E8F0"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B", margin: 0, fontFamily: "Marcellus, serif" }}>Bulk Delete Subscribers</h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "1rem", lineHeight: 1.5 }}>
              Are you sure you want to delete the selected <strong>{selectedIds.length}</strong> subscribers? This action will permanently remove all selected emails.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "2rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowBulkDeleteModal(false)}
                style={{ padding: "10px 20px", borderRadius: "30px", border: "1px solid #E2E8F0", backgroundColor: "#fff", fontWeight: 600, fontSize: "13px", color: "#64748B", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkDelete}
                style={{ padding: "10px 20px", borderRadius: "30px", border: "none", backgroundColor: "#EF4444", fontWeight: 600, fontSize: "13px", color: "#fff", cursor: "pointer" }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Keyframes styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
