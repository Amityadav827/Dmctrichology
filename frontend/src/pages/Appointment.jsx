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
    } catch (error) {
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

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchItems(1);
  }, [debouncedSearch, status, startDate, endDate, sortBy, sortOrder, quickFilter]);

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
    if (!window.confirm("Delete this appointment?")) {
      return;
    }

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
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg lg lg">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Appointment List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage bookings, update services and export appointment leads.
            </p>
          </div>
          <ExportButton onClick={handleExport} loading={exporting} />
        </div>

        <div className="mt-5 space-y-3">
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

          <div className="grid gap-3 md">
            <select
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">All Appointments</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="appointmentDate">Sort by Appointment Date</option>
              <option value="name">Sort by Name</option>
              <option value="service">Sort by Service</option>
            </select>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

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
              { key: "appointmentDate", label: "Appointment Date" },
              { key: "message", label: "Message" },
              { key: "status", label: "Status" },
              { key: "createdAt", label: "Created Date" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item) => (
              <tr key={item._id} className="text-sm text-slate-600">
                <td className="px-5 py-4 font-semibold text-ink">{item.name}</td>
                <td className="px-5 py-4">{item.email}</td>
                <td className="px-5 py-4">{item.mobile}</td>
                <td className="px-5 py-4">
                  <ServiceDropdown
                    value={item.service}
                    options={serviceOptions}
                    disabled={actionId === item._id}
                    onChange={(value) => updateInline(item._id, { service: value })}
                  />
                </td>
                <td className="px-5 py-4">
                  {new Date(item.appointmentDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setMessageModal({ open: true, item })}
                    className="truncate text-left text-slate-500 underline"
                  >
                    {item.message || "-"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <StatusDropdown
                      value={item.status}
                      options={statusOptions}
                      disabled={actionId === item._id}
                      onChange={(value) => updateInline(item._id, { status: value })}
                    />
                  </div>
                </td>
                <td className="px-5 py-4">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-5 py-4">
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
          </Table>

          <Pagination pagination={pagination} onPageChange={fetchItems} />
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
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">{messageModal.item?.name}</p>
          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {messageModal.item?.message || "No message provided"}
          </p>
        </div>
      </Modal>
    </div>
  );
}

function Pagination({ pagination, onPageChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-panel md md md">
      <p className="text-sm text-slate-500">
        Showing page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Appointment;


