/*
  # Enable Realtime for video_reel_likes and video_reel_comments

  Enables Supabase Realtime publication on the two tables used by the reels
  feature so that like and comment counts update live without page refresh.

  1. Changes
    - Add `video_reel_likes` to the supabase_realtime publication
    - Add `video_reel_comments` to the supabase_realtime publication
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'video_reel_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE video_reel_likes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'video_reel_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE video_reel_comments;
  END IF;
END $$;
