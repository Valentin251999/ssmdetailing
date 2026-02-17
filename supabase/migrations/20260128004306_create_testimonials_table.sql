/*
  # Create Testimonials Table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the person leaving testimonial
      - `email` (text, required) - Email for contact/verification
      - `rating` (integer, required) - Rating from 1 to 5 stars
      - `message` (text, required) - Testimonial message
      - `status` (text, default 'pending') - Status: 'pending', 'approved', 'rejected'
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `testimonials` table
    - Allow anonymous users to INSERT testimonials
    - Allow authenticated users to SELECT all testimonials (for admin panel)
    - Allow authenticated users to UPDATE testimonial status (for approval/rejection)
  
  3. Constraints
    - Rating must be between 1 and 5
    - Status must be one of: 'pending', 'approved', 'rejected'
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert testimonials
CREATE POLICY "Anonymous users can submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all testimonials
CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update testimonial status
CREATE POLICY "Authenticated users can update testimonial status"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);