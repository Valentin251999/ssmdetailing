/*
  # Add featured flag to video reels

  1. Changes
    - Add `is_featured` boolean column to `video_reels` table
    - Default value is `false`
    - This allows selecting which videos appear on the main page (max 4)
    
  2. Notes
    - Existing videos will be set to `is_featured = false` by default
    - Admin panel will allow toggling this flag
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_reels' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE video_reels ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;
