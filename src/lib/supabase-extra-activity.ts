import { supabase } from "./supabase";
import { ProjectTask } from "./mock-data";

/**
 * 🚀 SUPABASE SERVICE: EXTRA ACTIVITIES
 * Manages persistence for authorial/extra activities in the Supabase backend.
 */
export const supabaseExtraActivity = {
  /**
   * Saves an extra activity to Supabase.
   * Ensures data integrity by mapping ProjectTask fields to the DB schema.
   */
  async saveActivity(task: ProjectTask) {
    if (!supabase) {
      console.warn("Supabase client not initialized. Activity saved only locally.");
      return;
    }

    try {
      // Map ProjectTask to Supabase table structure
      // We use upsert to prevent duplicates and ensure 'truth' (updates if already exists)
      const { data, error } = await supabase
        .from('extra_activities')
        .upsert({
          external_id: task.id,
          title: task.title,
          description: task.description,
          sector_id: task.sectorId,
          municipality: task.municipality || 'Regional',
          status: task.status,
          user_id: task.assignedById,
          user_name: task.assignedByName,
          is_extra: true,
          created_at: task.createdAt,
          completed_at: task.completedAt,
          metadata: JSON.parse(JSON.stringify(task)) // Full backup for data recovery
        }, { onConflict: 'external_id' });

      if (error) {
        console.error("Supabase Save Error (Extra Activity):", error.message);
        throw error;
      }
      
      console.log(`[Supabase] Activity ${task.id} synchronized successfully.`);
      return data;
    } catch (e) {
      console.error("Supabase Exception (Extra Activity):", e);
      throw e;
    }
  }
};
