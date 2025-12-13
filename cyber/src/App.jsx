import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Workflow from "./components/Workflow";
import InterfaceModes from "./components/InterfaceModes";
import Features from "./components/Features";
import Footer from "./components/Footer";
import CyberBackground from "./components/CyberBackground";
import CyberConsole from "./components/CyberConsole";
import LocationPage from "./components/LocationPage";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document
          .getElementById(location.state.scrollTo)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />

        <main>
          <section id="hero"><Hero /></section>
          <section id="workflow"><Workflow /></section>
          <section id="interfaces"><InterfaceModes /></section>
          <Features />
        </main>

        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/console" element={<CyberConsole />} />
      <Route path="/intel" element={<LocationPage />} />
    </Routes>
  );
}

export default App;
