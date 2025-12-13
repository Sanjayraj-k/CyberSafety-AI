import React from 'react';
import {
    Globe2,
    Scan,
    MapPin,
    MessageCircle,
    Link2,
    FileCheck
} from 'lucide-react';

const FeatureTile = ({ title, desc, icon: Icon, span = 1 }) => (
    <div className={`tech-card p-8 ${span === 2 ? 'md:col-span-2' : ''} bg-zinc-950/80 backdrop-blur-sm`}>
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-green-900/10 border border-green-900/50">
                <Icon size={20} className="text-green-500" />
            </div>
            <div className="font-mono text-[10px] text-green-700">
                MOD_{title.replace(/\s/g, '_').toUpperCase().slice(0, 8)}
            </div>
        </div>
        <h3 className="font-mono font-bold text-xl mb-3 text-white">{title}</h3>
        <p className="text-green-400/70 text-sm leading-relaxed">
            {desc}
        </p>
    </div>
);

const Features = () => {
    return (
        <section id="features" className="py-24 bg-transparent border-b-4 border-green-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <span className="mono-tag mb-2 block text-green-600">System Capabilities</span>
                    <h2 className="font-mono text-3xl font-bold text-white">KEY INNOVATIONS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureTile
                        title="Multimodal AI Support"
                        desc="Understands text, voice, images & regional languages — enabling even non-literate users to report cybercrime easily."
                        icon={Globe2}
                    />
                    <FeatureTile
                        title="Auto-Matched Routing"
                        desc="Identifies the crime type and directs users to the exact official government portal & form, eliminating confusion."
                        icon={Link2}
                    />
                    <FeatureTile
                        title="Smart Evidence Validator"
                        desc="Checks if the required proofs (screenshots, transactions, URLs) are complete to avoid complaint rejection."
                        icon={FileCheck}
                    />

                    <FeatureTile
                        title="WhatsApp-First Accessibility"
                        desc="Runs directly on WhatsApp — no new app required — reaching rural, elderly & non-tech users effectively."
                        icon={MessageCircle}
                        span={2}
                    />
                    <FeatureTile
                        title="Location-Aware Intel"
                        desc="Fetches nearest cyber police contacts & latest govt advisories based on user location and case type."
                        icon={MapPin}
                    />
                    <FeatureTile
                        title="Real-Time Official Links"
                        desc="AI instantly delivers the correct cyber complaint links & hotlines for immediate action — no misinformation."
                        icon={Scan}
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;