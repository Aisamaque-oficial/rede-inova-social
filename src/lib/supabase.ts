import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Activity logging will be disabled or mocked.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 📊 user_activity_logs Table Schema (SQL):
 * 
 * create table user_activity_logs (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id text not null,
 *   user_name text,
 *   user_sector text,
 *   last_online timestamp with time zone default now(),
 *   session_duration bigint default 0, -- in seconds
 *   created_at timestamp with time zone default now()
 * );
 * 
 * create index idx_user_activity_user_id on user_activity_logs(user_id);
 * create index idx_user_activity_last_online on user_activity_logs(last_online desc);
 */
