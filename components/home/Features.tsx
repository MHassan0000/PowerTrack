"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Target, Users, Smartphone, Trophy, Zap } from "lucide-react";

const features = [
    {
        title: "Personalized Coaching",
        description: "Tailored plans that adapt to your daily recovery, sleep scores, and training load automatically.",
        icon: <Target className="w-8 h-8" />,
        colSpan: "md:col-span-1",
        bg: "bg-[rgb(var(--card))]"
    },
    {
        title: "Data Insights",
        description: "Deep-dive analytics to visualize your progress with professional-grade metrics and charts.",
        icon: <BarChart3 className="w-8 h-8" />,
        colSpan: "md:col-span-1",
        bg: "bg-[rgb(var(--card))]"
    },
    {
        title: "Global Community",
        description: "Compete in global leaderboards and connect with like-minded elite athletes worldwide.",
        icon: <Users className="w-8 h-8" />,
        colSpan: "md:col-span-1",
        bg: "bg-[rgb(var(--card))]"
    },
    {
        title: "Smart Device Sync",
        description: "Seamlessly integrates with Apple Health, Garmin, and Whoop for total biometric tracking.",
        icon: <Smartphone className="w-8 h-8" />,
        colSpan: "md:col-span-2",
        bg: "bg-[rgb(var(--card))]" // Could be a different shade or gradient
    },
    {
        title: "Gamified Progress",
        description: "Earn badges, unlock tiers, and maintain streaks to keep your motivation at peak levels.",
        icon: <Trophy className="w-8 h-8" />,
        colSpan: "md:col-span-1",
        bg: "bg-[rgb(var(--card))]"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.4, // Very distinct steps
            delayChildren: 0.4
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
};

export function Features() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.7]);

    return (
        <section ref={sectionRef} className="py-24 px-4 bg-[rgb(var(--background-secondary))] relative overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <motion.div 
                    style={{ y, opacity }}
                    className="mb-16 md:text-center max-w-3xl mx-auto"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6"
                    >
                        Elite Performance <span className="text-[rgb(var(--primary))]">Tools</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-xl text-[rgb(var(--foreground-muted))]"
                    >
                        Everything you need to reach your peak potential, engineered into one seamless platform.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px", amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
                            className={`${feature.colSpan} group relative overflow-hidden rounded-xl border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50 transition-colors duration-300`}
                        >
                            <div className={`${feature.bg} p-8 h-full flex flex-col justify-between relative z-10`}>
                                <div className="mb-6 w-14 h-14 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--primary))] group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-[rgb(var(--foreground-muted))] leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Effect Background */}
                            <div className="absolute inset-0 bg-linear-to-br from-[rgb(var(--primary))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
