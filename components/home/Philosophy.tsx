"use client";

import { motion } from "framer-motion";
import { Swords, Dumbbell, Zap, Mountain } from "lucide-react";

const PARTNERS = [
    { name: "FIGHTCLUB", icon: Swords },
    { name: "IRON GYM", icon: Dumbbell },
    { name: "VELOCITY", icon: Zap },
    { name: "SUMMIT", icon: Mountain },
];

export function Philosophy() {
    return (
        <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-radial-[at_center_top] from-zinc-900/30 via-[#050505]/80 to-[#050505] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10 block">
                {/* Quote Section */}
                <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Added px-4 py-2 to prevent italic clipping */}
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-white leading-tight mb-8 px-4 py-2">
                            &quot;The only bad workout is the<br className="hidden md:block" /> one that didn&apos;t happen.&quot;
                        </h2>
                        
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-8 md:w-16 bg-[rgb(var(--primary))]/50" />
                            <span className="text-[rgb(var(--primary))] text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                                Elite Performance Philosophy
                            </span>
                            <div className="h-px w-8 md:w-16 bg-[rgb(var(--primary))]/50" />
                        </div>
                    </motion.div>
                </div>

                {/* Trusted By Section */}
                <div className="text-center">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8 md:mb-12">
                        Trusted by elite athletes from
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {PARTNERS.map((partner, index) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 group cursor-default"
                            >
                                <partner.icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[rgb(var(--primary))] transition-colors" />
                                <span className="text-sm md:text-base font-bold text-zinc-400 group-hover:text-white transition-colors tracking-wider">
                                    {partner.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
