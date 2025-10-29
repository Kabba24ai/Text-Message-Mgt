/*
  # Add anonymous access policies for text messages

  1. Security Changes
    - Drop existing restrictive policies that require authentication
    - Add new policies that allow anonymous (anon) access for all operations
    - This allows the app to work without authentication

  2. Important Notes
    - All users (including anonymous) can now view, create, update, and delete messages
    - This is appropriate for demo/development purposes
    - In production, you should implement proper authentication
*/

DROP POLICY IF EXISTS "Authenticated users can view messages" ON text_messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON text_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON text_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON text_messages;

DROP POLICY IF EXISTS "Users can view all text messages" ON text_messages;
DROP POLICY IF EXISTS "Users can insert text messages" ON text_messages;
DROP POLICY IF EXISTS "Users can update text messages" ON text_messages;
DROP POLICY IF EXISTS "Users can delete text messages" ON text_messages;

CREATE POLICY "Anyone can view text messages"
  ON text_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert text messages"
  ON text_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update text messages"
  ON text_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete text messages"
  ON text_messages
  FOR DELETE
  USING (true);
