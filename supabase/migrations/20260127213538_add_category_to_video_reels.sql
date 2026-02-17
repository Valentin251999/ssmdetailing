/*
  # Add Category Field to Video Reels
  
  1. Changes
    - Add `category` field to `video_reels` table
    - Category options: 'interior', 'exterior', 'starlight'
    - Add `tiktok_url` field for direct TikTok links
    - Add `likes_count` and `comments_count` for display
  
  2. Notes
    - Default category is 'interior'
    - Fields are designed for TikTok/Reels style display
*/

-- Add category and TikTok-specific fields
DO $$
BEGIN
  -- Add category field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_reels' AND column_name = 'category'
  ) THEN
    ALTER TABLE video_reels 
    ADD COLUMN category text DEFAULT 'interior' CHECK (category IN ('interior', 'exterior', 'starlight'));
  END IF;

  -- Add tiktok_url field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_reels' AND column_name = 'tiktok_url'
  ) THEN
    ALTER TABLE video_reels 
    ADD COLUMN tiktok_url text;
  END IF;

  -- Add likes_count field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_reels' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE video_reels 
    ADD COLUMN likes_count integer DEFAULT 0;
  END IF;

  -- Add comments_count field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_reels' AND column_name = 'comments_count'
  ) THEN
    ALTER TABLE video_reels 
    ADD COLUMN comments_count integer DEFAULT 0;
  END IF;
END $$;