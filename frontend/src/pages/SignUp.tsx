import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Briefcase,
  UserCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";
import { authApi, ApiError } from "../lib/api";

interface LocationState {
  role?: UserRole;
}

export default function SignUp() {
  const location = useLocation();
  const preselectedRole = (location.state as LocationState | null)?.role;

  const [role, setRole]               = useState<UserRole>(preselectedRole ?? "worker");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Helpers ────────────────────────────────────────────────────────────────

  function clearErrors() {
    setError(null);
    setFieldErrors({});
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);

    try {
      // 1. Hit the backend signup endpoint
      await authApi.signUp({
        name:        name.trim(),
        email:       email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        role,
      });


      // 2. Immediately log the user in with the real credentials
      //    (signup returns no token by design — the user must confirm email
      //     OR we call login right after if email confirmation is disabled)
      const loginData = await authApi.login({
        email:    email.trim(),
        password,
      });

      // 3. Store user + token in AuthContext (and localStorage)
      login(
        {
          id:          loginData.user.id,
          name:        loginData.user.name,
          email:       loginData.user.email,
          phoneNumber: loginData.user.phoneNumber,
          role,
        },
        loginData.token
      );

      // 4. Redirect to the correct dashboard
      navigate(role === "worker" ? "/dashboard" : "/client-dashboard");

    } catch (err) {
      if (err instanceof ApiError) {
        // Zod validation details from the backend (array of { path, message })
        if (err.status === 400 && Array.isArray(err.details)) {
          const mapped: Record<string, string> = {};
          for (const issue of err.details as Array<{ path: string[]; message: string }>) {
            const field = issue.path[0];
            if (field) mapped[field] = issue.message;
          }
          setFieldErrors(mapped);
          setError("Please fix the errors below.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-amber/15 blur-3xl animate-blob [animation-delay:4s]" />
        <div className="absolute top-1/2 left-0 h-72 w-72 rounded-full bg-violet/15 blur-3xl animate-blob [animation-delay:2s]" />
      </div>

      <Reveal className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Logo size={30} />
          <span className="font-display text-xl font-semibold text-paper">LindaKazi</span>
        </Link>

        <div className="relative overflow-hidden rounded-card border border-line bg-surface-raised/90 backdrop-blur p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-8 animate-glow">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-paper">Create your account</h1>
            <p className="mt-1 text-sm text-mist">Join LindaKazi and take control of your safety loop</p>
          </div>

          {/* Role toggle */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-pill border border-line bg-ink p-1">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`flex items-center justify-center gap-1.5 rounded-pill py-2 text-xs font-semibold transition-all ${
                role === "worker"
                  ? "bg-teal text-ink shadow-[0_0_20px_-4px_rgba(46,230,199,0.6)]"
                  : "text-mist hover:text-paper"
              }`}
            >
              <UserCheck size={14} />
              Worker
            </button>
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex items-center justify-center gap-1.5 rounded-pill py-2 text-xs font-semibold transition-all ${
                role === "client"
                  ? "bg-amber text-ink shadow-[0_0_20px_-4px_rgba(255,168,61,0.6)]"
                  : "text-mist hover:text-paper"
              }`}
            >
              <Briefcase size={14} />
              Client
            </button>
          </div>

          {/* Global error banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Full name */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Full name
              </span>
              <span
                className={`flex items-center gap-2 rounded-lg border bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60 ${
                  fieldErrors.name ? "border-red-500/60" : "border-line"
                }`}
              >
                <User size={15} className="text-mist-dim" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearErrors(); }}
                  placeholder="e.g. Amina Wanjiru"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                  autoComplete="name"
                />
              </span>
              {fieldErrors.name && (
                <span className="text-[11px] text-red-400">{fieldErrors.name}</span>
              )}
            </label>

            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Email
              </span>
              <span
                className={`flex items-center gap-2 rounded-lg border bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60 ${
                  fieldErrors.email ? "border-red-500/60" : "border-line"
                }`}
              >
                <Mail size={15} className="text-mist-dim" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                  autoComplete="email"
                />
              </span>
              {fieldErrors.email && (
                <span className="text-[11px] text-red-400">{fieldErrors.email}</span>
              )}
            </label>

            {/* Phone number */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Phone number
              </span>
              <span
                className={`flex items-center gap-2 rounded-lg border bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60 ${
                  fieldErrors.phoneNumber ? "border-red-500/60" : "border-line"
                }`}
              >
                <Phone size={15} className="text-mist-dim" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); clearErrors(); }}
                  placeholder="+254 712 345 678"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                  autoComplete="tel"
                />
              </span>
              {fieldErrors.phoneNumber && (
                <span className="text-[11px] text-red-400">{fieldErrors.phoneNumber}</span>
              )}
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Password
              </span>
              <span
                className={`flex items-center gap-2 rounded-lg border bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60 ${
                  fieldErrors.password ? "border-red-500/60" : "border-line"
                }`}
              >
                <Lock size={15} className="text-mist-dim" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-mist-dim transition-colors hover:text-teal"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </span>
              {fieldErrors.password && (
                <span className="text-[11px] text-red-400">{fieldErrors.password}</span>
              )}
            </label>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-pill bg-teal px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_-5px_rgba(46,230,199,0.6)] transition-all hover:-translate-y-0.5 hover:bg-teal-dim disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Sign Up as {role === "worker" ? "Worker" : "Client"}
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <p className="mt-6 text-center text-sm text-mist">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-soft hover:text-teal font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-mist">
          <Link to="/" className="text-teal-soft hover:text-teal">
            ← Back to home
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
