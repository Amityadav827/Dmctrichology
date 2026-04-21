import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createResultCategory,
  deleteResultCategory,
  getResultCategories,
  toggleResultCategoryStatus,
  updateResultCategory,
  updateResultCategoryOrder,
} from "../api/services";

const initialForm = {
  name: "",
  description: "",
  order: 0,
  status: "active",
};

function ResultCategory() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async (page = pagination.page, searchValue = query) => {
    setLoading(true);
    try {
      const response = await getResultCategories({
        page,
        limit: pagination.limit,
        search: searchValue,
      });
      setItems(response.data);
      setPagination(response.pagination);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load result categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1, query);
  }, [query]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      order: item.order,
      status: item.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await updateResultCategory(editingItem._id, form);
        toast.success("Result category updated");
      } else {
        await createResultCategory(form);
        toast.success("Result category created");
      }
      closeModal();
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save result category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result category?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteResultCategory(id);
      toast.success("Result category deleted");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete result category");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleResultCategoryStatus(id);
      toast.success("Status updated");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateResultCategoryOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order updated");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    } finally {
      setOrderSavingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg lg lg">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Result Category List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Create and organize result categories with search, paging and inline sorting.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Result Category
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md md md">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search result category"
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus focus"
          />
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
        <Spinner label="Loading result categories..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "id", label: "ID" },
              { key: "category", label: "Result Category" },
              { key: "description", label: "Description" },
              { key: "order", label: "Order" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item, index) => (
              <tr key={item._id} className="text-sm text-slate-600">
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td className="px-5 py-4 font-semibold text-ink">{item.name}</td>
                <td className="px-5 py-4 max-w-md text-slate-500">{item.description || "-"}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={orderMap[item._id] ?? item.order}
                      onChange={(event) =>
                        setOrderMap((prev) => ({ ...prev, [item._id]: event.target.value }))
                      }
                      className="w-20 rounded-xl border border-slate-200 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleOrderSave(item._id)}
                      disabled={orderSavingId === item._id}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled"
                    >
                      {orderSavingId === item._id ? "Saving..." : "Save"}
                    </button>
                  </div>
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
                onClick={() => fetchItems(pagination.page - 1, query)}
                disabled={pagination.page <= 1}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchItems(pagination.page + 1, query)}
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
        title={editingItem ? "Edit Result Category" : "Add Result Category"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Result Category" : "Create Result Category"}
        loading={saving}
      >
        <div className="grid gap-5 md">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>
          <div className="md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>
          <div className="md">
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

export default ResultCategory;


