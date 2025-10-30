/*
  # Create Funnel Automation Tables

  1. New Tables
    - `funnel_steps`
      - `id` (uuid, primary key)
      - `funnel_id` (uuid, foreign key to sales_funnels) - Which funnel
      - `step_number` (integer) - Order of the step (1, 2, 3, etc.)
      - `message_id` (uuid, foreign key to text_messages or email_messages) - Message to send
      - `message_type` (text) - 'sms' or 'email'
      - `delay_days` (integer) - Days to wait before sending (0 = immediate)
      - `trigger_condition` (text) - When to send: 'rental_created', 'rental_active', 'before_return', etc.
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `customer_funnel_enrollments`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers) - Which customer
      - `rental_id` (uuid, foreign key to rentals) - Which rental triggered this
      - `funnel_id` (uuid, foreign key to sales_funnels) - Which funnel
      - `enrolled_at` (timestamptz) - When customer was enrolled
      - `status` (text) - 'active', 'completed', 'paused', 'cancelled'
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `funnel_step_executions`
      - `id` (uuid, primary key)
      - `enrollment_id` (uuid, foreign key to customer_funnel_enrollments)
      - `funnel_step_id` (uuid, foreign key to funnel_steps)
      - `scheduled_date` (timestamptz) - When this step should execute
      - `executed_date` (timestamptz) - When this step was actually executed
      - `status` (text) - 'pending', 'sent', 'failed', 'skipped'
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous access (demo purposes)

  3. Purpose
    - Define automated steps in sales funnels
    - Track customer enrollment in funnels (when they rent equipment)
    - Track execution of funnel steps (automated message sending)
    - Enable automated communication based on rental events
*/

-- Create funnel_steps table
CREATE TABLE IF NOT EXISTS funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES sales_funnels(id) ON DELETE CASCADE,
  step_number integer NOT NULL DEFAULT 1,
  message_id uuid NOT NULL,
  message_type text NOT NULL DEFAULT 'sms',
  delay_days integer NOT NULL DEFAULT 0,
  trigger_condition text NOT NULL DEFAULT 'rental_created',
  created_at timestamptz DEFAULT now(),
  CHECK (message_type IN ('sms', 'email')),
  CHECK (trigger_condition IN ('rental_created', 'rental_active', 'before_return', 'after_return', 'custom')),
  UNIQUE(funnel_id, step_number)
);

-- Create customer_funnel_enrollments table
CREATE TABLE IF NOT EXISTS customer_funnel_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rental_id uuid REFERENCES rentals(id) ON DELETE SET NULL,
  funnel_id uuid NOT NULL REFERENCES sales_funnels(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CHECK (status IN ('active', 'completed', 'paused', 'cancelled'))
);

-- Create funnel_step_executions table
CREATE TABLE IF NOT EXISTS funnel_step_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES customer_funnel_enrollments(id) ON DELETE CASCADE,
  funnel_step_id uuid NOT NULL REFERENCES funnel_steps(id) ON DELETE CASCADE,
  scheduled_date timestamptz NOT NULL,
  executed_date timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CHECK (status IN ('pending', 'sent', 'failed', 'skipped'))
);

-- Enable RLS
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_funnel_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_step_executions ENABLE ROW LEVEL SECURITY;

-- Funnel steps policies
CREATE POLICY "Allow anonymous read access to funnel_steps"
  ON funnel_steps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to funnel_steps"
  ON funnel_steps FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to funnel_steps"
  ON funnel_steps FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to funnel_steps"
  ON funnel_steps FOR DELETE
  TO anon
  USING (true);

-- Customer funnel enrollments policies
CREATE POLICY "Allow anonymous read access to customer_funnel_enrollments"
  ON customer_funnel_enrollments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to customer_funnel_enrollments"
  ON customer_funnel_enrollments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to customer_funnel_enrollments"
  ON customer_funnel_enrollments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to customer_funnel_enrollments"
  ON customer_funnel_enrollments FOR DELETE
  TO anon
  USING (true);

-- Funnel step executions policies
CREATE POLICY "Allow anonymous read access to funnel_step_executions"
  ON funnel_step_executions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to funnel_step_executions"
  ON funnel_step_executions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to funnel_step_executions"
  ON funnel_step_executions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to funnel_step_executions"
  ON funnel_step_executions FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_funnel_steps_funnel_id ON funnel_steps(funnel_id);
CREATE INDEX IF NOT EXISTS idx_customer_funnel_enrollments_customer_id ON customer_funnel_enrollments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_funnel_enrollments_rental_id ON customer_funnel_enrollments(rental_id);
CREATE INDEX IF NOT EXISTS idx_customer_funnel_enrollments_funnel_id ON customer_funnel_enrollments(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_step_executions_enrollment_id ON funnel_step_executions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_funnel_step_executions_status ON funnel_step_executions(status);
CREATE INDEX IF NOT EXISTS idx_funnel_step_executions_scheduled_date ON funnel_step_executions(scheduled_date);
