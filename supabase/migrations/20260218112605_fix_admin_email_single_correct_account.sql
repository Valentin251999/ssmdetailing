/*
  # Fix admin email - use only the correct admin account

  Removes 'admin@ssm-detailing.ro' (does not exist) from all policies.
  Only 'chitudanutvalentin@gmail.com' is the real admin account.

  Tables updated: portfolio_items, faq_items, gallery_images, public_reviews,
  services, site_settings, testimonials, video_reel_comments, video_reel_likes, video_reels
*/

-- portfolio_items
DROP POLICY IF EXISTS "Admin can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can delete portfolio items" ON portfolio_items;

CREATE POLICY "Admin can insert portfolio items"
  ON portfolio_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update portfolio items"
  ON portfolio_items FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete portfolio items"
  ON portfolio_items FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- faq_items
DROP POLICY IF EXISTS "Admin can insert FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admin can update FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admin can delete FAQ items" ON faq_items;

CREATE POLICY "Admin can insert FAQ items"
  ON faq_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update FAQ items"
  ON faq_items FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete FAQ items"
  ON faq_items FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- gallery_images
DROP POLICY IF EXISTS "Admin can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admin can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admin can delete gallery images" ON gallery_images;

CREATE POLICY "Admin can insert gallery images"
  ON gallery_images FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update gallery images"
  ON gallery_images FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete gallery images"
  ON gallery_images FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- public_reviews
DROP POLICY IF EXISTS "Admin can delete reviews" ON public_reviews;

CREATE POLICY "Admin can delete reviews"
  ON public_reviews FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- services
DROP POLICY IF EXISTS "Admin can insert services" ON services;
DROP POLICY IF EXISTS "Admin can update services" ON services;
DROP POLICY IF EXISTS "Admin can delete services" ON services;

CREATE POLICY "Admin can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update services"
  ON services FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete services"
  ON services FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- site_settings
DROP POLICY IF EXISTS "Admin can update site settings" ON site_settings;

CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- testimonials
DROP POLICY IF EXISTS "Admin can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin can delete testimonials" ON testimonials;

CREATE POLICY "Admin can insert testimonials"
  ON testimonials FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update testimonials"
  ON testimonials FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete testimonials"
  ON testimonials FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- video_reel_comments
DROP POLICY IF EXISTS "Admin can delete comments" ON video_reel_comments;

CREATE POLICY "Admin can delete comments"
  ON video_reel_comments FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- video_reel_likes
DROP POLICY IF EXISTS "Admin can delete likes" ON video_reel_likes;

CREATE POLICY "Admin can delete likes"
  ON video_reel_likes FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

-- video_reels
DROP POLICY IF EXISTS "Admin can insert video reels" ON video_reels;
DROP POLICY IF EXISTS "Admin can update video reels" ON video_reels;
DROP POLICY IF EXISTS "Admin can delete video reels" ON video_reels;

CREATE POLICY "Admin can insert video reels"
  ON video_reels FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can update video reels"
  ON video_reels FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));

CREATE POLICY "Admin can delete video reels"
  ON video_reels FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'chitudanutvalentin@gmail.com'));
