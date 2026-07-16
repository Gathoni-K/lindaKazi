import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToHash from "./components/ScrollToHash";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export default function App() {
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