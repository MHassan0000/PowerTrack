import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Transform{" "}
              <span className="glow-text">Your Body</span>
              <br />
              With PowerTrack
            </h1>
            <p className="text-xl md:text-2xl text-[rgb(var(--foreground-muted))] max-w-2xl mx-auto">
              Your ultimate fitness companion. Track workouts, monitor progress,
              and achieve your goals with intelligent tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-bold rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/30 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))] font-bold rounded-lg hover:bg-[rgb(var(--primary))]/10 transition-all text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-[rgb(var(--background-secondary))]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need to <span className="glow-text">Succeed</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glow-border bg-[rgb(var(--card))] p-6 rounded-xl">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Log your exercises, sets, and reps with our intuitive interface
              </p>
            </div>
            <div className="glow-border bg-[rgb(var(--card))] p-6 rounded-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Progress Monitoring</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Visualize your gains with comprehensive charts and analytics
              </p>
            </div>
            <div className="glow-border bg-[rgb(var(--card))] p-6 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Set and crush your fitness goals with personalized plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your <span className="glow-text">Journey</span>?
          </h2>
          <p className="text-xl text-[rgb(var(--foreground-muted))]">
            Join thousands of users achieving their fitness goals with PowerTrack
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-bold rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/30 text-lg"
          >
            Build Your Program
          </Link>
        </div>
      </section>
    </div>
  );
}
