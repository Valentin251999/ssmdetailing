/*
  # Create Complete CMS Tables for Website Management

  ## Overview
  This migration creates a comprehensive content management system allowing admin users
  to modify all aspects of the website including hero section, services, testimonials,
  gallery, FAQ, and contact information.

  ## New Tables

  ### 1. `site_settings`
  Global website settings
    - `id` (uuid, primary key)
    - `hero_title` (text) - Main hero title
    - `hero_subtitle` (text) - Hero subtitle
    - `hero_image_url` (text) - Hero background image
    - `contact_phone` (text) - Contact phone number
    - `contact_email` (text) - Contact email
    - `contact_address` (text) - Physical address
    - `whatsapp_number` (text) - WhatsApp contact number
    - `facebook_url` (text) - Facebook page URL
    - `instagram_url` (text) - Instagram profile URL
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `services`
  Service offerings
    - `id` (uuid, primary key)
    - `title` (text) - Service title
    - `description` (text) - Service description
    - `icon_name` (text) - Lucide icon name
    - `display_order` (integer) - Order in which services appear
    - `is_active` (boolean) - Whether service is displayed
    - `created_at` (timestamptz)

  ### 3. `testimonials`
  Customer testimonials
    - `id` (uuid, primary key)
    - `customer_name` (text) - Customer name
    - `customer_role` (text) - Customer role/title
    - `content` (text) - Testimonial content
    - `rating` (integer) - Rating out of 5
    - `display_order` (integer) - Display order
    - `is_active` (boolean) - Whether testimonial is displayed
    - `created_at` (timestamptz)

  ### 4. `gallery_images`
  General gallery images
    - `id` (uuid, primary key)
    - `image_url` (text) - Image URL
    - `title` (text) - Image title
    - `category` (text) - Image category
    - `display_order` (integer) - Display order
    - `is_active` (boolean) - Whether image is displayed
    - `created_at` (timestamptz)

  ### 5. `faq_items`
  Frequently asked questions
    - `id` (uuid, primary key)
    - `question` (text) - FAQ question
    - `answer` (text) - FAQ answer
    - `display_order` (integer) - Display order
    - `is_active` (boolean) - Whether FAQ is displayed
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow anonymous users to read data (SELECT)
  - No authentication required for public viewing
  - Admin features will be password-protected in the UI

  ## Initial Data
  Populates tables with current website content as starting point
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL DEFAULT 'Detailing Auto Profesional în Iași',
  hero_subtitle text NOT NULL DEFAULT 'Redăm strălucirea mașinii tale cu servicii premium de detailing auto',
  hero_image_url text DEFAULT '',
  contact_phone text DEFAULT '+40 123 456 789',
  contact_email text DEFAULT 'contact@detailingiasi.ro',
  contact_address text DEFAULT 'Str. Exemplu Nr. 123, Iași',
  whatsapp_number text DEFAULT '+40123456789',
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Sparkles',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_role text DEFAULT '',
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL,
  category text DEFAULT 'General',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Anyone can view gallery images"
  ON gallery_images FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Anyone can view FAQ items"
  ON faq_items FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for admin operations (unrestricted for now)
CREATE POLICY "Anyone can update site settings"
  ON site_settings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert services"
  ON services FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update services"
  ON services FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete services"
  ON services FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update testimonials"
  ON testimonials FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete testimonials"
  ON testimonials FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert gallery images"
  ON gallery_images FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update gallery images"
  ON gallery_images FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete gallery images"
  ON gallery_images FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert FAQ items"
  ON faq_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update FAQ items"
  ON faq_items FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete FAQ items"
  ON faq_items FOR DELETE
  TO anon
  USING (true);

-- Insert initial site settings
INSERT INTO site_settings (id, hero_title, hero_subtitle, contact_phone, contact_email, contact_address, whatsapp_number)
VALUES (
  gen_random_uuid(),
  'Detailing Auto Profesional în Iași',
  'Redăm strălucirea mașinii tale cu servicii premium de detailing auto',
  '+40 123 456 789',
  'contact@detailingiasi.ro',
  'Str. Exemplu Nr. 123, Iași',
  '+40123456789'
);

-- Insert initial services
INSERT INTO services (title, description, icon_name, display_order) VALUES
('Detailing Exterior', 'Polish, ceruire, tratamente ceramice pentru o strălucire de durată', 'Sparkles', 1),
('Detailing Interior', 'Curățare profundă, igienizare tapițerie și recondiționare piele', 'Home', 2),
('Tratamente Protecție', 'Tratamente ceramice, PPF și protecție vopsea profesională', 'Shield', 3),
('Recondiționare Faruri', 'Redăm claritatea farurilor pentru o vizibilitate optimă', 'Lightbulb', 4),
('Polish & Corecție Vopsea', 'Eliminarea zgârieturilor și imperfecțiunilor din vopsea', 'SprayCan', 5),
('Detailing Motor', 'Curățare și protecție compartiment motor', 'Wrench', 6);

-- Insert initial testimonials
INSERT INTO testimonials (customer_name, customer_role, content, rating, display_order) VALUES
('Andrei Popescu', 'Proprietar BMW X5', 'Servicii excepționale! Mașina arată ca nouă după tratamentul ceramic. Recomand cu încredere!', 5, 1),
('Maria Ionescu', 'Proprietar Audi A4', 'Profesionalism la superlativ. Echipa este dedicată și atentă la detalii. Mulțumit 100%!', 5, 2),
('Alexandru Popa', 'Proprietar Mercedes C-Class', 'Cel mai bun detailing din Iași! Rezultate impecabile și prețuri corecte.', 5, 3);

-- Insert initial FAQ items
INSERT INTO faq_items (question, answer, display_order) VALUES
('Cât durează un serviciu complet de detailing?', 'Un serviciu complet de detailing exterior și interior durează între 4-8 ore, în funcție de starea vehiculului și serviciile solicitate.', 1),
('Oferiți garanție pentru tratamentele ceramice?', 'Da, oferim garanție de până la 5 ani pentru tratamentele ceramice premium, în funcție de produsul ales și condițiile de întreținere.', 2),
('Este nevoie de programare?', 'Da, recomandăm programarea în avans pentru a ne asigura că putem aloca timpul necesar pentru serviciile dumneavoastră.', 3),
('Acceptați plata cu cardul?', 'Da, acceptăm atât plata cash cât și cu cardul bancar.', 4);