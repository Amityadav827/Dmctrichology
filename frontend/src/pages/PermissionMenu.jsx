import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckboxGroup from "../components/CheckboxGroup";
import Loader from "../components/Loader";
import { getRoles, updateRole } from "../api/services";

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

function PermissionMenu() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.data);
      if (response.data[0]) {
        setSelectedRoleId(response.data[0]._id);
        setPermissions(response.data[0].permissions || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const selectedRole = roles.find((role) => role._id === selectedRoleId);
    setPermissions(selectedRole?.permissions || []);
  }, [selectedRoleId, roles]);

  const handleSave = async () => {
    if (!selectedRoleId) {
      return;
    }

    setSaving(true);
    try {
      const selectedRole = roles.find((role) => role._id === selectedRoleId);
      await updateRole(selectedRoleId, {
        name: selectedRole?.name,
        permissions,
      });
      toast.success("Permissions updated");
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 shadow-panel">
        <h3 className="text-2xl font-semibold text-ink">Permission Menu</h3>
        <p className="mt-1 text-sm text-slate-500">
          Control access to all admin modules using role-based permissions.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading permissions..." />
      ) : (
        <div className="rounded-[28px] bg-white p-6 shadow-panel">
          <div className="max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Select Role</label>
            <select
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <CheckboxGroup options={permissionOptions} values={permissions} onChange={setPermissions} />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedRoleId}
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Permissions"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionMenu;
