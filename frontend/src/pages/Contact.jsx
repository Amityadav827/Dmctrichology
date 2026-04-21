import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ExportButton from "../components/ExportButton";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import {
  deleteContact,
  exportContactsCsv,
  getContacts,
  updateContact,
} from "../api/services";

const statusOptions = [
  { label: "New", value: "new" },
  { label: "Replied", value: "replied" },
  { label: "Closed", value: "closed" },
];

function Contact() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, item: null });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getContacts({
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load contact leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, [debouncedSearch, status, startDate, endDate]);

  const handleStatusChange = async (id, value) => {
    setActionId(id);
    try {
      await updateContact(id, { status: value });
      toast.success("Status updated");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact lead?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteContact(id);
      toast.success("Lead deleted");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete lead");
    } finally {
      setActionId("");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportContactsCsv();
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
            <h3 className="text-2xl font-semibold text-ink">Contact Us List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Review contact form submissions, update statuses and export the latest lead sheet.
            </p>
          </div>
          <ExportButton onClick={handleExport} loading={exporting} />
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
        <Loader label="Loading contact leads..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "mobile", label: "Mobile" },
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
                <td className="px-5 py-4 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setMessageModal({ open: true, item })}
                    className="truncate text-left text-slate-500 underline"
                  >
                    {item.message}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <select
                      value={item.status}
                      onChange={(event) => handleStatusChange(item._id, event.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
        title="Contact Message"
        onClose={() => setMessageModal({ open: false, item: null })}
        onSubmit={() => setMessageModal({ open: false, item: null })}
        submitLabel="Close"
        loading={false}
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">{messageModal.item?.name}</p>
          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {messageModal.item?.message}
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

export default Contact;


