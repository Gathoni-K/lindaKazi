import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, ShieldCheck, LayoutDashboard, Wallet } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const workerLinks = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Safety", to: "/dashboard/safety", icon: ShieldCheck },
  { label: "Earnings", to: "/dashboard/earnings", icon: Wallet },
];

const clientLinks = [{ label: "Dashboard", to: "/client-dashboard", icon: LayoutDashboard }];

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isWorker = user?.role === "worker";
  const links = isWorker ? workerLinks : clientLinks;
  const homeTo = isWorker ? "/dashboard" : "/client-dashboard";
  const badgeLabel = isWorker ? "Verified Worker" : "Verified Client";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 text-sm transition-colors ${
      isActive ? "text-teal font-semibold" : "text-mist hover:text-paper"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to='/' className="flex items-center gap-2">
          <Logo size={26} />
          <span className="font-display text-base font-semibold tracking-tight text-paper">
            LindaKazi
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <NavLink to={l.to} end={l.to === homeTo} className={navLinkClass}>
                <l.icon size={15} />
                {l.label}
              </NavLink>
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

          <span className="flex items-center gap-1.5 rounded-pill border border-teal/30 bg-teal/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-teal">
            <ShieldCheck size={13} />
            {badgeLabel}
          </span>

          {user && <Avatar name={user.name} />}

          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-danger/50 hover:text-danger"
          >
            <LogOut size={15} />
          </button>
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
                <NavLink
                  to={l.to}
                  end={l.to === homeTo}
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
                  <l.icon size={15} />
                  {l.label}
                </NavLink>
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
            {user && (
              <li className="flex items-center gap-2">
                <Avatar name={user.name} size={28} />
                <span className="font-mono text-xs text-mist">{user.name}</span>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-danger"
              >
                <LogOut size={15} />
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}