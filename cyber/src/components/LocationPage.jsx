import React from 'react';
import Navbar from './Navbar';
import LocationIntel from './LocationIntel';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LocationPage = () => {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden selection:bg-green-500/30">
            {/* Grid Background */}
            <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] opacity-10 pointer-events-none">
                {[...Array(1600)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-green-900/30" />
                ))}
            </div>

            <Navbar />

            <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-12 border-b border-green-900/50 pb-6"
                >
                    <div className="w-12 h-12 bg-green-900/20 border border-green-500 flex items-center justify-center">
                        <Globe className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            GLOBAL_INTEL<span className="text-green-500">_MAP</span>
                        </h1>
                        <p className="text-green-500/60 text-sm mt-1">REAL-TIME THREAT MONITORING & RESOURCE LOCATOR</p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <LocationIntel caseType="General Cyber Crime" />
                </motion.div>

                <div className="mt-8 border text-center p-8 border-green-500/20 bg-green-900/5">
                    <p className="text-green-400 text-sm">
                        {'>>'} NOTE: THIS INTERFACE PROVIDES GEOSPATIAL DATA FOR ALL CYBER DIVISIONS.
                        FOR CASE-SPECIFIC INTEL, USE THE <span className="text-white font-bold">SOLVE IT</span> CONSOLE.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LocationPage;
