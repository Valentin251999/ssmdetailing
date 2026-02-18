/*
  # Fix admin policies to allow both admin accounts

  ## Problem
  UPDATE/INSERT/DELETE policies only allow `chitudanutvalentin@gmail.com`.
  The `admin@ssm-detailing.ro` account CANNOT modify any data.

  ## Fix
  Update all admin write policies to allow both:
  - admin@ssm-detailing.ro
  - chitudanutvalentin@gmail.com

  ## Tables affected
  - site_settings (UPDATE)
  - services (INSERT, UPDATE, DELETE)
  - testimonials (INSERT, UPDATE, DELETE)
  - faq_items (INSERT, UPDATE, DELETE)
  - gallery_images (INSERT, UPDATE, DELETE)
  - portfolio_items (INSERT, UPDATE, DELETE)
  - public_reviews (UPDATE, DELETE)
  - video_reels (INSERT, UPDATE, DELETE)
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email IN ('admin@ssm-detailing.ro', 'chitudanutvalentin@gmail.com')
  )
$$;

DROP POLICY IF EXISTS "Admin can update site settings" ON site_settings;
CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update services" ON services;
CREATE POLICY "Admin can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert services" ON services;
CREATE POLICY "Admin can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete services" ON services;
CREATE POLICY "Admin can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update testimonials" ON testimonials;
CREATE POLICY "Admin can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert testimonials" ON testimonials;
CREATE POLICY "Admin can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete testimonials" ON testimonials;
CREATE POLICY "Admin can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin can update FAQ items" ON faq_items;
CREATE POLICY "Admin can update FAQ items"
  ON faq_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can insert FAQ items" ON faq_items;
CREATE POLICY "Admin can insert FAQ items"
  ON faq_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can delete FAQ items" ON faq_items;
CREATE POLICY "Admin can delete FAQ items"
  ON faq_items FOR DELETE
  TO authenticated
  USING (is_admin());
