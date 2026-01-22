-- =====================================================
-- Comprehensive Exercise Library
-- =====================================================
-- Populates exercise library with 35+ exercises covering all muscle groups
-- Using Unsplash URLs for exercise images

-- Clear existing sample data (optional - comment out if you want to keep existing)
-- DELETE FROM public.exercise_library;

-- =====================================================
-- CHEST EXERCISES
-- =====================================================

INSERT INTO public.exercise_library (name, description, primary_muscle, secondary_muscles, equipment, difficulty, media_url, instructions, tips) VALUES

('Barbell Bench Press', 'The king of chest exercises for building upper body strength and mass', 'Chest', ARRAY['Triceps', 'Shoulders'], 'Barbell', 'intermediate', 
 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
 E'1. Lie flat on bench with feet planted firmly\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to mid-chest with control\n4. Press up explosively to starting position\n5. Keep shoulder blades retracted throughout',
 'Keep feet flat on floor. Maintain slight arch in lower back. Control the descent. Touch chest lightly.'),

('Incline Dumbbell Press', 'Targets upper chest for complete pec development', 'Chest', ARRAY['Shoulders', 'Triceps'], 'Dumbbell', 'intermediate',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
 E'1. Set bench to 30-45 degree incline\n2. Start with dumbbells at shoulder height\n3. Press dumbbells up and slightly inward\n4. Lower with control to starting position',
 'Don\'t go too steep (max 45°). Keep core engaged. Avoid flaring elbows too wide.'),

('Dips', 'Bodyweight exercise for lower chest and triceps', 'Chest', ARRAY['Triceps', 'Shoulders'], 'Bodyweight', 'intermediate',
 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
 E'1. Start at top position with arms extended\n2. Lean forward slightly\n3. Lower body until shoulders are below elbows\n4. Push back up to starting position',
 'Lean forward for chest emphasis. Keep movement controlled. Add weight when ready.'),

('Cable Flyes', 'Isolation exercise for chest with constant tension', 'Chest', ARRAY['Shoulders'], 'Cable', 'beginner',
 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
 E'1. Set cables to chest height\n2. Step forward with slight lean\n3. Bring handles together in hugging motion\n4. Return to starting position with control',
 'Keep slight bend in elbows. Focus on chest contraction. Don\'t overstretch at the back.'),

('Push-ups', 'Classic bodyweight exercise for overall chest development', 'Chest', ARRAY['Triceps', 'Shoulders', 'Core'], 'Bodyweight', 'beginner',
 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
 E'1. Start in plank position, hands shoulder-width\n2. Lower chest to ground with elbows at 45°\n3. Push back up to starting position\n4. Keep body straight throughout movement',
 'Engage core. Keep elbows at 45 degrees. Full range of motion. Modify on knees if needed.'),

-- =====================================================
-- BACK EXERCISES
-- =====================================================

('Deadlift', 'The king of compound exercises, builds total body strength', 'Back', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Barbell', 'advanced',
 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800',
 E'1. Stand with feet hip-width, bar over mid-foot\n2. Bend at hips and knees, grip bar outside legs\n3. Keep back straight, chest up, shoulders back\n4. Drive through heels to stand up\n5. Lower bar with control',
 'Keep bar close to body. Engage core throughout. Avoid rounding back. Start light to master form.'),

('Pull-ups', 'Ultimate bodyweight back exercise for width', 'Back', ARRAY['Biceps', 'Forearms'], 'Pull-up Bar', 'intermediate',
 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
 E'1. Hang from bar with overhand grip, hands wider than shoulders\n2. Pull up until chin clears bar\n3. Lower with control to full extension\n4. Avoid swinging or kipping',
 'Engage lats. Squeeze shoulder blades. Use assistance band if needed. Keep core tight.'),

('Barbell Rows', 'Fundamental back thickness builder', 'Back', ARRAY['Biceps', 'Core'], 'Barbell', 'intermediate',
 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800',
 E'1. Bend at hips to about 45 degrees\n2. Grip bar slightly wider than shoulder width\n3. Pull bar to lower chest/upper abs\n4. Squeeze shoulder blades together\n5. Lower with control',
 'Keep back straight. Drive elbows back. Avoid using momentum. Keep core engaged.'),

('Lat Pulldowns', 'Great for building back width and strength', 'Back', ARRAY['Biceps', 'Shoulders'], 'Cable', 'beginner',
 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
 E'1. Sit with knees secured under pads\n2. Grip bar wider than shoulder width\n3. Pull bar down to upper chest\n4. Squeeze shoulder blades together\n5. Return to starting position with control',
 'Lead with elbows. Keep chest up. Avoid leaning back too much. Full stretch at top.'),

('Face Pulls', 'Essential for rear delts and upper back health', 'Back', ARRAY['Shoulders'], 'Cable', 'beginner',
 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
 E'1. Set cable to face height with rope attachment\n2. Pull rope towards face, splitting at the end\n3. Drive elbows high and back\n4. Focus on rear delt contraction',
 'High reps build shoulder health. Pull apart rope at face. Keep shoulders down.'),

