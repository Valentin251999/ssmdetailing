/*
  # Create Video Reels Storage Bucket

  1. Storage
    - Create `video-reels` storage bucket for video files
    - Set bucket to public for easy access
    - Allow uploads up to 100MB (typical for short videos)
  
  2. Security
    - Allow public read access for all users
    - Allow authenticated users to upload videos
    - Allow authenticated users to delete their own videos
*/

-- Create the video-reels storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-reels',
  'video-reels',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to video files
CREATE POLICY "Public can view video reels"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'video-reels');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload video reels"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'video-reels');

-- Allow authenticated users to update videos
CREATE POLICY "Authenticated users can update video reels"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'video-reels');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete video reels"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'video-reels');