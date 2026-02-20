/*
  # Update is_admin function to single email

  Removes admin@ssm-detailing.ro and keeps only chitudanutvalentin@gmail.com
  as the authorized admin account.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid()
  AND email = 'chitudanutvalentin@gmail.com'
)
$$;
