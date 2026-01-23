"use client";

import { motion } from "framer-motion";
import { CTA } from "@/components/home/CTA";
import { Quote } from "lucide-react";

export default function PhilosophyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24">
            
            {/* Header */}
            <section className="container mx-auto px-4 mb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[rgb(var(--primary))] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Ethos</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                        Forged in <span className="text-white">Steel.</span><br />
                        Proven by <span className="text-[rgb(var(--primary))]">Data.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        We don't believe in shortcuts. We believe in the ruthless pursuit of progress, measured precisely and executed flawlessly.
                    </p>
                </motion.div>
            </section>

            {/* Core Tenets */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-3xl font-bold uppercase mb-4 text-white">1. Measure Everything</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                What gets measured gets managed. If you're not tracking your progress, you're just guessing. 
                                We provide the tools to capture every metric that matters.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold uppercase mb-4 text-white">2. Consistency is King</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Intensity builds muscle, but consistency builds champions. Our platform is designed to keep you 
                                accountable and on track, day in and day out.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold uppercase mb-4 text-white">3. Data Over Ego</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Leave your ego at the door. The numbers don't lie. We help you train smarter, matching your 
                                intensity to your recovery, so you can perform at your peak for the long haul.
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-tr from-[rgb(var(--primary))]/20 to-transparent rounded-2xl blur-3xl opacity-30" />
                        <div className="relative z-10 bg-[#18181B] p-12 rounded-3xl border border-white/5 text-center">
                            <Quote className="w-12 h-12 text-[rgb(var(--primary))] mx-auto mb-8 opacity-50" />
                            <p className="text-2xl md:text-3xl font-serif italic text-white mb-8 leading-relaxed">
                                "The only bad workout is the one that didn't happen."
                            </p>
                            <div className="h-px w-24 bg-[rgb(var(--primary))] mx-auto mb-4" />
                            <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">PowerTrack Philosophy</span>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
}
