/*
  # Create Portfolio Items Table

  ## Overview
  Creates a table to store portfolio items (before/after photos) for the detailing business.
  
  ## New Tables
    - `portfolio_items`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Name/description of the work (e.g., "BMW Seria 5 - Detailing Complet")
      - `category` (text) - Service category (e.g., "Detailing Exterior", "Detailing Interior", etc.)
      - `before_image_url` (text) - URL to the "before" image in Supabase Storage
      - `after_image_url` (text) - URL to the "after" image in Supabase Storage
      - `display_order` (integer) - Order in which items should be displayed (lower numbers first)
      - `is_featured` (boolean) - Whether to show on homepage gallery
      - `created_at` (timestamptz) - When the item was added
      - `updated_at` (timestamptz) - When the item was last updated
  
  ## Security
    - Enable RLS on `portfolio_items` table
    - Add policy for public read access (portfolio is public)
    - Add policy for authenticated admin users to insert/update/delete
  
  ## Notes
    - Images will be stored in Supabase Storage bucket 'portfolio'
    - Public read access allows visitors to see the portfolio
    - Only authenticated users (admins) can modify portfolio items
*/

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view portfolio items (public read)
CREATE POLICY "Portfolio items are publicly readable"
  ON portfolio_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert portfolio items
CREATE POLICY "Authenticated users can insert portfolio items"
  ON portfolio_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update portfolio items
CREATE POLICY "Authenticated users can update portfolio items"
  ON portfolio_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete portfolio items
CREATE POLICY "Authenticated users can delete portfolio items"
  ON portfolio_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_portfolio_display_order ON portfolio_items(display_order);

-- Create index on is_featured for homepage gallery
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(is_featured) WHERE is_featured = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_items_updated_at 
  BEFORE UPDATE ON portfolio_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
