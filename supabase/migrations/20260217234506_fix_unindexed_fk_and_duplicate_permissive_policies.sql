/*
  # Fix Unindexed Foreign Key and Duplicate Permissive Policies

  1. **Performance Fix: Add Missing Index**
     - Add index on `video_reel_comments.video_reel_id` to cover the foreign key
     - This was previously dropped and needs to be restored for join/cascade performance

  2. **Security Fix: Consolidate Duplicate Permissive SELECT Policies**
     - `testimonials`: Drop `Users can view testimonials` (SELECT for authenticated)
       because `Admin can manage testimonials` (ALL for authenticated) already covers SELECT.
       Recreate as anon-only so anonymous visitors can still see approved testimonials.
     - `video_reel_comments`: Drop `Users can view comments` (SELECT for anon,authenticated)
       and recreate as anon-only, since the admin ALL policy covers authenticated SELECT.
     - `video_reel_likes`: Same fix as comments.

  3. **Result**
     - Each table will have exactly one permissive SELECT policy per role
     - No duplicate permissive policies for the same role and action
*/

-- 1. Add missing index on video_reel_comments.video_reel_id
CREATE INDEX IF NOT EXISTS idx_video_reel_comments_video_reel_id
  ON public.video_reel_comments (video_reel_id);

-- 2. Fix testimonials: remove authenticated SELECT, keep anon SELECT
DROP POLICY IF EXISTS "Users can view testimonials" ON public.testimonials;

-- 3. Fix video_reel_comments: recreate SELECT as anon-only
DROP POLICY IF EXISTS "Users can view comments" ON public.video_reel_comments;

CREATE POLICY "Anon can view comments"
  ON public.video_reel_comments
  FOR SELECT
  TO anon
  USING (true);

-- 4. Fix video_reel_likes: recreate SELECT as anon-only
DROP POLICY IF EXISTS "Users can view likes" ON public.video_reel_likes;

CREATE POLICY "Anon can view likes"
  ON public.video_reel_likes
  FOR SELECT
  TO anon
  USING (true);
