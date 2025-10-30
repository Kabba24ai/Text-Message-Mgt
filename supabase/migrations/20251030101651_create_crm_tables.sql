/*
  # Create CRM Tables for Rental Business

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `first_name` (text) - Customer first name
      - `last_name` (text) - Customer last name
      - `email` (text, unique) - Customer email address
      - `phone` (text) - Customer phone number
      - `notes` (text) - Additional notes about the customer
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `equipment`
      - `id` (uuid, primary key)
      - `name` (text) - Equipment name
      - `category` (text) - Equipment category
      - `description` (text) - Equipment description
      - `instructions_url` (text) - YouTube video or instructions URL
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `rentals`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers) - Which customer
      - `rental_date` (date) - When rental starts
      - `return_date` (date) - When rental is due back
      - `status` (text) - Status: pending, active, completed, cancelled
      - `total_amount` (numeric) - Total rental cost
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `rental_items`
      - `id` (uuid, primary key)
      - `rental_id` (uuid, foreign key to rentals) - Which rental
      - `equipment_id` (uuid, foreign key to equipment) - Which equipment
      - `quantity` (integer) - How many units
      - `unit_price` (numeric) - Price per unit
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous access (demo purposes)

  3. Purpose
    - Track customers and their contact information
    - Track rental equipment with instructions
    - Track rentals and what equipment is rented
    - Foundation for automated communication via sales funnels
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text UNIQUE,
  phone text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  description text DEFAULT '',
  instructions_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rental_date date NOT NULL DEFAULT CURRENT_DATE,
  return_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))
);

-- Create rental_items table
CREATE TABLE IF NOT EXISTS rental_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_items ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Allow anonymous read access to customers"
  ON customers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to customers"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to customers"
  ON customers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to customers"
  ON customers FOR DELETE
  TO anon
  USING (true);

-- Equipment policies
CREATE POLICY "Allow anonymous read access to equipment"
  ON equipment FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to equipment"
  ON equipment FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to equipment"
  ON equipment FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to equipment"
  ON equipment FOR DELETE
  TO anon
  USING (true);

-- Rentals policies
CREATE POLICY "Allow anonymous read access to rentals"
  ON rentals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to rentals"
  ON rentals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to rentals"
  ON rentals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to rentals"
  ON rentals FOR DELETE
  TO anon
  USING (true);

-- Rental items policies
CREATE POLICY "Allow anonymous read access to rental_items"
  ON rental_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to rental_items"
  ON rental_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to rental_items"
  ON rental_items FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to rental_items"
  ON rental_items FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rentals_customer_id ON rentals(customer_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rental_items_rental_id ON rental_items(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_items_equipment_id ON rental_items(equipment_id);
