import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { forgotPassword } from "../api/services";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await forgotPassword({ email });
      toast.success("Reset link sent to your email");
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset link");
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
            <KeyRound className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password</h1>
          <p className="mt-3 text-sm text-slate-400">Enter your email to receive a password reset link.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 font-medium">
                We've sent a password reset link to <span className="text-white underline">{email}</span>. Please check your inbox.
              </p>
            </div>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  placeholder="admin@dmc.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-gradientStart to-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
