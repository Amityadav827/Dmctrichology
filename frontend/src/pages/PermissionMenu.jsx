import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { 
  Shield, CheckCircle, XCircle, Info, 
  ChevronRight, Layers, Lock, Globe, 
  FileText, Users, Play, Image, MessageSquare, 
  Layout, Save
} from "lucide-react";
import Loader from "../components/Loader";
import { getRoles, updateRole } from "../api/services";

const permissionGroups = [
  { 
    title: "Core Access", 
    icon: <Layout size={18} />,
    options: [
      { label: "Dashboard Overview", value: "dashboard" },
      { label: "SEO Management", value: "seo" },
    ]
  },
  { 
    title: "Content Management", 
    icon: <FileText size={18} />,
    options: [
      { label: "Services", value: "services" },
      { label: "Results", value: "result" },
      { label: "Blog Posts", value: "blog" },
      { label: "CMS Pages", value: "cms" },
    ]
  },
  { 
    title: "Media & Social", 
    icon: <Image size={18} />,
    options: [
      { label: "Video Library", value: "video" },
      { label: "Image Gallery", value: "gallery" },
      { label: "Testimonials", value: "testimonial" },
    ]
  },
  { 
    title: "System & Safety", 
    icon: <Lock size={18} />,
    options: [
      { label: "User Management", value: "users" },
      { label: "System Config", value: "config" },
    ]
  }
];

const allPermissionValues = permissionGroups.flatMap(g => g.options.map(o => o.value));

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
      toast.error("Unable to load access control data");
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

  const togglePermission = (value) => {
    setPermissions(prev => 
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    );
  };

  const toggleGroup = (values, isAllInGroup) => {
    if (isAllInGroup) {
      setPermissions(prev => prev.filter(p => !values.includes(p)));
    } else {
      setPermissions(prev => [...new Set([...prev, ...values])]);
    }
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      const selectedRole = roles.find((role) => role._id === selectedRoleId);
      await updateRole(selectedRoleId, {
        name: selectedRole?.name,
        permissions,
      });
      toast.success("Access permissions updated successfully");
      // Update local state to reflect changes
      setRoles(prev => prev.map(r => r._id === selectedRoleId ? { ...r, permissions } : r));
    } catch (error) {
      toast.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const isAllSelected = useMemo(() => 
    allPermissionValues.every(v => permissions.includes(v)), 
  [permissions]);

  const toggleAll = () => {
    setPermissions(isAllSelected ? [] : [...allPermissionValues]);
  };

  if (loading) return <Loader label="Mapping security matrix..." />;

  const selectedRoleName = roles.find(r => r._id === selectedRoleId)?.name || "";

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Access Control Center</h3>
          <p className="text-sm text-slate-500 mt-1">Configure module-level visibility for each system role</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAll}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            {isAllSelected ? "Deselect All" : "Select All Modules"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedRoleId}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? "Saving Changes..." : "Save Matrix"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Role Selection */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
          <label className="text-sm font-bold text-slate-900 block mb-4">Target Role</label>
          <div className="space-y-2">
            {roles.map((role) => (
              <div 
                key={role._id}
                onClick={() => setSelectedRoleId(role._id)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRoleId === role._id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className={selectedRoleId === role._id ? 'text-blue-100' : 'text-slate-400'} />
                  <span className="text-sm font-bold uppercase tracking-tight">{role.name}</span>
                </div>
                <ChevronRight size={16} className={selectedRoleId === role._id ? 'text-white/50' : 'text-slate-300'} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Changes made here affect all users currently assigned to the <span className="underline font-bold uppercase">{selectedRoleName}</span> role.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Permission Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {permissionGroups.map((group) => {
            const groupValues = group.options.map(o => o.value);
            const isAllInGroup = groupValues.every(v => permissions.includes(v));
            const isSomeInGroup = groupValues.some(v => permissions.includes(v)) && !isAllInGroup;

            return (
              <div key={group.title} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500">
                      {group.icon}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{group.title}</h4>
                  </div>
                  <button 
                    onClick={() => toggleGroup(groupValues, isAllInGroup)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                  >
                    {isAllInGroup ? "Deselect Group" : "Select Group"}
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.options.map((opt) => (
                    <div 
                      key={opt.value}
                      onClick={() => togglePermission(opt.value)}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        permissions.includes(opt.value) 
                          ? 'bg-blue-50/50 border-blue-100' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          permissions.includes(opt.value) 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-white border-slate-300'
                        }`}>
                          {permissions.includes(opt.value) && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold ${
                          permissions.includes(opt.value) ? 'text-slate-900' : 'text-slate-500'
                        }`}>
                          {opt.label}
                        </span>
                      </div>
                      {permissions.includes(opt.value) ? (
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Allowed</div>
                      ) : (
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Hidden</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PermissionMenu;
