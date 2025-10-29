/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null) - Category name
      - `description` (text) - Optional description of the category
      - `created_at` (timestamptz) - When the category was created
      - `updated_at` (timestamptz) - When the category was last updated

  2. Security
    - Enable RLS on `categories` table
    - Add policies for anonymous access (matching text_messages pattern)

  3. Initial Data
    - Insert existing categories from text_messages for consistency
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
  ON categories
  FOR DELETE
  USING (true);

-- Insert distinct categories from existing messages
INSERT INTO categories (name, description)
SELECT DISTINCT context_category, 'Category for ' || context_category || ' messages'
FROM text_messages
WHERE context_category IS NOT NULL
ON CONFLICT (name) DO NOTHING;
