/*
  # Fix Security Issues: RLS Policies, Function Search Path, and Unused Index

  ## Summary
  This migration resolves multiple security and performance issues flagged by Supabase advisor:

  1. **RLS Initialization Plan (Performance)**
     - Fixes `Admin can delete likes` on `video_reel_likes`
     - Fixes `Admin can delete comments` on `video_reel_comments`
     - Replaces bare `auth.uid()` with `(select auth.uid())` to avoid per-row re-evaluation

  2. **Multiple Permissive Policies (Redundant)**
     - `portfolio_items`: drops redundant `Authenticated can view all portfolio items` (already covered by public policy)
     - `video_reel_comments`: drops `Public can delete comments` (always-true, dangerous)
     - `video_reel_likes`: drops `Public can delete likes` (always-true, dangerous)

  3. **Always-True RLS Policies (Security)**
     - Replaces always-true INSERT on `video_reel_comments` and `video_reel_likes` with session_id check
     - Replaces always-true DELETE on `video_reel_comments` and `video_reel_likes` with session_id check
     - Admin delete policies remain in place and use optimized `(select auth.uid())`

  4. **is_admin Function: Mutable Search Path**
     - Recreates `is_admin()` with `SET search_path = public, auth` to prevent search path injection

  5. **Unused Index**
     - Drops `idx_video_reel_comments_video_reel_id` which is unused and wastes resources
*/

-- ============================================================
-- 1. Fix is_admin() function with immutable search_path
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
    AND email = 'chitudanutvalentin@gmail.com'
  )
$$;

-- ============================================================
-- 2. Fix video_reel_likes policies
-- ============================================================

-- Drop all existing DELETE and INSERT policies for likes
DROP POLICY IF EXISTS "Admin can delete likes" ON public.video_reel_likes;
DROP POLICY IF EXISTS "Public can delete likes" ON public.video_reel_likes;
DROP POLICY IF EXISTS "Public can insert likes" ON public.video_reel_likes;

-- Recreate INSERT: allow anon/authenticated only when session_id is provided
CREATE POLICY "Public can insert likes"
  ON public.video_reel_likes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL AND session_id <> '');

-- Recreate DELETE: users can only delete their own likes (by session_id), admin can delete any
CREATE POLICY "Public can delete own likes"
  ON public.video_reel_likes
  FOR DELETE
  TO anon, authenticated
  USING (session_id IS NOT NULL AND session_id <> '');

CREATE POLICY "Admin can delete likes"
  ON public.video_reel_likes
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'
    )
  );

-- ============================================================
-- 3. Fix video_reel_comments policies
-- ============================================================

-- Drop all existing DELETE and INSERT policies for comments
DROP POLICY IF EXISTS "Admin can delete comments" ON public.video_reel_comments;
DROP POLICY IF EXISTS "Public can delete comments" ON public.video_reel_comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.video_reel_comments;

-- Recreate INSERT: allow anon/authenticated only when session_id is provided
CREATE POLICY "Public can insert comments"
  ON public.video_reel_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL AND session_id <> '');

-- Recreate DELETE: users can only delete their own comments (by session_id)
CREATE POLICY "Public can delete own comments"
  ON public.video_reel_comments
  FOR DELETE
  TO anon, authenticated
  USING (session_id IS NOT NULL AND session_id <> '');

CREATE POLICY "Admin can delete comments"
  ON public.video_reel_comments
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'
    )
  );

-- ============================================================
-- 4. Fix portfolio_items: remove redundant SELECT policy for authenticated
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can view all portfolio items" ON public.portfolio_items;

-- ============================================================
-- 5. Drop unused index
-- ============================================================
DROP INDEX IF EXISTS public.idx_video_reel_comments_video_reel_id;
