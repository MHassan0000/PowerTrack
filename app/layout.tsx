import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PowerTrack - Your AI-Powered Fitness Companion",
  description: "Track workouts, monitor progress, and achieve your fitness goals with PowerTrack - the ultimate fitness tracking app powered by AI.",
  keywords: ["fitness", "workout", "tracking", "health", "nutrition", "exercise"],
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased matrix-lines bg-[rgb(var(--background))]`}>
        {children}
        <Script id="pwa-init" strategy="afterInteractive">
          {`
            // Register service worker
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              color: 'rgb(var(--foreground))',
            },
          }}
        />
      </body>
    </html>
  );
}

