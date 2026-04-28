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

async function checkColumn() {
  const { data, error } = await supabase
    .from('user_activity_logs')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching logs:', error);
    return;
  }

  if (data && data.length > 0) {
    const hasColumn = 'sector_name' in data[0];
    console.log(`Column 'sector_name' exists: ${hasColumn}`);
  } else {
    // Try to select just the column to see if it errors
    const { error: colError } = await supabase
      .from('user_activity_logs')
      .select('sector_name')
      .limit(1);
    
    if (colError && colError.message.includes('column "sector_name" does not exist')) {
      console.log("Column 'sector_name' exists: false");
    } else if (colError) {
      console.error('Error checking column:', colError);
    } else {
      console.log("Column 'sector_name' exists: true");
    }
  }
}

checkColumn();
