import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createVideo,
  deleteVideo,
  getVideoCategories,
  getVideos,
  toggleVideoStatus,
  updateVideo,
  updateVideoOrder,
} from "../api/services";

const initialForm = {
  categoryId: "",
  title: "",
  videoUrl: "",
  order: 0,
  status: "active",
  thumbnail: null,
};

function VideoInner() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      const response = await getVideoCategories({ page: 1, limit: 100 });
      setCategories(response.data);
      if (!selectedCategory && response.data[0]) {
        setSelectedCategory(response.data[0]._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load video categories");
    }
  };

  const fetchItems = async (categoryId = selectedCategory) => {
    setLoading(true);
    try {
      const response = await getVideos(categoryId ? { categoryId } : {});
      setItems(response.data);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      ...initialForm,
      categoryId: selectedCategory || categories[0]?._id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      categoryId: item.categoryId?._id || "",
      title: item.title,
      videoUrl: item.videoUrl,
      order: item.order,
      status: item.status,
      thumbnail: null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("categoryId", form.categoryId);
    formData.append("title", form.title);
    formData.append("videoUrl", form.videoUrl);
    formData.append("order", form.order);
    formData.append("status", form.status);
    if (form.thumbnail instanceof File) {
      formData.append("thumbnail", form.thumbnail);
    }
    return formData;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = buildFormData();
      if (editingItem) {
        await updateVideo(editingItem._id, payload);
        toast.success("Video updated");
      } else {
        await createVideo(payload);
        toast.success("Video created");
      }
      closeModal();
      fetchItems(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteVideo(id);
      toast.success("Video deleted");
      fetchItems(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete video");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleVideoStatus(id);
      toast.success("Status updated");
      fetchItems(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateVideoOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order updated");
      fetchItems(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order");
    } finally {
      setOrderSavingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Video List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage video items, hosted links, thumbnails and sort order from one screen.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Video
          </button>
        </div>

        <div className="mt-5 max-w-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Video Category</label>
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
        <Spinner label="Loading videos..." />
      ) : (
        <Table
          columns={[
            { key: "id", label: "ID" },
            { key: "service", label: "Service" },
            { key: "heading", label: "Video Heading" },
            { key: "thumb", label: "Thumbnail" },
            { key: "order", label: "Order" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
        >
          {items.map((item, index) => (
            <tr key={item._id} className="text-sm text-slate-600">
              <td className="px-5 py-4 font-semibold text-slate-500">{index + 1}</td>
              <td className="px-5 py-4 font-semibold text-ink">{item.categoryId?.name || "-"}</td>
              <td className="px-5 py-4">
                <div className="font-semibold text-ink">{item.title}</div>
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-coral underline"
                >
                  Open video
                </a>
              </td>
              <td className="px-5 py-4">
                <img
                  src={`http://127.0.0.1:5000${item.thumbnail}`}
                  alt={item.title}
                  className="h-16 w-20 rounded-2xl object-cover"
                />
              </td>
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
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
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
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Video" : "Add Video"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Video" : "Create Video"}
        loading={saving}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Video Heading</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Video URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="https://youtube.com/watch?v=..."
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
          <div className="md:col-span-2">
            <ImageUpload
              label="Upload Thumbnail"
              file={form.thumbnail}
              previewUrl={editingItem ? `http://127.0.0.1:5000${editingItem.thumbnail}` : ""}
              onFileChange={(file) => setForm((prev) => ({ ...prev, thumbnail: file }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VideoInner;

