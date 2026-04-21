import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Dropdown from "../components/Dropdown";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
  createMenuOperation,
  deleteMenuOperation,
  getMenuOperations,
  getMenus,
  getOperations,
  updateMenuOperation,
} from "../api/services";

const initialForm = {
  menuId: "",
  operationId: "",
};

function MenuOperation() {
  const [menus, setMenus] = useState([]);
  const [operations, setOperations] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const menuOptions = useMemo(
    () => menus.map((menu) => ({ label: menu.name, value: menu._id })),
    [menus]
  );

  const operationOptions = useMemo(
    () => operations.map((operation) => ({ label: operation.name, value: operation._id })),
    [operations]
  );

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [menusResponse, operationsResponse, mappingsResponse] = await Promise.all([
        getMenus(),
        getOperations(),
        getMenuOperations(),
      ]);

      setMenus(menusResponse.data);
      setOperations(operationsResponse.data);
      setItems(mappingsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load menu operations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      menuId: menus[0]?._id || "",
      operationId: operations[0]?._id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      menuId: item.menuId?._id || "",
      operationId: item.operationId?._id || "",
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
        await updateMenuOperation(editingItem._id, form);
        toast.success("Mapping updated");
      } else {
        await createMenuOperation(form);
        toast.success("Mapping created");
      }
      closeModal();
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save mapping");
    } finally {
      setSaving(false);
    }
  };

  const handleInlineMenuSave = async (id, operationId, menuId) => {
    setActionId(id);
    try {
      await updateMenuOperation(id, { operationId, menuId });
      toast.success("Mapping updated");
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update mapping");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mapping?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteMenuOperation(id);
      toast.success("Mapping deleted");
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete mapping");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg lg lg">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Manage Menu Operation List</h3>
            <p className="mt-1 text-sm text-slate-500">
              Map operations to menus and adjust assignments from a single view.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Manage Menu Operation
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading mappings..." />
      ) : (
        <Table
          columns={[
            { key: "operation", label: "Operation Name" },
            { key: "menu", label: "Menu Name" },
            { key: "save", label: "Save" },
            { key: "delete", label: "Delete" },
          ]}
        >
          {items.map((item) => (
            <MenuOperationRow
              key={item._id}
              item={item}
              menuOptions={menuOptions}
              loading={actionId === item._id}
              onSave={handleInlineMenuSave}
              onDelete={handleDelete}
            />
          ))}
        </Table>
      )}

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Menu Operation" : "Add Menu Operation"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Mapping" : "Create Mapping"}
        loading={saving}
      >
        <div className="grid gap-5 md">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Operation Name</label>
            <Dropdown
              value={form.operationId}
              onChange={(value) => setForm((prev) => ({ ...prev, operationId: value }))}
              options={operationOptions}
              placeholder="Select operation"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Menu Name</label>
            <Dropdown
              value={form.menuId}
              onChange={(value) => setForm((prev) => ({ ...prev, menuId: value }))}
              options={menuOptions}
              placeholder="Select menu"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MenuOperationRow({ item, menuOptions, loading, onSave, onDelete }) {
  const [selectedMenuId, setSelectedMenuId] = useState(item.menuId?._id || "");

  useEffect(() => {
    setSelectedMenuId(item.menuId?._id || "");
  }, [item.menuId]);

  return (
    <tr className="text-sm text-slate-600">
      <td className="px-5 py-4 font-semibold text-ink">{item.operationId?.name || "-"}</td>
      <td className="px-5 py-4">
        <Dropdown
          value={selectedMenuId}
          onChange={setSelectedMenuId}
          options={menuOptions}
          placeholder="Select menu"
        />
      </td>
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onSave(item._id, item.operationId?._id, selectedMenuId)}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </td>
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onDelete(item._id)}
          disabled={loading}
          className="btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default MenuOperation;


