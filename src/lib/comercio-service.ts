import { supabase } from "./supabase";

export interface ComercioPerfil {
  id: string;
  user_email: string;
  nome: string;
  telefone: string;
  cidade_slug: string;
  tipo: 'produtor' | 'secretaria';
  senha_hash?: string;
  created_at?: string;
}

export interface ComercioProduto {
  id?: string;
  produtor_id: string;
  cidade_slug: string;
  nome: string;
  descricao?: string;
  preco: number;
  unidade: string;
  imagem_url?: string;
  ativo?: boolean;
  created_at?: string;
}

export const comercioService = {
  // Autenticação mockada/simples (Para MVP sem auth complexa via Supabase Auth)
  async login(email: string, senha_plana: string): Promise<{ sucesso: boolean; perfil?: ComercioPerfil; mensagem?: string }> {
    // MOCK PARA APRESENTAÇÃO SIMPECAL
    if (email === 'produtor@teste.com' && senha_plana === '123456') {
      return {
        sucesso: true,
        perfil: {
          id: 'mock-prod-1',
          user_email: 'produtor@teste.com',
          nome: 'Associação de Serra Pelada II',
          telefone: '77988889999',
          cidade_slug: 'caatiba',
          tipo: 'produtor'
        }
      };
    }

    try {
      const { data, error } = await supabase
        .from('comercio_perfis')
        .select('*')
        .eq('user_email', email)
        .single();
      
      if (error || !data) {
        return { sucesso: false, mensagem: "Usuário não encontrado." };
      }
      
      if (data.senha_hash !== senha_plana) {
         return { sucesso: false, mensagem: "Senha incorreta." };
      }
      
      return { sucesso: true, perfil: data as ComercioPerfil };
    } catch (e) {
      console.error("Erro no login do comércio:", e);
      return { sucesso: false, mensagem: "Erro interno no servidor." };
    }
  },

  async registrar(perfil: Omit<ComercioPerfil, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase.from('comercio_perfis').insert([perfil]);
    if (error) {
        console.error("Erro ao registrar:", error);
        return false;
    }
    return true;
  },

  // Produtos
  async getProdutosPorProdutor(produtorId: string): Promise<ComercioProduto[]> {
    // MOCK PARA APRESENTAÇÃO SIMPECAL
    if (produtorId === 'mock-prod-1') {
      return [
        {
          id: 'mock-1',
          produtor_id: 'mock-prod-1',
          cidade_slug: 'caatiba',
          nome: 'Chocolate Artesanal (70% Cacau)',
          descricao: 'Delicioso chocolate artesanal produzido pelas famílias do distrito de Serra Pelada II.',
          preco: 15.00,
          unidade: 'barra',
          imagem_url: '',
          ativo: true
        },
        {
          id: 'mock-2',
          produtor_id: 'mock-prod-1',
          cidade_slug: 'caatiba',
          nome: 'Licor de Jenipapo',
          descricao: 'Licor tradicional produzido com frutos selecionados da região de Serra Pelada II.',
          preco: 25.50,
          unidade: 'garrafa',
          imagem_url: '',
          ativo: true
        }
      ];
    }

    const { data, error } = await supabase
      .from('comercio_produtos')
      .select('*')
      .eq('produtor_id', produtorId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data as ComercioProduto[];
  },

  async getProdutosPorCidade(cidadeSlug: string): Promise<(ComercioProduto & { comercio_perfis: { nome: string; telefone: string } })[]> {
    const { data, error } = await supabase
      .from('comercio_produtos')
      .select('*, comercio_perfis(nome, telefone)')
      .eq('cidade_slug', cidadeSlug)
      .eq('ativo', true)
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Erro ao buscar produtos da vitrine", error);
        return [];
    }
    return data as any[];
  },

  async adicionarProduto(produto: ComercioProduto): Promise<boolean> {
    const { error } = await supabase.from('comercio_produtos').insert([produto]);
    if (error) {
        console.error("Erro ao adicionar produto:", error);
        return false;
    }
    return true;
  },

  async atualizarProduto(id: string, updates: Partial<ComercioProduto>): Promise<boolean> {
    const { error } = await supabase.from('comercio_produtos').update(updates).eq('id', id);
    return !error;
  },

  async deletarProduto(id: string): Promise<boolean> {
    const { error } = await supabase.from('comercio_produtos').delete().eq('id', id);
    return !error;
  },

  // Métricas
  async registrarClique(produtoId: string, produtorId: string, cidadeSlug: string): Promise<void> {
    await supabase.from('comercio_cliques').insert([{
        produto_id: produtoId,
        produtor_id: produtorId,
        cidade_slug: cidadeSlug
    }]);
  },

  async getMetricasSecretaria(cidadeSlug: string) {
    // Para simplificar, buscamos produtores e cliques da cidade
    const { data: produtores } = await supabase
        .from('comercio_perfis')
        .select('*')
        .eq('cidade_slug', cidadeSlug)
        .eq('tipo', 'produtor');
        
    const { data: cliques } = await supabase
        .from('comercio_cliques')
        .select('*')
        .eq('cidade_slug', cidadeSlug);
        
    const { data: produtos } = await supabase
        .from('comercio_produtos')
        .select('*')
        .eq('cidade_slug', cidadeSlug)
        .eq('ativo', true);
        
    return {
        totalProdutores: produtores?.length || 0,
        totalProdutosAtivos: produtos?.length || 0,
        totalCliques: cliques?.length || 0
    };
  }
};
