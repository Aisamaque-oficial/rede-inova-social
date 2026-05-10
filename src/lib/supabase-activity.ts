import { supabase } from "./supabase";

export interface UserActivity {
  id?: string;
  user_id: string;
  user_name: string;
  user_sector: string;
  sector_name?: string; // New field for LISSA specific sectors
  last_online: string;
  session_duration: number;
  last_action?: string; // Última ação realizada (ex: página visitada)
}

// Helper to ensure compatibility with Supabase UUID type
const toUUID = (id: string) => {
  if (!id) return '00000000-0000-0000-0000-000000000000';
  // If it's already a UUID, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return id;
  // If it's a numeric mock ID (like "1", "15"), pad it to be a valid UUID
  const numericId = id.replace(/\D/g, '');
  if (numericId && numericId.length <= 12) {
    return `00000000-0000-0000-0000-${numericId.padStart(12, '0')}`;
  }
  // Fallback for other string IDs (like Firebase UIDs which are not UUIDs)
  return `00000000-0000-0000-0000-ffffffffffff`; 
};

// Helper to revert UUID to numeric ID for app compatibility
const fromUUID = (uuid: string) => {
  if (!uuid || !uuid.startsWith('00000000-0000-0000-0000-')) return uuid;
  const lastPart = uuid.split('-').pop() || '';
  const numeric = lastPart.replace(/^0+/, '');
  return numeric || '0';
};

export const supabaseActivity = {
  async logActivity(activity: UserActivity) {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .upsert({
          user_id: toUUID(activity.user_id),
          user_name: activity.user_name,
          user_sector: activity.user_sector,
          sector_name: activity.sector_name, // Support for specific sector naming
          last_online: activity.last_online,
          session_duration: activity.session_duration,
          last_action: activity.last_action
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
      
      // Map back to original IDs so the UI (encontrarUsuarioPorId) works
      return (data || []).map(log => ({
        ...log,
        user_id: fromUUID(log.user_id)
      }));
    } catch (e) {
      console.error("Supabase Fetch Error:", e);
      return [];
    }
  }
};
