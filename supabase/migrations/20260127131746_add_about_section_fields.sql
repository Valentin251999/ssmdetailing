/*
  # Add About Section Fields to Site Settings

  ## Changes
  - Adds fields for managing the About section content:
    - about_eyebrow (e.g., "Despre Noi")
    - about_title (e.g., "Atelier Specializat")
    - about_intro (introductory paragraph)
    - about_what_we_do (JSON array of services we offer)
    - about_what_we_dont_do (JSON array of services we don't offer)
    - about_motto (closing statement)
    
  ## Notes
  - All fields are nullable with sensible defaults
  - Uses JSONB for array fields for flexibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_eyebrow'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_eyebrow text DEFAULT 'Despre Noi';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_title'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_title text DEFAULT 'Atelier Specializat';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_intro'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_intro text DEFAULT 'SSM Detailing este un atelier specializat exclusiv pe interior auto.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_what_we_do'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_what_we_do jsonb DEFAULT '["Plafoane Starlight personalizate", "Detailing interior premium", "Restaurare faruri", "Retapițare plafon & stâlpi", "Curățare jante"]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_what_we_dont_do'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_what_we_dont_do jsonb DEFAULT '["Spălare exterioară", "Corecție vopsea", "Ceară / Lustruire", "Servicii de volum"]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_motto'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN about_motto text DEFAULT 'Ne concentrăm pe calitate, nu pe cantitate.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_eyebrow'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_eyebrow text DEFAULT 'Atelier Specializat Interior Auto';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_cta_primary'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_cta_primary text DEFAULT 'Programează-te';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_cta_secondary'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_cta_secondary text DEFAULT 'Vezi Portfolio';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_tagline'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_tagline text DEFAULT 'Excelență în detailing interior auto';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_description'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_description text DEFAULT 'Atelier specializat exclusiv pe interior - transformăm fiecare mașină într-o experiență unică.';
  END IF;
END $$;