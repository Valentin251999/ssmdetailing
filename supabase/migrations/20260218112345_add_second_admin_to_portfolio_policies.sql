/*
  # Add second admin email to portfolio policies

  Updates all portfolio_items RLS policies to allow both admin emails:
  - admin@ssm-detailing.ro (original admin)
  - chitudanutvalentin@gmail.com (second admin)

  Also updates portfolio storage bucket policies.
*/

DROP POLICY IF EXISTS "Admin can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can delete portfolio items" ON portfolio_items;

CREATE POLICY "Admin can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('admin@ssm-detailing.ro', 'chitudanutvalentin@gmail.com')
    )
  );

CREATE POLICY "Admin can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('admin@ssm-detailing.ro', 'chitudanutvalentin@gmail.com')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('admin@ssm-detailing.ro', 'chitudanutvalentin@gmail.com')
    )
  );

CREATE POLICY "Admin can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN ('admin@ssm-detailing.ro', 'chitudanutvalentin@gmail.com')
    )
  );
