/*
  # Allow Anonymous Upload to Video Reels Storage

  1. Changes
    - Update storage policies to allow anonymous (anon) users to upload videos
    - Update storage policies to allow anonymous users to delete videos
    - This enables the admin panel to function without authentication

  2. Security Note
    - This allows anyone to upload videos to the storage bucket
    - Consider adding authentication to the admin panel in production
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload video reels" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update video reels" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete video reels" ON storage.objects;

-- Allow anon users to upload videos
CREATE POLICY "Anyone can upload video reels"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'video-reels');

-- Allow anon users to update videos
CREATE POLICY "Anyone can update video reels"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'video-reels');

-- Allow anon users to delete videos
CREATE POLICY "Anyone can delete video reels"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'video-reels');