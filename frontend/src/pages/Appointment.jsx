import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ExportButton from "../components/ExportButton";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ServiceDropdown from "../components/ServiceDropdown";
import StatusBadge from "../components/StatusBadge";
import StatusDropdown from "../components/StatusDropdown";
import Table from "../components/Table";
import {
  deleteAppointment,
  exportAppointmentsCsv,
  getAppointments,
  getServicesMaster,
  updateAppointment,
} from "../api/services";

const statusOptions = [
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const selectStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  padding: "0.5rem 0.875rem",
  fontSize: "0.875rem",
  color: "#334155",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};

function Appointment() {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [quickFilter, setQuickFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, item: null });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const serviceOptions = useMemo(() => {
    const serviceItems = services?.data || services || [];
    return serviceItems.map((service) => ({
      label: service.title || service.name,
      value: service.title || service.name,
    }));
  }, [services]);

  const fetchServices = async () => {
    try {
      const response = await getServicesMaster();
      setServices(response.data || response);
    } catch {
      setServices([]);
    }
  };

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getAppointments({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        status,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        quickFilter,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);
  useEffect(() => { fetchItems(1); }, [debouncedSearch, status, startDate, endDate, sortBy, sortOrder, quickFilter]);

  const updateInline = async (id, payload) => {
    setActionId(id);
    try {
      await updateAppointment(id, payload);
      toast.success("Appointment updated");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update appointment");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    setActionId(id);
    try {
      await deleteAppointment(id);
      toast.success("Appointment deleted");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete appointment");
    } finally {
      setActionId("");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAppointmentsCsv();
      toast.success("CSV exported");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Appointment List
            </h3>
            <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#64748B", margin: "0.25rem 0 0" }}>
              Manage bookings, update services and export appointment leads.
            </p>
          </div>
          <ExportButton onClick={handleExport} loading={exporting} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <select
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Appointments</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="pending">Pending</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="createdAt">Sort by Created Date</option>
              <option value="appointmentDate">Sort by Appointment Date</option>
              <option value="name">Sort by Name</option>
              <option value="service">Sort by Service</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={selectStyle}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader label="Loading appointments..." />
      ) : (
        <>
          <Table
            stickyHeader
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "mobile", label: "Mobile" },
              { key: "service", label: "Service" },
              { key: "appointmentDate", label: "Appt. Date" },
              { key: "message", label: "Message" },
              { key: "status", label: "Status" },
              { key: "createdAt", label: "Created" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item) => (
              <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap" }}>{item.name}</td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#475569", fontSize: "0.8rem" }}>{item.email}</td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#475569", whiteSpace: "nowrap" }}>{item.mobile}</td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <ServiceDropdown
                    value={item.service}
                    options={serviceOptions}
                    disabled={actionId === item._id}
                    onChange={(value) => updateInline(item._id, { service: value })}
                  />
                </td>
                <td style={{ padding: "0.875rem 1.25rem", whiteSpace: "nowrap", color: "#475569", fontSize: "0.875rem" }}>
                  {new Date(item.appointmentDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.875rem 1.25rem", maxWidth: "180px" }}>
                  <button
                    type="button"
                    onClick={() => setMessageModal({ open: true, item })}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#2563EB",
                      fontSize: "0.8rem",
                      textDecoration: "underline",
                      textAlign: "left",
                      padding: 0,
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {item.message || "—"}
                  </button>
                </td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <StatusBadge status={item.status} />
                    <StatusDropdown
                      value={item.status}
                      options={statusOptions}
                      disabled={actionId === item._id}
                      onChange={(value) => updateInline(item._id, { status: value })}
                    />
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#64748B", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    disabled={actionId === item._id}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </Table>

          <PaginationBar pagination={pagination} onPageChange={fetchItems} />
        </>
      )}

      <Modal
        open={messageModal.open}
        title="Appointment Message"
        onClose={() => setMessageModal({ open: false, item: null })}
        onSubmit={() => setMessageModal({ open: false, item: null })}
        submitLabel="Close"
        loading={false}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontWeight: 600, color: "#0F172A", margin: 0 }}>{messageModal.item?.name}</p>
          <p
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "0.875rem",
              fontSize: "0.875rem",
              color: "#475569",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {messageModal.item?.message || "No message provided"}
          </p>
        </div>
      </Modal>
    </div>
  );
}

function PaginationBar({ pagination, onPageChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "0.875rem 1.25rem",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <p style={{ fontSize: "0.875rem", color: "#64748B", margin: 0 }}>
        Page {pagination.page} of {pagination.totalPages}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="btn-secondary"
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.8rem" }}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="btn-secondary"
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.8rem" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Appointment;
