import React from 'react';
import { Shield, Terminal } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200">
            <div className="max-w-7xl mx-auto pl-4 pr-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-cyber-dark text-white">
                            <Terminal size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono font-bold text-lg tracking-tight leading-none text-slate-900">
                                CYBER<span className="text-cyber-blue">.SOP</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                                Incident Response Unit
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        {['CAPABILITIES', 'WORKFLOW', 'INTERFACES'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="h-16 flex items-center px-6 text-xs font-bold tracking-widest hover:bg-slate-50 border-l border-slate-100 transition-colors text-slate-600 hover:text-cyber-blue"
                            >
                                {item}
                            </a>
                        ))}
                        <a
                            href="#"
                            className="h-16 flex items-center px-8 bg-cyber-blue text-white text-xs font-bold tracking-widest hover:bg-blue-600 border-l border-blue-600 transition-colors"
                        >
                            LAUNCH_CONSOLE
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