-- =====================================================
-- SHOULDER EXERCISES
-- =====================================================

('Overhead Press', 'Premier shoulder-building compound movement', 'Shoulders', ARRAY['Triceps', 'Core'], 'Barbell', 'intermediate',
 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800',
 E'1. Start with bar at collarbone height\n2. Press bar overhead in straight line\n3. Lock out at top with bar over mid-foot\n4. Lower bar with control to starting position',
 'Keep core tight. Full lockout overhead. Bar path should be vertical. Avoid excessive back arch.'),

('Lateral Raises', 'Isolation for shoulder width and caps', 'Shoulders', NULL, 'Dumbbell', 'beginner',
 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
 E'1. Stand with dumbbells at sides\n2. Raise arms out to sides to shoulder height\n3. Lead with elbows, slight bend throughout\n4. Lower with control',
 'Don\'t go too heavy. Lead with elbows. Slight forward lean. Control the descent.'),

('Arnold Press', 'Complete shoulder development with rotation', 'Shoulders', ARRAY['Triceps'], 'Dumbbell', 'intermediate',
 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
 E'1. Start with dumbbells at shoulder height, palms facing you\n2. Press up while rotating palms outward\n3. Lock out with palms facing forward\n4. Reverse motion to return',
 'Control the rotation. Full range of motion. Keep core engaged. Avoid momentum.'),

-- =====================================================
-- ARM EXERCISES
-- =====================================================

('Barbell Curls', 'Classic bicep mass builder', 'Biceps', NULL, 'Barbell', 'beginner',
 'https://images.unsplash.com/photo-1532384555668-bc0be7f1570e?w=800',
 E'1. Stand with feet shoulder-width apart\n2. Grip bar with underhand grip\n3. Curl bar up to shoulders\n4. Squeeze biceps at top\n5. Lower with control',
 'Keep elbows stationary. Avoid swinging. Control the negative. Full range of motion.'),

('Hammer Curls', 'Builds biceps and forearms simultaneously', 'Biceps', ARRAY['Forearms'], 'Dumbbell', 'beginner',
 'https://images.unsplash.com/photo-1567598508481-65985588e295?w=800',
 E'1. Hold dumbbells with neutral grip (palms facing each other)\n2. Curl dumbbells up keeping thumbs on top\n3. Squeeze at the top\n4. Lower with control',
 'Neutral grip throughout. Keep elbows tucked. No swinging. Great for forearm development.'),

('Tricep Dips', 'Effective bodyweight tricep builder', 'Triceps', ARRAY['Chest'], 'Bodyweight', 'beginner',
 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
 E'1. Position hands on bench behind you\n2. Lower body by bending elbows to 90 degrees\n3. Keep body close to bench\n4. Push back up to starting position',
 'Stay upright for tricep focus. Keep elbows close. Add weight when ready.'),

('Cable Pushdowns', 'Isolation for tricep definition', 'Triceps', NULL, 'Cable', 'beginner',
 'https://images.unsplash.com/photo-1517964603305-11c0f6cd6f4a?w=800',
 E'1. Stand facing cable machine, bar at chest height\n2. Push bar down until arms fully extended\n3. Keep elbows pinned at sides\n4. Return to starting position with control',
 'Keep elbows stationary. Full lockout at bottom. Squeeze triceps. Control the weight.'),

-- =====================================================
-- LEG EXERCISES
-- =====================================================

('Barbell Squats', 'The king of leg exercises for overall development', 'Quadriceps', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Barbell', 'intermediate',
 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
 E'1. Bar on upper back, feet shoulder-width apart\n2. Squat down keeping chest up, knees aligned with toes\n3. Go to at least parallel depth\n4. Drive through heels to stand\n5. Keep core tight throughout',
 'Keep chest up. Knees track over toes. Go as deep as mobility allows. Breathe properly.'),

('Romanian Deadlift', 'Premier hamstring and glute builder', 'Hamstrings', ARRAY['Glutes', 'Back'], 'Barbell', 'intermediate',
 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800',
 E'1. Start standing with bar at thigh level\n2. Hinge at hips, push butt back\n3. Lower bar along legs keeping back straight\n4. Feel stretch in hamstrings\n5. Drive hips forward to return',
 'Keep bar close to legs. Soft knee bend. Feel the hamstring stretch. Don\'t round back.'),

('Lunges', 'Unilateral leg exercise for balance and strength', 'Quadriceps', ARRAY['Glutes'], 'Dumbbell', 'beginner',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
 E'1. Step forward into lunge position\n2. Lower back knee toward ground\n3. Keep front knee over ankle\n4. Push through front heel to return\n5. Alternate legs',
 'Keep torso upright. Front knee behind toes. Push through heel. Great for balance.'),

('Leg Press', 'Heavy quad builder with reduced spinal load', 'Quadriceps', ARRAY['Glutes'], 'Machine', 'beginner',
 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=800',
 E'1. Sit in machine with feet shoulder-width on platform\n2. Release safety and lower weight\n3. Lower until knees at 90 degrees\n4. Press through heels to extend',
 'Full range of motion. Don\'t lock out knees completely. Keep back flat on pad.'),

