-- =====================================================================================
-- MIGRAÇÃO SUPABASE: SISTEMA DE ATRIBUIÇÕES E COMUNICAÇÃO INTERNA (TRELLO-STYLE)
-- =====================================================================================
-- Rode este script no Editor SQL do seu painel Supabase.

-- 1. TABELA PRINCIPAL: ATRIBUIÇÕES (Tarefas/Demandas)
CREATE TABLE IF NOT EXISTS public.atribuicoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL, -- ID original do sistema (ex: t-12345)
  setor TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  assigned_to_user_id TEXT, -- ID do responsável pela execução
  assigned_by_user_id TEXT, -- ID de quem criou/solicitou
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  prazo TIMESTAMPTZ,
  metadata JSONB, -- Para manter compatibilidade com o formato ProjectTask do frontend
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABELA DE COMENTÁRIOS E HISTÓRICO
CREATE TABLE IF NOT EXISTS public.comentarios_atribuicao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  atribuicao_id UUID REFERENCES public.atribuicoes(id) ON DELETE CASCADE,
  external_task_id TEXT NOT NULL, -- FK indireta para o sistema atual
  autor_id TEXT NOT NULL,
  autor_nome TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'comment', -- Valores esperados: 'comment', 'status_change', 'analysis', 'system'
  anexos JSONB,
  read_at TIMESTAMPTZ, -- Data de leitura, útil para notificações
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HABILITAR REALTIME
-- Isso permite que o cliente escute eventos via `supabase.channel()`
alter publication supabase_realtime add table public.atribuicoes;
alter publication supabase_realtime add table public.comentarios_atribuicao;

-- =====================================================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS DE ACESSO
-- =====================================================================================
-- O usuário solicitou que RLS não fique aberta no longo prazo.
-- Abaixo, definimos a política TEMPORÁRIA (Desenvolvimento) e deixamos 
-- documentada como ativar a política DEFINITIVA (Produção) quando o Auth for real.

-- Ativar RLS nas tabelas
ALTER TABLE public.atribuicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_atribuicao ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------------------
-- POLÍTICA TEMPORÁRIA DE DESENVOLVIMENTO (PERMISSIVA)
-- -------------------------------------------------------------------------------------
-- Como o sistema atual usa localStorage/Auth customizado, o Supabase não terá
-- acesso automático a auth.uid(). Permitiremos temporariamente todas as operações.
-- ATENÇÃO: Remova ou comente estas linhas antes de subir para produção!

CREATE POLICY "TEMPORARY_DEV_ALLOW_ALL_ATRIBUICOES" 
ON public.atribuicoes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "TEMPORARY_DEV_ALLOW_ALL_COMENTARIOS" 
ON public.comentarios_atribuicao FOR ALL USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------------------
-- POLÍTICA DEFINITIVA DE PRODUÇÃO (CÓDIGO COMENTADO PARA USO FUTURO)
-- -------------------------------------------------------------------------------------
/*
-- 1. Remover as políticas temporárias
DROP POLICY "TEMPORARY_DEV_ALLOW_ALL_ATRIBUICOES" ON public.atribuicoes;
DROP POLICY "TEMPORARY_DEV_ALLOW_ALL_COMENTARIOS" ON public.comentarios_atribuicao;

-- 2. Política de Atribuições:
--    Um usuário só pode ver/modificar se ele:
--    a) Foi quem criou (assigned_by_user_id)
--    b) É o responsável pela execução (assigned_to_user_id)
--    * Nota: Usuários admin/coordenação poderão precisar de uma regra que faça join
--            com uma tabela de perfis (ex: users.role == 'ADMIN').

CREATE POLICY "Users can see assignments they own or requested"
ON public.atribuicoes FOR SELECT
USING (
  assigned_to_user_id = auth.uid()::text OR 
  assigned_by_user_id = auth.uid()::text
);

CREATE POLICY "Users can create assignments"
ON public.atribuicoes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their assignments"
ON public.atribuicoes FOR UPDATE
USING (
  assigned_to_user_id = auth.uid()::text OR 
  assigned_by_user_id = auth.uid()::text
);

-- 3. Política de Comentários:
--    Só podem ser lidos/inseridos se o usuário tiver acesso à atribuição pai.
CREATE POLICY "Users can see comments of their assignments"
ON public.comentarios_atribuicao FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.atribuicoes a
    WHERE a.external_id = comentarios_atribuicao.external_task_id
    AND (a.assigned_to_user_id = auth.uid()::text OR a.assigned_by_user_id = auth.uid()::text)
  )
);

CREATE POLICY "Users can insert comments on their assignments"
ON public.comentarios_atribuicao FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.atribuicoes a
    WHERE a.external_id = external_task_id
    AND (a.assigned_to_user_id = auth.uid()::text OR a.assigned_by_user_id = auth.uid()::text)
  )
);
*/

-- =====================================================================================
-- FIM DA MIGRAÇÃO
-- =====================================================================================
