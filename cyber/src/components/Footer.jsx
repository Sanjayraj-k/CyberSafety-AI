import React from 'react';
import { Terminal } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-900 flex items-center justify-center text-white">
                            <Terminal size={14} />
                        </div>
                        <span className="font-mono font-bold text-sm tracking-widest text-slate-900">
                            CYBER.SOP // SYSTEM
                        </span>
                    </div>

                    <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        [C] 2024 INTEL_CORP. ALL RIGHTS RESERVED.
                    </div>

                    <div className="flex gap-8 font-mono text-xs text-slate-500">
                        <a href="#" className="hover:text-cyber-blue transition-colors">ACCESS_LOGS</a>
                        <a href="#" className="hover:text-cyber-blue transition-colors">PRIVACY_PROTOCOL</a>
                        <a href="#" className="hover:text-cyber-blue transition-colors">CONTACT_ADMIN</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
