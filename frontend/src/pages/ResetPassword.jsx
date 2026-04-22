import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { resetPassword } from "../api/services";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await resetPassword(token, { password: form.password });
      toast.success("Password updated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-darkBg overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradientStart/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md p-8 card-glass border-slate-700/50 bg-darkCard/60 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-gradientStart to-primary mb-6 shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Set New Password</h1>
          <p className="mt-3 text-sm text-slate-400">Please choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-12 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-12 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-gradientStart to-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Cancel and return
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
