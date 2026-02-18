/*
  # Fix SELECT policies for authenticated users (admin)

  ## Problem
  Currently SELECT policies only allow `anon` role to see active items.
  The admin (authenticated) cannot see ALL items including inactive ones.
  This causes admin panel to show incorrect/incomplete data.

  ## Changes
  - Add SELECT policy for `authenticated` on `services` - can see ALL items
  - Add SELECT policy for `authenticated` on `testimonials` - can see ALL items
  - Add SELECT policy for `authenticated` on `faq_items` - can see ALL items
  - Add SELECT policy for `authenticated` on `site_settings` - can read settings
  - Add SELECT policy for `authenticated` on `gallery_images` - can see ALL items
  - Add SELECT policy for `authenticated` on `portfolio_items` - can see ALL items
  - Add SELECT policy for `authenticated` on `public_reviews` - can see ALL reviews
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'services' AND policyname = 'Authenticated can view all services'
  ) THEN
    CREATE POLICY "Authenticated can view all services"
      ON services FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'testimonials' AND policyname = 'Authenticated can view all testimonials'
  ) THEN
    CREATE POLICY "Authenticated can view all testimonials"
      ON testimonials FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'faq_items' AND policyname = 'Authenticated can view all faq items'
  ) THEN
    CREATE POLICY "Authenticated can view all faq items"
      ON faq_items FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_settings' AND policyname = 'Authenticated can view site settings'
  ) THEN
    CREATE POLICY "Authenticated can view site settings"
      ON site_settings FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'gallery_images' AND policyname = 'Authenticated can view all gallery images'
  ) THEN
    CREATE POLICY "Authenticated can view all gallery images"
      ON gallery_images FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'portfolio_items' AND policyname = 'Authenticated can view all portfolio items'
  ) THEN
    CREATE POLICY "Authenticated can view all portfolio items"
      ON portfolio_items FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'public_reviews' AND policyname = 'Authenticated can view all public reviews'
  ) THEN
    CREATE POLICY "Authenticated can view all public reviews"
      ON public_reviews FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
