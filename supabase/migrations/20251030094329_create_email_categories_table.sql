/*
  # Create email_categories table

  This migration creates a separate table for managing email message categories,
  mirroring the structure of the existing categories table used for SMS messages.

  1. New Tables
    - `email_categories`
      - `id` (uuid, primary key) - Unique identifier for each email category
      - `name` (text, unique) - Category name (must be unique)
      - `description` (text, nullable) - Optional description of the category
      - `created_at` (timestamptz) - When the category was created
      - `updated_at` (timestamptz) - When the category was last updated

  2. Security
    - Enable RLS on `email_categories` table
    - Add policy for anonymous users to perform all operations
      (This matches the existing categories security model)

  3. Important Notes
    - The table structure is identical to the categories table
    - Separating SMS and email categories allows independent organization
    - RLS policy allows anonymous access to support the current application architecture
*/

CREATE TABLE IF NOT EXISTS email_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users full access to email_categories"
  ON email_categories
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
