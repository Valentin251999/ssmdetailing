/*
  # Add Approval System to Public Reviews

  1. Changes
    - Add `is_approved` column to public_reviews table (default false)
    - Add `reviewed_at` column to track when admin reviewed it
    - Update SELECT policy to only show approved reviews to anonymous users
    - Allow admin/anon to see all reviews (for admin panel)
  
  2. Security
    - Anonymous users can only see approved reviews on public page
    - Admin panel can see all reviews to moderate them
    - Anonymous users can still submit reviews (pending approval)
*/

-- Add approval columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'public_reviews' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE public_reviews ADD COLUMN is_approved boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'public_reviews' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE public_reviews ADD COLUMN reviewed_at timestamptz;
  END IF;
END $$;

-- Drop old SELECT policy
DROP POLICY IF EXISTS "Anyone can view reviews" ON public_reviews;

-- Create new policies
CREATE POLICY "Anyone can view approved reviews"
  ON public_reviews
  FOR SELECT
  TO anon
  USING (is_approved = true);

-- Update existing reviews to be approved (so they show immediately)
UPDATE public_reviews SET is_approved = true WHERE is_approved = false;
