import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-8"
                        >

                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-mono text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8"
                        >
                            AUTOMATED <br />
                            CYBER <span className="text-cyber-blue">RESPONSE</span> <br />
                            PROTOCOLS
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 max-w-2xl mb-10 border-l-2 border-slate-200 pl-6 py-2"
                        >
                            Deploy LLM-driven Standard Operating Procedures (SOPs) for rapid incident mitigation.
                            Supports multi-modal input ingestion via Web and Mobile endpoints.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-mono text-sm tracking-wider flex items-center gap-3 group transition-all">
                                INITIATE_WEB_SESSION
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-mono text-sm tracking-wider flex items-center gap-3 transition-all">
                                CONNECT_WHATSAPP
                            </button>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 relative">
                        {/* Abstract Technical Graphic */}
                        <div className="aspect-square border-2 border-slate-900 p-2 relative">
                            <div className="absolute top-0 right-0 p-2 font-mono text-xs bg-slate-900 text-white">
                                FIG.01
                            </div>
                            <div className="w-full h-full border border-slate-200 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                                    {[...Array(36)].map((_, i) => <div key={i} className="border border-slate-300" />)}
                                </div>
                                <div className="relative z-10 p-6 bg-white border border-slate-200 shadow-xl max-w-[240px]">
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        <div className="font-mono text-[10px] text-slate-400">INCIDENT ID: #9921</div>
                                    </div>
                                    <div className="font-mono text-xs text-slate-600 mb-2">{'>'} DETECTED: Phishing</div>
                                    <div className="font-mono text-xs text-slate-600 mb-2">{'>'} SOURCE: Email Gateway</div>
                                    <div className="font-mono text-xs text-cyber-blue">{'>'} ACTION: Execute SOP-99</div>
                                </div>

                                {/* Decorative Cursor */}
                                <motion.div
                                    animate={{ x: [0, 50, 50, 0], y: [0, 20, 0, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute top-1/4 left-1/4"
                                >
                                    <MousePointer2 className="text-slate-900 fill-white" size={24} />
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
