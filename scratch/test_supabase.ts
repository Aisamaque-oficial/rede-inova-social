import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase keys not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing connection to:', supabaseUrl);
  
  const { data, error } = await supabase
    .from('user_activity_logs')
    .insert({
      user_id: 'test_id',
      user_name: 'Test User',
      user_sector: 'Test Sector',
      last_online: new Date().toISOString(),
      session_duration: 0
    });

  if (error) {
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
  } else {
    console.log('Insert successful!');
    // Delete the test record
    await supabase.from('user_activity_logs').delete().eq('user_id', 'test_id');
  }
}

testInsert();
