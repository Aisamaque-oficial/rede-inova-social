import { supabase } from "./supabase";
import { librasGlossary, librasPills as mockPills, librasTracks as mockTracks } from "./mock-data";

export interface GlossaryTerm {
  id: string;
  term: string;
  axis_id: number;
  definition: string;
  description?: string;
  context: string;
  video_url: string;
  videoUrl?: string;
  sign_strategy: string;
  signStrategy?: string;
  tags?: string[];
  eixoTitle?: string;
  eixoEmoji?: string;
}

export interface MinutePill {
  id: string;
  title: string;
  video_url: string;
  videoUrl?: string;
  visual_reinforcement_url?: string;
  visualReinforcementUrl?: string;
  support_text?: string;
  supportText?: string;
  practical_app?: string;
  practicalApp?: string;
  category?: string;
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  video_url: string;
  videoUrl?: string;
  quiz_data: any;
  quizData?: any;
  questions?: any;
}

function parseAxisId(axisId: string | number): number | 'todos' {
  if (axisId === 'todos' || !axisId) return 'todos';
  const slugMap: Record<string, number> = {
    'fundamentacao': 1,
    'imunologico-digestivo': 2,
    'rotulagem-tecnica': 3,
    'analise-critica': 4,
    'soberania-alimentar': 5,
    'producao-campo': 6
  };
  if (typeof axisId === 'string' && slugMap[axisId.toLowerCase()]) {
    return slugMap[axisId.toLowerCase()];
  }
  const num = Number(axisId);
  return isNaN(num) ? 'todos' : num;
}

function getLocalGlossaryFallback(parsedAxis: number | 'todos'): any[] {
  const result: any[] = [];
  librasGlossary.forEach((axis: any, index: number) => {
    const axisNum = axis.numericId || (index + 1);
    if (parsedAxis === 'todos' || parsedAxis === axisNum) {
      (axis.terms || []).forEach((t: any, termIdx: number) => {
        result.push({
          id: t.id || `local-term-${axisNum}-${termIdx + 1}`,
          term: t.term,
          axis_id: axisNum,
          definition: t.definition || t.description || '',
          description: t.description || t.definition || '',
          context: t.context || '',
          video_url: t.video_url || t.videoUrl || '',
          videoUrl: t.videoUrl || t.video_url || '',
          sign_strategy: t.sign_strategy || t.signStrategy || '',
          signStrategy: t.signStrategy || t.sign_strategy || '',
          tags: t.tags || [],
          eixoTitle: axis.title,
          eixoEmoji: axis.emoji
        });
      });
    }
  });
  return result;
}

export const librasService = {
  getGlossaryByAxis: async (axisId: string | number): Promise<any[]> => {
    const parsedAxis = parseAxisId(axisId);

    try {
      // Query Supabase with a 1500ms timeout to avoid blocking UI when offline/paused
      const fetchPromise = (async () => {
        let query = supabase.from('lissa_glossary').select('*').order('term', { ascending: true });
        if (parsedAxis !== 'todos') {
          query = query.eq('axis_id', parsedAxis);
        }
        return await query;
      })();

      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase request timeout")), 1500)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error || !data || data.length === 0) {
        if (error) console.warn("LibrasService: Usando base local (Supabase indisponível/vazio):", error?.message || error);
        return getLocalGlossaryFallback(parsedAxis);
      }

      return data.map((t: any) => ({
        ...t,
        description: t.definition || t.description,
        definition: t.definition || t.description,
        videoUrl: t.video_url || '',
        video_url: t.video_url || '',
        signStrategy: t.sign_strategy || t.signStrategy || '',
        sign_strategy: t.sign_strategy || t.signStrategy || '',
        tags: t.tags || [],
        eixoTitle: Number(t.axis_id) === 1 ? 'Fundamentação' :
                   Number(t.axis_id) === 2 ? 'Imunológico-Digestivo' :
                   Number(t.axis_id) === 3 ? 'Rotulagem Técnica' :
                   Number(t.axis_id) === 4 ? 'Análise Crítica' :
                   Number(t.axis_id) === 5 ? 'Soberania Alimentar' :
                   Number(t.axis_id) === 6 ? 'Produção e Segurança no Campo' :
                   'Conceito Técnico',
        eixoEmoji: Number(t.axis_id) === 1 ? '🤟' :
                   Number(t.axis_id) === 2 ? '🧬' :
                   Number(t.axis_id) === 3 ? '🏷️' :
                   Number(t.axis_id) === 4 ? '⚖️' :
                   Number(t.axis_id) === 5 ? '🌽' :
                   Number(t.axis_id) === 6 ? '🌱' :
                   '🔖'
      }));
    } catch (e: any) {
      console.warn("LibrasService: Exceção na busca remota, retornando termos locais:", e?.message || e);
      return getLocalGlossaryFallback(parsedAxis);
    }
  },

  async getMinutes(): Promise<any[]> {
    try {
      const fetchPromise = supabase.from('lissa_minutes').select('*').order('created_at');
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 1500)
      );
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      if (error || !data || data.length === 0) {
        return mockPills;
      }
      return data.map((m: any) => ({
        ...m,
        videoUrl: m.video_url || '',
        visualReinforcementUrl: m.visual_reinforcement_url || '',
        supportText: m.support_text || '',
        practicalApp: m.practical_app || ''
      }));
    } catch (e) {
      return mockPills;
    }
  },

  async getTracks(): Promise<any[]> {
    try {
      const fetchPromise = supabase.from('lissa_tracks').select('*').order('created_at');
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 1500)
      );
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      if (error || !data || data.length === 0) {
        return mockTracks;
      }
      return data.map((t: any) => ({
        ...t,
        videoUrl: t.video_url || '',
        quizData: t.quiz_data,
        questions: t.quiz_data
      }));
    } catch (e) {
      return mockTracks;
    }
  },

  async saveProgress(userId: string, contentId: string, contentType: string, score: number, completed: boolean) {
    try {
      const { error } = await supabase.from('user_learning_progress').upsert({
        user_id: userId,
        content_id: contentId,
        content_type: contentType,
        score,
        completed,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,content_id' });
      
      if (error) throw error;
    } catch (e) {
      console.warn("Progresso não pôde ser salvo remotamente:", e);
    }
  }
};
