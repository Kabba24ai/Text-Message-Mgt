/*
  # Create Sales Funnels System

  1. New Tables
    - `sales_funnels`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Name of the sales funnel
      - `description` (text) - Optional description of the funnel
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `funnel_content_assignments`
      - `id` (uuid, primary key)
      - `funnel_id` (uuid, foreign key to sales_funnels) - Which funnel
      - `message_id` (uuid, foreign key to text_messages) - Which message
      - `created_at` (timestamptz) - Assignment timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for anonymous access (demo purposes)

  3. Purpose
    - Track sales funnels in the system
    - Assign funnel content messages to specific sales funnels
    - Allow many-to-many relationship (one message can be in multiple funnels)
*/

-- Create sales_funnels table
CREATE TABLE IF NOT EXISTS sales_funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create funnel_content_assignments junction table
CREATE TABLE IF NOT EXISTS funnel_content_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES sales_funnels(id) ON DELETE CASCADE,
  message_id uuid NOT NULL REFERENCES text_messages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(funnel_id, message_id)
);

-- Enable RLS
ALTER TABLE sales_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_content_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_funnels (anonymous access for demo)
CREATE POLICY "Allow anonymous read access to sales_funnels"
  ON sales_funnels FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to sales_funnels"
  ON sales_funnels FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to sales_funnels"
  ON sales_funnels FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to sales_funnels"
  ON sales_funnels FOR DELETE
  TO anon
  USING (true);

-- Create policies for funnel_content_assignments (anonymous access for demo)
CREATE POLICY "Allow anonymous read access to funnel_content_assignments"
  ON funnel_content_assignments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to funnel_content_assignments"
  ON funnel_content_assignments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to funnel_content_assignments"
  ON funnel_content_assignments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to funnel_content_assignments"
  ON funnel_content_assignments FOR DELETE
  TO anon
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_funnel_content_assignments_message_id 
  ON funnel_content_assignments(message_id);

CREATE INDEX IF NOT EXISTS idx_funnel_content_assignments_funnel_id 
  ON funnel_content_assignments(funnel_id);
