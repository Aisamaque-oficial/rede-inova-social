import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/**
 * 🔒 ENDPOINT DE INTEGRAÇÃO - REDE PARTICIPA (REST API v1)
 * Este endpoint permite que a plataforma central Rede Participa consuma dados
 * agregados e sanitizados da Rede Inova Social de forma segura e em modo leitura.
 */

function validarChaveAcesso(request: NextRequest): boolean {
  const chaveEsperada = process.env.REDE_PARTICIPA_API_KEY || "rp_inova_sec_2026_x9k2m1";
  
  // 1. Tenta header customizado x-api-key
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey && xApiKey === chaveEsperada) return true;

  // 2. Tenta header Authorization: Bearer <TOKEN>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.replace("Bearer ", "").trim();
    if (bearerToken === chaveEsperada) return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  try {
    // 🛡️ 1. Validação de Autenticação Segura (Chave da API)
    if (!validarChaveAcesso(request)) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Não autorizado.",
          mensagem: "Chave de API inválida ou ausente. Forneça o header 'x-api-key' ou 'Authorization: Bearer <TOKEN>'."
        },
        { status: 401 }
      );
    }

    // 🔍 2. Extração dos parâmetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const tipo = (searchParams.get("tipo") || "todos").toLowerCase();
    const municipio = searchParams.get("municipio")?.toLowerCase().trim();
    const limiteRaw = parseInt(searchParams.get("limite") || "100", 10);
    const limite = Math.min(Math.max(limiteRaw, 1), 500);

    const dadosResposta: Record<string, any> = {};

    // 🧑‍🌾 3. Consulta de Produtores
    if (tipo === "todos" || tipo === "produtores") {
      let query = supabaseAdmin
        .from("infra_perfis")
        .select("id, nome_completo, nome_propriedade, cidade_slug, comunidade_distrito, ativo, created_at")
        .eq("tipo_perfil", "produtor")
        .order("created_at", { ascending: false })
        .limit(limite);

      if (municipio && municipio !== "todos") {
        query = query.eq("cidade_slug", municipio);
      }

      const { data: produtores, error: erroProdutores } = await query;

      if (erroProdutores) {
        console.error("Erro ao buscar produtores para API:", erroProdutores);
      }

      // Sanitização LGPD (Não expor e-mail pessoal ou senha)
      dadosResposta.produtores = (produtores || []).map(p => ({
        id_publico: p.id,
        nome_produtor: p.nome_completo,
        propriedade: p.nome_propriedade || "Não informada",
        municipio: p.cidade_slug,
        comunidade_distrito: p.comunidade_distrito || "Sede",
        status: p.ativo ? "ativo" : "inativo",
        cadastrado_em: p.created_at
      }));
    }

    // 🛒 4. Consulta de Lotes e Ofertas Comerciais
    if (tipo === "todos" || tipo === "ofertas") {
      let query = supabaseAdmin
        .from("infra_lotes_oferta")
        .select(`
          id,
          quantidade_disponivel,
          unidade_venda,
          preco_venda,
          pedido_minimo,
          status,
          created_at,
          produto_base:infra_produtos_base(nome, descricao),
          perfil:infra_perfis!inner(cidade_slug)
        `)
        .order("created_at", { ascending: false })
        .limit(limite);

      if (municipio && municipio !== "todos") {
        query = query.eq("perfil.cidade_slug", municipio);
      }

      const { data: ofertas, error: erroOfertas } = await query;

      if (erroOfertas) {
        console.error("Erro ao buscar ofertas para API:", erroOfertas);
      }

      dadosResposta.ofertas = (ofertas || []).map((o: any) => ({
        id_lote: o.id,
        produto: o.produto_base?.nome || "Produto Agrícola",
        descricao: o.produto_base?.descricao || "",
        quantidade_disponivel: o.quantidade_disponivel,
        unidade_venda: o.unidade_venda,
        preco_unitario: o.preco_venda,
        pedido_minimo: o.pedido_minimo,
        status: o.status,
        municipio: o.perfil?.cidade_slug || "não identificado",
        publicado_em: o.created_at
      }));
    }

    // 🌱 5. Consulta de Caderno de Campo / Estimativas de Safra
    if (tipo === "todos" || tipo === "producao") {
      const { data: producoes, error: erroProducao } = await supabaseAdmin
        .from("infra_registros_producao")
        .select(`
          id,
          quantidade_estimada,
          unidade_medida,
          status,
          data_inicio_ciclo,
          data_prevista_colheita,
          observacoes,
          created_at,
          produto_base:infra_produtos_base(nome),
          unidade_produtiva:infra_unidades_produtivas!inner(
            nome,
            tamanho_hectares,
            perfil:infra_perfis!inner(cidade_slug)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limite);

      if (erroProducao) {
        console.error("Erro ao buscar produções para API:", erroProducao);
      }

      let producoesFiltradas = producoes || [];
      if (municipio && municipio !== "todos") {
        producoesFiltradas = producoesFiltradas.filter(
          (item: any) => item.unidade_produtiva?.perfil?.cidade_slug === municipio
        );
      }

      dadosResposta.producao = producoesFiltradas.map((prod: any) => ({
        id_registro: prod.id,
        cultura: prod.produto_base?.nome || "Cultura Geral",
        unidade_manejo: prod.unidade_produtiva?.nome || "Talhão Principal",
        area_hectares: prod.unidade_produtiva?.tamanho_hectares || null,
        estimativa_volume: prod.quantidade_estimada,
        unidade_medida: prod.unidade_medida,
        status_ciclo: prod.status,
        inicio_ciclo: prod.data_inicio_ciclo,
        previsao_colheita: prod.data_prevista_colheita,
        municipio: prod.unidade_produtiva?.perfil?.cidade_slug || "regional"
      }));
    }

    // 📊 6. Métricas Consolidadas do Território
    if (tipo === "todos" || tipo === "metricas") {
      const { data: todosPerfis } = await supabaseAdmin
        .from("infra_perfis")
        .select("cidade_slug, tipo_perfil, ativo");

      const { data: todasOfertas } = await supabaseAdmin
        .from("infra_lotes_oferta")
        .select("status, perfil:infra_perfis!inner(cidade_slug)");

      const contagemPorCidade: Record<string, { produtores: number; secretarias: number; ofertasAtivas: number }> = {};

      (todosPerfis || []).forEach(p => {
        const cidade = p.cidade_slug || "geral";
        if (!contagemPorCidade[cidade]) {
          contagemPorCidade[cidade] = { produtores: 0, secretarias: 0, ofertasAtivas: 0 };
        }
        if (p.tipo_perfil === "produtor") contagemPorCidade[cidade].produtores += 1;
        if (p.tipo_perfil === "secretaria") contagemPorCidade[cidade].secretarias += 1;
      });

      (todasOfertas || []).forEach((o: any) => {
        const cidade = o.perfil?.cidade_slug || "geral";
        if (!contagemPorCidade[cidade]) {
          contagemPorCidade[cidade] = { produtores: 0, secretarias: 0, ofertasAtivas: 0 };
        }
        if (o.status === "ativo") contagemPorCidade[cidade].ofertasAtivas += 1;
      });

      dadosResposta.metricas_territoriais = {
        total_municipios_monitorados: Object.keys(contagemPorCidade).length,
        total_produtores_geral: (todosPerfis || []).filter(p => p.tipo_perfil === "produtor").length,
        total_ofertas_ativas_geral: (todasOfertas || []).filter((o: any) => o.status === "ativo").length,
        detalhamento_por_municipio: contagemPorCidade
      };
    }

    // 📦 7. Resposta Estruturada Final
    return NextResponse.json({
      sucesso: true,
      origem: "Rede Inova Social - Médio Sudoeste Baiano",
      projeto_vinculado: "Rede Participa",
      versao_api: "v1",
      timestamp: new Date().toISOString(),
      parametros_aplicados: {
        tipo,
        municipio: municipio || "todos",
        limite
      },
      dados: dadosResposta
    });

  } catch (erro: any) {
    console.error("Erro interno no endpoint de integração Rede Participa:", erro);
    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro interno no servidor ao processar a integração.",
        detalhes: erro?.message || "Consulte os logs do servidor."
      },
      { status: 500 }
    );
  }
}

// 🛡️ Bloquear métodos de alteração (Princípio do Read-Only)
export async function POST() {
  return NextResponse.json(
    { sucesso: false, erro: "Método não permitido. Este endpoint é estritamente de leitura (apenas GET)." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { sucesso: false, erro: "Método não permitido. Este endpoint é estritamente de leitura (apenas GET)." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { sucesso: false, erro: "Método não permitido. Este endpoint é estritamente de leitura (apenas GET)." },
    { status: 405 }
  );
}
