import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createSecondCategory,
  deleteSecondCategory,
  getSecondCategories,
  getServiceCategories,
  toggleSecondCategoryStatus,
  updateSecondCategory,
} from "../api/services";

const initialForm = {
  categoryId: "",
  name: "",
  slug: "",
  order: 0,
  status: "active",
};

function SecondCategory() {
  const [categories, setCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      const response = await getServiceCategories({ page: 1, limit: 100 });
      setCategories(response.data);
      if (!selectedCategory && response.data[0]) {
        setSelectedCategory(response.data[0]._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load categories");
    }
  };

  const fetchSecondCategories = async (categoryId = selectedCategory) => {
    setLoading(true);
    try {
      const response = await getSecondCategories(categoryId ? { categoryId } : {});
      setSecondCategories(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load second categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSecondCategories(selectedCategory);
  }, [selectedCategory]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm((prev) => ({ ...initialForm, categoryId: selectedCategory || categories[0]?._id || "" }));
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      categoryId: item.categoryId?._id || "",
      name: item.name,
      slug: item.slug,
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
        await updateSecondCategory(editingItem._id, form);
        toast.success("Second category updated");
      } else {
        await createSecondCategory(form);
        toast.success("Second category created");
      }
      closeModal();
      fetchSecondCategories(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save second category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this second category?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteSecondCategory(id);
      toast.success("Second category deleted");
      fetchSecondCategories(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete second category");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleSecondCategoryStatus(id);
      toast.success("Status updated");
      fetchSecondCategories(selectedCategory);
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
            <h3 className="text-2xl font-semibold text-ink">Second Category</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage second-level service groups under each parent category.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Second Category
          </button>
        </div>

        <div className="mt-5 max-w-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Parent Category</label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading second categories..." />
      ) : (
        <Table
          columns={[
            { key: "category", label: "Category Name" },
            { key: "name", label: "Second Category Name" },
            { key: "order", label: "Order" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
        >
          {secondCategories.map((item) => (
            <tr key={item._id} className="text-sm text-slate-600">
              <td className="px-5 py-4 font-semibold text-ink">{item.categoryId?.name || "-"}</td>
              <td className="px-5 py-4">
                <div className="font-semibold text-ink">{item.name}</div>
                <div className="text-xs text-slate-400">{item.slug}</div>
              </td>
              <td className="px-5 py-4">{item.order}</td>
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
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Second Category" : "Add Second Category"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Second Category" : "Create Second Category"}
        loading={saving}
      >
        <div className="grid gap-5 md">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Parent Category</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Second Category Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
            <input
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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

export default SecondCategory;


