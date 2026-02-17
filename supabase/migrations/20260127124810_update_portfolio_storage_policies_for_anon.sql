/*
  # Update Portfolio Storage Policies for Anonymous Users
  
  ## Overview
  Modifies storage bucket policies to allow anonymous users to upload and manage images.
  This is temporary until authentication is implemented.
  
  ## Changes
    - Drop existing restrictive policies for uploads and deletes
    - Create new policies that allow both anonymous and authenticated users
  
  ## Security Notes
    - This allows anyone to upload/delete images in the portfolio bucket
    - For production use, authentication should be implemented
    - Current setup is suitable for internal use with trusted access
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;

-- Allow anyone (anon + authenticated) to upload images
CREATE POLICY "Anyone can upload portfolio images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow anyone (anon + authenticated) to delete images
CREATE POLICY "Anyone can delete portfolio images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'portfolio');

-- Allow anyone to update images (for potential future updates)
CREATE POLICY "Anyone can update portfolio images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'portfolio')
WITH CHECK (bucket_id = 'portfolio');