/*
  # Add Funny Category to Video Reels
  
  1. Changes
    - Update category constraint to include 'funny' option
    - Existing categories: 'interior', 'exterior', 'starlight'
    - New category: 'funny' (pentru videoclipuri amuzante)
  
  2. Notes
    - Keeps all existing data intact
    - Expands category options for TikTok-style content variety
*/

-- Drop existing constraint and add new one with 'funny' category
DO $$
BEGIN
  -- Drop the old constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'video_reels' AND constraint_name LIKE '%category%check%'
  ) THEN
    ALTER TABLE video_reels DROP CONSTRAINT IF EXISTS video_reels_category_check;
  END IF;

  -- Add new constraint with funny category
  ALTER TABLE video_reels 
  ADD CONSTRAINT video_reels_category_check 
  CHECK (category IN ('interior', 'exterior', 'starlight', 'funny'));
END $$;