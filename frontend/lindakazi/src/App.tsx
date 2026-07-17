import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WorkerDashboard from "./pages/dashboard/WorkerDashboard";
import Safety from "./pages/dashboard/Safety";
import Earnings from "./pages/dashboard/Earnings";

function PublicSite() {
  return (
    <div className="min-h-screen bg-ink">
      <ScrollToHash />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="worker">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="safety" element={<Safety />} />
        <Route path="earnings" element={<Earnings />} />
      </Route>
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}