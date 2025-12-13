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

        // SAMPLE DATA FOR DEMONSTRATION
        const sampleData = {
            "category_name": "Sextortion",
            "gov_documents_to_submit": [
                "Complaint form",
                "Supporting evidence documents",
                "Identity proof"
            ],
            "law_reference": [
                {
                    "act": "Computer Fraud and Abuse Act (CFAA)",
                    "description": "Prohibits unauthorized access to computers and computer systems, which can be applied to sextortion cases involving hacking or unauthorized access.",
                    "section": "18 U.S.C. § 1030",
                    "title": "Fraud and related activity in connection with computers"
                },
                {
                    "act": "Extortion and Threats",
                    "description": "Makes it a crime to transmit threats or extortion demands across state or international borders.",
                    "section": "18 U.S.C. § 875",
                    "title": "Interstate communications"
                }
            ],
            "possible_crimes": [],
            "primary_category": "Sextortion",
            "realistic_examples": [
                "A person is threatened with the release of intimate images unless they pay a ransom.",
                "An individual is coerced into performing sexual acts online after being blackmailed with compromising content.",
                "A scammer demands money or gifts in exchange for not sharing explicit photos or videos."
            ],
            "reasoning": "The user is being threatened with explicit images and demanded payment, which directly fits the definition of Sextortion (Sexual Blackmail) as per the master list.",
            "required_documents": [
                "Police report",
                "Copy of the threatening messages or emails",
                "Any relevant communication records",
                "Identification documents"
            ],
            "severity": "HIGH",
            "what_happens_next": {
                "attacker_next_steps": [
                    "Send additional explicit images or more threatening messages to intimidate the victim",
                    "Demand a higher payment or additional forms of payment (e.g., gift cards, cryptocurrency)",
                    "Share the explicit material with the victim's social media contacts or wider networks if payment is not made"
                ],
                "immediate_actions_recommended": [
                    "Do not engage with the attacker or pay the demanded amount",
                    "Block the attacker on all social media platforms and report the incident to the platform's moderators",
                    "Contact local law enforcement or a cybercrime reporting hotline for assistance"
                ],
                "risk_statistics": {
                    "data_compromise_probability": "40%",
                    "escalation_probability": "70%",
                    "financial_loss_probability": "85%",
                    "reputation_damage_probability": "90%"
                },
                "risk_timeline": {
                    "24_hours": "The attacker may increase the frequency or severity of threats to prompt immediate payment. The victim's social media accounts may be hacked or used to spread the explicit material.",
                    "48_hours": "The attacker could involve other scammers or share the victim's information on dark web platforms, potentially leading to identity theft or further extortion attempts.",
                    "7_days": "If no payment is made, the attacker may release the explicit material publicly, leading to severe reputation damage and potential long-term consequences for the victim."
                },
                "warning_signs_to_watch": [
                    "New, suspicious accounts contacting the victim with similar threats",
                    "Increased online activity or posts from the victim's social media accounts that seem unauthorized"
                ]
            }
        };

        try {
            // SIMULATED API CALL
            setTimeout(() => {
                setData(sampleData);
                setLoading(false);
            }, 2000);
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

    const calculateReadiness = () => {
        let score = 0;
        let missing = [];

        if (activeTab === 'text') {
            if (complaint.length > 10) score += 30;
            if (complaint.length > 50) score += 30;
            if (complaint.length > 100) score += 20;
            if (complaint.length < 10) missing.push("Incident Description");
        } else {
            if (file) score += 80;
            else missing.push("Evidence File");
        }

        // Base readiness just for being on the platform
        score += 20;

        return { score: Math.min(score, 100), missing };
    };

    const readiness = calculateReadiness();

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
                    <div className="lg:col-span-12 xl:col-span-5 h-fit xl:sticky xl:top-28">
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
                                    disabled={loading}
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

                    {/* Results Display - Summary Column */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6">
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

                                {/* Risk Statistics */}
                                {data.what_happens_next?.risk_statistics && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(data.what_happens_next.risk_statistics).map(([key, value]) => (
                                            <div key={key} className="bg-green-900/10 border border-green-500/30 p-3 text-center">
                                                <div className="text-xl font-bold text-white mb-1">{value}</div>
                                                <div className="text-[10px] text-green-500/70 uppercase tracking-wider">{key.replace(/_/g, ' ')}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Doc Analysis HUD - Moved to Top Section to balance height */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Recommended Actions */}
                                    <div className="border border-green-500/30 bg-green-900/5 p-6">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-widest mb-4 border-b border-green-500/30 pb-2">
                                            <Shield className="w-4 h-4" />
                                            RECOMMENDED_COUNTERMEASURES
                                        </h4>
                                        <ul className="space-y-3">
                                            {data.what_happens_next?.immediate_actions_recommended?.map((action, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-green-300">
                                                    <span className="text-xs bg-red-900/50 border border-red-500/30 text-red-400 px-1.5 py-0.5 mt-0.5">PRIORITY</span>
                                                    {action}
                                                </li>
                                            ))}
                                            {!data.what_happens_next?.immediate_actions_recommended && data.required_documents?.map((doc, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-green-300">
                                                    <span className="text-xs bg-green-900/50 border border-green-500/30 px-1.5 py-0.5 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                                                    {doc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Submission Manifest */}
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
                            </motion.div>
                        )}
                    </div>

                    {/* Extended Results - Full Width Details */}
                    {data && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {/* Law Reference */}
                            {data.law_reference?.length > 0 && (
                                <div className="border border-green-500/30 bg-black/50 p-6 relative">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-widest mb-4">
                                        <Lock className="w-4 h-4" />
                                        LEGAL_FRAMEWORK_VIOLATIONS
                                    </h4>
                                    <div className="space-y-4">
                                        {data.law_reference.map((law, idx) => (
                                            <div key={idx} className="bg-green-900/10 border border-green-500/20 p-4 hover:border-green-500/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-green-500 bg-green-900/30 px-2 py-1">{law.section}</span>
                                                </div>
                                                <h5 className="font-bold text-white text-sm mb-1">{law.act}</h5>
                                                <p className="text-xs text-green-400/70 italic mb-2">"{law.title}"</p>
                                                <p className="text-xs text-green-300 leading-relaxed">{law.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Threat Projection - Attacker Moves */}
                            {data.what_happens_next?.attacker_next_steps && (
                                <div className="border border-red-500/30 bg-red-900/5 p-6">
                                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        PREDICTED_ATTACKER_MOVES
                                    </h4>
                                    <ul className="space-y-3">
                                        {data.what_happens_next.attacker_next_steps.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-red-300/80">
                                                <span className="text-red-500 font-bold">{">>"}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Threat Projection - Timeline */}
                            {data.what_happens_next?.risk_timeline && (
                                <div className="border border-green-500/30 bg-black/50 p-6">
                                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">
                                        RISK_ESCALATION_TIMELINE
                                    </h4>
                                    <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-green-500/30">
                                        {Object.entries(data.what_happens_next.risk_timeline).map(([time, desc], idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-black border border-green-500 rounded-full flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                </div>
                                                <span className="text-xs font-bold text-green-500 uppercase tracking-wider block mb-1">{time.replace(/_/g, ' ')}</span>
                                                <p className="text-xs text-green-300/80 leading-relaxed">{desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                <div className="lg:col-span-2 border border-green-500/20 p-4">
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
                </div>
            </main>
        </div>
    );
};

export default CyberConsole;
