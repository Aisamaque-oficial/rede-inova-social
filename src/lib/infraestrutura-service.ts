import { supabase } from "./supabase";

// Tipagens baseadas no schema_infraestrutura.sql

export interface InfraCategoria {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  ordem: number;
}

export interface InfraProdutoBase {
  id: string;
  categoria_id: string;
  nome: string;
  unidade_medida_padrao: string;
  descricao?: string;
  imagem_padrao_url?: string;
}

export interface InfraSelo {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'certificacao_produto' | 'caracteristica_produtor';
  icone_url?: string;
}

export interface InfraUnidadeProdutiva {
  id: string;
  perfil_id: string;
  nome: string; // Ex: 'Apiário Principal'
  tamanho_hectares?: number;
  coordenadas?: any;
  created_at?: string;
}

export interface InfraRegistroProducao {
  id: string;
  unidade_produtiva_id: string;
  produto_base_id: string;
  quantidade_estimada: number;
  unidade_medida: string;
  data_inicio_ciclo?: string;
  data_prevista_colheita?: string;
  status: 'em_andamento' | 'colhido' | 'perdido';
  observacoes?: string;
  created_at?: string;
  // Joins
  produto_base?: InfraProdutoBase;
  unidade_produtiva?: InfraUnidadeProdutiva;
}

export interface InfraLoteOferta {
  id: string;
  perfil_id: string;
  registro_producao_id?: string;
  produto_base_id: string;
  quantidade_disponivel: number;
  unidade_venda: string;
  preco_venda: number;
  pedido_minimo: number;
  data_validade?: string;
  fotos_url?: string[];
  formas_entrega?: string[];
  status: 'ativo' | 'esgotado' | 'pausado';
  created_at?: string;
  // Joins
  produto_base?: InfraProdutoBase;
}

export const infraestruturaService = {

  // ==========================================
  // GESTÃO PRODUTIVA (CADERNO DE CAMPO)
  // ==========================================

  async getUnidadesProdutivas(perfilId: string): Promise<InfraUnidadeProdutiva[]> {
    const { data, error } = await supabase
      .from('infra_unidades_produtivas')
      .select('*')
      .eq('perfil_id', perfilId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar unidades produtivas:", error);
      return [];
    }
    return data as InfraUnidadeProdutiva[];
  },

  async addUnidadeProdutiva(unidade: Omit<InfraUnidadeProdutiva, 'id' | 'created_at'>): Promise<InfraUnidadeProdutiva | null> {
    const { data, error } = await supabase
      .from('infra_unidades_produtivas')
      .insert([unidade])
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao adicionar unidade:", error);
      return null;
    }
    return data as InfraUnidadeProdutiva;
  },

  async getRegistrosProducao(perfilId: string): Promise<InfraRegistroProducao[]> {
    // Retorna todos os registros vinculados às unidades produtivas deste perfil
    const { data, error } = await supabase
      .from('infra_registros_producao')
      .select(`
        *,
        produto_base:infra_produtos_base(*),
        unidade_produtiva:infra_unidades_produtivas!inner(*)
      `)
      .eq('unidade_produtiva.perfil_id', perfilId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar caderno de campo:", error);
      return [];
    }
    return data as InfraRegistroProducao[];
  },

  async addRegistroProducao(registro: Omit<InfraRegistroProducao, 'id' | 'created_at' | 'produto_base' | 'unidade_produtiva'>): Promise<boolean> {
    const { error } = await supabase.from('infra_registros_producao').insert([registro]);
    return !error;
  },

  // ==========================================
  // COMERCIALIZAÇÃO (VITRINE)
  // ==========================================

  async getLotes(perfilId: string): Promise<InfraLoteOferta[]> {
    const { data, error } = await supabase
      .from('infra_lotes_oferta')
      .select('*, produto_base:infra_produtos_base(*)')
      .eq('perfil_id', perfilId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar lotes de oferta:", error);
      return [];
    }
    return data as InfraLoteOferta[];
  },

  async addLote(lote: Omit<InfraLoteOferta, 'id' | 'created_at' | 'produto_base'>): Promise<boolean> {
    const { error } = await supabase.from('infra_lotes_oferta').insert([lote]);
    return !error;
  },

  async updateLote(id: string, updates: Partial<InfraLoteOferta>): Promise<boolean> {
    const { error } = await supabase.from('infra_lotes_oferta').update(updates).eq('id', id);
    if (error) {
      console.error("Erro ao atualizar lote:", error);
    }
    return !error;
  },

  // ==========================================
  // CATÁLOGO GLOBAL
  // ==========================================

  async getCategorias(): Promise<InfraCategoria[]> {
    const { data, error } = await supabase.from('infra_categorias').select('*').order('ordem', { ascending: true });
    return error ? [] : (data as InfraCategoria[]);
  },

  async getVitrineLotes(cidadeSlug: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('infra_lotes_oferta')
      .select(`
        *,
        produto_base:infra_produtos_base(*),
        perfil:infra_perfis!inner(*)
      `)
      .eq('status', 'ativo')
      .eq('perfil.cidade_slug', cidadeSlug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar lotes da vitrine:", error);
      return [];
    }
    return data;
  },

  async getProdutosBasePorCategoria(categoriaId: string): Promise<InfraProdutoBase[]> {
    const { data, error } = await supabase
      .from('infra_produtos_base')
      .select('*')
      .eq('categoria_id', categoriaId)
      .order('nome', { ascending: true });
    return error ? [] : (data as InfraProdutoBase[]);
  },

  async getMetricasSecretaria(cidadeSlug: string) {
    const { data: produtores } = await supabase
        .from('infra_perfis')
        .select('*')
        .eq('cidade_slug', cidadeSlug)
        .eq('tipo_perfil', 'produtor');
        
    const { data: produtos } = await supabase
        .from('infra_lotes_oferta')
        .select('*, perfil:infra_perfis!inner(*)')
        .eq('perfil.cidade_slug', cidadeSlug)
        .eq('status', 'ativo');
        
    return {
        totalProdutores: produtores?.length || 0,
        totalProdutosAtivos: produtos?.length || 0,
        totalCliques: 0 // Simplificado para MVP
    };
  }
};
