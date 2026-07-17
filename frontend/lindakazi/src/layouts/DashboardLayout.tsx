import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-ink">
      <DashboardNavbar />
      <main>
        <Outlet />
      </main>
      <ScrollToTopButton />
    </div>
  );
}