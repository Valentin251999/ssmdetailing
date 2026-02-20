/*
  # Fix is_admin() - restore both admin emails

  The previous migration accidentally overwrote is_admin() to only allow
  one email. This restores both admin emails and keeps the security improvements
  (SET search_path, optimized auth.uid() call).
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
    AND email IN ('chitudanutvalentin@gmail.com', 'admin@ssm-detailing.ro')
  )
$$;
