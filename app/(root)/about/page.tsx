"use client";

import { motion } from "framer-motion";

import { Users, Target, Zap, Heart } from "lucide-react";

const VALUES = [
    {
        icon: Target,
        title: "Precision",
        description: "We believe in data-driven training. Measurable progress requires precise tracking and analysis."
    },
    {
        icon: Users,
        title: "Community",
        description: "Greatness isn't achieved in isolation. We foster a global community of elite performers."
    },
    {
        icon: Zap,
        title: "Innovation",
        description: "We constantly push the boundaries of what's possible with technology and fitness."
    },
    {
        icon: Heart,
        title: "Passion",
        description: "We are fueled by a relentless love for self-improvement and the grind."
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[rgb(var(--background))] text-white pt-24">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 uppercase"
                    >
                        Building the <span className="text-[rgb(var(--primary))]">Future</span> of Fitness
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-zinc-400 leading-relaxed"
                    >
                        PowerTrack was born from a simple obsession: to give every athlete access to elite-level tools. 
                        We strip away the noise and focus on what matters—your metrics, your progress, and your potential.
                    </motion.p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#18181B] p-8 rounded-2xl border border-white/5 hover:border-[rgb(var(--primary))]/30 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center text-[rgb(var(--primary))] mb-6 group-hover:scale-110 transition-transform">
                                <value.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{value.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="bg-[#18181B] rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[rgb(var(--primary))]/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">Our Story</h2>
                        <div className="space-y-6 text-zinc-400 text-lg">
                            <p>
                                Started in a garage by two obsessed lifters, PowerTrack has grown into a platform trusted by thousands. 
                                We got tired of clunky apps that were either too simple or overly complicated.
                            </p>
                            <p>
                                We wanted something that felt like a dashboard for a fighter jet—precise, fast, and powerful. 
                                So we built it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

           
        </div>
    );
}
