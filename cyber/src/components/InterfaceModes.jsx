import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, MessageSquare, ShieldAlert } from 'lucide-react';

const InterfaceModes = () => {
    const [mode, setMode] = useState('web');

    return (
        <section id="interfaces" className="py-24 bg-transparent border-b-4 border-green-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Controls */}
                    <div className="md:w-1/3">
                        <span className="mono-tag mb-4 block text-green-600">TERMINAL ACCESS</span>
                        <h2 className="font-mono text-3xl font-bold mb-8 text-white">INTERFACE SELECTION</h2>

                        <div className="space-y-4">
                            <button
                                onClick={() => setMode('web')}
                                className={`w-full text-left p-6 border flex items-center gap-4 transition-all ${mode === 'web'
                                    ? 'border-green-500 bg-green-900/20 text-white shadow-[0_0_15px_rgba(0,255,65,0.2)]'
                                    : 'border-green-900/30 hover:border-green-700 text-green-500/50'
                                    }`}
                            >
                                <Monitor size={24} className={mode === 'web' ? 'text-green-400' : ''} />
                                <div>
                                    <div className="font-mono font-bold text-sm">WEB_CONSOLE</div>
                                    <div className="text-xs opacity-70">Admin & Analyst Dashboard</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('whatsapp')}
                                className={`w-full text-left p-6 border flex items-center gap-4 transition-all ${mode === 'whatsapp'
                                    ? 'border-[#25D366] bg-[#25D366]/20 text-white shadow-[0_0_15px_rgba(37,211,102,0.2)]'
                                    : 'border-green-900/30 hover:border-green-700 text-green-500/50'
                                    }`}
                            >
                                <Smartphone size={24} className={mode === 'whatsapp' ? 'text-[#25D366]' : ''} />
                                <div>
                                    <div className="font-mono font-bold text-sm">WHATSAPP_BOT</div>
                                    <div className="text-xs opacity-70">Field Agent Rapid Response</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Display */}
                    <div className="md:w-2/3">
                        <div className="border border-green-900 h-[500px] relative bg-black/90 p-2 shadow-[10px_10px_0px_0px_rgba(0,51,0,1)]">
                            {/* Device Bezel */}
                            <div className="w-full h-full bg-black border border-green-900/50 relative overflow-hidden">

                                {/* Top Bar */}
                                <div className="h-8 bg-green-950/30 flex items-center px-4 justify-between text-green-500 font-mono text-[10px] border-b border-green-900/50">
                                    <span>CONN: SECURE [ENCRYPTED]</span>
                                    <span>{mode === 'web' ? 'HTTPS://CYBER.SOP/DASH' : 'API: WA_BUSINESS_V2'}</span>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 h-full overflow-y-auto">
                                    {mode === 'web' ? (
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 bg-green-900/20 text-green-500 flex items-center justify-center font-mono text-xs border border-green-900">AI</div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="bg-black border border-green-900 p-4 w-3/4 font-mono text-xs leading-relaxed text-green-400">
                                                        {'>'} SYSTEM READY.<br />
                                                        {'>'} AWAITING INPUT. PLEASE DESCRIBE THE INCIDENT OR UPLOAD LOGS.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 flex-row-reverse">
                                                <div className="w-8 h-8 bg-green-500 text-black flex items-center justify-center font-mono text-xs">USR</div>
                                                <div className="bg-green-500/10 border border-green-500/20 text-green-100 p-4 w-3/4 font-mono text-xs leading-relaxed">
                                                    Server Error 503 on the main payment gateway. Logs showing unusual traffic spikes from IP range 192.168.x.x
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 bg-green-900/20 text-green-500 flex items-center justify-center font-mono text-xs border border-green-900">AI</div>
                                                <div className="bg-black border border-green-900 p-4 w-3/4 font-mono text-xs leading-relaxed text-green-400">
                                                    <div className="text-red-500 font-bold mb-2 flex items-center gap-2"><ShieldAlert size={12} /> THREAT: DDoS_ATTACK</div>
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
                                        <div className="max-w-sm mx-auto bg-[#0b141a] border border-slate-700 h-[350px] flex flex-col">
                                            <div className="bg-[#1f2c34] h-12 flex items-center px-4 text-white gap-3">
                                                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center"><MessageSquare size={16} /></div>
                                                <span className="font-sans font-bold text-sm">CyberBot</span>
                                            </div>
                                            <div className="flex-1 p-4 space-y-4 overflow-hidden bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-80">
                                                <div className="bg-[#1f2c34] p-2 rounded text-xs shadow-sm self-start max-w-[80%] font-sans text-slate-200">
                                                    Send incident photo 📸
                                                </div>
                                                <div className="bg-[#005c4b] p-2 rounded text-xs shadow-sm self-end ml-auto max-w-[80%] font-sans text-white">
                                                    [Image Sent]
                                                </div>
                                                <div className="bg-[#1f2c34] p-2 rounded text-xs shadow-sm self-start max-w-[80%] font-sans text-slate-200">
                                                    <b className="text-yellow-500">Analysis:</b> SQL Injection Attempt detected.<br /><br />Apply patch KB-992.
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
