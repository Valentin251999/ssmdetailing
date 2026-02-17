/*
  # Update Video Reels RLS Policies for Anonymous Access
  
  1. Changes
    - Drop existing authenticated-only policies for INSERT, UPDATE, DELETE
    - Create new policies that allow anonymous users to perform CRUD operations
    - Keep SELECT policies as they are (anon can view active, all for authenticated)
  
  2. Security Note
    - This allows anonymous users to modify video reels
    - In production, this should be protected with proper authentication
    - Consider adding password protection or proper auth system
*/

-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Authenticated users can insert video reels" ON video_reels;
DROP POLICY IF EXISTS "Authenticated users can update video reels" ON video_reels;
DROP POLICY IF EXISTS "Authenticated users can delete video reels" ON video_reels;

-- Create new policies that allow anonymous users
CREATE POLICY "Anyone can insert video reels"
  ON video_reels
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update video reels"
  ON video_reels
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete video reels"
  ON video_reels
  FOR DELETE
  TO anon, authenticated
  USING (true);
