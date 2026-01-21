import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PowerTrack - Your AI-Powered Fitness Companion",
  description: "Track workouts, monitor progress, and achieve your fitness goals with PowerTrack - the ultimate fitness tracking app powered by AI.",
  keywords: ["fitness", "workout", "tracking", "health", "nutrition", "exercise"],
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
      <body className={`${inter.variable} antialiased matrix-lines`}>
        <Navbar user={user} />
        <main className="pt-16 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}

