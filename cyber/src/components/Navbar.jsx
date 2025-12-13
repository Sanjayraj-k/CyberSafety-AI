import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (sectionId) => {
        if (location.pathname === "/") {
            // Already on landing page → just scroll
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            // On /console → go to home, then scroll
            navigate("/", { state: { scrollTo: sectionId } });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
                    ? "bg-black/95 border-green-900/50 backdrop-blur-md"
                    : "bg-transparent border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-black border border-green-500/50 text-green-500">
                            <Shield size={20} />
                        </div>
                        <div>
                            <span className="font-mono font-bold text-xl text-white">
                                SENTINEL<span className="text-green-500">SOP</span>
                            </span>
                            <div className="text-xs text-green-700 uppercase tracking-widest">
                                Incident Response Unit
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { label: "HOME", id: "hero" },
                            { label: "WORKFLOW", id: "workflow" },
                            { label: "INTERFACES", id: "interfaces" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className="h-16 px-6 text-sm font-bold font-mono tracking-widest text-green-500/70 hover:text-green-400 hover:bg-green-900/10 border-b-2 border-transparent hover:border-green-500 transition-all"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Console Button */}
                    <div className="hidden md:flex items-center">
                        <Link
                            to="/console"
                            className="h-10 px-6 bg-green-600 hover:bg-green-500 text-black text-sm font-bold font-mono tracking-widest flex items-center justify-center transition-colors"
                        >
                            SOLVE IT
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
