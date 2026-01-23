"use client";

import { motion } from "framer-motion";
import { CTA } from "@/components/home/CTA";
import { BarChart3, Target, Users, Smartphone, Trophy, Zap, Clock, Shield, Database } from "lucide-react";

const ALL_FEATURES = [
    {
        title: "Personalized Coaching",
        description: "Adaptive AI that recalibrates your training plans based on real-time performance and recovery metrics.",
        icon: Target,
        delay: 0
    },
    {
        title: "Analytics Dashboard",
        description: "Professional-grade data visualization. Track volume, intensity, relative exertion, and projected 1RMs.",
        icon: BarChart3,
        delay: 0.1
    },
    {
        title: "Community Leaderboards",
        description: "Compete with friends and athletes worldwide. Push your limits by chasing the top spot.",
        icon: Users,
        delay: 0.2
    },
    {
        title: "Cross-Platform Sync",
        description: "Seamless synchronization across web and mobile. Your data moves with you, everywhere.",
        icon: Smartphone,
        delay: 0.3
    },
    {
        title: "Gamification System",
        description: "Earn XP, unlock achievements, and level up as you crush your workouts. Stay motivated.",
        icon: Trophy,
        delay: 0.4
    },
    {
        title: "Workout Builder",
        description: "Intuitive drag-and-drop workout creator. Build complex routines in seconds.",
        icon: Database,
        delay: 0.5
    },
    {
        title: "Rest Timer & Pacing",
        description: "Built-in smart timers ensure you're resting exactly as much as you need for your goals.",
        icon: Clock,
        delay: 0.6
    },
    {
        title: "Secure Data Vault",
        description: "Enterprise-grade encryption keeps your health data private and secure at all times.",
        icon: Shield,
        delay: 0.7
    },
    {
        title: "Live Session Tracking",
        description: "Real-time active workout mode with big, bold metrics perfect for busy gym environments.",
        icon: Zap,
        delay: 0.8
    }
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[rgb(var(--background))] text-white pt-24">
            
            {/* Header */}
            <section className="container mx-auto px-4 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                        The Ultimate <span className="text-[rgb(var(--primary))]">Toolkit</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        Every feature you need to dominate your training, meticulously engineered for performance.
                    </p>
                </motion.div>
            </section>

            {/* Feature Grid */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ALL_FEATURES.map((feature) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            className="bg-[#18181B] p-8 rounded-2xl border border-white/5 hover:border-[rgb(var(--primary))]/40 transition-all hover:-translate-y-1 group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-[rgb(var(--background))] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:border-[rgb(var(--primary))] group-hover:text-[rgb(var(--primary))] transition-all duration-300">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[rgb(var(--primary))] transition-colors">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <CTA />
        </div>
    );
}
