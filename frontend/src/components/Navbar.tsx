import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface NavLink {
  label: string;
  to: string;
}

const links: NavLink[] = [
  { label: "Features", to: "/#safety-loop" },
  { label: "About", to: "/about" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            LindaKazi
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-sm text-mist transition-colors hover:text-paper"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-teal/50 hover:text-teal"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 text-xs text-mist">
                <ShieldCheck size={14} className="text-teal" />
                {user.name.split(" ")[0]} · {user.role === "worker" ? "Worker" : "Client"}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-danger/50 hover:text-danger"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-mist transition-colors hover:text-paper"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="rounded-pill bg-teal px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-dim"
              >
                Get Protected
              </Link>
            </>
          )}
        </div>

        <button
          className="text-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/60 bg-ink px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-mist hover:text-paper"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm text-mist hover:text-paper"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </li>

            {user ? (
              <>
                <li className="font-mono text-xs text-mist">
                  Signed in as {user.name} ({user.role})
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-danger"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-pill bg-teal px-4 py-2 text-center text-sm font-semibold text-ink"
                >
                  Get Protected
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}