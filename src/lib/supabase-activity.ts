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
  
  // If it's a numeric ID (like "1", "15"), pad it to be a valid UUID
  const numericId = id.replace(/\D/g, '');
  if (numericId && numericId.length <= 12 && id.length < 15) {
    return `00000000-0000-0000-0000-${numericId.padStart(12, '0')}`;
  }
  
  // For other string IDs (like Firebase UIDs), we create a deterministic UUID
  // We use a simple hash to fill the last part
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  const fallbackId = id.length > 4 ? id.substring(0, 4) : id.padStart(4, '0');
  const hexPrefix = Array.from(fallbackId).map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 4);
  
  return `00000000-0000-4000-8000-${hexPrefix.padStart(4, '0')}${hexHash.padStart(8, '0')}`;
};

// Helper to revert UUID to ID if possible (only for padded numeric IDs)
const fromUUID = (uuid: string) => {
  if (!uuid) return '';
  if (uuid.startsWith('00000000-0000-0000-0000-')) {
    const lastPart = uuid.split('-').pop() || '';
    const numeric = lastPart.replace(/^0+/, '');
    return numeric || '0';
  }
  return uuid;
};

export const supabaseActivity = {
  async logActivity(activity: UserActivity) {
    if (!supabase) return;
    
    const deterministicId = toUUID(activity.user_id);
    
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .upsert({
          id: deterministicId, // Use as primary key for reliable upsert
          user_id: deterministicId, // DB column was created as UUID
          user_name: activity.user_name,
          user_sector: activity.user_sector,
          sector_name: activity.sector_name,
          last_online: activity.last_online,
          session_duration: activity.session_duration,
          last_action: activity.last_action
        }, { onConflict: 'id' });

      if (error) {
        console.warn("Supabase Log Warning (Activity):", error.message || error);
        
        // Fallback: Tentar insert simplificado (sem colunas novas que podem não existir no DB)
        const { error: insertError } = await supabase.from('user_activity_logs').upsert({
          id: deterministicId,
          user_id: deterministicId,
          user_name: activity.user_name,
          user_sector: activity.user_sector,
          last_online: activity.last_online,
          session_duration: activity.session_duration
        }, { onConflict: 'id' });
        
        if (insertError) {
          console.error("Supabase Log Final Error:", insertError.message);
        }
      }
    } catch (e) {
      console.warn("Supabase Activity Tracker Exception (Silenced):", e);
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
