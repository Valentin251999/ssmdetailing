import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
