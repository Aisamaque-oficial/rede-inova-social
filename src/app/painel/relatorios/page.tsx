"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  FileSpreadsheet, 
  Database, 
  Store, 
  Sprout, 
  Users, 
  Filter, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const MUNICIPIOS_MEDIO_SUDOESTE = [
  { slug: "todos", nome: "Todos os Municípios (Consolidado)" },
  { slug: "caatiba", nome: "Caatiba" },
  { slug: "itapetinga", nome: "Itapetinga" },
  { slug: "macarani", nome: "Macarani" },
  { slug: "maiquinique", nome: "Maiquinique" },
  { slug: "itambe", nome: "Itambé" },
  { slug: "encruzilhada", nome: "Encruzilhada" },
  { slug: "ribeirao-do-largo", nome: "Ribeirão do Largo" },
  { slug: "itarantim", nome: "Itarantim" },
  { slug: "potiragua", nome: "Potiraguá" },
  { slug: "firmino-alves", nome: "Firmino Alves" },
  { slug: "ibicui", nome: "Ibicuí" },
  { slug: "iguai", nome: "Iguaí" },
  { slug: "nova-canaa", nome: "Nova Canaã" },
];

export default function ExportacaoRelatoriosPage() {
  const [municipioFiltro, setMunicipioFiltro] = useState("todos");
  const [produtores, setProdutores] = useState<any[]>([]);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [producao, setProducao] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaPrevia, setAbaPrevia] = useState<"produtores" | "producao" | "ofertas">("produtores");
  const [copiadoUrl, setCopiadoUrl] = useState(false);
  const [copiadoKey, setCopiadoKey] = useState(false);

  const apiKeyExibida = "rp_inova_sec_2026_x9k2m1";
  const [endpointUrl, setEndpointUrl] = useState("/api/v1/integracao/rede-participa");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEndpointUrl(`${window.location.origin}/api/v1/integracao/rede-participa`);
    }
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // 1. Produtores
      let qProdutores = supabase
        .from("infra_perfis")
        .select("id, nome_completo, nome_propriedade, cidade_slug, comunidade_distrito, telefone, ativo, created_at")
        .eq("tipo_perfil", "produtor")
        .order("created_at", { ascending: false });

      if (municipioFiltro !== "todos") {
        qProdutores = qProdutores.eq("cidade_slug", municipioFiltro);
      }
      const { data: dataProd } = await qProdutores;
      setProdutores(dataProd || []);

      // 2. Ofertas
      let qOfertas = supabase
        .from("infra_lotes_oferta")
        .select(`
          id, quantidade_disponivel, unidade_venda, preco_venda, pedido_minimo, status, created_at,
          produto_base:infra_produtos_base(nome),
          perfil:infra_perfis!inner(nome_completo, cidade_slug)
        `)
        .order("created_at", { ascending: false });

      if (municipioFiltro !== "todos") {
        qOfertas = qOfertas.eq("perfil.cidade_slug", municipioFiltro);
      }
      const { data: dataOf } = await qOfertas;
      setOfertas(dataOf || []);

      // 3. Caderno de Campo / Produção
      let qProducao = supabase
        .from("infra_registros_producao")
        .select(`
          id, quantidade_estimada, unidade_medida, status, data_inicio_ciclo, data_prevista_colheita, observacoes, created_at,
          produto_base:infra_produtos_base(nome),
          unidade_produtiva:infra_unidades_produtivas!inner(
            nome, tamanho_hectares,
            perfil:infra_perfis!inner(nome_completo, cidade_slug)
          )
        `)
        .order("created_at", { ascending: false });

      const { data: dataProdReg } = await qProducao;
      let regFiltrados = dataProdReg || [];
      if (municipioFiltro !== "todos") {
        regFiltrados = regFiltrados.filter(
          (r: any) => r.unidade_produtiva?.perfil?.cidade_slug === municipioFiltro
        );
      }
      setProducao(regFiltrados);

    } catch (erro) {
      console.error("Erro ao carregar dados para relatório:", erro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [municipioFiltro]);

  // Função auxiliar para baixar CSV formatado com BOM (Compatível 100% com Excel)
  const baixarCsv = (nomeArquivo: string, cabecalhos: string[], linhas: (string | number)[][]) => {
    const separador = ";";
    const conteudoLinhas = linhas.map(linha => 
      linha.map(val => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(separador)
    );

    const csvContent = "\uFEFF" + [cabecalhos.join(separador), ...conteudoLinhas].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${nomeArquivo}_${municipioFiltro}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportadores Específicos
  const exportarProdutores = () => {
    const headers = ["ID", "Nome do Produtor", "Propriedade", "Município", "Distrito/Comunidade", "Telefone", "Status", "Data de Cadastro"];
    const rows = produtores.map(p => [
      p.id,
      p.nome_completo,
      p.nome_propriedade || "-",
      p.cidade_slug?.toUpperCase(),
      p.comunidade_distrito || "Sede",
      p.telefone || "-",
      p.ativo ? "Ativo" : "Inativo",
      p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "-"
    ]);
    baixarCsv("relatorio_produtores_rede_inova", headers, rows);
  };

  const exportarProducao = () => {
    const headers = ["ID Registro", "Cultura / Produto", "Produtor", "Município", "Unidade / Talhão", "Área (ha)", "Volume Estimado", "Unidade", "Status", "Previsão Colheita"];
    const rows = producao.map((pr: any) => [
      pr.id,
      pr.produto_base?.nome || "Cultura Geral",
      pr.unidade_produtiva?.perfil?.nome_completo || "-",
      pr.unidade_produtiva?.perfil?.cidade_slug?.toUpperCase() || "-",
      pr.unidade_produtiva?.nome || "-",
      pr.unidade_produtiva?.tamanho_hectares || "-",
      pr.quantidade_estimada,
      pr.unidade_medida,
      pr.status,
      pr.data_prevista_colheita ? new Date(pr.data_prevista_colheita).toLocaleDateString("pt-BR") : "-"
    ]);
    baixarCsv("relatorio_caderno_campo_producao", headers, rows);
  };

  const exportarOfertas = () => {
    const headers = ["ID Lote", "Produto", "Produtor", "Município", "Quantidade Disponível", "Unidade", "Preço Unitário (R$)", "Pedido Mínimo", "Status", "Publicado Em"];
    const rows = ofertas.map((o: any) => [
      o.id,
      o.produto_base?.nome || "-",
      o.perfil?.nome_completo || "-",
      o.perfil?.cidade_slug?.toUpperCase() || "-",
      o.quantidade_disponivel,
      o.unidade_venda,
      o.preco_venda?.toFixed(2) || "0.00",
      o.pedido_minimo,
      o.status,
      o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"
    ]);
    baixarCsv("relatorio_ofertas_vitrine", headers, rows);
  };

  const exportarConsolidado = () => {
    exportarProdutores();
    setTimeout(() => exportarProducao(), 500);
    setTimeout(() => exportarOfertas(), 1000);
  };

  const copiarTexto = (texto: string, tipo: "url" | "key") => {
    navigator.clipboard.writeText(texto);
    if (tipo === "url") {
      setCopiadoUrl(true);
      setTimeout(() => setCopiadoUrl(false), 2000);
    } else {
      setCopiadoKey(true);
      setTimeout(() => setCopiadoKey(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Painel Estratégico
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Interoperabilidade & Auditoria
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Exportação de Relatórios & Integração
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Gere dados analíticos em planilhas e gerencie a conexão segura de dados com a Rede Participa.
          </p>
        </div>

        {/* Filtro de Município */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={municipioFiltro}
            onChange={(e) => setMunicipioFiltro(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-4"
          >
            {MUNICIPIOS_MEDIO_SUDOESTE.map(m => (
              <option key={m.slug} value={m.slug}>{m.nome}</option>
            ))}
          </select>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={carregarDados}
            title="Recarregar Dados"
            className="rounded-xl text-slate-500 hover:text-primary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Grid de Cards de Exportação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Produtores */}
        <Card className="rounded-3xl border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
              Produtores Rurais
            </CardTitle>
            <CardDescription className="text-xs">
              Cadastros das famílias agricultoras e propriedades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-black text-slate-900">
              {loading ? "..." : produtores.length} <span className="text-xs text-slate-400 font-bold uppercase">Cadastrados</span>
            </div>
            <Button 
              onClick={exportarProdutores} 
              disabled={loading || produtores.length === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider gap-2 py-5"
            >
              <Download className="w-4 h-4" /> Baixar Planilha CSV
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Produção */}
        <Card className="rounded-3xl border-slate-200 hover:border-emerald-500/40 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
              <Sprout className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
              Caderno de Campo
            </CardTitle>
            <CardDescription className="text-xs">
              Manejo, volumes estimados e safras previstas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-black text-slate-900">
              {loading ? "..." : producao.length} <span className="text-xs text-slate-400 font-bold uppercase">Registros</span>
            </div>
            <Button 
              onClick={exportarProducao} 
              disabled={loading || producao.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider gap-2 py-5"
            >
              <Download className="w-4 h-4" /> Baixar Planilha CSV
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Ofertas */}
        <Card className="rounded-3xl border-slate-200 hover:border-amber-500/40 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
              <Store className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
              Vitrine & Ofertas
            </CardTitle>
            <CardDescription className="text-xs">
              Lotes disponíveis para comercialização e preços.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-black text-slate-900">
              {loading ? "..." : ofertas.length} <span className="text-xs text-slate-400 font-bold uppercase">Lotes Ofertados</span>
            </div>
            <Button 
              onClick={exportarOfertas} 
              disabled={loading || ofertas.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider gap-2 py-5"
            >
              <Download className="w-4 h-4" /> Baixar Planilha CSV
            </Button>
          </CardContent>
        </Card>

        {/* Card 4: Consolidado */}
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-transparent hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
              Pacote Consolidado
            </CardTitle>
            <CardDescription className="text-xs">
              Baixe todas as bases de dados em sequência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-black text-primary">
              Dataset Completo
            </div>
            <Button 
              onClick={exportarConsolidado} 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider gap-2 py-5 shadow-md shadow-primary/20"
            >
              <Download className="w-4 h-4" /> Exportar Tudo (.CSV)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção 2: Integração Segura com a Rede Participa */}
      <Card className="rounded-[2.5rem] border-primary/20 bg-slate-900 text-white overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  Integração Oficial com a Rede Participa
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    API REST v1 ATIVA
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">
                  Ponto de conexão para os desenvolvedores da plataforma Rede Participa consumirem dados em tempo real.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                🔒 Permissão: Read-Only (Apenas Leitura)
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Endpoint */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Endpoint da API (URL Base)
              </label>
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-xs text-emerald-400">
                <span className="truncate mr-2">{endpointUrl}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copiarTexto(endpointUrl, "url")}
                  className="text-slate-300 hover:text-white shrink-0"
                >
                  {copiadoUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Chave de API */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Chave de Acesso (x-api-key)
              </label>
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-xs text-amber-400">
                <span className="truncate mr-2">{apiKeyExibida}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copiarTexto(apiKeyExibida, "key")}
                  className="text-slate-300 hover:text-white shrink-0"
                >
                  {copiadoKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">Pronto para repassar aos desenvolvedores da Rede Participa?</p>
              <p className="text-slate-400">
                Criamos um tutorial técnico completo com exemplos em cURL, JavaScript e Python, dicionário de dados e código de erros.
              </p>
            </div>
            <Button
              asChild
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl px-6 py-5 shrink-0"
            >
              <a href="/docs/TUTORIAL_INTEGRACAO_REDE_PARTICIPA.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" /> Ver Manual do Desenvolvedor
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Pré-visualização dos Dados em Tabela */}
      <Card className="rounded-[2.5rem] border-slate-200 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
                Visualização Prévia dos Dados
              </CardTitle>
              <CardDescription className="text-xs">
                Confira os registros antes de exportar para a planilha.
              </CardDescription>
            </div>

            {/* Abas */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAbaPrevia("produtores")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  abaPrevia === "produtores" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Produtores ({produtores.length})
              </button>
              <button
                onClick={() => setAbaPrevia("producao")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  abaPrevia === "producao" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Produção ({producao.length})
              </button>
              <button
                onClick={() => setAbaPrevia("ofertas")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  abaPrevia === "ofertas" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ofertas ({ofertas.length})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-96">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">Carregando dados...</div>
            ) : abaPrevia === "produtores" ? (
              produtores.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">Nenhum produtor encontrado para o filtro selecionado.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">Nome do Produtor</th>
                      <th className="p-4">Propriedade</th>
                      <th className="p-4">Município</th>
                      <th className="p-4">Distrito/Comunidade</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {produtores.slice(0, 10).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{p.nome_completo}</td>
                        <td className="p-4">{p.nome_propriedade || "-"}</td>
                        <td className="p-4 uppercase font-bold text-primary">{p.cidade_slug}</td>
                        <td className="p-4">{p.comunidade_distrito || "Sede"}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.ativo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {p.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : abaPrevia === "producao" ? (
              producao.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">Nenhum registro de produção encontrado.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">Cultura</th>
                      <th className="p-4">Produtor</th>
                      <th className="p-4">Município</th>
                      <th className="p-4">Volume Estimado</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {producao.slice(0, 10).map((pr: any) => (
                      <tr key={pr.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{pr.produto_base?.nome || "Cultura Geral"}</td>
                        <td className="p-4">{pr.unidade_produtiva?.perfil?.nome_completo || "-"}</td>
                        <td className="p-4 uppercase font-bold text-primary">{pr.unidade_produtiva?.perfil?.cidade_slug || "-"}</td>
                        <td className="p-4">{pr.quantidade_estimada} {pr.unidade_medida}</td>
                        <td className="p-4">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                            {pr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              ofertas.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">Nenhuma oferta cadastrada na vitrine.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Produtor</th>
                      <th className="p-4">Município</th>
                      <th className="p-4">Quantidade</th>
                      <th className="p-4">Preço (R$)</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {ofertas.slice(0, 10).map((o: any) => (
                      <tr key={o.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{o.produto_base?.nome || "Produto"}</td>
                        <td className="p-4">{o.perfil?.nome_completo || "-"}</td>
                        <td className="p-4 uppercase font-bold text-primary">{o.perfil?.cidade_slug || "-"}</td>
                        <td className="p-4">{o.quantidade_disponivel} {o.unidade_venda}</td>
                        <td className="p-4 font-bold text-slate-900">R$ {o.preco_venda?.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            o.status === "ativo" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
          {((abaPrevia === "produtores" && produtores.length > 10) || 
            (abaPrevia === "producao" && producao.length > 10) || 
            (abaPrevia === "ofertas" && ofertas.length > 10)) && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
              Exibindo apenas os 10 primeiros registros na prévia. Baixe o arquivo CSV completo para visualizar todos.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
