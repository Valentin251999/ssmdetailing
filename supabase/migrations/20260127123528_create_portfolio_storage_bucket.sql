/*
  # Create Portfolio Storage Bucket

  1. Storage Setup
    - Create public bucket "portfolio" for storing portfolio images
    - Allow public read access to images
    - Allow authenticated users to upload images

  2. Security
    - Public can view all images
    - Only authenticated users can upload images
    - Authenticated users can delete their own uploads
*/

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read images
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');
