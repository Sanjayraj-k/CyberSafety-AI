import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    GitCommit,
    Cpu,
    ShieldAlert,
    FileText,
    Play,
    RotateCcw
} from 'lucide-react';

const StepCard = ({ number, title, desc, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="group relative"
    >
        <div className="absolute -left-12 top-0 font-mono text-4xl text-green-900/50 font-bold group-hover:text-green-500 transition-colors">
            0{number}
        </div>
        <div className="tech-card p-6 h-full z-10 relative bg-zinc-950/80 backdrop-blur-sm">
            <div className="mb-4 text-green-500">
                <Icon size={24} />
            </div>
            <h3 className="font-mono font-bold text-lg mb-2 text-white">{title}</h3>
            <p className="text-sm text-green-400/70 leading-relaxed font-sans">{desc}</p>
        </div>
    </motion.div>
);

const Workflow = () => {
    const [activeStep, setActiveStep] = useState(-1);

    const steps = [
        { label: "USER_INPUT", icon: "👤" },
        { label: "ENCRYPTION", icon: "🔒" },
        { label: "LLM_CORE", icon: "🧠" },
        { label: "SOP_DB", icon: "📂" },
        { label: "ACTION_PLAN", icon: "⚡" }
    ];

    const handleNextStep = () => {
        setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : -1));
    };

    return (
        <section id="workflow" className="py-24 border-b-4 border-green-900 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="mono-tag block mb-2 text-green-600">System Architecture</span>
                        <h2 className="font-mono text-3xl font-bold text-white">
                            INTELLIGENCE PIPELINE
                        </h2>
                    </div>
                    <p className="text-green-400/60 max-w-md text-sm border-l-2 border-green-500 pl-4">
                        A linear progression from unchecked input to validated security response.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mb-24">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-px bg-green-900/30 -z-0" />

                    <StepCard
                        number={1}
                        title="INGESTION"
                        desc="Raw data intake via Webform or WhatsApp API. text/audio/image classification."
                        icon={GitCommit}
                        delay={0.1}
                    />
                    <StepCard
                        number={2}
                        title="ANALYSIS"
                        desc="LLM processing engine extracts intent, IoCs, and threat indicators."
                        icon={Cpu}
                        delay={0.2}
                    />
                    <StepCard
                        number={3}
                        title="MATCHING"
                        desc="Vector search against SOP database and historical incident logs."
                        icon={ShieldAlert}
                        delay={0.3}
                    />
                    <StepCard
                        number={4}
                        title="RESPONSE"
                        desc="Structured output generation with step-by-step mitigation guide."
                        icon={FileText}
                        delay={0.4}
                    />
                </div>

                {/* Interactive Process Flow */}
                <div className="border border-green-900 bg-black/50 p-8 rounded-sm relative overflow-hidden">
                    <h2 className="font-mono text-3xl font-bold text-white">
                        FOR DEEPER UNDERSTANDING
                    </h2>

                    <div className="flex justify-center mb-12">
                        <button
                            onClick={handleNextStep}
                            className="group flex items-center gap-3 px-6 py-3 bg-green-900/20 border border-green-500 hover:bg-green-500 hover:text-black text-green-500 font-mono text-xs tracking-widest transition-all"
                        >
                            {activeStep === steps.length - 1 ? (
                                <>
                                    <RotateCcw size={16} /> RESET_SIMULATION
                                </>
                            ) : (
                                <>
                                    <Play size={16} /> {activeStep === -1 ? 'START_SIMULATION' : `EXECUTE_NEXT_STEP [ ${activeStep + 1} / ${steps.length} ]`}
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 min-h-[120px]">
                        {steps.map((step, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    initial={{ opacity: 0.3, scale: 0.9 }}
                                    animate={{
                                        opacity: i <= activeStep ? 1 : 0.2,
                                        scale: i === activeStep ? 1.1 : 1,
                                        filter: i <= activeStep ? 'blur(0px)' : 'blur(2px)'
                                    }}
                                    className="flex flex-col items-center gap-3 transition-all duration-500"
                                >
                                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-500 ${i <= activeStep
                                        ? 'border-green-500 bg-green-900/20 shadow-[0_0_20px_rgba(0,255,65,0.3)] text-white'
                                        : 'border-green-900/30 bg-black text-green-900'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <span className={`font-mono text-[10px] font-bold tracking-wider transition-colors duration-300 ${i <= activeStep ? 'text-green-500' : 'text-green-900/40'
                                        }`}>{step.label}</span>
                                </motion.div>
                                {i < 4 && (
                                    <div className="h-[2px] flex-1 w-full md:w-auto bg-green-900/20 relative overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: i < activeStep ? "0%" : "-100%" }}
                                            transition={{ duration: 0.5, ease: "circOut" }}
                                            className="absolute top-0 left-0 h-full w-full bg-green-500 shadow-[0_0_10px_#00ff41]"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;