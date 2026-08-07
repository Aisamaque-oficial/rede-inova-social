-- Script de Criação das Tabelas para o Módulo Comércio Local
-- Rode este script no Editor SQL do seu painel do Supabase.

-- 1. Tabela de Perfis do Comércio (comercio_perfis)
-- Usada para identificar Produtores Familiares e Secretarias
CREATE TABLE IF NOT EXISTS public.comercio_perfis (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email text NOT NULL UNIQUE,
    nome text NOT NULL,
    telefone text NOT NULL,
    cidade_slug text NOT NULL,
    tipo text NOT NULL CHECK (tipo IN ('produtor', 'secretaria')),
    senha_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Tabela de Produtos (comercio_produtos)
CREATE TABLE IF NOT EXISTS public.comercio_produtos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    produtor_id uuid REFERENCES public.comercio_perfis(id) ON DELETE CASCADE,
    cidade_slug text NOT NULL,
    nome text NOT NULL,
    descricao text,
    preco numeric(10, 2) NOT NULL,
    unidade text NOT NULL DEFAULT 'un',
    imagem_url text,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Tabela de Interesses/Pedidos (comercio_cliques)
CREATE TABLE IF NOT EXISTS public.comercio_cliques (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    produto_id uuid REFERENCES public.comercio_produtos(id) ON DELETE CASCADE,
    produtor_id uuid REFERENCES public.comercio_perfis(id) ON DELETE CASCADE,
    cidade_slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comercio_produtos_cidade ON public.comercio_produtos(cidade_slug);
CREATE INDEX IF NOT EXISTS idx_comercio_produtos_produtor ON public.comercio_produtos(produtor_id);
CREATE INDEX IF NOT EXISTS idx_comercio_perfis_cidade ON public.comercio_perfis(cidade_slug);

-- RLS
ALTER TABLE public.comercio_perfis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comercio_produtos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comercio_cliques DISABLE ROW LEVEL SECURITY;
