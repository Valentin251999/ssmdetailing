/*
  # Allow Anonymous Delete on Public Reviews

  1. Changes
    - Add DELETE policy for anonymous users on public_reviews table
    - Allows anyone to delete reviews (for admin management)
  
  2. Security
    - Anonymous users can DELETE reviews
    - This enables the admin panel to remove inappropriate reviews
*/

CREATE POLICY "Anyone can delete reviews"
  ON public_reviews
  FOR DELETE
  TO anon
  USING (true);