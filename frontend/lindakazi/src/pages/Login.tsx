import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Briefcase, UserCheck, Mail, Lock, User } from "lucide-react";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState<UserRole>("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    login({ name: name.trim(), email: email.trim(), role });
    navigate("/");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
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
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-paper">Welcome back</h1>
            <p className="mt-1 text-sm text-mist">Sign in to continue to your safety loop</p>
          </div>

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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Full name
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60">
                <User size={15} className="text-mist-dim" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Wanjiru"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Email
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60">
                <Mail size={15} className="text-mist-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Password
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2.5 transition-colors focus-within:border-teal/60">
                <Lock size={15} className="text-mist-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-mist-dim focus:outline-none"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-pill bg-teal px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_-5px_rgba(46,230,199,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
            >
              <ShieldCheck size={16} />
              Sign In as {role === "worker" ? "Worker" : "Client"}
            </button>
          </form>
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