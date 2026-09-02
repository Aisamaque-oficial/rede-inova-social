import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
// Atenção: A service role key deve estar no .env.local e NUNCA ser vazada no frontend (NEXT_PUBLIC)
// Fallback adicionado para evitar que o "npm run build" falhe caso a variável não exista no ambiente de build.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_to_bypass_build_error_12345678901234567890';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
