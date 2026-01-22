"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

export function CTA() {
    return (
        <section className="py-32 px-4 bg-[rgb(var(--background))] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-125 bg-[rgb(var(--primary))]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-3xl p-12 md:p-24 text-center relative overflow-hidden"
                >
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
                            Ready to <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(var(--primary))] to-white">Ascend?</span>
                        </h2>

                        <p className="text-xl text-[rgb(var(--foreground-muted))] max-w-2xl mx-auto">
                            Join the community of athletes redefining what's possible. Your first 14 days are on us.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Link
                                href="/signup"
                                className="px-10 py-5 bg-[rgb(var(--primary))] text-black font-bold text-lg uppercase tracking-wider rounded-sm hover:scale-105 transition-transform shadow-lg shadow-[rgb(var(--primary))]/20"
                            >
                                Start Your Free Trial <Rocket className="inline-block ml-2 w-5 h-5" />
                            </Link>
                        </div>

                        <p className="text-sm text-[rgb(var(--foreground-muted))] pt-4">No credit card required for demo.</p>
                    </div>
                </motion.div>
            </div>

            {/* Footer Minimal */}
            <div className="mt-32 border-t border-[rgb(var(--border))] pt-12 pb-8">
                <div className="container mx-auto px-4 text-center text-[rgb(var(--foreground-muted))] text-sm">
                    <h3 className="text-2xl font-black uppercase text-white mb-8 tracking-widest">Apex Fitness</h3>
                    <div className="flex justify-center gap-8 mb-8">
                        <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Support</a>
                        <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors">Careers</a>
                    </div>
                    <p>&copy; 2024 Power Track Inc. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
}
