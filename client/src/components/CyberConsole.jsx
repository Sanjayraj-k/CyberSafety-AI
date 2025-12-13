import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, FileText, Upload, CheckCircle, Info, Send, Loader, Terminal as TerminalIcon, Lock, Activity, Image as ImageIcon, Mic, Scale, Target } from 'lucide-react';
import Navbar from './Navbar';

const CyberConsole = () => {
    const [complaint, setComplaint] = useState('');
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRealistic, setShowRealistic] = useState(false);
    const [showLawRef, setShowLawRef] = useState(false);
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
            case 'HIGH': return 'text-red-400 border-red-500 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
            case 'MEDIUM': return 'text-yellow-400 border-yellow-500 bg-yellow-950/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]';
            case 'LOW': return 'text-green-400 border-green-500 bg-green-950/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
            default: return 'text-gray-400 border-gray-500 bg-gray-950/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white font-mono relative overflow-hidden selection:bg-cyan-500/30">
            {/* Grid Background */}
            <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] opacity-5 pointer-events-none">
                {[...Array(1600)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-cyan-500/20" />
                ))}
            </div>

            <Navbar />

            <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12 border-b border-green-500/20 pb-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-950/50 border border-green-500/50 flex items-center justify-center rounded-lg">
                            <TerminalIcon className="w-6 h-6 text-green-400 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                CYBER<span className="text-green-400">_CONSOLE</span>
                            </h1>
                            <p className="text-sm text-gray-500">AI-Powered Incident Analysis</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Module */}
                    <div className="lg:col-span-12 xl:col-span-5">
                        <form onSubmit={handleSubmit} className="bg-black/80 border border-green-500/30 p-6 relative group hover:border-green-500/60 transition-colors duration-300 rounded-xl backdrop-blur-sm">
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500 rounded-br-lg" />

                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-400">
                                <Activity className="w-5 h-5 text-green-400" />
                                INPUT_PARAMETERS
                            </h2>

                            <div className="space-y-6">
                                {/* Tab Navigation */}
                                <div className="flex gap-2 border-b border-green-500/30 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('text'); setFile(null); setError(null); }}
                                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === 'text' ? 'bg-green-500 text-black' : 'bg-green-900/20 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-green-300'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            TEXT
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('image'); setComplaint(''); setError(null); }}
                                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === 'image' ? 'bg-green-500 text-black' : 'bg-green-900/20 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-green-300'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            IMAGE
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('audio'); setComplaint(''); setError(null); }}
                                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === 'audio' ? 'bg-green-500 text-black' : 'bg-green-900/20 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-green-300'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Mic className="w-4 h-4" />
                                            AUDIO
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
                                                    placeholder=">> Enter incident details..."
                                                    className="w-full h-[180px] bg-green-900/10 border border-green-500/30 rounded-lg p-4 text-white-400 placeholder-green-900/50 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all font-mono text-sm resize-none"
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
                                                    <div className={`w-full h-full border-2 border-dashed rounded-lg ${file ? 'border-green-500 bg-green-500/10' : 'border-green-500/30'} p-4 flex flex-col items-center justify-center gap-3 transition-all group-hover/upload:border-green-500/60`}>
                                                        <ImageIcon className={`w-10 h-10 ${file ? 'text-green-400' : 'text-green-500/50'}`} />
                                                        <span className={`text-sm ${file ? 'text-green-400' : 'text-green-500/50'}`}>
                                                            {file ? `>> ${file.name}` : '>> DROP IMAGE OR CLICK TO SCAN'}
                                                        </span>
                                                        <span className="text-xs text-green-500/30">SUPPORTED: JPG, PNG, WEBP</span>
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
                                                    <div className={`w-full h-full border-2 border-dashed rounded-lg ${file ? 'border-green-500 bg-green-500/10' : 'border-green-500/30'} p-4 flex flex-col items-center justify-center gap-3 transition-all group-hover/upload:border-green-500/60`}>
                                                        {file ? (
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1 h-4 bg-green-500 animate-[pulse_1s_infinite]" />
                                                                <div className="w-1 h-6 bg-green-500 animate-[pulse_1.2s_infinite]" />
                                                                <div className="w-1 h-3 bg-green-500 animate-[pulse_0.8s_infinite]" />
                                                                <div className="w-1 h-5 bg-green-500 animate-[pulse_1.4s_infinite]" />
                                                            </div>
                                                        ) : (
                                                            <Mic className="w-10 h-10 text-green-500/50" />
                                                        )}
                                                        <span className={`text-sm ${file ? 'text-green-400' : 'text-green-500/50'}`}>
                                                            {file ? `>> ${file.name}` : '>> DROP AUDIO OR CLICK TO RECORD'}
                                                        </span>
                                                        <span className="text-xs text-green-500/30">SUPPORTED: MP3, WAV, OGG</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || (activeTab === 'text' && !complaint) || (activeTab !== 'text' && !file)}
                                    className="w-full relative overflow-hidden group/btn bg-green-600 hover:bg-green-500 disabled:bg-green-900/20 disabled:cursor-not-allowed transition-all mt-8 rounded-lg"
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
                                    className="mt-4 p-4 border border-red-500/50 bg-red-950/30 rounded-lg flex items-start gap-3"
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                    <p className="text-red-300 text-sm">Error: {error}</p>
                                </motion.div>
                            )}
                        </form>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        {loading && (
                            <div className="h-full min-h-[400px] border border-green-500/30 bg-black/80 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                                {/* Matrix Rain Effect */}
                                <div className="absolute inset-0 overflow-hidden opacity-20">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute text-green-500 font-mono text-xs"
                                            style={{ left: `${i * 5}%` }}
                                            initial={{ y: -100 }}
                                            animate={{ y: '100vh' }}
                                            transition={{
                                                duration: 2 + Math.random() * 3,
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                                ease: 'linear'
                                            }}
                                        >
                                            {Array.from({ length: 15 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="font-mono text-green-500 text-5xl font-bold opacity-40 animate-pulse mb-8 z-10">
                                    ANALYZING
                                </div>
                                <div className="w-64 h-2 bg-green-900/30 rounded-full overflow-hidden z-10">
                                    <motion.div
                                        animate={{ x: [-256, 256] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="w-1/2 h-full bg-green-500 shadow-[0_0_15px_#22c55e]"
                                    />
                                </div>
                                <div className="mt-6 font-mono text-xs text-green-400 space-y-1 z-10">
                                    {['DECRYPTING PACKETS...', 'MATCHING PATTERNS...', 'QUERYING NEURAL NET...'].map((text, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ delay: i * 0.5, duration: 1.5, repeat: Infinity }}
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
                                className="space-y-5"
                            >
                                {/* Top Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Primary Category */}
                                    <div className="bg-gray-900/60 border border-gray-700 p-5 relative rounded-xl backdrop-blur-sm">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Classification</p>
                                        <h3 className="text-2xl font-bold text-white">{data.primary_category}</h3>
                                        {data.category_name && data.category_name !== data.primary_category && (
                                            <p className="text-sm text-gray-400 mt-1">({data.category_name})</p>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <FileText className="w-5 h-5 text-cyan-500/50" />
                                        </div>
                                    </div>

                                    {/* Severity */}
                                    <div className={`p-5 relative rounded-xl border ${getSeverityColor(data.severity)}`}>
                                        <p className="text-xs opacity-70 uppercase tracking-widest mb-2">Threat Level</p>
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-8 h-8" />
                                            <h3 className="text-3xl font-bold">{data.severity || 'N/A'}</h3>
                                        </div>
                                    </div>
                                </div>


                                {/* Documents Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Required Documents */}
                                    <div className="bg-gray-900/60 border border-gray-700 p-5 rounded-xl backdrop-blur-sm">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-3">
                                            <Shield className="w-4 h-4" />
                                            Required Documents
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.required_documents?.map((doc, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                    <span className="text-xs bg-purple-950/50 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                                                    <span>{doc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Gov Documents */}
                                    <div className="bg-gray-900/60 border border-gray-700 p-5 rounded-xl backdrop-blur-sm">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 border-b border-gray-700 pb-3">
                                            <Upload className="w-4 h-4" />
                                            Government Submissions
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.gov_documents_to_submit?.map((doc, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{doc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* AI Reasoning */}
                                <div className="bg-gray-900/60 border border-gray-700 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500" />
                                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 pl-4">
                                        AI Reasoning
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed text-sm pl-4">
                                        {data.reasoning || "No reasoning provided."}
                                    </p>
                                </div>

                                {/* Law References - Collapsible */}
                                {data.law_reference?.length > 0 && (
                                    <div className="bg-gray-900/60 border border-gray-700 rounded-xl backdrop-blur-sm overflow-hidden">
                                        <button
                                            onClick={() => setShowLawRef(!showLawRef)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors"
                                        >
                                            <span className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-widest">
                                                <Scale className="w-4 h-4" />
                                                Law References ({data.law_reference.length})
                                            </span>
                                            <span className="text-gray-500 text-lg">{showLawRef ? '−' : '+'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {showLawRef && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 pt-0 space-y-4">
                                                        {data.law_reference.map((law, i) => (
                                                            <div key={i} className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">{law.act}</span>
                                                                    <span className="text-white font-semibold">{law.section}</span>
                                                                    {law.title && <span className="text-gray-400">- {law.title}</span>}
                                                                </div>
                                                                <p className="text-gray-400 text-sm leading-relaxed">{law.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Realistic Examples - Collapsible */}
                                {data.realistic_examples?.length > 0 && (
                                    <div className="bg-gray-900/60 border border-gray-700 rounded-xl backdrop-blur-sm overflow-hidden">
                                        <button
                                            onClick={() => setShowRealistic(!showRealistic)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors"
                                        >
                                            <span className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest">
                                                <Info className="w-4 h-4" />
                                                Realistic Examples ({data.realistic_examples.length})
                                            </span>
                                            <span className="text-gray-500 text-lg">{showRealistic ? '−' : '+'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {showRealistic && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 pt-0 space-y-3">
                                                        {data.realistic_examples.map((ex, i) => (
                                                            <div key={i} className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-lg text-gray-300 text-sm leading-relaxed">
                                                                <span className="text-blue-400 mr-2">{i + 1}.</span>
                                                                {ex}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="text-center py-4">
                                    <p className="text-gray-600 text-xs">
                                        This analysis is AI-generated. Please verify with authorities before taking action.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {!data && !loading && (
                            <div className="h-full min-h-[400px] border border-gray-800 bg-gray-900/30 rounded-xl flex flex-col items-center justify-center">
                                <Lock className="w-16 h-16 mb-4 text-gray-700" />
                                <p className="font-mono text-sm tracking-widest text-gray-600">AWAITING INPUT</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CyberConsole;