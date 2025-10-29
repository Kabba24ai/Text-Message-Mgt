/*
  # Create email_messages table

  This migration creates a table for managing email messages (broadcast and funnel content) 
  similar to the text_messages table structure.

  1. New Tables
    - `email_messages`
      - `id` (uuid, primary key) - Unique identifier for each email message
      - `context_category` (text) - Category/context for organizing emails
      - `content_name` (text) - Name/title of the email message
      - `subject` (text) - Email subject line
      - `content` (text) - Email body content (HTML or plain text)
      - `message_type` (text) - Type of message: 'email_broadcast' or 'email_funnel_content'
      - `sent_date` (timestamptz, nullable) - When the broadcast was sent (null for unsent/funnel content)
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `email_messages` table
    - Add policy for anonymous users to perform all operations
      (This matches the existing text_messages security model)

  3. Important Notes
    - The table structure mirrors text_messages but is designed for email content
    - `subject` field is specific to emails (not present in text_messages)
    - `message_type` uses 'email_broadcast' and 'email_funnel_content' values
    - RLS policy allows anonymous access to support the current application architecture
*/

CREATE TABLE IF NOT EXISTS email_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_category text NOT NULL DEFAULT '',
  content_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  message_type text NOT NULL DEFAULT 'email_broadcast',
  sent_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users full access to email_messages"
  ON email_messages
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
