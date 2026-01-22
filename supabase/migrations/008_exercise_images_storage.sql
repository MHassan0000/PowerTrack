-- =====================================================
-- Exercise Images Storage Setup
-- =====================================================
-- Creates storage bucket for exercise images with public access

-- Create storage bucket for exercise images
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-images', 'exercise-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Storage Policies
-- =====================================================

-- Policy: Anyone can view exercise images (public read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'exercise-images');

-- Policy: Authenticated users can upload exercise images
CREATE POLICY "Authenticated users can upload exercise images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exercise-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Admins can update exercise images
CREATE POLICY "Admins can update exercise images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'exercise-images'
  AND auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Admins can delete exercise images
CREATE POLICY "Admins can delete exercise images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exercise-images'
  AND auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- =====================================================
-- Verification
-- =====================================================

SELECT * FROM storage.buckets WHERE id = 'exercise-images';
