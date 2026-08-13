-- ==========================================
-- REDE INOVA SOCIAL - INFRAESTRUTURA DIGITAL TERRITORIAL
-- ==========================================

-- 1. CATÁLOGO GLOBAL (Gerenciado pela Administração)
CREATE TABLE public.infra_categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL, -- Ex: 'Mel e produtos das abelhas'
    descricao TEXT,
    icone VARCHAR,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.infra_produtos_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES public.infra_categorias(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL, -- Ex: 'Mel de abelha uruçu'
    unidade_medida_padrao VARCHAR, -- Ex: 'kg', 'litro', 'unidade'
    descricao TEXT,
    imagem_padrao_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.infra_selos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL, -- Ex: 'Agroecológico', 'Quilombola'
    descricao TEXT,
    tipo VARCHAR NOT NULL, -- 'certificacao_produto' ou 'caracteristica_produtor'
    icone_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. GESTÃO DE USUÁRIOS E PERFIS
CREATE TABLE public.infra_perfis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR UNIQUE NOT NULL,
    tipo_perfil VARCHAR NOT NULL, -- 'produtor', 'secretaria', 'ater', 'admin', 'comprador'
    nome_completo VARCHAR NOT NULL,
    nome_propriedade VARCHAR, -- Apenas para produtores
    telefone VARCHAR,
    cidade_slug VARCHAR NOT NULL, -- Ex: 'itapetinga'
    comunidade_distrito VARCHAR, -- Ex: 'Serra Pelada II'
    coordenadas JSONB, -- { lat, lng }
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Relação Produtor <-> Selos (Muitos para Muitos)
CREATE TABLE public.infra_perfil_selos (
    perfil_id UUID REFERENCES public.infra_perfis(id) ON DELETE CASCADE,
    selo_id UUID REFERENCES public.infra_selos(id) ON DELETE CASCADE,
    validado_por UUID REFERENCES public.infra_perfis(id), -- Quem aprovou (ex: Secretaria/Ater)
    data_validacao TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (perfil_id, selo_id)
);

-- 3. GESTÃO PRODUTIVA (Caderno de Campo)
CREATE TABLE public.infra_unidades_produtivas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES public.infra_perfis(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL, -- Ex: 'Apiário Principal', 'Roça de Mandioca 1'
    tamanho_hectares DECIMAL,
    coordenadas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.infra_registros_producao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unidade_produtiva_id UUID REFERENCES public.infra_unidades_produtivas(id) ON DELETE CASCADE,
    produto_base_id UUID REFERENCES public.infra_produtos_base(id) ON DELETE RESTRICT,
    quantidade_estimada DECIMAL NOT NULL,
    unidade_medida VARCHAR NOT NULL,
    data_inicio_ciclo DATE,
    data_prevista_colheita DATE,
    status VARCHAR DEFAULT 'em_andamento', -- 'em_andamento', 'colhido', 'perdido'
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. COMERCIALIZAÇÃO (Vitrine / Ofertas)
CREATE TABLE public.infra_lotes_oferta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID REFERENCES public.infra_perfis(id) ON DELETE CASCADE,
    registro_producao_id UUID REFERENCES public.infra_registros_producao(id) ON DELETE SET NULL, -- Opcional linkar diretamente à colheita
    produto_base_id UUID REFERENCES public.infra_produtos_base(id) ON DELETE RESTRICT,
    quantidade_disponivel DECIMAL NOT NULL,
    unidade_venda VARCHAR NOT NULL,
    preco_venda DECIMAL NOT NULL,
    pedido_minimo DECIMAL DEFAULT 1,
    data_validade DATE,
    fotos_url TEXT[], -- Array de URLs
    formas_entrega VARCHAR[], -- Ex: ['retirada_local', 'entrega_cidade']
    status VARCHAR DEFAULT 'ativo', -- 'ativo', 'esgotado', 'pausado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. INTERAÇÕES E VENDAS
CREATE TABLE public.infra_pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comprador_id UUID REFERENCES public.infra_perfis(id) ON DELETE SET NULL, -- Se o comprador for registrado
    nome_comprador VARCHAR, -- Para compradores não registrados
    telefone_comprador VARCHAR,
    lote_id UUID REFERENCES public.infra_lotes_oferta(id) ON DELETE RESTRICT,
    quantidade DECIMAL NOT NULL,
    valor_total DECIMAL NOT NULL,
    status VARCHAR DEFAULT 'pendente', -- 'pendente', 'confirmado', 'concluido', 'cancelado'
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
