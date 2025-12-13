import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Workflow from './components/Workflow';
import InterfaceModes from './components/InterfaceModes';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Workflow />
        <InterfaceModes />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;