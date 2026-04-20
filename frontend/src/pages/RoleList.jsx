import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckboxGroup from "../components/CheckboxGroup";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { createRole, deleteRole, getRoles, updateRole } from "../api/services";

const permissionOptions = [
  { label: "Dashboard", value: "dashboard" },
  { label: "SEO", value: "seo" },
  { label: "Services", value: "services" },
  { label: "Result", value: "result" },
  { label: "Video", value: "video" },
  { label: "Gallery", value: "gallery" },
  { label: "Testimonial", value: "testimonial" },
  { label: "Blog", value: "blog" },
  { label: "Users", value: "users" },
];

const initialForm = {
  name: "",
  permissions: [],
};

function RoleList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setItems(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load roles");
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
      permissions: item.permissions || [],
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
        await updateRole(editingItem._id, form);
        toast.success("Role updated");
      } else {
        await createRole(form);
        toast.success("Role created");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteRole(id);
      toast.success("Role deleted");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete role");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Role List</h3>
            <p className="mt-1 text-sm text-slate-500">Create roles and attach module permissions.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Role
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading roles..." />
      ) : (
        <Table
          columns={[
            { key: "name", label: "Role Name" },
            { key: "permissions", label: "Permissions" },
            { key: "actions", label: "Actions" },
          ]}
        >
          {items.map((item) => (
            <tr key={item._id} className="text-sm text-slate-600">
              <td className="px-5 py-4 font-semibold uppercase text-ink">{item.name}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {(item.permissions || []).map((permission) => (
                    <span
                      key={permission}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700"
                    >
                      {permission}
                    </span>
                  ))}
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
                    disabled={actionId === item._id || item.name === "admin"}
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
        title={editingItem ? "Edit Role" : "Add Role"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Role" : "Create Role"}
        loading={saving}
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Role Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">Permissions</label>
            <CheckboxGroup
              options={permissionOptions}
              values={form.permissions}
              onChange={(values) => setForm((prev) => ({ ...prev, permissions: values }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RoleList;
