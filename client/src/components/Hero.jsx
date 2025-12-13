import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MousePointer2, ArrowRight } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    // ✅ WhatsApp Business Redirect
    const handleWhatsAppRedirect = () => {
        const phoneNumber = "15551864905"; // +1 555 186 4905 (formatted)
        const message = encodeURIComponent(
            "Hello SentinelSOP Team, I need assistance with a cyber issue."
        );

        window.open(
            `https://wa.me/${phoneNumber}?text=${message}`,
            "_blank"
        );
    };

    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent border-b-4 border-green-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-8">
                        <motion.div
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-8"
                        >
                        </motion.div>

                        <motion.h1
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-mono text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-8"
                        >
                            AUTOMATED <br />
                            CYBER <span className="text-green-500">ISSUE</span> <br />
                            SOLVER
                        </motion.h1>

                        <motion.p
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-green-400/80 max-w-2xl mb-10 border-l-2 border-green-900 pl-6 py-2"
                        >
                            Deploy LLM-driven Standard Operating Procedures (SOPs) for rapid incident mitigation.
                            Supports multi-modal input ingestion via Web and Mobile endpoints.
                        </motion.p>

                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            {/* Web Console Button */}
                            <button
                                onClick={() => navigate('/console')}
                                className="px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono text-sm tracking-wider flex items-center gap-3 group transition-all"
                            >
                                INITIATE_WEB_SESSION
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* ✅ WhatsApp Button */}
                            <button
                                onClick={handleWhatsAppRedirect}
                                className="px-8 py-4 bg-black border border-green-900 hover:border-green-500 text-green-500 font-mono text-sm tracking-wider flex items-center gap-3 transition-all"
                            >
                                CONNECT_WHATSAPP
                            </button>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 relative">
                        {/* Abstract Technical Graphic */}
                        <div className="aspect-square border-2 border-green-900 p-2 relative">
                            <div className="absolute top-0 right-0 p-2 font-mono text-xs bg-green-900 text-black font-bold">
                                FIG.01
                            </div>
                            <div className="w-full h-full border border-green-900/50 bg-black/50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                                    {[...Array(36)].map((_, i) => (
                                        <div key={i} className="border border-green-900/30" />
                                    ))}
                                </div>
                                <div className="relative z-10 p-6 bg-black border border-green-500 shadow-[0_0_30px_rgba(0,255,65,0.15)] max-w-[240px]">
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                        <div className="font-mono text-[10px] text-green-600">
                                            ISSUES: USER_ISSUES
                                        </div>
                                    </div>
                                    <div className="font-mono text-xs text-green-400 mb-2">
                                        {'>'} DETECTED: Phishing
                                    </div>
                                    <div className="font-mono text-xs text-green-400 mb-2">
                                        {'>'} THREAT: High
                                    </div>
                                    <div className="font-mono text-xs text-white">
                                        {'>'} REQ PROOFS: Docs,Snaps
                                    </div>
                                    <div className="font-mono text-xs text-white">
                                        {'>'} EXAMPLES: Related Examples
                                    </div>
                                </div>

                                {/* Decorative Cursor */}
                                <motion.div
                                    animate={{ x: [0, 50, 50, 0], y: [0, 20, 0, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute top-1/4 left-1/4"
                                >
                                    <MousePointer2
                                        className="text-green-500 fill-black"
                                        size={24}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;