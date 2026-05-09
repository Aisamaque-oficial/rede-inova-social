import { supabase } from "./supabase";

/**
 * 💬 SUPABASE SERVICE: COMUNICACOES INTERNAS (CHAT)
 * Handles internal real-time messaging between members.
 */
export const supabaseChat = {
  /**
   * Fetches messages between the current user and others.
   */
  async getMessages(userId: string) {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('comunicacoes_internas')
        .select('*')
        .or(`enviado_por.eq.${userId},recebido_por.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase Chat Error:", e);
      return [];
    }
  },

  /**
   * Sends a new message.
   */
  async sendMessage(senderId: string, receiverId: string, message: string) {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('comunicacoes_internas')
        .insert({
          enviado_por: senderId,
          recebido_por: receiverId,
          mensagem: message,
          status: 'pendente'
        });

      if (error) throw error;
    } catch (e) {
      console.error("Supabase Send Message Error:", e);
      throw e;
    }
  },

  /**
   * Subscribes to real-time incoming messages.
   */
  subscribeToMessages(userId: string, callback: (payload: any) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('realtime_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comunicacoes_internas',
          filter: `recebido_por=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
