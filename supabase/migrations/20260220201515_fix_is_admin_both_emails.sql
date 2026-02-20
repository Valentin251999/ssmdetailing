
/*
  # Fix is_admin() function to accept both admin accounts

  The is_admin() function only allowed one email, blocking the second admin account.
  This migration updates it to accept both admin emails.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email IN ('chitudanutvalentin@gmail.com', 'admin@ssm-detailing.ro')
  )
$$;
