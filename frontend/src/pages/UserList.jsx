import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";
import ToggleButton from "../components/ToggleButton";
import {
  createUser,
  deleteUser,
  getRoles,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "../api/services";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  status: "active",
};

function UserList() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load roles");
    }
  };

  const fetchItems = async (page = pagination.page, searchValue = query) => {
    setLoading(true);
    try {
      const response = await getUsers({
        page,
        limit: pagination.limit,
        search: searchValue,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchItems(1, query);
  }, [query]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...initialForm, role: roles[0]?._id || "" });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      password: "",
      role: item.role?._id || "",
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
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }

      if (editingItem) {
        await updateUser(editingItem._id, payload);
        toast.success("User updated");
      } else {
        await createUser(payload);
        toast.success("User created");
      }
      closeModal();
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchItems(pagination.page, query);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user");
    } finally {
      setActionId("");
    }
  };

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleUserStatus(id);
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
            <h3 className="text-2xl font-semibold text-ink">User List</h3>
            <p className="mt-1 text-sm text-slate-500">Manage registered users, roles and status.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Add Register
          </button>
        </div>
        <div className="mt-5 flex gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
        <Loader label="Loading users..." />
      ) : (
        <>
          <Table
            columns={[
              { key: "serial", label: "Serial Number" },
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone Number" },
              { key: "role", label: "Role" },
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
                <td className="px-5 py-4">{item.email}</td>
                <td className="px-5 py-4">{item.phone || "-"}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {item.role?.name || "-"}
                  </span>
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
        title={editingItem ? "Edit User" : "Add User"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update User" : "Create User"}
        loading={saving}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder={editingItem ? "Leave blank to keep current password" : ""}
              required={!editingItem}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
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

export default UserList;

