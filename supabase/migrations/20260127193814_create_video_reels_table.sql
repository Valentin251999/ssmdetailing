/*
  # Create Video Reels Table

  1. New Tables
    - `video_reels`
      - `id` (uuid, primary key)
      - `title` (text) - Titlul videoclipului
      - `description` (text) - Descrierea videoclipului
      - `video_url` (text) - URL pentru YouTube, Instagram, TikTok sau video direct
      - `thumbnail_url` (text) - URL pentru thumbnail/preview image
      - `duration` (integer) - Durata în secunde (optional)
      - `order_index` (integer) - Ordinea de afișare
      - `is_active` (boolean) - Dacă videoclipul este activ/vizibil
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `video_reels` table
    - Add policy for anonymous users to view active reels
    - Add policies for authenticated users to manage reels (pentru admin)
*/

CREATE TABLE IF NOT EXISTS video_reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_reels ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to view active reels
CREATE POLICY "Anyone can view active video reels"
  ON video_reels
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Policy for authenticated users to view all reels
CREATE POLICY "Authenticated users can view all video reels"
  ON video_reels
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to insert reels
CREATE POLICY "Authenticated users can insert video reels"
  ON video_reels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update reels
CREATE POLICY "Authenticated users can update video reels"
  ON video_reels
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete reels
CREATE POLICY "Authenticated users can delete video reels"
  ON video_reels
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS video_reels_order_index_idx ON video_reels(order_index);
CREATE INDEX IF NOT EXISTS video_reels_is_active_idx ON video_reels(is_active);