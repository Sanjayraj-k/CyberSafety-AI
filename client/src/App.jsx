import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MousePointer2, ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "15551864905";
    const message = encodeURIComponent(
      "Hello, I need help with a cyber issue."
    );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent border-b-4 border-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-8">
            <motion.h1
              className="font-mono text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-8"
            >
              AUTOMATED <br />
              CYBER <span className="text-green-500">ISSUE</span> <br />
              SOLVER
            </motion.h1>

            <motion.p className="text-lg text-green-400/80 max-w-2xl mb-10 border-l-2 border-green-900 pl-6 py-2">
              Deploy LLM-driven Standard Operating Procedures (SOPs) for rapid
              incident mitigation. Supports multi-modal input ingestion via Web
              and Mobile endpoints.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4">
              {/* Web Console */}
              <button
                onClick={() => navigate("/console")}
                className="px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono text-sm tracking-wider flex items-center gap-3 group transition-all"
              >
                INITIATE_WEB_SESSION
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppRedirect}
                className="px-8 py-4 bg-black border border-green-900 hover:border-green-500 text-green-500 font-mono text-sm tracking-wider flex items-center gap-3 transition-all"
              >
                CONNECT_WHATSAPP
              </button>
            </motion.div>
          </div>

          {/* Right Visual (unchanged) */}
          <div className="lg:col-span-4 relative">
            {/* your existing visual code */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;