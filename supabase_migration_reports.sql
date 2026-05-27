-- =====================================================================================
-- MIGRAÇÃO SUPABASE: SISTEMA DE RELATÓRIOS SETORIAIS
-- =====================================================================================
-- Rode este script no Editor SQL do seu painel Supabase para criar a tabela necessária.

-- 1. CRIAR TABELA: RELATÓRIOS SETORIAIS
CREATE TABLE IF NOT EXISTS public.relatorios_setoriais (
  id TEXT PRIMARY KEY, -- Usamos o ID gerado pelo frontend (report-12345...)
  sector_id TEXT NOT NULL,
  sector_sigla TEXT,
  sector_name TEXT,
  report_scope TEXT DEFAULT 'individual',
  period_type TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  content TEXT,
  member_activities JSONB DEFAULT '[]'::jsonb,
  signed_by TEXT,
  signed_by_cargo TEXT,
  signed_at TIMESTAMPTZ,
  signature_seal TEXT,
  status TEXT DEFAULT 'rascunho',
  sent_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  archived_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB -- Backup completo do objeto para resiliência
);

-- 1.1 PERMISSÕES EXPLÍCITAS (Novo padrão Supabase)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.relatorios_setoriais TO anon, authenticated, service_role;

-- 2. HABILITAR REALTIME
-- Isso permite que a Coordenação Geral veja os relatórios aparecendo na hora
alter publication supabase_realtime add table public.relatorios_setoriais;

-- 3. HABILITAR RLS (Row Level Security)
ALTER TABLE public.relatorios_setoriais ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICA TEMPORÁRIA DE DESENVOLVIMENTO (PERMISSIVA)
-- Permite leitura e escrita para todos enquanto o sistema de Auth Supabase não é integrado
CREATE POLICY "TEMPORARY_DEV_ALLOW_ALL_REPORTS" 
ON public.relatorios_setoriais FOR ALL USING (true) WITH CHECK (true);

-- 5. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reports_sector ON public.relatorios_setoriais(sector_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.relatorios_setoriais(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.relatorios_setoriais(created_at DESC);
