/*
  # Create Public Reviews Table

  1. New Tables
    - `public_reviews`
      - `id` (uuid, primary key)
      - `author_name` (text, nullable, default 'Anonim') - Optional name
      - `message` (text, required) - Review message
      - `rating` (integer, required) - Rating from 1 to 5 stars
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `public_reviews` table
    - Allow anonymous users to INSERT reviews
    - Allow anonymous users to SELECT reviews
  
  3. Constraints
    - Rating must be between 1 and 5
*/

CREATE TABLE IF NOT EXISTS public_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text DEFAULT 'Anonim',
  message text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit reviews"
  ON public_reviews
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view reviews"
  ON public_reviews
  FOR SELECT
  TO anon
  USING (true);