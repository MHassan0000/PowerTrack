import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
              With Advanced AI Technology
            </h1>

            <p className="text-xl md:text-2xl text-[rgb(var(--foreground-muted))] max-w-3xl mx-auto">
              Track workouts, monitor progress, and achieve your fitness goals
              with PowerTrack - your AI-powered fitness companion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-bold rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/30 text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-bold rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/30 text-lg"
                  >
                    Build Your Program →
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-8 py-4 glow-border bg-transparent font-medium rounded-lg hover:bg-[rgb(var(--card))] transition-all text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-5xl font-bold text-[rgb(var(--primary))] mb-2">
                500+
              </div>
              <div className="text-[rgb(var(--foreground-muted))] uppercase text-sm tracking-wider">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[rgb(var(--primary))] mb-2">
                3min
              </div>
              <div className="text-[rgb(var(--foreground-muted))] uppercase text-sm tracking-wider">
                Generation
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[rgb(var(--primary))] mb-2">
                100%
              </div>
              <div className="text-[rgb(var(--foreground-muted))] uppercase text-sm tracking-wider">
                Personalized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-[rgb(var(--background-secondary))]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to <span className="glow-text">Succeed</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-[rgb(var(--primary))]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Workout Tracking</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Log your exercises, sets, reps, and weight with our intuitive interface.
              </p>
            </div>

            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-[rgb(var(--primary))]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Visualize your gains with detailed charts and statistics.
              </p>
            </div>

            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-[rgb(var(--primary))]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🍎</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Nutrition Logging</h3>
              <p className="text-[rgb(var(--foreground-muted))]">
                Track your meals, calories, and macros to fuel your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Your Fitness, <span className="glow-text">Simplified</span>
          </h2>
          <p className="text-xl text-[rgb(var(--foreground-muted))] leading-relaxed">
            PowerTrack combines cutting-edge technology with intuitive design
            to help you achieve your fitness goals. Whether you're a beginner
            or a seasoned athlete, our platform adapts to your needs and grows
            with you.
          </p>
        </div>
      </section>
    </div>
  );
}

