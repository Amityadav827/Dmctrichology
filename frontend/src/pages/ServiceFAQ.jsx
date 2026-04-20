import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createServiceFaq,
  deleteServiceFaq,
  getSecondCategories,
  getServiceCategories,
  getServiceFaqs,
  toggleServiceFaqStatus,
  updateServiceFaq,
} from "../api/services";

const initialForm = {
  serviceId: "",
  question: "",
  answer: "",
  order: 0,
  status: "active",
};

function ServiceFAQ() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const filteredServices = useMemo(() => {
    if (!selectedCategory) {
      return services;
    }

    return services.filter((item) => item.categoryId?._id === selectedCategory);
  }, [services, selectedCategory]);

  const fetchFilters = async () => {
    try {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        getServiceCategories({ page: 1, limit: 100 }),
        getSecondCategories(),
      ]);
      setCategories(categoriesResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load filters");
    }
  };

  const fetchFaqs = async (serviceId = selectedService) => {
    setLoading(true);
    try {
      const response = await getServiceFaqs(serviceId ? { serviceId } : {});
      setFaqs(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedService) {
      const exists = filteredServices.some((service) => service._id === selectedService);
      if (!exists) {
        setSelectedService("");
      }
    }
  }, [selectedCategory, selectedService, filteredServices]);

  useEffect(() => {
    fetchFaqs(selectedService);
  }, [selectedService]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm((prev) => ({ ...initialForm, serviceId: selectedService || filteredServices[0]?._id || "" }));
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    const categoryId = item.serviceId?.categoryId?._id || "";
    setSelectedCategory(categoryId);
    setForm({
      serviceId: item.serviceId?._id || "",
      question: item.question,
      answer: item.answer,
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
        await updateServiceFaq(editingItem._id, form);
        toast.success("FAQ updated");
      } else {
        await createServiceFaq(form);
        toast.success("FAQ created");
      }
      closeModal();
      fetchFaqs(selectedService);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteServiceFaq(id);
      toast.success("FAQ deleted");
      fetchFaqs(selectedService);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete FAQ");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleServiceFaqStatus(id);
      toast.success("Status updated");
      fetchFaqs(selectedService);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const modalServices = selectedCategory
    ? services.filter((item) => item.categoryId?._id === selectedCategory)
    : services;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Service FAQ</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage question and answer sets for each service under the selected category.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add FAQ
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
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
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Second Category</label>
            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">All Services</option>
              {filteredServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading FAQs..." />
      ) : (
        <Table
          columns={[
            { key: "service", label: "Service Name" },
            { key: "question", label: "Question" },
            { key: "order", label: "Order" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
        >
          {faqs.map((item) => (
            <tr key={item._id} className="text-sm text-slate-600">
              <td className="px-5 py-4">
                <div className="font-semibold text-ink">{item.serviceId?.name || "-"}</div>
                <div className="text-xs text-slate-400">
                  {item.serviceId?.categoryId?.name || "No category"}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="font-semibold text-ink">{item.question}</div>
                <div className="mt-1 line-clamp-2 text-xs text-slate-400">{item.answer}</div>
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
                    className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 disabled:opacity-60"
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
        title={editingItem ? "Edit FAQ" : "Add FAQ"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update FAQ" : "Create FAQ"}
        loading={saving}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Second Category</label>
            <select
              value={form.serviceId}
              onChange={(event) => setForm((prev) => ({ ...prev, serviceId: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            >
              <option value="">Select service</option>
              {modalServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Question</label>
            <input
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Answer</label>
            <textarea
              rows="5"
              value={form.answer}
              onChange={(event) => setForm((prev) => ({ ...prev, answer: event.target.value }))}
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

export default ServiceFAQ;
