import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Workflow from "./components/Workflow";
import InterfaceModes from "./components/InterfaceModes";
import Footer from "./components/Footer";
import CyberBackground from "./components/CyberBackground";
import CyberConsole from "./components/CyberConsole";

// Home Page Component
const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Workflow />
      <InterfaceModes />
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Matrix Rain Background */}
      <CyberBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/console" element={<CyberConsole />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;