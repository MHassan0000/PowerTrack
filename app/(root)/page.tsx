import { createClient } from "@/lib/supabase/server";

import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Philosophy } from "@/components/home/Philosophy";
import { CTA } from "@/components/home/CTA";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logic removed to allow authenticated users to visit home

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] overflow-x-hidden selection:bg-[rgb(var(--primary))] selection:text-black">
      <Hero/>
      <Features />
      <Philosophy />
      <CTA />
    </main>
  );
}

