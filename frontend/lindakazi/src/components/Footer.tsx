import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={22} />
          <span className="font-display text-sm font-semibold text-paper">
            LindaKazi
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-mist-dim">
          <Link to="/about" className="hover:text-mist">About</Link>
          <Link to="/privacy-policy" className="hover:text-mist">Privacy Policy</Link>
          <Link to="/#safety-loop" className="hover:text-mist">Features</Link>
        </div>
        <p className="font-mono text-xs text-mist-dim">
          © 2026 LindaKazi. Safety Guaranteed.
        </p>
      </div>
    </footer>
  );
}