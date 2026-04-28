import { supabase } from "./supabase";

export interface GlossaryTerm {
  id: string;
  term: string;
  axis_id: number;
  definition: string;
  context: string;
  video_url: string;
  sign_strategy: string;
}

export interface MinutePill {
  id: string;
  title: string;
  video_url: string;
  visual_reinforcement_url: string;
  support_text: string;
  practical_app: string;
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  video_url: string;
  quiz_data: any;
}

export const librasService = {
  getGlossaryByAxis: async (axisId: string | number) => {
    let query = supabase.from('lissa_glossary').select('*').order('term', { ascending: true });
    
    if (axisId !== 'todos') {
      // Garantir que o ID seja um número inteiro para o Supabase
      query = query.eq('axis_id', Number(axisId));
    }
    
    const { data, error } = await query;
    if (error) {
      console.error("Erro Supabase Glossário:", error);
      return [];
    }

    console.log(`Lissa Debug: Carregados ${data?.length} termos para o eixo ${axisId}`);

    return (data || []).map(t => ({
      ...t,
      description: t.definition,
      videoUrl: t.video_url,
      signStrategy: t.sign_strategy,
      tags: t.tags || []
    })) as any[];
  },

  async getMinutes() {
    const { data, error } = await supabase.from('lissa_minutes').select('*').order('created_at');
    if (error) {
      console.error("Erro Minutos:", error.message || error);
      return [];
    }
    return (data || []).map(m => ({
      ...m,
      videoUrl: m.video_url,
      visualReinforcementUrl: m.visual_reinforcement_url,
      supportText: m.support_text,
      practicalApp: m.practical_app
    })) as any[];
  },

  async getTracks() {
    const { data, error } = await supabase.from('lissa_tracks').select('*').order('created_at');
    if (error) {
      console.error("Erro Trilhas:", error.message || error);
      return [];
    }
    return (data || []).map(t => ({
      ...t,
      videoUrl: t.video_url,
      quizData: t.quiz_data,
      questions: t.quiz_data // Also map to questions for compatibility
    })) as any[];
  },

  async saveProgress(userId: string, contentId: string, contentType: string, score: number, completed: boolean) {
    const { error } = await supabase.from('user_learning_progress').upsert({
      user_id: userId,
      content_id: contentId,
      content_type: contentType,
      score,
      completed,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,content_id' });
    
    if (error) throw error;
  }
};
