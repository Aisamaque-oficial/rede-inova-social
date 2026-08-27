-- ==========================================
-- SCRIPT DE SEED (DADOS INICIAIS DE TESTE) - VERSÃO SIMPLIFICADA (SEM BLOCOS DECLARE)
-- ==========================================
-- Rode isso no SQL Editor do Supabase logo APÓS rodar o schema_infraestrutura.sql

-- 1. Inserir Categorias Globais
INSERT INTO public.infra_categorias (id, nome, icone, ordem) VALUES 
('11111111-1111-1111-1111-111111111111', 'Grãos, cereais e leguminosas', 'Wheat', 1),
('22222222-2222-2222-2222-222222222222', 'Raízes, tubérculos e derivados', 'Leaf', 2),
('33333333-3333-3333-3333-333333333333', 'Hortaliças e verduras', 'Carrot', 3),
('44444444-4444-4444-4444-444444444444', 'Frutas', 'Apple', 4),
('55555555-5555-5555-5555-555555555555', 'Café, cacau e derivados', 'Coffee', 5),
('66666666-6666-6666-6666-666666666666', 'Mel e produtos das abelhas', 'Hexagon', 6),
('77777777-7777-7777-7777-777777777777', 'Leite e derivados', 'Milk', 7),
('88888888-8888-8888-8888-888888888888', 'Ovos e origem animal', 'Egg', 8),
('99999999-9999-9999-9999-999999999999', 'Carnes e derivados', 'Beef', 9),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Polpas, sucos e bebidas', 'Droplets', 10);

-- 2. Inserir Produtos Base
INSERT INTO public.infra_produtos_base (id, categoria_id, nome, unidade_medida_padrao, imagem_padrao_url) 
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Chocolate Artesanal (70% Cacau)', 'barra', '🍫');

INSERT INTO public.infra_produtos_base (id, categoria_id, nome, unidade_medida_padrao, imagem_padrao_url) 
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Licor de Jenipapo', 'garrafa', '🍾');

INSERT INTO public.infra_produtos_base (id, categoria_id, nome, unidade_medida_padrao, imagem_padrao_url) 
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Alface Crespa Orgânica', 'pé', '🥬');

-- 3. Inserir Perfil do Produtor de Teste (Caatiba)
INSERT INTO public.infra_perfis (id, user_email, tipo_perfil, nome_completo, nome_propriedade, telefone, cidade_slug, comunidade_distrito)
VALUES ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'produtor.caatiba@teste.com', 'produtor', 'Associação Serra Pelada II', 'Sítio Esperança', '5577991726710', 'caatiba', 'Serra Pelada II');

-- 4. Inserir Selo de Teste
INSERT INTO public.infra_selos (id, nome, tipo) VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Agricultura Familiar', 'caracteristica_produtor');

-- Vincular Selo ao Produtor
INSERT INTO public.infra_perfil_selos (perfil_id, selo_id, data_validacao)
VALUES ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW());

-- 5. Inserir Unidades Produtivas (Caderno de Campo)
INSERT INTO public.infra_unidades_produtivas (id, perfil_id, nome, tamanho_hectares)
VALUES ('10000000-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Agroindústria Familiar (Mata)', NULL);

INSERT INTO public.infra_unidades_produtivas (id, perfil_id, nome, tamanho_hectares)
VALUES ('10000000-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Pomar de Jenipapo', 1.0);

-- 6. Inserir Registros de Produção (O que ele está produzindo agora)
INSERT INTO public.infra_registros_producao (id, unidade_produtiva_id, produto_base_id, quantidade_estimada, unidade_medida, status, observacoes)
VALUES ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 200, 'barras', 'em_andamento', 'Produzido com amêndoas selecionadas');

INSERT INTO public.infra_registros_producao (id, unidade_produtiva_id, produto_base_id, quantidade_estimada, unidade_medida, status, observacoes)
VALUES ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 150, 'garrafas', 'em_andamento', 'Receita tradicional');

-- 7. Inserir Ofertas na Vitrine (O que ele colocou à venda)
INSERT INTO public.infra_lotes_oferta (id, perfil_id, registro_producao_id, produto_base_id, quantidade_disponivel, unidade_venda, preco_venda, status)
VALUES ('30000000-0000-0000-0000-000000000001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '20000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50, 'barra', 15.00, 'ativo');

INSERT INTO public.infra_lotes_oferta (id, perfil_id, registro_producao_id, produto_base_id, quantidade_disponivel, unidade_venda, preco_venda, status)
VALUES ('30000000-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '20000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 30, 'garrafa', 25.50, 'ativo');

-- Comando final para evitar erro de parser no Supabase
SELECT 'Seed inserido com sucesso!' as resultado;


