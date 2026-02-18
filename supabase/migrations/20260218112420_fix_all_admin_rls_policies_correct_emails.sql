/*
  # Fix all admin RLS policies with correct admin emails

  All tables had 'admin@example.com' as placeholder which is wrong.
  This migration updates all admin policies to allow both:
  - admin@ssm-detailing.ro (primary admin)
  - chitudanutvalentin@gmail.com (owner account)

  Tables updated:
  - faq_items (insert, update, delete)
  - gallery_images (insert, update, delete)
  - public_reviews (delete)
  - services (insert, update, delete)
  - site_settings (update)
  - testimonials (all)
  - video_reel_comments (all)
  - video_reel_likes (all)
  - video_reels (insert, update, delete)
*/

-- Helper: define the admin check inline
-- faq_items
DROP POLICY IF EXISTS "Admin can insert FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admin can update FAQ items" ON faq_items;
DROP POLICY IF EXISTS "Admin can delete FAQ items" ON faq_items;

CREATE POLICY "Admin can insert FAQ items"
  ON faq_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can update FAQ items"
  ON faq_items FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can delete FAQ items"
  ON faq_items FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- gallery_images
DROP POLICY IF EXISTS "Admin can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admin can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admin can delete gallery images" ON gallery_images;

CREATE POLICY "Admin can insert gallery images"
  ON gallery_images FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can update gallery images"
  ON gallery_images FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can delete gallery images"
  ON gallery_images FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- public_reviews
DROP POLICY IF EXISTS "Admin can delete reviews" ON public_reviews;

CREATE POLICY "Admin can delete reviews"
  ON public_reviews FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- services
DROP POLICY IF EXISTS "Admin can insert services" ON services;
DROP POLICY IF EXISTS "Admin can update services" ON services;
DROP POLICY IF EXISTS "Admin can delete services" ON services;

CREATE POLICY "Admin can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can update services"
  ON services FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can delete services"
  ON services FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- site_settings
DROP POLICY IF EXISTS "Admin can update site settings" ON site_settings;

CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- testimonials
DROP POLICY IF EXISTS "Admin can manage testimonials" ON testimonials;

CREATE POLICY "Admin can insert testimonials"
  ON testimonials FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can update testimonials"
  ON testimonials FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can delete testimonials"
  ON testimonials FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- video_reel_comments
DROP POLICY IF EXISTS "Admin can manage comments" ON video_reel_comments;

CREATE POLICY "Admin can delete comments"
  ON video_reel_comments FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- video_reel_likes
DROP POLICY IF EXISTS "Admin can manage likes" ON video_reel_likes;

CREATE POLICY "Admin can delete likes"
  ON video_reel_likes FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

-- video_reels
DROP POLICY IF EXISTS "Admin can insert video reels" ON video_reels;
DROP POLICY IF EXISTS "Admin can update video reels" ON video_reels;
DROP POLICY IF EXISTS "Admin can delete video reels" ON video_reels;

CREATE POLICY "Admin can insert video reels"
  ON video_reels FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can update video reels"
  ON video_reels FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));

CREATE POLICY "Admin can delete video reels"
  ON video_reels FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email IN ('admin@ssm-detailing.ro','chitudanutvalentin@gmail.com')));
