/*
  # Fix public_reviews INSERT policy

  ## Problem
  The existing INSERT policy only allows the `anon` role to submit reviews.
  This fails if the user has an active authenticated session (e.g., admin logged in).

  ## Changes
  - Drop the existing anon-only INSERT policy
  - Create a new INSERT policy that allows both `anon` AND `authenticated` roles to submit reviews
  - Keep the same validation checks (non-empty author_name, valid rating 1-5, non-empty message)
*/

DROP POLICY IF EXISTS "Anyone can submit reviews" ON public_reviews;

CREATE POLICY "Anyone can submit reviews"
  ON public_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    author_name IS NOT NULL AND
    TRIM(author_name) != '' AND
    rating >= 1 AND
    rating <= 5 AND
    message IS NOT NULL AND
    TRIM(message) != ''
  );
