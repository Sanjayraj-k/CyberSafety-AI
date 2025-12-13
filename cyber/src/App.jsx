import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Workflow from './components/Workflow';
import InterfaceModes from './components/InterfaceModes';
import Features from './components/Features';
import Footer from './components/Footer';
import CyberBackground from './components/CyberBackground';

function App() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-500/30 relative">
      <CyberBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Workflow />
          <InterfaceModes />
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;