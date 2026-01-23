"use client";

import { CTA } from "@/components/home/CTA";
import { Mail, MessageCircle, HelpCircle, ChevronRight } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[rgb(var(--background))] text-white pt-24">
            <div className="container mx-auto px-4 max-w-5xl mb-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">Support Center</h1>
                    <p className="text-xl text-zinc-400">We&apos;re here to help you crush your goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-[#18181B] p-8 rounded-2xl border border-white/5 text-center hover:border-[rgb(var(--primary))]/30 transition-colors">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center text-[rgb(var(--primary))] mb-6">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email Support</h3>
                        <p className="text-zinc-500 mb-6">Get a response within 24 hours.</p>
                        <a href="mailto:support@powertrack.com" className="text-[rgb(var(--primary))] font-bold hover:underline">support@powertrack.com</a>
                    </div>

                    <div className="bg-[#18181B] p-8 rounded-2xl border border-white/5 text-center hover:border-[rgb(var(--primary))]/30 transition-colors">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center text-[rgb(var(--primary))] mb-6">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                        <p className="text-zinc-500 mb-6">Available 9am - 5pm EST.</p>
                        <button className="text-zinc-500 font-bold cursor-not-allowed" disabled>Coming Soon</button>
                    </div>

                    <div className="bg-[#18181B] p-8 rounded-2xl border border-white/5 text-center hover:border-[rgb(var(--primary))]/30 transition-colors">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center text-[rgb(var(--primary))] mb-6">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Knowledge Base</h3>
                        <p className="text-zinc-500 mb-6">Guides and tutorials.</p>
                        <a href="#" className="text-[rgb(var(--primary))] font-bold hover:underline">Browse Articles</a>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 uppercase tracking-tight text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            "How do I reset my password?",
                            "Can I export my workout data?",
                            "Is there a mobile app?",
                            "How do I cancel my subscription?"
                        ].map((q) => (
                            <div key={q} className="bg-[#18181B] p-6 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group">
                                <span className="font-medium text-lg">{q}</span>
                                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-[rgb(var(--primary))] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CTA />
        </div>
    );
}
