import React from 'react';
import { motion } from 'framer-motion';
import {
    GitCommit,
    Cpu,
    ShieldAlert,
    FileText,
    ArrowRight
} from 'lucide-react';

const StepCard = ({ number, title, desc, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="group relative"
    >
        <div className="absolute -left-12 top-0 font-mono text-4xl text-slate-200 font-bold group-hover:text-cyber-blue transition-colors">
            0{number}
        </div>
        <div className="tech-card p-6 h-full bg-white z-10 relative">
            <div className="mb-4 text-slate-900">
                <Icon size={24} />
            </div>
            <h3 className="font-mono font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">{desc}</p>
        </div>
    </motion.div>
);

const Workflow = () => {
    return (
        <section id="workflow" className="py-24 border-y border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="mono-tag block mb-2">System Architecture</span>
                        <h2 className="font-mono text-3xl font-bold text-slate-900">
                            INTELLIGENCE PIPELINE
                        </h2>
                    </div>
                    <p className="text-slate-600 max-w-md text-sm border-l-2 border-cyber-blue pl-4">
                        A linear progression from unchecked input to validated security response.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-px bg-slate-200 -z-0" />

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

            </div>
        </section>
    );
};

export default Workflow;
