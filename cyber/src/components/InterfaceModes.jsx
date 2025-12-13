import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, MessageSquare, ShieldAlert } from 'lucide-react';

const InterfaceModes = () => {
    const [mode, setMode] = useState('web');

    return (
        <section id="interfaces" className="py-24 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Controls */}
                    <div className="md:w-1/3">
                        <span className="mono-tag mb-4 block">TERMINAL ACCESS</span>
                        <h2 className="font-mono text-3xl font-bold mb-8">INTERFACE SELECTION</h2>

                        <div className="space-y-4">
                            <button
                                onClick={() => setMode('web')}
                                className={`w-full text-left p-6 border flex items-center gap-4 transition-all ${mode === 'web'
                                    ? 'border-slate-900 bg-slate-900 text-white'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                            >
                                <Monitor size={24} />
                                <div>
                                    <div className="font-mono font-bold text-sm">WEB_CONSOLE</div>
                                    <div className="text-xs opacity-70">Admin & Analyst Dashboard</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('whatsapp')}
                                className={`w-full text-left p-6 border flex items-center gap-4 transition-all ${mode === 'whatsapp'
                                    ? 'border-[#25D366] bg-[#25D366] text-white'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                            >
                                <Smartphone size={24} />
                                <div>
                                    <div className="font-mono font-bold text-sm">WHATSAPP_BOT</div>
                                    <div className="text-xs opacity-70">Field Agent Rapid Response</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Display */}
                    <div className="md:w-2/3">
                        <div className="border border-slate-900 h-[500px] relative bg-slate-100 p-2 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
                            {/* Device Bezel */}
                            <div className="w-full h-full bg-white border border-slate-300 relative overflow-hidden">

                                {/* Top Bar */}
                                <div className="h-8 bg-slate-900 flex items-center px-4 justify-between text-white font-mono text-[10px]">
                                    <span>CONN: SECURE</span>
                                    <span>{mode === 'web' ? 'HTTPS://CYBER.SOP/DASH' : 'API: WA_BUSINESS_V2'}</span>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 h-full overflow-y-auto">
                                    {mode === 'web' ? (
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 bg-slate-200 flex items-center justify-center font-mono text-xs">AI</div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="bg-slate-50 border border-slate-200 p-4 w-3/4 font-mono text-xs leading-relaxed">
                                                        {'>'} SYSTEM READY.<br />
                                                        {'>'} AWAITING INPUT. PLEASE DESCRIBE THE INCIDENT OR UPLOAD LOGS.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 flex-row-reverse">
                                                <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-mono text-xs">USR</div>
                                                <div className="bg-slate-900 text-white p-4 w-3/4 font-mono text-xs leading-relaxed">
                                                    Server Error 503 on the main payment gateway. Logs showing unusual traffic spikes from IP range 192.168.x.x
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 bg-cyber-blue text-white flex items-center justify-center font-mono text-xs">AI</div>
                                                <div className="bg-blue-50 border border-blue-100 p-4 w-3/4 font-mono text-xs leading-relaxed">
                                                    <div className="text-blue-600 font-bold mb-2 flex items-center gap-2"><ShieldAlert size={12} /> THREAT: DDoS_ATTACK</div>
                                                    {'>'} ANALYZING TRAFFIC PATTERNS...<br />
                                                    {'>'} CONFIDENCE: 98%<br />
                                                    <br />
                                                    RECOMMENDED SOP #442:<br />
                                                    1. ENABLE RATE LIMITING ON FIREWALL.<br />
                                                    2. BLOCK IP RANGE 192.168.x.x<br />
                                                    3. SCALE UP INSTANCE POOL.
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="max-w-sm mx-auto bg-[#efeae2] border border-slate-300 h-[350px] flex flex-col">
                                            <div className="bg-[#008069] h-12 flex items-center px-4 text-white gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><MessageSquare size={16} /></div>
                                                <span className="font-sans font-bold text-sm">CyberBot</span>
                                            </div>
                                            <div className="flex-1 p-4 space-y-4 overflow-hidden">
                                                <div className="bg-white p-2 rounded text-xs shadow-sm self-start max-w-[80%] font-sans">
                                                    Send incident photo 📸
                                                </div>
                                                <div className="bg-[#dcf8c6] p-2 rounded text-xs shadow-sm self-end ml-auto max-w-[80%] font-sans">
                                                    [Image Sent]
                                                </div>
                                                <div className="bg-white p-2 rounded text-xs shadow-sm self-start max-w-[80%] font-sans">
                                                    <b>Analysis:</b> SQL Injection Attempt detected in screenshot.<br /><br />Apply patch KB-992 immediately.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InterfaceModes;
