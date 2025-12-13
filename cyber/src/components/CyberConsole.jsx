import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, FileText, Upload, CheckCircle, Info, Send, Loader, Terminal as TerminalIcon, Lock, Activity, Image as ImageIcon, Mic } from 'lucide-react';
import Navbar from './Navbar';

const CyberConsole = () => {
    const [complaint, setComplaint] = useState('');
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRealistic, setShowRealistic] = useState(false);
    const [activeTab, setActiveTab] = useState('text'); // 'text', 'image', 'audio'

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setComplaint('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const formData = new FormData();

            if (activeTab === 'image' && file) {
                formData.append('file', file);
            } else if (activeTab === 'audio' && file) {
                formData.append('file', file);
            } else if (activeTab === 'text' && complaint) {
                formData.append('complaint', complaint);
            } else {
                setError(`Please provide ${activeTab} input`);
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/classify', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to classify complaint');
            }

            const result = await response.json();
            // Simulating a delay for the "scanning" effect if the API is too fast
            setTimeout(() => {
                setData(result);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toUpperCase()) {
            case 'HIGH': return 'text-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
            case 'MEDIUM': return 'text-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            case 'LOW': return 'text-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
            default: return 'text-gray-500 border-gray-500';
        }
    };

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
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12 border-b border-green-900/50 pb-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/20 border border-green-500 flex items-center justify-center">
                            <TerminalIcon className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                CYBER<span className="text-green-500">_CONSOLE</span>
                            </h1>

                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Module */}
                    <div className="lg:col-span-12 xl:col-span-5">
                        <form onSubmit={handleSubmit} className="bg-black/50 border border-green-500/30 p-6 relative group hover:border-green-500/60 transition-colors duration-300">
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500" />

                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                INPUT_PARAMETERS
                            </h2>

                            <div className="space-y-6">
                                {/* Tab Navigation */}
                                <div className="flex gap-2 border-b border-green-500/30 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('text'); setFile(null); setError(null); }}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'text' ? 'bg-green-500 text-black' : 'bg-green-900/10 text-green-500 border border-green-500/30 hover:bg-green-500/20'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            TEXT_LOG
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('image'); setComplaint(''); setError(null); }}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'image' ? 'bg-green-500 text-black' : 'bg-green-900/10 text-green-500 border border-green-500/30 hover:bg-green-500/20'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            IMG_SCAN
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('audio'); setComplaint(''); setError(null); }}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'audio' ? 'bg-green-500 text-black' : 'bg-green-900/10 text-green-500 border border-green-500/30 hover:bg-green-500/20'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Mic className="w-4 h-4" />
                                            AUDIO_VOX
                                        </div>
                                    </button>
                                </div>

                                {/* Active Input Section */}
                                <div className="min-h-[200px] relative">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'text' && (
                                            <motion.div
                                                key="text"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="absolute inset-0"
                                            >
                                                <label className="block text-xs uppercase tracking-widest text-green-500/70 mb-2">
                                                    INCIDENT_DESCRIPTION
                                                </label>
                                                <textarea
                                                    value={complaint}
                                                    onChange={(e) => setComplaint(e.target.value)}
                                                    placeholder=">> ENTER INCIDENT DETAILS..."
                                                    className="w-full h-[180px] bg-green-900/5 border border-green-500/30 p-4 text-green-400 placeholder-green-900/50 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all font-mono text-sm resize-none"
                                                />
                                            </motion.div>
                                        )}

                                        {activeTab === 'image' && (
                                            <motion.div
                                                key="image"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="absolute inset-0"
                                            >
                                                <label className="block text-xs uppercase tracking-widest text-green-500/70 mb-2">
                                                    UPLOAD_EVIDENCE (IMAGE)
                                                </label>
                                                <div className="relative group/upload h-[180px]">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`w-full h-full border border-dashed ${file ? 'border-green-500 bg-green-500/10' : 'border-green-500/30'} p-4 flex flex-col items-center justify-center gap-3 transition-all group-hover/upload:border-green-500/60`}>
                                                        <ImageIcon className={`w-8 h-8 ${file ? 'text-green-500' : 'text-green-500/50'}`} />
                                                        <span className={`text-sm ${file ? 'text-green-400' : 'text-green-500/50'}`}>
                                                            {file ? `>> SELECTED: ${file.name}` : '>> DROP IMAGE OR CLICK TO SCAN'}
                                                        </span>
                                                        <span className="text-[10px] text-green-500/30">SUPPORTED: JPG, PNG, WEBP</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'audio' && (
                                            <motion.div
                                                key="audio"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="absolute inset-0"
                                            >
                                                <label className="block text-xs uppercase tracking-widest text-green-500/70 mb-2">
                                                    AUDIO_EVIDENCE (VOICE)
                                                </label>
                                                <div className="relative group/upload h-[180px]">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="audio/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`w-full h-full border border-dashed ${file ? 'border-green-500 bg-green-500/10' : 'border-green-500/30'} p-4 flex flex-col items-center justify-center gap-3 transition-all group-hover/upload:border-green-500/60`}>
                                                        {file ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1 h-3 bg-green-500 animate-[bounce_1s_infinite]" />
                                                                <div className="w-1 h-5 bg-green-500 animate-[bounce_1.2s_infinite]" />
                                                                <div className="w-1 h-2 bg-green-500 animate-[bounce_0.8s_infinite]" />
                                                            </div>
                                                        ) : (
                                                            <Mic className="w-8 h-8 text-green-500/50" />
                                                        )}
                                                        <span className={`text-sm ${file ? 'text-green-400' : 'text-green-500/50'}`}>
                                                            {file ? `>> SELECTED: ${file.name}` : '>> DROP AUDIO OR CLICK TO RECORD'}
                                                        </span>
                                                        <span className="text-[10px] text-green-500/30">SUPPORTED: MP3, WAV, OGG</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || (activeTab === 'text' && !complaint) || (activeTab !== 'text' && !file)}
                                    className="w-full relative overflow-hidden group/btn bg-green-600 hover:bg-green-500 disabled:bg-green-900/20 disabled:cursor-not-allowed transition-colors mt-8"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] opacity-30" />
                                    <div className="relative py-4 px-6 flex items-center justify-center gap-3">
                                        {loading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin text-black" />
                                                <span className="text-black font-bold tracking-widest">PROCESSING...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 text-black" />
                                                <span className="text-black font-bold tracking-widest">INITIATE_ANALYSIS</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-4 p-3 border border-red-500/50 bg-red-900/10 flex items-start gap-3"
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                    <p className="text-red-400 text-sm font-bold">ERROR: {error}</p>
                                </motion.div>
                            )}
                        </form>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        {loading && (
                            <div className="h-full min-h-[400px] border border-green-500/30 bg-black/50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                                <div className="font-mono text-green-500 text-6xl font-bold opacity-20 animate-pulse mb-8">
                                    ANALYZING
                                </div>
                                <div className="w-64 h-2 bg-green-900/30 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: [-256, 256] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="w-1/2 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                                    />
                                </div>
                                <div className="mt-4 font-mono text-xs text-green-400">
                                    {['DECRYPTING PACKETS...', 'MATCHING PATTERNS...', 'QUERYING NEURAL NET...'].map((text, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                                        >
                                            {`>> ${text}`}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Top Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-black/80 border border-green-500/30 p-6 relative">
                                        <p className="text-xs text-green-500/50 uppercase tracking-widest mb-1">CLASSIFIED_AS</p>
                                        <h3 className="text-2xl font-bold text-white mb-2">{data.primary_category}</h3>
                                        {data.category_name && data.category_name !== data.primary_category && (
                                            <p className="text-sm text-green-400 opacity-70">({data.category_name})</p>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <FileText className="w-5 h-5 text-green-500/50" />
                                        </div>
                                    </div>

                                    <div className={`bg-black/80 border p-6 relative ${getSeverityColor(data.severity)}`}>
                                        <p className="text-xs opacity-70 uppercase tracking-widest mb-1">THREAT_LEVEL</p>
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-8 h-8" />
                                            <h3 className="text-3xl font-bold">{data.severity}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Doc Analysis HUD */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Action Items */}
                                    <div className="border border-green-500/30 bg-green-900/5 p-6">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-widest mb-4 border-b border-green-500/30 pb-2">
                                            <Shield className="w-4 h-4" />
                                            REQUIRED_PROTOCOLS
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.required_documents?.map((doc, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-green-300">
                                                    <span className="text-xs bg-green-900/50 border border-green-500/30 px-1.5 py-0.5 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                                                    {doc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Gov Docs */}
                                    <div className="border border-green-500/30 bg-green-900/5 p-6">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-widest mb-4 border-b border-green-500/30 pb-2">
                                            <Upload className="w-4 h-4" />
                                            SUBMISSION_MANIFEST
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.gov_documents_to_submit?.map((doc, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-green-300">
                                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                    {doc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* AI Reasoning */}
                                <div className="border border-green-500/30 bg-black/50 p-6 relative">
                                    <div className="absolute -left-1 top-6 w-1 h-12 bg-green-500" />
                                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">
                                        NEURAL_NET_REASONING
                                    </h4>
                                    <p className="text-green-100/80 leading-relaxed font-mono text-sm border-l-2 border-green-900/50 pl-4">
                                        {data.reasoning || "NO REASONING PROVIDED."}
                                    </p>
                                </div>

                                {/* Realistic Examples */}
                                {data.realistic_examples?.length > 0 && (
                                    <div className="border border-green-500/20 p-4">
                                        <button
                                            onClick={() => setShowRealistic(!showRealistic)}
                                            className="w-full flex items-center justify-between text-xs font-bold text-green-500 hover:text-green-400 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                REALISTIC_SCENARIOS
                                            </span>
                                            <span>{showRealistic ? '[-]' : '[+]'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {showRealistic && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 space-y-3">
                                                        {data.realistic_examples.map((ex, i) => (
                                                            <div key={i} className="bg-green-900/10 border border-green-500/10 p-3 text-sm text-green-300/80">
                                                                {`>> ${ex}`}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {!data && !loading && (
                            <div className="h-full border border-green-500/10 bg-black/20 flex flex-col items-center justify-center text-green-900/30">
                                <Lock className="w-16 h-16 mb-4 opacity-20" />
                                <p className="font-mono text-sm tracking-widest">AWAITING_INPUT</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CyberConsole;
