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
