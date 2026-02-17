/*
  # Fix RLS Performance and Security Issues

  ## Performance Optimizations
  
  1. **RLS Policy Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale
  
  2. **Remove Unused Indexes**
     - Drop `idx_portfolio_display_order` from portfolio_items
     - Drop `video_reels_order_index_idx` from video_reels
     - Drop `video_reels_is_active_idx` from video_reels
     - Drop `idx_video_reel_likes_video_id` from video_reel_likes
     - Drop `idx_video_reel_comments_video_id` from video_reel_comments
  
  3. **Consolidate Multiple Permissive Policies**
     - Merge duplicate SELECT policies for testimonials
     - Merge duplicate SELECT policies for video_reel_comments
     - Merge duplicate SELECT policies for video_reel_likes
  
  4. **Security Improvements**
     - Add proper validation to public_reviews INSERT policy
     - Prevent unrestricted access while maintaining functionality

  ## Changes Applied
  
  All admin policies now use `(select auth.uid())` for optimal performance.
  Unused indexes removed to reduce maintenance overhead.
  Duplicate policies consolidated to simplify security model.
*/

-- =====================================================
-- PART 1: Drop and recreate RLS policies with optimized auth checks
-- =====================================================

-- Portfolio Items Policies
DROP POLICY IF EXISTS "Admin can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin can update portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin can delete portfolio items" ON public.portfolio_items;

CREATE POLICY "Admin can insert portfolio items"
  ON public.portfolio_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can update portfolio items"
  ON public.portfolio_items
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can delete portfolio items"
  ON public.portfolio_items
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Gallery Images Policies
DROP POLICY IF EXISTS "Admin can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admin can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admin can delete gallery images" ON public.gallery_images;

CREATE POLICY "Admin can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Services Policies
DROP POLICY IF EXISTS "Admin can insert services" ON public.services;
DROP POLICY IF EXISTS "Admin can update services" ON public.services;
DROP POLICY IF EXISTS "Admin can delete services" ON public.services;

CREATE POLICY "Admin can insert services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can update services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can delete services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Site Settings Policies
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

CREATE POLICY "Admin can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- FAQ Items Policies
DROP POLICY IF EXISTS "Admin can insert FAQ items" ON public.faq_items;
DROP POLICY IF EXISTS "Admin can update FAQ items" ON public.faq_items;
DROP POLICY IF EXISTS "Admin can delete FAQ items" ON public.faq_items;

CREATE POLICY "Admin can insert FAQ items"
  ON public.faq_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can update FAQ items"
  ON public.faq_items
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can delete FAQ items"
  ON public.faq_items
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Video Reels Policies
DROP POLICY IF EXISTS "Admin can insert video reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admin can update video reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admin can delete video reels" ON public.video_reels;

CREATE POLICY "Admin can insert video reels"
  ON public.video_reels
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can update video reels"
  ON public.video_reels
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

CREATE POLICY "Admin can delete video reels"
  ON public.video_reels
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Testimonials Policies - Consolidate multiple permissive policies
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can view all testimonials" ON public.testimonials;

CREATE POLICY "Users can view testimonials"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Public Reviews Policies
DROP POLICY IF EXISTS "Admin can delete reviews" ON public.public_reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.public_reviews;

CREATE POLICY "Admin can delete reviews"
  ON public.public_reviews
  FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Fix the always-true policy with proper validation
CREATE POLICY "Anyone can submit reviews"
  ON public.public_reviews
  FOR INSERT
  TO anon
  WITH CHECK (
    author_name IS NOT NULL 
    AND trim(author_name) != '' 
    AND rating >= 1 
    AND rating <= 5
    AND message IS NOT NULL 
    AND trim(message) != ''
  );

-- Video Reel Comments Policies - Consolidate multiple permissive policies
DROP POLICY IF EXISTS "Admin can manage comments" ON public.video_reel_comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.video_reel_comments;

CREATE POLICY "Users can view comments"
  ON public.video_reel_comments
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admin can manage comments"
  ON public.video_reel_comments
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Video Reel Likes Policies - Consolidate multiple permissive policies
DROP POLICY IF EXISTS "Admin can manage likes" ON public.video_reel_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.video_reel_likes;

CREATE POLICY "Users can view likes"
  ON public.video_reel_likes
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admin can manage likes"
  ON public.video_reel_likes
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- =====================================================
-- PART 2: Remove unused indexes
-- =====================================================

DROP INDEX IF EXISTS public.idx_portfolio_display_order;
DROP INDEX IF EXISTS public.video_reels_order_index_idx;
DROP INDEX IF EXISTS public.video_reels_is_active_idx;
DROP INDEX IF EXISTS public.idx_video_reel_likes_video_id;
DROP INDEX IF EXISTS public.idx_video_reel_comments_video_id;