import React from 'react';
import { Terminal } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black pt-16 pb-8 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00FF41 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-900/30 border border-green-500 flex items-center justify-center text-green-500">
                            <Terminal size={16} />
                        </div>
                        <span className="font-mono font-bold text-sm tracking-widest text-white">
                            SENTINEL.SOP
                        </span>
                    </div>

                    <div className="font-mono text-xs text-green-700 uppercase tracking-wider">
                        [@MAKESURE] 2025 ALL RIGHTS RESERVED.
                    </div>

                    <div className="flex gap-8 font-mono text-xs text-green-600">
                        <a href="#" className="hover:text-green-400 transition-colors">ACCESS_LOGS</a>
                        <a href="#" className="hover:text-green-400 transition-colors">PRIVACY_PROTOCOL</a>
                        <a href="#" className="hover:text-green-400 transition-colors">CONTACT_ADMIN</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;