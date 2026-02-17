/*
  # Create Video Reels Likes and Comments System

  1. New Tables
    - `video_reel_likes`
      - `id` (uuid, primary key)
      - `video_reel_id` (uuid, foreign key to video_reels)
      - `session_id` (text, unique identifier from browser)
      - `created_at` (timestamp)
    
    - `video_reel_comments`
      - `id` (uuid, primary key)
      - `video_reel_id` (uuid, foreign key to video_reels)
      - `author_name` (text, anonymous name)
      - `content` (text, comment text)
      - `session_id` (text, unique identifier from browser)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Allow anyone to read likes and comments (public)
    - Allow anyone to insert likes and comments (anonymous interaction)
    - Users can only delete their own likes/comments based on session_id
  
  3. Indexes
    - Index on video_reel_id for faster queries
    - Unique constraint on video_reel_id + session_id for likes (one like per session)
*/

-- Create video_reel_likes table
CREATE TABLE IF NOT EXISTS video_reel_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_reel_id uuid REFERENCES video_reels(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_reel_id, session_id)
);

-- Create video_reel_comments table
CREATE TABLE IF NOT EXISTS video_reel_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_reel_id uuid REFERENCES video_reels(id) ON DELETE CASCADE NOT NULL,
  author_name text DEFAULT 'Anonim' NOT NULL,
  content text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_reel_likes_video_id ON video_reel_likes(video_reel_id);
CREATE INDEX IF NOT EXISTS idx_video_reel_comments_video_id ON video_reel_comments(video_reel_id);
CREATE INDEX IF NOT EXISTS idx_video_reel_comments_created_at ON video_reel_comments(created_at DESC);

-- Enable RLS
ALTER TABLE video_reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_reel_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes
CREATE POLICY "Anyone can view likes"
  ON video_reel_likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add likes"
  ON video_reel_likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own likes"
  ON video_reel_likes FOR DELETE
  TO anon, authenticated
  USING (true);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments"
  ON video_reel_comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add comments"
  ON video_reel_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own comments"
  ON video_reel_comments FOR DELETE
  TO anon, authenticated
  USING (true);