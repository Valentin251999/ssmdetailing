/*
  # Add TikTok URL to Site Settings

  1. Changes
    - Add `tiktok_url` column to `site_settings` table
    - Default value is empty string
  
  2. Security
    - No RLS changes needed (existing policies apply)
*/

-- Add TikTok URL column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'tiktok_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN tiktok_url text DEFAULT '';
  END IF;
END $$;