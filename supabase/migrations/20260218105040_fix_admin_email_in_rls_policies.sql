/*
  # Fix Admin Email in RLS Policies

  The admin policies were checking for 'admin@example.com' but the actual
  admin account uses 'admin@ssm-detailing.ro'. This migration updates all
  admin RLS policies across all tables to use the correct email.

  Tables affected:
  - portfolio_items (insert, update, delete)
*/

DROP POLICY IF EXISTS "Admin can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin can delete portfolio items" ON portfolio_items;

CREATE POLICY "Admin can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@ssm-detailing.ro'
    )
  );

CREATE POLICY "Admin can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@ssm-detailing.ro'
    )
  );

CREATE POLICY "Admin can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@ssm-detailing.ro'
    )
  );
