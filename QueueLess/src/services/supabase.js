import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchQueues() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: new Error('Supabase não está configurado.') };
  }

  return supabase
    .from('queues')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);
}