('Calf Raises', 'Isolates calves for lower leg development', 'Calves', NULL, 'Machine', 'beginner',
 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
 E'1. Position shoulders under pads, balls of feet on edge\n2. Lower heels as far as possible\n3. Push up onto toes as high as possible\n4. Squeeze calves at top',
 'Full range of motion. Pause at top and bottom. Can use any elevated surface.'),

-- =====================================================
-- CORE EXERCISES
-- =====================================================

('Plank', 'Fundamental core stability exercise', 'Core', NULL, 'Bodyweight', 'beginner',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
 E'1. Position forearms on ground, elbows under shoulders\n2. Extend legs back, toes on ground\n3. Keep body in straight line from head to heels\n4. Hold position, engage core and glutes',
 'Don\'t let hips sag. Breathe normally. Start with shorter holds. Build up time gradually.'),

('Russian Twists', 'Oblique exercise for rotational core strength', 'Core', NULL, 'Medicine Ball', 'beginner',
 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800',
 E'1. Sit with knees bent, feet off ground\n2. Hold weight at chest\n3. Rotate torso side to side\n4. Touch weight to ground on each side',
 'Keep chest up. Control the rotation. Can elevate feet for more challenge.'),

('Hanging Leg Raises', 'Advanced core exercise for lower abs', 'Core', NULL, 'Pull-up Bar', 'advanced',
 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
 E'1. Hang from pull-up bar\n2. Keep legs straight or bent\n3. Raise knees/legs to chest height\n4. Lower with control\n5. Avoid swinging',
 'Control the swing. Start with knee raises. Progress to straight legs. Engage core throughout.'),

('Ab Wheel Rollouts', 'Challenging full core exercise', 'Core', NULL, 'Other', 'advanced',
 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800',
 E'1. Start on knees with wheel in hands\n2. Roll forward extending body\n3. Keep core tight, don\'t let hips sag\n4. Pull back to starting position',
 'Start from knees. Progress slowly. Keep core braced. Don\'t hyperextend back.'),

-- =====================================================
-- FULL BODY / FUNCTIONAL
-- =====================================================

('Burpees', 'High-intensity full body cardio exercise', 'Core', ARRAY['Chest', 'Quadriceps'], 'Bodyweight', 'intermediate',
 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
 E'1. Start standing\n2. Drop to push-up position\n3. Perform push-up\n4. Jump feet to hands\n5. Explosive jump up\n6. Repeat',
 'Maintain good form even when tired. Modify as needed. Great for conditioning.'),

('Kettlebell Swings', 'Dynamic hip hinge movement for power', 'Glutes', ARRAY['Hamstrings', 'Core'], 'Kettlebell', 'intermediate',
 'https://images.unsplash.com/photo-1517963879433-cbb2baa2b727?w=800',
 E'1. Start with kettlebell on ground between feet\n2. Hinge at hips and grip kettlebell\n3. Swing kettlebell back between legs\n4. Explosively drive hips forward\n5. Swing to chest height',
 'Hip hinge movement, not squat. Explosive hip drive. Arms just guide weight. Keep back straight.'),

('Box Jumps', 'Plyometric exercise for explosive power', 'Quadriceps', ARRAY['Glutes', 'Calves'], 'Other', 'intermediate',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
 E'1. Stand facing box at appropriate height\n2. Swing arms back\n3. Jump explosively onto box\n4. Land softly with bent knees\n5. Step down carefully',
 'Start with lower box. Land softly. Full hip extension at top. Step down, don\'t jump down.')

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  primary_muscle = EXCLUDED.primary_muscle,
  secondary_muscles = EXCLUDED.secondary_muscles,
  equipment = EXCLUDED.equipment,
  difficulty = EXCLUDED.difficulty,
  media_url = EXCLUDED.media_url,
  instructions = EXCLUDED.instructions,
  tips = EXCLUDED.tips;

-- =====================================================
-- Verification
-- =====================================================

-- Count total exercises
SELECT COUNT(*) as total_exercises FROM public.exercise_library;

-- Count by muscle group
SELECT primary_muscle, COUNT(*) as exercise_count 
FROM public.exercise_library 
GROUP BY primary_muscle 
ORDER BY primary_muscle;

-- Count by difficulty
SELECT difficulty, COUNT(*) as exercise_count 
FROM public.exercise_library 
GROUP BY difficulty 
ORDER BY CASE difficulty 
  WHEN 'beginner' THEN 1
  WHEN 'intermediate' THEN 2
  WHEN 'advanced' THEN 3
END;

-- Count by equipment
SELECT equipment, COUNT(*) as exercise_count 
FROM public.exercise_library 
GROUP BY equipment 
ORDER BY exercise_count DESC;

-- Verify all have images
SELECT COUNT(*) as exercises_with_images 
FROM public.exercise_library 
WHERE media_url IS NOT NULL;
