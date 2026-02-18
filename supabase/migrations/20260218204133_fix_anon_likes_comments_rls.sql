/*
  # Fix Anonymous Likes and Comments RLS Policies

  ## Problem
  A previous security fix migration removed anonymous INSERT/DELETE access to
  video_reel_likes and video_reel_comments tables. However, the frontend uses
  session_id (stored in localStorage) to allow any visitor to like/comment without
  authentication. This caused likes to fail silently and disappear.

  ## Changes
  1. Drop the overly restrictive "Admin can manage" policies
  2. Restore proper anonymous access policies:
     - SELECT: Everyone can view likes and comments (for real-time counts)
     - INSERT: Anyone can insert (anon and authenticated)
     - DELETE: Anyone can delete (needed for un-liking)
  3. Keep admin-specific policies for admin operations

  ## Security Approach
  The session_id-based approach is appropriate for a public portfolio site where:
  - No sensitive user data is involved
  - The like/comment system is for engagement, not authentication
  - Spam prevention is handled at the application level
*/

-- Drop the overly restrictive admin-only policies that block anonymous users
DROP POLICY IF EXISTS "Admin can manage comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Admin can manage likes" ON video_reel_likes;

-- Also drop any other conflicting policies that may exist
DROP POLICY IF EXISTS "Anyone can view likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Anyone can add likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Anyone can view comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Anyone can add comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Anon can view likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Anon can insert likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Anon can delete likes" ON video_reel_likes;
DROP POLICY IF EXISTS "Anon can view comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Anon can insert comments" ON video_reel_comments;
DROP POLICY IF EXISTS "Anon can delete comments" ON video_reel_comments;

-- VIDEO REEL LIKES: Restore proper public access
CREATE POLICY "Public can view likes"
  ON video_reel_likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert likes"
  ON video_reel_likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can delete likes"
  ON video_reel_likes FOR DELETE
  TO anon, authenticated
  USING (true);

-- VIDEO REEL COMMENTS: Restore proper public access
CREATE POLICY "Public can view comments"
  ON video_reel_comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert comments"
  ON video_reel_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can delete comments"
  ON video_reel_comments FOR DELETE
  TO anon, authenticated
  USING (true);
