import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createGalleryItems,
  deleteGalleryItem,
  getGalleryItems,
  toggleGalleryItemStatus,
  updateGalleryItem,
} from "../api/services";

const initialForm = {
  title: "",
  images: [],
};

function Gallery() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async (page = pagination.page, searchValue = query) => {
    setLoading(true);
    try {
      const response = await getGalleryItems({
        page,
        limit: pagination.limit,
        search: searchValue,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1, query);
  }, [query]);

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
      title: item.title || "",
      images: [],
    });
    setModalOpen(true);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", form.title);

    if (editingItem) {
      if (form.images[0]) {
        formData.append("images", form.images[0]);
      }
      formData.append("order", editingItem.order ?? 0);
      formData.append("status", editingItem.status ?? "active");
    } else {
      form.images.forEach((image) => formData.append("images", image));
    }

    return formData;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = buildFormData();

      if (!editingItem && !form.images.length) {
        throw new Error("Please select at least one image");
      }

      if (editingItem) {
        await updateGalleryItem(editingItem._id, payload);
        toast.success("Gallery image updated");
      } else {
        await createGalleryItems(payload);
        toast.success("Gallery images uploaded");
      }

      closeModal();
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to save gallery item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery image?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteGalleryItem(id);
      toast.success("Gallery image deleted");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete gallery image");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleGalleryItemStatus(id);
      toast.success("Status updated");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Gallery List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload and manage gallery images with preview-friendly listing.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Gallery
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search gallery by title"
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-coral focus:bg-white"
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
        <Loader label="Loading gallery..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "id", label: "ID" },
              { key: "image", label: "Image" },
              { key: "actions", label: "Actions" },
            ]}
          >
            {items.map((item, index) => (
              <tr key={item._id} className="text-sm text-slate-600">
                <td className="px-5 py-4 font-semibold text-slate-500">
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td className="px-5 py-4">
                  <div className="group flex items-center gap-4">
                    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white p-2">
                      <img
                        src={`http://127.0.0.1:5000${item.image}`}
                        alt={item.title || "Gallery"}
                        className="h-20 w-24 rounded-2xl object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{item.title || "Untitled image"}</div>
                      <div className="mt-2">
                        <ToggleButton
                          status={item.status}
                          loading={actionId === item._id}
                          onClick={() => handleToggle(item._id)}
                        />
                      </div>
                    </div>
                  </div>
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
                      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          <div className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-panel md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchItems(pagination.page - 1, query)}
                disabled={pagination.page <= 1}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchItems(pagination.page + 1, query)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Gallery Image" : "Add Gallery"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Image" : "Upload Images"}
        loading={saving}
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Optional title"
            />
          </div>

          <ImageUpload
            label={editingItem ? "Replace Image" : "Upload Images"}
            file={form.images}
            previewUrl={editingItem ? `http://127.0.0.1:5000${editingItem.image}` : []}
            multiple={!editingItem}
            helperText="Drag and drop one or more gallery images here"
            onFileChange={(files) =>
              setForm((prev) => ({ ...prev, images: Array.isArray(files) ? files : files ? [files] : [] }))
            }
          />
        </div>
      </Modal>
    </div>
  );
}

export default Gallery;
