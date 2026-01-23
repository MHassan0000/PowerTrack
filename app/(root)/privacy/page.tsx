"use client";

import { CTA } from "@/components/home/CTA";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[rgb(var(--background))] text-white pt-24">
            <div className="container mx-auto px-4 max-w-4xl mb-24">
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-12">Privacy Policy</h1>
                
                <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
                    <p className="lead text-xl text-white font-medium mb-8">
                        Your privacy is critical to us. At PowerTrack, we track your workouts, not your life.
                    </p>

                    <h3 className="text-white font-bold mt-12 mb-4">1. Data Collection</h3>
                    <p>
                        We collect only the information necessary to provide you with a world-class training experience. 
                        This includes your workout logs, body metrics (if you choose to input them), and account details.
                    </p>

                    <h3 className="text-white font-bold mt-12 mb-4">2. How We Use Your Data</h3>
                    <p>
                        Your data is used solely to analytics, progress tracking, and improving the app experience. 
                        We do not sell your personal data to third parties. Ever.
                    </p>

                    <h3 className="text-white font-bold mt-12 mb-4">3. Data Security</h3>
                    <p>
                        We employ industry-standard encryption and security measures to protect your information. 
                        Your data is stored securely on servers with robust access controls.
                    </p>

                    <h3 className="text-white font-bold mt-12 mb-4">4. Your Rights</h3>
                    <p>
                        You own your data. You can request a full export or deletion of your account and data at any time 
                        through the settings menu.
                    </p>

                    <h3 className="text-white font-bold mt-12 mb-4">5. Updates</h3>
                    <p>
                        We may update this policy from time to time. We will notify you of any significant changes via email 
                        or an in-app notification.
                    </p>
                    
                    <p className="mt-12 text-sm text-zinc-600">
                        Last updated: January 2024
                    </p>
                </div>
            </div>

            <CTA />
        </div>
    );
}
