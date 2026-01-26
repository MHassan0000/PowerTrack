"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

export function CTA() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 1]);

    return (
        <section ref={sectionRef} className="bg-[#050505] relative pt-0 pb-12 border-t border-white/5">
            <motion.div style={{ y, opacity }} className="container mx-auto px-4">
                {/* Main CTA Content */}
                <div className="py-24 md:py-32 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {/* Added padding px-4 to prevent italic clipping */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-4">
                            Ready to redefine your limits?
                        </h2>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join thousands of athletes pushing their boundaries every day.
                            Start your free 14-day trial now.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            
                            <Link
                                href="/about"
                                className="w-full sm:w-auto px-8 py-4 text-white font-medium hover:text-[rgb(var(--primary))] transition-colors flex items-center justify-center gap-2 group"
                            >
                                Learn more 
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-12 md:mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        
                        <span className="text-xl font-black italic tracking-tighter text-white">
                            POWER<span className="text-[rgb(var(--primary))]">TRACK</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-zinc-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/support" className="hover:text-white transition-colors">Support</Link>
                    </div>

                    <p className="text-zinc-600">
                        &copy; 2024 Power Track Inc.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
