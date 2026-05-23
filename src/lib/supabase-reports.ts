import { supabase } from "./supabase";
import { SectorReport } from "./data-service";

/**
 * 📊 SUPABASE SERVICE: RELATÓRIOS SETORIAIS
 * Gerencia a persistência centralizada de relatórios assinados e enviados para a CGP.
 */
export const supabaseReports = {
  /**
   * Salva ou atualiza um relatório no Supabase.
   */
  async saveReport(report: SectorReport) {
    if (!supabase) {
      console.warn("Supabase não inicializado. Relatório salvo apenas localmente.");
      return;
    }

    try {
      const { error } = await supabase
        .from('relatorios_setoriais')
        .upsert({
          id: report.id,
          sector_id: report.sectorId,
          sector_sigla: report.sectorSigla,
          sector_name: report.sectorName,
          report_scope: report.reportScope,
          period_type: report.periodType,
          period_start: report.periodStart,
          period_end: report.periodEnd,
          content: report.content,
          member_activities: report.memberActivities,
          signed_by: report.signedBy,
          signed_by_cargo: report.signedByCargo,
          signed_at: report.signedAt,
          signature_seal: report.signatureSeal,
          status: report.status,
          sent_at: report.sentAt,
          archived_at: report.archivedAt,
          archived_by: report.archivedBy,
          created_at: report.createdAt,
          metadata: JSON.parse(JSON.stringify(report))
        }, { onConflict: 'id' });

      if (error) {
        console.error("Erro ao salvar relatório no Supabase:", error.message);
        throw error;
      }
      
      console.log(`[Supabase] Relatório ${report.id} sincronizado com sucesso.`);
    } catch (e) {
      console.error("Exceção ao sincronizar relatório:", e);
      throw e;
    }
  },

  /**
   * Busca todos os relatórios centralizados.
   */
  async getReports(): Promise<SectorReport[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('relatorios_setoriais')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(row => ({
        ...row.metadata, // Usa o metadata como base para garantir compatibilidade com a interface
        status: row.status,
        sentAt: row.sent_at,
        archivedAt: row.archived_at,
        archivedBy: row.archived_by
      } as SectorReport));
    } catch (e) {
      console.error("Erro ao buscar relatórios no Supabase:", e);
      return [];
    }
  },

  /**
   * Exclui um relatório do Supabase.
   */
  async deleteReport(reportId: string): Promise<void> {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('relatorios_setoriais')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      
      console.log(`[Supabase] Relatório ${reportId} excluído com sucesso.`);
    } catch (e) {
      console.error("Erro ao excluir relatório no Supabase:", e);
      throw e;
    }
  },

  /**
   * Assina mudanças em tempo real nos relatórios.
   */
  subscribeToReports(callback: (payload: any) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('realtime_relatorios')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'relatorios_setoriais'
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
