import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createMenu,
  deleteMenu,
  getMenus,
  toggleMenuStatus,
  updateMenu,
  updateMenuOrder,
} from "../api/services";

const initialForm = {
  name: "",
  url: "",
  order: 0,
  status: "active",
};

function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [orderSavingId, setOrderSavingId] = useState("");
  const [orderMap, setOrderMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getMenus();
      setItems(response.data);
      setOrderMap(
        response.data.reduce((acc, item) => {
          acc[item._id] = item.order;
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      url: item.url,
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
        await updateMenu(editingItem._id, form);
        toast.success("Menu updated");
      } else {
        await createMenu(form);
        toast.success("Menu created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save menu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteMenu(id);
      toast.success("Menu deleted");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete menu");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleMenuStatus(id);
      toast.success("Status updated");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleOrderSave = async (id) => {
    setOrderSavingId(id);
    try {
      await updateMenuOrder(id, { order: Number(orderMap[id]) });
      toast.success("Order updated");
      fetchItems();
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
            <h3 className="text-2xl font-semibold text-ink">Menu List</h3>
            <p className="mt-1 text-sm text-slate-500">Manage dynamic menu links and ordering.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Menu
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading menus..." />
      ) : (
        <Table
          columns={[
            { key: "name", label: "Menu Name" },
            { key: "url", label: "Menu URL" },
            { key: "order", label: "Order" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions" },
          ]}
        >
          {items.map((item) => (
            <tr key={item._id} className="text-sm text-slate-600">
              <td className="px-5 py-4 font-semibold text-ink">{item.name}</td>
              <td className="px-5 py-4 text-slate-500">{item.url}</td>
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
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Menu" : "Add Menu"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Menu" : "Create Menu"}
        loading={saving}
      >
        <div className="grid gap-5 md">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Menu Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Menu URL</label>
            <input
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
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

export default Menu;


