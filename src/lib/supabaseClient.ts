import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gxvjkfpqnubriabieugl.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_EpzY-RrxXebHizxNf1GAjA_Qujw83Og';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
);

// Client for public / browser-side interactions
export const supabase = createClient(supabaseUrl, supabaseKey);
