# Exercise Management Guide

This guide explains how to add new exercises to the PowerTrack exercise library, including strategies for sourcing high-quality images.

## Table of Contents

1. [Adding Exercises](#adding-exercises)
2. [Image Sourcing](#image-sourcing)
3. [Database Schema Reference](#database-schema-reference)
4. [Best Practices](#best-practices)

---

## Adding Exercises

### Method 1: Via Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Navigate to your project at [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Go to **SQL Editor** in the left sidebar

2. **Use INSERT Statement**

```sql
INSERT INTO public.exercise_library (
    name,
    description,
    primary_muscle,
    secondary_muscles,
    equipment,
    difficulty,
    media_url,
    instructions,
    tips
) VALUES (
    'Exercise Name Here',
    'Brief description of the exercise and its benefits',
    'Primary Muscle Group',
    ARRAY['Secondary Muscle 1', 'Secondary Muscle 2'],  -- Can be NULL
    'Equipment Type',
    'beginner',  -- or 'intermediate' or 'advanced'
    'https://example.com/image.jpg',  -- Image URL
    E'1. Step one\n2. Step two\n3. Step three\n4. Step four',
    'Form tips, safety notes, and coaching cues'
);
```

3. **Example - Adding a Dumbbell Row**

```sql
INSERT INTO public.exercise_library (
    name,
    description,
    primary_muscle,
    secondary_muscles,
    equipment,
    difficulty,
    media_url,
    instructions,
    tips
) VALUES (
    'Single Arm Dumbbell Row',
    'Unilateral back exercise for building thickness and correcting imbalances',
    'Back',
    ARRAY['Biceps', 'Core'],
    'Dumbbell',
    'intermediate',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    E'1. Place one knee and hand on bench for support\n2. Let dumbbell hang with arm extended\n3. Pull dumbbell to hip, driving elbow back\n4. Squeeze shoulder blade at top\n5. Lower with control',
    'Don\\'t rotate torso. Keep back neutral. Lead with elbow. Focus on lat contraction.'
);
```

### Method 2: Bulk Import

For adding multiple exercises at once, create a SQL file with multiple INSERT statements:

```sql
INSERT INTO public.exercise_library (name, description, primary_muscle, secondary_muscles, equipment, difficulty, media_url, instructions, tips) VALUES
('Exercise 1', 'Description 1', 'Chest', ARRAY['Triceps'], 'Barbell', 'beginner', 'https://...', 'Instructions', 'Tips'),
('Exercise 2', 'Description 2', 'Back', ARRAY['Biceps'], 'Cable', 'intermediate', 'https://...', 'Instructions', 'Tips'),
('Exercise 3', 'Description 3', 'Legs', NULL, 'Bodyweight', 'advanced', 'https://...', 'Instructions', 'Tips');
```

Then run it in the SQL Editor.

---

## Image Sourcing

### Option 1: Unsplash (Recommended ⭐)

**Why Unsplash?**

- Free, high-quality images
- Optimized for web use
- Built-in image transformation (resize, format, crop)
- Royalty-free for commercial use

**How to Use:**

1. Visit [Unsplash.com](https://unsplash.com)
2. Search for relevant terms:
   - `"fitness exercise"`
   - `"gym workout"`
   - `"[muscle group] workout"` (e.g., "chest workout", "leg workout")
   - Specific exercises (e.g., "barbell bench press", "deadlift")

3. Copy the image URL and optimize it:

```
Original: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b
Optimized: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop
```

**URL Parameters:**

- `w=800` - Width of 800px (good for cards)
- `q=80` - Quality 80% (balances quality and file size)
- `auto=format` - Automatically serves WebP to supported browsers
- `fit=crop` - Crops to specified dimensions

### Option 2: Pexels

**Alternative free stock photo resource**

1. Visit [Pexels.com](https://pexels.com)
2. Search for fitness/exercise imagery
3. Download or use direct URLs

### Option 3: Custom Image Uploads via Supabase Storage

For proprietary exercise videos or custom images:

1. **Enable Supabase Storage**
   - Go to Storage in Supabase Dashboard
   - Create a bucket named `exercise-media`
   - Set to **Public** access

2. **Upload Images**

   ```sql
   -- After uploading to Supabase Storage, get the public URL
   -- Format: https://[project-ref].supabase.co/storage/v1/object/public/exercise-media/[filename]
   ```

3. **Use in Exercise**
   ```sql
   INSERT INTO exercise_library (name, ..., media_url) VALUES
   ('Exercise Name', ..., 'https://your-project.supabase.co/storage/v1/object/public/exercise-media/my-image.jpg');
   ```

### Image Guidelines

**Recommended Specifications:**

- **Resolution:** 800×600 or higher
- **Format:** JPG for photos, WebP for modern browsers, GIF for animations
- **Aspect Ratio:** 4:3 or 16:9 works best
- **File Size:** Under 200KB (use compression/optimization)

**Content Guidelines:**

- Clear demonstration of the exercise
- Good lighting
- Proper form visible
- No distracting backgrounds
- Diverse representation when possible

---

## Database Schema Reference

### Table: `exercise_library`

| Column              | Type      | Required | Description                                          |
| ------------------- | --------- | -------- | ---------------------------------------------------- |
| `id`                | UUID      | Auto     | Primary key (auto-generated)                         |
| `name`              | TEXT      | ✅ Yes   | Exercise name (must be unique)                       |
| `description`       | TEXT      | No       | Brief description of the exercise                    |
| `primary_muscle`    | TEXT      | ✅ Yes   | Main muscle group targeted                           |
| `secondary_muscles` | TEXT[]    | No       | Array of secondary muscles worked                    |
| `equipment`         | TEXT      | ✅ Yes   | Required equipment                                   |
| `difficulty`        | TEXT      | ✅ Yes   | Must be: `beginner`, `intermediate`, or `advanced`   |
| `media_url`         | TEXT      | No       | URL to image/GIF                                     |
| `instructions`      | TEXT      | No       | Step-by-step instructions (use `\n` for line breaks) |
| `tips`              | TEXT      | No       | Form tips and safety notes                           |
| `created_by`        | UUID      | No       | User ID of creator (for admin tracking)              |
| `created_at`        | TIMESTAMP | Auto     | Creation timestamp                                   |
| `updated_at`        | TIMESTAMP | Auto     | Last update timestamp                                |

### Valid Values

**Primary/Secondary Muscles:**

- Chest
- Back
- Shoulders
- Biceps
- Triceps
- Quadriceps
- Hamstrings
- Glutes
- Calves
- Core
- Forearms

**Equipment:**

- Barbell
- Dumbbell
- Cable
- Machine
- Bodyweight
- Kettlebell
- Resistance Band
- Medicine Ball
- Pull-up Bar
- Other

**Difficulty:**

- `beginner` - Simple movements, low injury risk
- `intermediate` - Requires some experience and technique
- `advanced` - Complex movements, requires mastery

---

## Best Practices

### 1. **Use Descriptive Names**

✅ Good: `"Barbell Bench Press"`, `"Romanian Deadlift"`
❌ Avoid: `"BP"`, `"RDL"`, `"Exercise 1"`

### 2. **Write Clear Instructions**

- Number each step
- Use action verbs
- Keep sentences concise
- Use `E'...'` for multi-line strings in SQL

```sql
E'1. Stand with feet hip-width apart\n2. Hinge at hips to grip bar\n3. Keep back straight\n4. Drive through heels'
```

### 3. **Include Safety Tips**

Focus on:

- Common form mistakes
- Injury prevention
- Breathing cues
- Equipment setup

### 4. **Muscle Group Consistency**

Use consistent naming:

- Use `"Chest"` not `"Pecs"` or `"Pectorals"`
- Use `"Quadriceps"` not `"Quads"`
- Match existing muscle groups in database

### 5. **Test Your Exercises**

After adding exercises:

1. Check they appear in the exercise library
2. Test search functionality
3. Verify filters work correctly
4. Ensure images load properly

### 6. **Update Existing Exercises**

```sql
UPDATE public.exercise_library
SET
    description = 'New description',
    media_url = 'https://new-image-url.com/image.jpg',
    updated_at = NOW()
WHERE name = 'Exercise Name';
```

---

## Quick Reference Commands

### View all exercises

```sql
SELECT name, primary_muscle, equipment, difficulty
FROM exercise_library
ORDER BY name;
```

### Count exercises by muscle group

```sql
SELECT primary_muscle, COUNT(*) as count
FROM exercise_library
GROUP BY primary_muscle
ORDER BY count DESC;
```

### Find exercises without images

```sql
SELECT name, primary_muscle
FROM exercise_library
WHERE media_url IS NULL;
```

### Delete an exercise

```sql
DELETE FROM exercise_library
WHERE name = 'Exercise Name';
```

---

## Support

If you encounter issues:

1. Check SQL syntax for typos
2. Verify difficulty value is exactly `beginner`, `intermediate`, or `advanced`
3. Ensure image URLs are publicly accessible
4. Check Supabase logs for error messages

For image sourcing questions:

- Unsplash: License allows commercial use without attribution
- Pexels: Similar free license
- Always verify licensing before using images

---

**Last Updated:** January 2026
