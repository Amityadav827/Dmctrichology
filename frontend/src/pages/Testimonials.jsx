import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import StarRating from "../components/StarRating";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  toggleTestimonialStatus,
  updateTestimonial,
} from "../api/services";

const initialForm = {
  source: "manual",
  name: "",
  designation: "",
  message: "",
  rating: 5,
  status: "active",
};

function Testimonials() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async (page = pagination.page, searchValue = query, sourceValue = sourceFilter) => {
    setLoading(true);
    try {
      const response = await getTestimonials({
        page,
        limit: pagination.limit,
        search: searchValue,
        source: sourceValue || undefined,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1, query, sourceFilter);
  }, [query, sourceFilter]);

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      source: item.source,
      name: item.name,
      designation: item.designation || "",
      message: item.message,
      rating: item.rating,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await updateTestimonial(editingItem._id, form);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(form);
        toast.success("Testimonial created");
      }

      closeModal();
      fetchItems(pagination.page, query, sourceFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchItems(pagination.page, query, sourceFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete testimonial");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleTestimonialStatus(id);
      toast.success("Status updated");
      fetchItems(pagination.page, query, sourceFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg lg lg">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Testimonials List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage written testimonials with source filters, ratings and quick status controls.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Testimonials
          </button>
        </div>

        <div className="mt-5 grid gap-3 md_220px_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or message"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus focus"
          />
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="">All Sources</option>
            <option value="google">Google</option>
            <option value="manual">Manual</option>
            <option value="website">Website</option>
          </select>
          <button
            type="button"
            onClick={() => setQuery(search)}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading testimonials..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "id", label: "ID" },
              { key: "source", label: "Source" },
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
              { key: "rating", label: "Rating" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item, index) => (
              <tr key={item._id} className="text-sm text-slate-600">
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      item.source === "google"
                        ? "bg-blue-100 text-blue-700"
                        : item.source === "website"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.source}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-ink">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.designation || "-"}</div>
                </td>
                <td className="px-5 py-4 max-w-md">
                  <p className="truncate text-slate-500">{item.message}</p>
                </td>
                <td className="px-5 py-4">
                  <StarRating value={item.rating} />
                </td>
                <td className="px-5 py-4">
                  <ToggleButton
                    status={item.status}
                    loading={actionId === item._id}
                    onClick={() => handleToggle(item._id)}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={actionId === item._id}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          <div className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-panel md md md">
            <p className="text-sm text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchItems(pagination.page - 1, query, sourceFilter)}
                disabled={pagination.page <= 1}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchItems(pagination.page + 1, query, sourceFilter)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Testimonial" : "Create Testimonial"}
        loading={saving}
      >
        <div className="grid gap-5 md">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Source</label>
            <select
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="google">Google</option>
              <option value="manual">Manual</option>
              <option value="website">Website</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div className="md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Designation</label>
            <input
              value={form.designation}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, designation: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>
          <div className="md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Message</label>
            <textarea
              rows="5"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
            <StarRating
              value={form.rating}
              interactive
              onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Testimonials;


