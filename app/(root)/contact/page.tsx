"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Using Zod + Controlled inputs for simplicity and consistency

import { toast } from 'sonner';
import { contactSchema, type ContactInput } from '@/lib/validations/contact';
import emailjs from '@emailjs/browser';
import { Loader2, Send, Mail, User, MessageSquare } from 'lucide-react';
import { CTA } from "@/components/home/CTA";

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ContactInput>({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const result = contactSchema.safeParse(formData);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const firstError = Object.values(errors).flat()[0];
            toast.error(firstError || 'Invalid input');
            return;
        }

        setLoading(true);

        try {
            // Check for env vars
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                console.error('Missing EmailJS keys:', { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey });
                throw new Error('Email configuration missing');
            }

            // Use .send() with JSON data instead of .sendForm() to avoid DOM/AdBlock issues
            await emailjs.send(
                serviceId, 
                templateId, 
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_name: 'PowerTrack Team', // Optional: Customize as needed
                },
                publicKey
            );

            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' }); // Reset form
        } catch (error: any) {
            console.error('Email error:', error);
            // Improve error messaging
            if (error?.text) {
                toast.error(`Error: ${error.text}`);
            } else {
                toast.error('Failed to send message. Please check your connection or ad blocker.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[rgb(var(--background))] text-white pt-24">
            <section className="container mx-auto px-4 mb-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6"
                        >
                            Get in <span className="text-[rgb(var(--primary))]">Touch</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl text-zinc-400 max-w-2xl mx-auto"
                        >
                            Have a question, feedback, or just want to talk training? We're here for it.
                        </motion.p>
                    </div>

                    {/* Form Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#18181B] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-[rgb(var(--primary))]/5 to-transparent pointer-events-none" />

                        <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label htmlFor="user_name" className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="user_name"
                                        name="user_name" // EmailJS typically expects 'user_name' or similar mapped in template
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="user_email" className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="user_email"
                                        name="user_email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[rgb(var(--primary))] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[rgb(var(--primary-hover))] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
                <CTA />
            </section>

           
        </div>
    );
}
