-- ==========================================
-- REDE INOVA SOCIAL - REGRAS DE SEGURANÇA (RLS)
-- ==========================================

-- 1. Ativar RLS em todas as tabelas
ALTER TABLE public.infra_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_produtos_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_selos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_perfil_selos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_unidades_produtivas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_registros_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_lotes_oferta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infra_pedidos ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de Leitura Pública (Vitrine e Catálogo)
-- Qualquer pessoa (mesmo sem login) pode ler categorias e produtos base
CREATE POLICY "Leitura pública de categorias" ON public.infra_categorias FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos base" ON public.infra_produtos_base FOR SELECT USING (true);
CREATE POLICY "Leitura pública de selos" ON public.infra_selos FOR SELECT USING (true);

-- Apenas produtores ativos e ofertas ativas devem ser públicas
CREATE POLICY "Leitura pública de perfis ativos" ON public.infra_perfis FOR SELECT USING (ativo = true);
CREATE POLICY "Leitura pública de ofertas ativas" ON public.infra_lotes_oferta FOR SELECT USING (status = 'ativo' OR auth.uid() = perfil_id);
CREATE POLICY "Leitura pública de unidades (necessário p/ vitrine)" ON public.infra_unidades_produtivas FOR SELECT USING (true);

-- 3. Políticas de Produtor (Dono dos dados)
-- O produtor só pode ver/editar suas próprias unidades, registros e lotes.
CREATE POLICY "Produtor gerencia suas unidades" ON public.infra_unidades_produtivas
    FOR ALL USING (auth.uid() = perfil_id);

CREATE POLICY "Produtor gerencia seus registros de produção" ON public.infra_registros_producao
    FOR ALL USING (
        unidade_produtiva_id IN (SELECT id FROM public.infra_unidades_produtivas WHERE perfil_id = auth.uid())
    );

CREATE POLICY "Produtor gerencia seus lotes de oferta" ON public.infra_lotes_oferta
    FOR ALL USING (auth.uid() = perfil_id);

-- O produtor pode atualizar seu próprio perfil
CREATE POLICY "Produtor edita próprio perfil" ON public.infra_perfis
    FOR UPDATE USING (auth.uid() = id);

-- NOTA: O backend usará a chave secreta (service_role) para criar novos usuários e perfis, ignorando essas regras.
