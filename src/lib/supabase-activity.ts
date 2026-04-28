import { supabase } from "./supabase";

export interface UserActivity {
  id?: string;
  user_id: string;
  user_name: string;
  user_sector: string;
  sector_name?: string; // New field for LISSA specific sectors
  last_online: string;
  session_duration: number;
}

export const supabaseActivity = {
  async logActivity(activity: UserActivity) {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .upsert({
          user_id: activity.user_id,
          user_name: activity.user_name,
          user_sector: activity.user_sector,
          sector_name: activity.sector_name, // Support for specific sector naming
          last_online: activity.last_online,
          session_duration: activity.session_duration
        }, { onConflict: 'user_id' });

      if (error) console.error("Supabase Log Error (Activity):", error.message || error);
    } catch (e) {
      console.warn("Supabase Exception:", e);
    }
  },

  async getActivityLogs() {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('last_online', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase Fetch Error:", e);
      return [];
    }
  }
};
