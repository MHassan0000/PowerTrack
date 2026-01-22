# PowerTrack - Fitness Tracking Platform

A modern fitness tracking application built with Next.js, Supabase, and TypeScript. Track workouts, monitor progress, and achieve your fitness goals.

## Features

- 🏋️ **Workout Management** - Create custom workouts and templates
- 💪 **Exercise Library** - 35+ exercises with detailed instructions and images
- 📊 **Progress Tracking** - Monitor your fitness journey with charts and stats
- 🎯 **Goal Setting** - Set and track fitness goals
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - Powered by Supabase Auth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account ([Sign up here](https://supabase.com))
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd power-track
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials from [Supabase Dashboard](https://app.supabase.com/project/_/settings/api):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**

   Run the migrations in your Supabase SQL Editor in this order:

   ```bash
   # 1. Initial schema (users, base tables)
   supabase/migrations/001_initial_schema.sql

   # 2. Profile fields
   supabase/migrations/002_profile_fields.sql

   # 3. Exercise library
   supabase/migrations/003_exercise_library.sql

   # 4. Workout management
   supabase/migrations/004_workout_management.sql

   # 5. Workout logging
   supabase/migrations/005_workout_logging.sql

   # 6. Progress tracking
   supabase/migrations/006_progress_tracking.sql

   # 7. Goals
   supabase/migrations/007_goals.sql

   # 8. Exercise images storage (NEW)
   supabase/migrations/008_exercise_images_storage.sql

   # 9. Comprehensive exercises (NEW)
   supabase/migrations/009_comprehensive_exercises.sql
   ```

   **Important**: Run migrations 008 and 009 to populate the exercise library with 35+ exercises!

5. **Storage Setup** (For exercise images)

   In your Supabase Dashboard:
   - Go to Storage → Create a new bucket called `exercise-images`
   - Make it public
   - Or just run migration `008_exercise_images_storage.sql` which creates it automatically

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **users** - User profiles and settings
- **exercise_library** - 35+ pre-loaded exercises
- **workouts** - Workout templates and plans
- **workout_exercises** - Exercise → Workout relationships
- **workout_sessions** - Logged workout sessions
- **set_logs** - Individual set tracking
- **body_stats** - Body measurements over time
- **fitness_goals** - User fitness goals

## Exercise Library

The app comes pre-loaded with 35+ exercises covering:

- **Chest**: Bench Press, Incline Press, Dips, Cable Flyes, Push-ups
- **Back**: Deadlift, Pull-ups, Rows, Lat Pulldowns, Face Pulls
- **Shoulders**: Overhead Press, Lateral Raises, Arnold Press
- **Arms**: Barbell Curls, Hammer Curls, Tricep Dips, Cable Pushdowns
- **Legs**: Squats, Romanian Deadlifts, Lunges, Leg Press, Calf Raises
- **Core**: Planks, Russian Twists, Leg Raises, Ab Wheel
- **Full Body**: Burpees, Kettlebell Swings, Box Jumps

All exercises include detailed instructions, form tips, and images.

## Build & Deployment

### Production Build

```bash
# Standard build
npm run build

# Build ignoring lint errors (if needed)
npm run build -- --no-lint
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production domain)
4. Deploy!

## Project Structure

```
power-track/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (root)/            # Public pages (homepage)
├── components/             # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── shared/            # Reusable components
│   ├── progress/          # Progress tracking components
│   └── workout/           # Workout-related components
├── lib/                   # Utilities and actions
│   ├── actions/           # Server actions
│   ├── constants/         # App constants
│   └── supabase/          # Supabase client config
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Key Features Explained

### Workout Management

- Create custom workout templates
- Add exercises with sets, reps, and weights
- Reorder exercises within workouts
- Duplicate workouts
- Schedule workouts

### Progress Tracking

- Log completed workouts
- Track body measurements
- View progress charts
- Monitor volume and frequency

### Exercise Library

- Browse 35+ exercises
- Filter by muscle group, equipment, difficulty
- Search functionality
- Detailed instructions and form tips

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase
