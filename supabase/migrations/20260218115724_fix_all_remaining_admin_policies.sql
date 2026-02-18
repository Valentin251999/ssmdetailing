/*
  # Fix all remaining admin write policies

  ## Problem
  gallery_images, portfolio_items, public_reviews, video_reels
  have UPDATE/DELETE policies that only allow chitudanutvalentin@gmail.com.
  The admin@ssm-detailing.ro account cannot modify these tables.

  ## Fix
  Use the is_admin() function (already created) for all write policies.
*/

DROP POLICY IF EXISTS "Admin can update gallery images" ON gallery_images;
CREATE POLICY "Admin can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert gallery images" ON gallery_images;
CREATE POLICY "Admin can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete gallery images" ON gallery_images;
CREATE POLICY "Admin can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update portfolio items" ON portfolio_items;
CREATE POLICY "Admin can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert portfolio items" ON portfolio_items;
CREATE POLICY "Admin can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete portfolio items" ON portfolio_items;
CREATE POLICY "Admin can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete reviews" ON public_reviews;
CREATE POLICY "Admin can delete reviews"
  ON public_reviews FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update reviews" ON public_reviews;
CREATE POLICY "Admin can update reviews"
  ON public_reviews FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update video reels" ON video_reels;
CREATE POLICY "Admin can update video reels"
  ON video_reels FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert video reels" ON video_reels;
CREATE POLICY "Admin can insert video reels"
  ON video_reels FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete video reels" ON video_reels;
CREATE POLICY "Admin can delete video reels"
  ON video_reels FOR DELETE
  TO authenticated
  USING (is_admin());
