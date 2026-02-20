
/*
  # Fix is_admin() to use only the correct admin email

  Reverts is_admin() to accept only the single valid admin account.
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
    AND email = 'chitudanutvalentin@gmail.com'
  )
$$;
