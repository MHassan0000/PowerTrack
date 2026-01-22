"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Zap, Star, TrendingUp, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[rgb(var(--background))]">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[rgb(var(--primary))]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left pt-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--primary))]"></span>
                            </span>
                            <span className="text-xs font-medium tracking-wider uppercase text-[rgb(var(--foreground-secondary))]">
                                New Generation Fitness
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight uppercase italic pb-2">
                            Forge Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(var(--primary))] to-white">
                                Ultimate Self
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[rgb(var(--foreground-muted))] max-w-lg leading-relaxed">
                            AI-driven coaching, elite community, and metrics that matter. Join the 1% of athletes reaching their peak today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                            <Link
                                href="/signup"
                                className="group relative w-full sm:w-auto px-8 py-4 bg-[rgb(var(--primary))] text-black font-bold text-lg uppercase tracking-wide overflow-hidden rounded-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Free<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </Link>

                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-8 py-4 border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-bold text-lg uppercase tracking-wide hover:bg-[rgb(var(--card))] transition-colors rounded-sm flex items-center justify-center"
                            >
                                View Demo <Play className="inline-block ml-2 w-4 h-4 fill-current" />
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-8 pt-8 border-t border-[rgb(var(--border))]/50 w-full lg:w-auto">
                            <div className="flex -space-x-4">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100",
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                                ].map((src, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[rgb(var(--background))] relative z-10 hover:scale-110 transition-transform duration-300 ring-2 ring-[rgb(var(--border))] ring-offset-2 ring-offset-[rgb(var(--background))]">
                                        <img src={src} alt="Athlete" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-2 border-[rgb(var(--background))] bg-[rgb(var(--card))] flex items-center justify-center text-xs font-bold text-[rgb(var(--foreground))] relative z-0 hover:scale-110 transition-transform duration-300 ring-1 ring-[rgb(var(--border))]">
                                    +10k
                                </div>
                            </div>
                            <div className="space-y-1 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <div className="flex gap-0.5 text-[rgb(var(--primary))]">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-[rgb(var(--foreground))]">5.0</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-[rgb(var(--foreground-muted))]">
                                    <TrendingUp className="w-4 h-4 text-[rgb(var(--primary))]" />
                                    <span className="font-medium">Trusted by elite athletes</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content - Abstract/3D Mockup placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--primary))] to-transparent opacity-20 blur-[100px] rounded-full" />

                            {/* Main Card */}
                            <div className="relative z-10 w-full h-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 grayscale hover:grayscale-0 transition-all duration-700 group">
                                {/* Replaced real image with placeholder div to avoid 404s if asset missing. User can replace. */}
                                <div className="w-full h-full bg-[rgb(var(--background-secondary))] flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                                    <div className="relative z-10 text-center p-8">
                                        <Activity className="w-24 h-24 text-[rgb(var(--primary))] mx-auto mb-4 opacity-80" />
                                        <h3 className="text-3xl font-black uppercase text-white tracking-widest">PowerTrack</h3>
                                        <p className="text-[rgb(var(--primary))] font-mono text-sm mt-2">SYSTEM ACTIVE</p>
                                    </div>
                                </div>

                                {/* Floating UI Elements */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center text-[rgb(var(--primary))]">
                                            <Zap className="w-5 h-5 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/60 font-medium uppercase">Heart Rate Zone</p>
                                            <p className="text-xl font-bold text-white tabular-nums">145 <span className="text-sm text-white/40 font-normal">BPM</span></p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-24 flex items-end gap-1">
                                        {[40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                                            <div key={i} className="flex-1 bg-[rgb(var(--primary))]" style={{ height: `${h}%`, opacity: i > 4 ? 1 : 0.3 }} />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
