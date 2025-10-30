import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TextMessage = {
  id: string;
  context_category: string;
  content_name: string;
  content: string;
  message_type: 'broadcast' | 'funnel_content';
  created_date: string;
  sent_date: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailMessage = {
  id: string;
  context_category: string;
  content_name: string;
  subject: string;
  content: string;
  message_type: 'email_broadcast' | 'email_funnel_content';
  sent_date: string | null;
  created_at: string;
};

export type SalesFunnel = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type FunnelContentAssignment = {
  id: string;
  funnel_id: string;
  message_id: string;
  created_at: string;
};

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Equipment = {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Rental = {
  id: string;
  customer_id: string;
  rental_date: string;
  return_date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type RentalItem = {
  id: string;
  rental_id: string;
  equipment_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type FunnelStep = {
  id: string;
  funnel_id: string;
  step_number: number;
  message_id: string;
  message_type: 'sms' | 'email';
  delay_days: number;
  trigger_condition: 'rental_created' | 'rental_active' | 'before_return' | 'after_return' | 'custom';
  created_at: string;
};

export type CustomerFunnelEnrollment = {
  id: string;
  customer_id: string;
  rental_id: string | null;
  funnel_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
};

export type FunnelStepExecution = {
  id: string;
  enrollment_id: string;
  funnel_step_id: string;
  scheduled_date: string;
  executed_date: string | null;
  status: 'pending' | 'sent' | 'failed' | 'skipped';
  created_at: string;
};
