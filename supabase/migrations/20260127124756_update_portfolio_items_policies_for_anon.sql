/*
  # Update Portfolio Items Policies for Anonymous Users
  
  ## Overview
  Modifies RLS policies to allow anonymous users to manage portfolio items.
  This is temporary until authentication is implemented.
  
  ## Changes
    - Drop existing insert/update/delete policies
    - Create new policies that allow both anonymous and authenticated users
  
  ## Security Notes
    - This allows anyone to modify portfolio items
    - For production use, authentication should be implemented
    - Current setup is suitable for internal use with trusted access
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio items" ON portfolio_items;

-- Policy: Anyone can insert portfolio items
CREATE POLICY "Anyone can insert portfolio items"
  ON portfolio_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Anyone can update portfolio items
CREATE POLICY "Anyone can update portfolio items"
  ON portfolio_items
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Anyone can delete portfolio items
CREATE POLICY "Anyone can delete portfolio items"
  ON portfolio_items
  FOR DELETE
  TO anon, authenticated
  USING (true);