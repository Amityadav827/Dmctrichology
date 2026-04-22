import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ExportButton from "../components/ExportButton";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Table from "../components/Table";
import CustomDropdown from "../components/CustomDropdown";
import {
  deleteCallback,
  exportCallbacksCsv,
  getCallbacks,
  updateCallbackStatus,
} from "../api/services";

const statusOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Converted", value: "converted" },
];

function Callback() {
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
    try {
      await updateCallbackStatus(id, { status: value });
      toast.success("Status updated");
      fetchItems(pagination.page);
    } catch (error) {
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
    try {
      await deleteCallback(id);
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
      await exportCallbacksCsv();
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Request A Callback List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Track callback leads with date filters, statuses and exports.
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
        <Loader label="Loading callback leads..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "mobile", label: "Mobile" },
              { key: "status", label: "Status" },
              { key: "createdAt", label: "Created Date" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item) => (
              <tr key={item._id} className="text-sm text-slate-600">
                <td className="px-5 py-4 font-semibold text-ink">{item.name}</td>
                <td className="px-5 py-4">{item.mobile}</td>
                <td className="px-5 py-4">
                  <div className="max-w-[160px]">
                    <CustomDropdown
                      value={item.status}
                      onChange={(val) => handleStatusChange(item._id, val)}
                      options={statusOptions}
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
    </div>
  );
}

function Pagination({ pagination, onPageChange }) {
  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Callback;



