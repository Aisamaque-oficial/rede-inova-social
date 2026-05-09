import { supabase } from "./supabase";
import { ProjectTask } from "./mock-data";

/**
 * 🚀 SUPABASE SERVICE: ATRIBUICOES (TASKS) E COMENTARIOS
 * Manages centralized task assignments and their internal communications with real-time support.
 */
export const supabaseAtribuicoes = {
  /**
   * Fetches all assignments relevant to the current user (sent or received).
   */
  async getAssignments(userId: string, userSector?: string) {
    if (!supabase) return [];

    try {
      let query = supabase.from('atribuicoes').select('*');
      
      if (userSector) {
        query = query.or(`assigned_to_user_id.eq.${userId},assigned_by_user_id.eq.${userId},setor.eq.${userSector}`);
      } else {
        query = query.or(`assigned_to_user_id.eq.${userId},assigned_by_user_id.eq.${userId}`);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase Fetch Error (Atribuicoes):", e);
      return [];
    }
  },

  /**
   * Saves or updates an assignment.
   */
  async saveAssignment(task: ProjectTask, senderId: string, receiverId: string) {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('atribuicoes')
        .upsert({
          external_id: task.id,
          setor: task.sectorId || task.sector,
          titulo: task.title,
          descricao: task.description,
          assigned_to_user_id: receiverId,
          assigned_by_user_id: senderId,
          status: task.status,
          prioridade: task.priority,
          prazo: task.deadline,
          metadata: JSON.parse(JSON.stringify(task)),
          updated_at: new Date().toISOString()
        }, { onConflict: 'external_id' });

      if (error) throw error;
    } catch (e) {
      console.error("Supabase Save Error (Atribuicoes):", e);
      throw e;
    }
  },

  /**
   * Atualiza especificamente o status ou prazo de uma atribuição já existente
   */
  async updateAssignmentStatus(externalId: string, updates: any) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('atribuicoes')
        .update({
           ...updates,
           updated_at: new Date().toISOString()
        })
        .eq('external_id', externalId);

      if (error) throw error;
    } catch (e) {
       console.error("Supabase Update Status Error:", e);
       throw e;
    }
  },

  /**
   * Busca os comentários e histórico de uma atribuição específica
   */
  async getComments(externalTaskId: string) {
    if (!supabase) return [];
    try {
       const { data, error } = await supabase
        .from('comentarios_atribuicao')
        .select('*')
        .eq('external_task_id', externalTaskId)
        .order('created_at', { ascending: true });

       if (error) throw error;
       return data || [];
    } catch (e) {
       console.error("Supabase Fetch Comments Error:", e);
       return [];
    }
  },

  /**
   * Adiciona um novo comentário ou registro de histórico (ex: mudança de status)
   */
  async addComment(externalTaskId: string, autorId: string, autorNome: string, mensagem: string, tipo: string = 'comment') {
    if (!supabase) return;
    try {
      // Para associar com a chave estrangeira correta, podemos primeiro buscar o UUID interno da atribuição se necessário,
      // mas como a tabela 'comentarios_atribuicao' foi configurada para usar ON DELETE CASCADE com atribuicao_id, 
      // precisamos desse id interno. Vamos buscar primeiro:
      const { data: atribuicao } = await supabase.from('atribuicoes').select('id').eq('external_id', externalTaskId).single();
      
      const { error } = await supabase
        .from('comentarios_atribuicao')
        .insert({
          atribuicao_id: atribuicao?.id || null, // Se ainda não sincou, pode ser null, mas o external_task_id garante o vínculo
          external_task_id: externalTaskId,
          autor_id: autorId,
          autor_nome: autorNome,
          mensagem: mensagem,
          tipo: tipo
        });

      if (error) throw error;
    } catch (e) {
      console.error("Supabase Add Comment Error:", e);
      throw e;
    }
  },

  /**
   * Subscribes to real-time changes in assignments.
   */
  subscribeToAssignments(userId: string, userSector: string | undefined, callback: (payload: any) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('realtime_atribuicoes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'atribuicoes'
        },
        (payload) => {
          const record = payload.new || payload.old;
          if (record) {
             const isForMe = record.assigned_to_user_id === userId || record.assigned_by_user_id === userId;
             const isForMySector = userSector && record.setor === userSector;
             if (isForMe || isForMySector) {
                callback(payload);
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribes to real-time changes in comments for a specific task or globally.
   */
  subscribeToComments(callback: (payload: any) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('realtime_comentarios')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comentarios_atribuicao'
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
