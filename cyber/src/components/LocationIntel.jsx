import React, { useState, useEffect } from "react";
import {
    Shield,
    AlertTriangle,
    ExternalLink,
    Navigation,
    Radar,
} from "lucide-react";
import { motion } from "framer-motion";

const LocationIntel = ({ caseType = "Cyber Crime" }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState("prompt"); // prompt, granted, denied

    // Govt Advisories
    const getAdvisories = (type) => {
        const advisories = [
            {
                title: "National Cyber Crime Reporting Portal",
                content: "File a formal complaint at cybercrime.gov.in",
            },
            {
                title: "Digital Evidence Standard",
                content:
                    "Do not delete any messages or screenshots. They are crucial evidence.",
            },
            {
                title: "Financial Fraud Protocol",
                content: "Immediately freeze affected bank accounts and call 1930.",
            },
            {
                title: "Helpline Assistance",
                content: "Dial 1930 for immediate cybercrime reporting assistance.",
            },
            {
                title: "Identity Protection",
                content: "Enable 2FA on all accounts and monitor credit reports.",
            },
            {
                title: "Network Isolation",
                content: "Disconnect infected devices from Wi-Fi immediately.",
            },
            {
                title: "Social Engineering Warning",
                content: "Verify caller identities before sharing any OTPs.",
            },
        ];

        if (type?.toLowerCase().includes("sextortion")) {
            advisories.push({
                title: "Sextortion Alert",
                content:
                    "Do not pay the ransom. 90% of attackers demand more money after payment.",
            });
        }

        return advisories;
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.permissions
            ?.query({ name: "geolocation" })
            .then((result) => {
                setPermissionStatus(result.state);
                result.onchange = () => setPermissionStatus(result.state);
            });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setPermissionStatus("granted");
                setLoading(false);
            },
            (err) => {
                if (err.code === 1) setPermissionStatus("denied");
                setError("Location access required for local intel.");
                setLoading(false);
            }
        );
    }, []);

    const handleGrantPermission = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setPermissionStatus("granted");
                setLoading(false);
            },
            () => {
                setError("Unable to retrieve location.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            {/* Geo-Intel Module */}
            <div className="bg-black/80 border border-green-500/30 p-6 relative overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,197,94,0.2)_360deg)] animate-spin" />
                    </div>
                )}

                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                    <Navigation
                        className={`w-5 h-5 text-green-500 ${loading ? "animate-spin" : ""
                            }`}
                    />
                    GEOSPATIAL_INTEL
                </h3>

                <div className="min-h-[160px] flex flex-col">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3">
                            <Radar className="w-12 h-12 text-green-500 animate-pulse" />
                            <p className="text-green-500/70 text-xs tracking-widest animate-pulse">
                                TRIANGULATING POSITION...
                            </p>
                        </div>
                    ) : permissionStatus === "denied" ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3 border border-red-500/30 bg-red-900/10 p-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <p className="text-red-400 text-sm font-bold">ACCESS DENIED</p>
                            <p className="text-red-300/70 text-xs">
                                Location permissions required to find nearby cyber cells.
                            </p>
                            <button
                                onClick={handleGrantPermission}
                                className="text-xs text-green-500 underline underline-offset-4 hover:text-white"
                            >
                                RETRY ACCESS
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between border-b border-green-500/20 pb-2">
                                <div>
                                    <p className="text-xs text-green-500/50 uppercase tracking-widest mb-1">
                                        CURRENT_SECTOR
                                    </p>
                                    <p className="text-white font-mono">
                                        {location
                                            ? `${location.lat.toFixed(
                                                4
                                            )}° N, ${location.lng.toFixed(4)}° E`
                                            : "UNKNOWN"}
                                    </p>
                                </div>
                                <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
                            </div>

                            <div className="border border-green-500/20 bg-green-900/10 text-center overflow-hidden relative">
                                {location && (
                                    <>
                                        <div className="w-full h-[300px] relative filter grayscale invert-[.9] contrast-[1.2]">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                title="Cyber Tactical Map"
                                                scrolling="no"
                                                marginHeight="0"
                                                marginWidth="0"
                                                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
                                                className="opacity-80 hover:opacity-100 transition-opacity"
                                            >
                                            </iframe>
                                            {/* Overlay for grid effect */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                                        </div>

                                        <a
                                            href={`https://www.google.com/maps/search/cyber+crime+police+station+near+me/@${location.lat},${location.lng},12z`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-green-600 text-black hover:bg-green-500 py-3 transition-all relative z-10"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            OPEN FULL TACTICAL MAP
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Govt Advisories */}
            <div className="bg-black/80 border border-green-500/30 p-6 flex flex-col">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                    <Shield className="w-5 h-5 text-green-500" />
                    OFFICIAL_DIRECTIVES
                </h3>

                <div className="flex-1 space-y-3">
                    {getAdvisories(caseType).map((advisory, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 border-l-2 border-green-500/30 pl-3 py-1"
                        >
                            <span className="text-green-500 font-bold text-xs mt-0.5">
                                0{idx + 1}
                            </span>
                            <div>
                                <p className="text-green-300 font-bold text-sm">
                                    {advisory.title}
                                </p>
                                <p className="text-green-500/60 text-xs">
                                    {advisory.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-green-500/20">
                    <p className="text-[10px] text-green-500/40 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500/40 rounded-full animate-pulse" />
                        LIVE FEED FROM MINISTRY OF HOME AFFAIRS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationIntel;
