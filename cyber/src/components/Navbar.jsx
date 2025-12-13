import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? 'bg-black/95 border-green-900/50 backdrop-blur-md' : 'bg-transparent border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-black border border-green-500/50 text-green-500">
                            <Shield size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono font-bold text-lg tracking-tight leading-none text-white">
                                SENTINEL<span className="text-green-500">SOP</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-green-700 font-medium">
                                Incident Response Unit
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {['HOME', 'WORKFLOW', 'INTERFACES'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="h-16 flex items-center px-6 text-xs font-bold font-mono tracking-widest text-green-500/70 hover:text-green-400 hover:bg-green-900/10 border-b-2 border-transparent hover:border-green-500 transition-all"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="hidden md:flex items-center">
                        <a
                            href="#"
                            className="h-10 px-6 bg-green-600 hover:bg-green-500 text-black text-xs font-bold font-mono tracking-widest flex items-center justify-center transition-colors clip-path-slant"
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
