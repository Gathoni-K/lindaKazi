import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import WorkerAlerts from "./pages/dashboard/WorkerAlerts";
import ClientAlerts from "./pages/dashboard/ClientAlerts";

function PublicSite() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <ScrollToHash />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
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
         <Route path="alerts" element={<WorkerAlerts />} />
      </Route>

      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute allowedRole="client">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="alerts" element={<ClientAlerts />} />
      </Route>

      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}