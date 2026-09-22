"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { librasGlossary } from "@/lib/mock-data";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Layers, 
  Search, 
  Play, 
  X, 
  Ear, 
  ArrowLeft, 
  ArrowRight,
  Video,
  BookOpen,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  List,
  Columns,
  Maximize2,
  ShieldCheck,
  Scale,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Tag,
  Share2
} from "lucide-react";

// Curated dictionary of related concepts, practices, examples, and linguistic statuses for core terms
const TERM_ENRICHMENTS: Record<string, {
  practice?: string;
  example?: string;
  linguisticType?: "Sinal Consolidado" | "Variação Registrada" | "Composição Conceitual" | "Classificador Visual" | "Explicação Conceitual";
  linguisticNote?: string;
  relatedConcepts?: string[];
  normativeSource?: string;
  scientificSource?: string;
}> = {
  "segurança dos alimentos": {
    practice: "Envolve rigorosos cuidados e protocolos de controle microbiológico, físico e químico em todas as etapas: produção primária, armazenamento, transporte, preparo e consumo final.",
    example: "Manter carnes e laticínios refrigerados na temperatura indicada pelo fabricante inibe a multiplicação de bactérias patogênicas como Salmonella e Listeria.",
    linguisticType: "Composição Conceitual",
    linguisticNote: "Construção bimanual harmonizada: sinal de ALIMENTO associado ao sinal de PROTEÇÃO/SEGURO e validação afirmativa.",
    relatedConcepts: ["Alimento seguro", "Inocuidade dos alimentos", "Perigo", "Risco", "Boas práticas", "Segurança alimentar e nutricional"],
    normativeSource: "ANVISA — RDC nº 216/2004 (Regulamento Técnico de Boas Práticas) e MAPA",
    scientificSource: "Codex Alimentarius (FAO/WHO, 2020) — General Principles of Food Hygiene (CXC 1-1969)"
  },
  "segurança alimentar e nutricional": {
    practice: "Orientação e formulação de políticas públicas estruturantes, incentivo à agricultura familiar, compras públicas de alimentos saudáveis (PNAE/PAA) e garantia da soberania alimentar.",
    example: "Famílias de baixa renda acessarem feiras agroecológicas comunitárias com produtos in natura variados, sem comprometer a renda destinada à moradia e saúde.",
    linguisticType: "Explicação Conceitual",
    linguisticNote: "Sinalização discursiva em espaço amplo abrangendo DIREITO, COMIDA DE VERDADE e COLETIVIDADE, enfatizando a dimensão sociopolítica.",
    relatedConcepts: ["Segurança dos alimentos", "Soberania alimentar", "Direito humano à alimentação", "Biodiversidade alimentar", "Agricultura familiar"],
    normativeSource: "Lei Orgânica de Segurança Alimentar e Nutricional — LOSAN (Lei nº 11.346/2006)",
    scientificSource: "Guia Alimentar para a População Brasileira (Ministério da Saúde, 2014); Maluf, R. (2007)"
  },
  "alimento seguro": {
    practice: "Adoção de procedimentos operacionais padronizados (POPs) de higienização de mãos, superfícies de contato, água tratada e sanitização de vegetais.",
    example: "Um lote de hortaliças cultivado com água potável e sem agrotóxicos ilegais, lavado com solução clorada adequada antes da distribuição para merenda escolar.",
    linguisticType: "Sinal Consolidado",
    linguisticNote: "Sinal consolidado de ALIMENTO seguido do sinal de SEGURO/LIVRE-DE-PERIGO com expressão facial de tranquilidade.",
    relatedConcepts: ["Segurança dos alimentos", "Inocuidade dos alimentos", "Boas práticas", "Perigo"],
    normativeSource: "ANVISA — Portaria SVS/MS nº 326/1997 e RDC nº 216/2004",
    scientificSource: "International Commission on Microbiological Specifications for Foods (ICMSF)"
  },
  "inocuidade dos alimentos": {
    practice: "Garantia estrita de que o produto não veicula substâncias tóxicas, microrganismos patogênicos ou corpos estranhos em níveis lesivos ao organismo humano.",
    example: "A pasteurização térmica do leite para destruição de bactérias causadoras de tuberculose bovina e brucelose sem alterar os nutrientes essenciais.",
    linguisticType: "Composição Conceitual",
    linguisticNote: "Datilologia do radical técnico acompanhada de sinais explicativos de LIMPO, PURO e NÃO-PREJUDICA-A-SAÚDE.",
    relatedConcepts: ["Segurança dos alimentos", "Alimento seguro", "Perigo biológico", "Risco alimentar"],
    normativeSource: "Codex Alimentarius — Código de Práticas de Higiene e Padrões da OMS/FAO",
    scientificSource: "Forsythe, S. J. (2010). Microbiologia da Segurança dos Alimentos"
  },
  "perigo": {
    practice: "Identificação proativa de fontes de contaminação física (cacos de vidro, metais), química (resíduos de pesticidas, detergentes) ou biológica (vírus, bactérias, parasitas).",
    example: "Uma lasca de metal que se desprende de uma lâmina de processador industrial e cai na massa do alimento antes da embalagem.",
    linguisticType: "Sinal Consolidado",
    linguisticNote: "Sinal clássico e amplamente dicionarizado de PERIGO/ATENÇÃO com expressão facial enfática de alerta.",
    relatedConcepts: ["Risco", "Segurança dos alimentos", "Perigo alimentar", "Inocuidade dos alimentos"],
    normativeSource: "ANVISA — Guia de Boas Práticas e Análise de Perigos e Pontos Críticos de Controle (APPCC)",
    scientificSource: "Mortimore, S. & Wallace, C. (2013). HACCP: A Practical Approach"
  },
  "risco": {
    practice: "Cálculo probabilístico da chance de um perigo se concretizar e da severidade do agravo à saúde decorrente da exposição ao alimento.",
    example: "O risco de infecção alimentar por comer maionese caseira feita com ovos crus deixada horas sob o sol em comparação à maionese industrial pasteurizada.",
    linguisticType: "Sinal Consolidado",
    linguisticNote: "Sinal de RISCO/PROBABILIDADE com movimento manual modulado de acordo com a intensidade.",
    relatedConcepts: ["Perigo", "Segurança dos alimentos", "Análise de risco"],
    normativeSource: "Codex Alimentarius — Princípios Operacionais para Análise de Risco",
    scientificSource: "WHO/FAO (2006). Food safety risk analysis: a guide for national food safety authorities"
  },
  "alimento ultraprocessado": {
    practice: "Identificação rápida pela leitura atenta da lista de ingredientes no verso das embalagens, priorizando comida in natura no cotidiano.",
    example: "Salgadinhos de pacote, refrigerantes e biscoitos recheados repletos de aromatizantes, realçadores de sabor (glutamato) e espessantes.",
    linguisticType: "Composição Conceitual",
    linguisticNote: "Sinalização comparativa: COMIDA + FÁBRICA/MÁQUINAS + QUÍMICOS/ADITIVOS em oposição a vegetal colhido da terra.",
    relatedConcepts: ["Classificação NOVA", "Alimento in natura", "Aditivo alimentar", "Rotulagem nutricional"],
    normativeSource: "Ministério da Saúde — Guia Alimentar para a População Brasileira",
    scientificSource: "Monteiro, C. A. et al. (2019). Ultra-processed foods: what they are and how to identify them"
  },
  "deserto alimentar": {
    practice: "Mapeamento territorial de bairros e periferias desprovidos de feiras livres, hortifrutis e açougues, onde só predominam lojas de ultraprocessados.",
    example: "Moradores que precisam se deslocar mais de 3 km de transporte público para conseguir comprar uma fruta ou verdura fresca a preço acessível.",
    linguisticType: "Classificador Visual",
    linguisticNote: "Uso de classificadores espaciais demonstrando a ausência de feiras e abundância de pacotes plásticos industrializados.",
    relatedConcepts: ["Pântano alimentar", "Segurança alimentar e nutricional", "Ambiente alimentar", "Território"],
    normativeSource: "Câmara Interministerial de Segurança Alimentar e Nutricional — CAISAN",
    scientificSource: "Honório, O. S. et al. (2021). Desertos e Pântanos Alimentares no Brasil"
  }
};

// Curated comparison templates for Eixo 4 and critical comparisons
const COMPARISON_TEMPLATES: Record<string, {
  titleA: string;
  titleB: string;
  rows: { label: string; valA: string; valB: string }[];
}> = {
  "manteiga × margarina": {
    titleA: "Manteiga (Origem Animal)",
    titleB: "Margarina (Emulsão Industrial)",
    rows: [
      {
        label: "O que é",
        valA: "Derivado lácteo obtido pelo batimento mecânico do creme de leite (nata de vaca pasteurizada).",
        valB: "Emulsão sintética de óleos vegetais e água formulada quimicamente pela indústria."
      },
      {
        label: "Composição e Ingredientes",
        valA: "Apenas 1 ou 2 ingredientes: creme de leite e sal (opcional). Fonte de vitaminas A e D da gordura láctea.",
        valB: "Lista longa com óleos vegetais hidrogenados ou interesterificados, corantes, conservantes e aromas sintéticos."
      },
      {
        label: "Denominação Oficial (MAPA/ANVISA)",
        valA: "Manteiga de Primeira Qualidade / Manteiga Comum.",
        valB: "Margarina vegetal com ou sem sal."
      },
      {
        label: "O que observar no Rótulo",
        valA: "Lista limpa sem nomes estranhos ou números de aditivos químicos.",
        valB: "Presença de gorduras interesterificadas, emulsificantes (mono e diglicerídeos) e antioxidantes artificiais."
      }
    ]
  },
  "leite × bebida láctea": {
    titleA: "Leite Fluido Integral",
    titleB: "Bebida Láctea",
    rows: [
      {
        label: "O que é",
        valA: "Leite 100% integral pasteurizado ou UHT da ordenha, sem diluições.",
        valB: "Mistura com adição de soro de leite residual, amido modificado e gordura vegetal."
      },
      {
        label: "Composição e Ingredientes",
        valA: "100% leite de vaca. Rico em cálcio biodisponível e proteínas completas.",
        valB: "Pelo menos 51% de base láctea (soro barato), espessantes, estabilizantes e aromatizantes."
      },
      {
        label: "Denominação Oficial (MAPA/ANVISA)",
        valA: "Leite Pasteurizado / UHT Integral.",
        valB: "Bebida Láctea Pasteurizada / UHT (obrigatório destacar no painel frontal)."
      },
      {
        label: "O que observar no Rótulo",
        valA: "Palavra 'LEITE' clara no centro. Sem amido ou soro na lista de ingredientes.",
        valB: "Escrito em letras menores 'Bebida Láctea'. Lista longa contendo soro de queijo e gomas."
      }
    ]
  },
  "leite em pó × composto lácteo": {
    titleA: "Leite em Pó Integral",
    titleB: "Composto Lácteo",
    rows: [
      {
        label: "O que é",
        valA: "Leite fluido desidratado sem remoção de nutrientes essenciais.",
        valB: "Mistura de derivados de leite com óleos vegetais, maltodextrina e açúcar adicionado."
      },
      {
        label: "Composição e Ingredientes",
        valA: "Leite integral e lecitina de soja (emulsionante natural).",
        valB: "Mínimo de apenas 51% de derivados lácteos. Contém açúcar e gordura vegetal de baixo custo."
      },
      {
        label: "Denominação Oficial (MAPA/ANVISA)",
        valA: "Leite em Pó Integral.",
        valB: "Composto Lácteo com Óleos Vegetais (não é leite em pó!)."
      },
      {
        label: "O que observar no Rótulo",
        valA: "Embalagem diz 'Leite em Pó'. Lista simples sem açúcares adicionados.",
        valB: "Lata com imagens infantis parecendo leite, mas com a denominação 'Composto Lácteo'."
      }
    ]
  },
  "leite condensado × mistura láctea condensada": {
    titleA: "Leite Condensado Tradicional",
    titleB: "Mistura Láctea Condensada",
    rows: [
      {
        label: "O que é",
        valA: "Leite concentrado por evaporação a vácuo com adição exclusiva de sacarose.",
        valB: "Produto ultraprocessado que substitui o leite nobre por soro, amido modificado e óleos."
      },
      {
        label: "Composição e Ingredientes",
        valA: "Leite integral, açúcar e lactose.",
        valB: "Soro de leite concentrado, leite desnatado, açúcar, amido modificado e gordura vegetal."
      },
      {
        label: "Denominação Oficial (MAPA/ANVISA)",
        valA: "Leite Condensado.",
        valB: "Mistura Láctea Condensada de Leite e Soro de Leite."
      },
      {
        label: "O que observar no Rótulo",
        valA: "Textura firme natural ao cozinhar brigadeiro. Densidade láctea característica.",
        valB: "Pode 'desandar' ou talhar facilmente em receitas de confeitaria devido ao amido e soro."
      }
    ]
  },
  "suco × néctar": {
    titleA: "Suco 100% de Fruta",
    titleB: "Néctar de Fruta",
    rows: [
      {
        label: "O que é",
        valA: "Bebida pura sem adição de água nem açúcar, obtida da polpa ou prensagem da fruta fresca.",
        valB: "Bebida adoçada artificialmente diluída em água, com teor reduzido de polpa de fruta."
      },
      {
        label: "Composição e Ingredientes",
        valA: "100% fruta (ou suco reconstituído). Sem conservantes ou açúcares adicionados.",
        valB: "Geralmente 20% a 50% de polpa de fruta, com muita água e adição pesada de açúcar refinado."
      },
      {
        label: "Denominação Oficial (MAPA/ANVISA)",
        valA: "Suco de Fruta Integral / 100% Fruta.",
        valB: "Néctar de Fruta Adoçado."
      },
      {
        label: "O que observar no Rótulo",
        valA: "Rótulo destaca '100% Suco' e na lista só consta o suco da fruta.",
        valB: "No verso, o açúcar é o segundo ingrediente logo após a água."
      }
    ]
  }
};

export function GlossaryFilters() {
  // selectedAxisId: null = Hub view (shows 6 Eixo cards)
  // "1", "2", ... "6" or "todos" = Dedicated Eixo view
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);
  const [activeTermIndex, setActiveTermIndex] = useState<number>(0);
  const [termSearchQuery, setTermSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"bilang" | "video_only" | "text_only">("bilang");
  const [showReferences, setShowReferences] = useState(false);

  // Eixos list with guaranteed numericId
  const eixosList = useMemo(() => {
    return librasGlossary.map((e, index) => ({
      ...e,
      numericId: e.numericId || (index + 1)
    }));
  }, []);

  const totalTermsCount = useMemo(() => {
    return librasGlossary.reduce((acc, curr) => acc + (curr.terms?.length || 0), 0);
  }, []);

  // Current active axis object
  const currentEixo = useMemo(() => {
    if (!selectedAxisId || selectedAxisId === "todos") return null;
    return eixosList.find(e => 
      String(e.numericId) === String(selectedAxisId) || 
      String(e.id).toLowerCase() === String(selectedAxisId).toLowerCase()
    ) || null;
  }, [selectedAxisId, eixosList]);

  // Current terms list for selected axis
  const rawTerms = useMemo(() => {
    if (!selectedAxisId) return [];
    if (selectedAxisId === "todos") {
      return eixosList.flatMap(e => (e.terms || []).map((t, idx) => ({ 
        ...t, 
        axisTitle: e.title, 
        axisEmoji: e.emoji, 
        axisNum: e.numericId,
        codeId: `${e.numericId}${String.fromCharCode(65 + (idx % 26))}${idx >= 26 ? Math.floor(idx / 26) : ""}`
      })));
    }
    if (!currentEixo) return [];
    return (currentEixo.terms || []).map((t, idx) => ({ 
      ...t, 
      axisTitle: currentEixo.title, 
      axisEmoji: currentEixo.emoji, 
      axisNum: currentEixo.numericId,
      codeId: `${currentEixo.numericId}${String.fromCharCode(65 + (idx % 26))}${idx >= 26 ? Math.floor(idx / 26) : ""}`
    }));
  }, [selectedAxisId, currentEixo, eixosList]);

  // Smart search recognizing questions, comparisons and colloquial words
  const filteredTerms = useMemo(() => {
    if (!termSearchQuery.trim()) return rawTerms;
    const q = termSearchQuery.toLowerCase().trim();

    // Map colloquial queries to targets
    const queryAliases: Record<string, string[]> = {
      "alergia e intolerância": ["alergia", "intolerância"],
      "diferença entre alergia e intolerância": ["alergia", "intolerância"],
      "leite condensado e mistura láctea": ["mistura láctea", "leite condensado"],
      "manteiga e margarina": ["manteiga", "margarina"],
      "suco e néctar": ["suco", "néctar"],
      "segurança dos alimentos e segurança alimentar": ["segurança dos alimentos", "segurança alimentar"]
    };

    let targetKeywords = [q];
    for (const [alias, words] of Object.entries(queryAliases)) {
      if (q.includes(alias) || alias.includes(q)) {
        targetKeywords = words;
        break;
      }
    }

    return rawTerms.filter(t => {
      const name = (t.term || "").toLowerCase();
      const def = (t.definition || t.description || "").toLowerCase();
      const strat = (t.signStrategy || t.sign_strategy || "").toLowerCase();
      const tags = (t.tags || []).join(" ").toLowerCase();

      return targetKeywords.some(kw => 
        name.includes(kw) || def.includes(kw) || strat.includes(kw) || tags.includes(kw)
      );
    });
  }, [rawTerms, termSearchQuery]);

  // Reset active term index when changing axis
  useEffect(() => {
    setActiveTermIndex(0);
    setDisplayMode("bilang");
    setShowReferences(false);
  }, [selectedAxisId]);

  // Keep index valid
  const safeActiveIndex = (activeTermIndex >= 0 && activeTermIndex < filteredTerms.length) ? activeTermIndex : 0;
  const activeTerm = filteredTerms[safeActiveIndex] || null;

  // Enrich active term with curated or dynamic scientific metadata
  const enrichedTerm = useMemo(() => {
    if (!activeTerm) return null;
    const key = (activeTerm.term || "").toLowerCase().trim();
    const enrichment = TERM_ENRICHMENTS[key] || {};

    // Check if comparison term
    const isComp = Boolean(
      activeTerm.isComparison || 
      activeTerm.comparisonData || 
      key.includes("×") || 
      key.includes("≠") || 
      key.includes(" vs ")
    );

    let compData = activeTerm.comparisonData;
    if (!compData && isComp) {
      for (const [compKey, data] of Object.entries(COMPARISON_TEMPLATES)) {
        if (key.includes(compKey) || compKey.includes(key)) {
          compData = data;
          break;
        }
      }
    }

    // Determine linguistic status
    const lingType = enrichment.linguisticType || (
      activeTerm.linguisticMediation?.type || (
        isComp ? "Explicação Conceitual" :
        key.length < 15 ? "Sinal Consolidado" : "Composição Conceitual"
      )
    );

    // Fallback practice & example if not directly configured
    const practice = enrichment.practice || activeTerm.practice || activeTerm.context || 
      "Aplicação de protocolos sanitários e procedimentos operacionais padronizados em conformidade com as diretrizes da ANVISA e MAPA.";

    const example = enrichment.example || activeTerm.example || 
      `Identificação prática de ${activeTerm.term} nos pontos de fiscalização, feiras livres ou rotulagem dos alimentos comercializados.`;

    const relatedConcepts = enrichment.relatedConcepts || activeTerm.relatedConcepts || [
      "Boas práticas", "Inocuidade dos alimentos", "Segurança dos alimentos", "Alimento seguro"
    ].filter(r => r.toLowerCase() !== key);

    const normativeSource = enrichment.normativeSource || activeTerm.sources?.regulatory || "ANVISA — Resoluções Técnicas e MAPA";
    const scientificSource = enrichment.scientificSource || activeTerm.sources?.scientific || "Codex Alimentarius (FAO/OMS) e periódicos científicos da área";

    return {
      ...activeTerm,
      isComparison: isComp,
      comparisonData: compData,
      practice,
      example,
      relatedConcepts,
      linguisticStatus: lingType,
      linguisticNote: enrichment.linguisticNote || activeTerm.linguisticMediation?.linguisticNote || "Construção de sentido orientada pela semântica espacial e gramática visual da Libras.",
      normativeSource,
      scientificSource,
      updatedAt: "Setembro de 2026"
    };
  }, [activeTerm]);

  // Navigate to a related concept
  const handleNavigateToRelated = (conceptName: string) => {
    const q = conceptName.toLowerCase().trim();
    // Search in current list first
    const foundIdx = rawTerms.findIndex(t => (t.term || "").toLowerCase().includes(q));
    if (foundIdx !== -1) {
      setTermSearchQuery("");
      setActiveTermIndex(foundIdx);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 320, behavior: "smooth" });
      }
      return;
    }

    // Search globally across all eixos
    for (const eixo of eixosList) {
      const idxInEixo = (eixo.terms || []).findIndex(t => (t.term || "").toLowerCase().includes(q));
      if (idxInEixo !== -1) {
        setSelectedAxisId(String(eixo.numericId));
        setTimeout(() => {
          setActiveTermIndex(idxInEixo);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 320, behavior: "smooth" });
          }
        }, 80);
        return;
      }
    }

    // Fallback: put in search query
    setTermSearchQuery(conceptName);
  };

  const handleSelectAxis = (axisId: string | number) => {
    setSelectedAxisId(String(axisId));
    setTermSearchQuery("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleBackToHub = () => {
    setSelectedAxisId(null);
    setTermSearchQuery("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

  const handleNextAxis = () => {
    const next = axisNumber === eixosList.length ? 1 : axisNumber + 1;
    setSelectedAxisId(String(next));
    setTermSearchQuery("");
  };

  const handlePrevAxis = () => {
    const prev = axisNumber === 1 ? eixosList.length : axisNumber - 1;
    setSelectedAxisId(String(prev));
    setTermSearchQuery("");
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    let base = url.trim();
    if (base.includes("shorts/")) {
      const id = base.split("shorts/")[1]?.split(/[?&#]/)[0];
      base = `https://www.youtube.com/embed/${id}`;
    } else if (base.includes("youtu.be/")) {
      const id = base.split("youtu.be/")[1]?.split(/[?&#]/)[0];
      base = `https://www.youtube.com/embed/${id}`;
    } else if (base.includes("watch?v=")) {
      const id = base.split("watch?v=")[1]?.split(/[?&#]/)[0];
      base = `https://www.youtube.com/embed/${id}`;
    }
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
  };

  // =========================================================================
  // VIEW 1: HUB DOS 6 EIXOS TEMÁTICOS
  // =========================================================================
  if (!selectedAxisId) {
    return (
      <div className="space-y-8 mb-20 animate-in fade-in duration-500 w-full text-slate-800">
        {/* Banner do Hub */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-200">
              <Compass className="h-3.5 w-3.5" />
              <span>Base Terminológica Oficial</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Glossário de Libras Científica
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">
              Base terminológica com <strong>{totalTermsCount} conceitos</strong> em Libras e Língua Portuguesa, organizados em <strong>6 eixos temáticos</strong> para consulta, aprofundamento e mediação científica.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => handleSelectAxis("todos")}
              className="px-6 py-4 rounded-2xl bg-stone-900 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02] flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              <span>Ver Todos os Conceitos</span>
            </button>
          </div>
        </div>

        {/* Grade dos 6 Eixos Temáticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eixosList.map((eixo, index) => (
            <motion.div
              key={eixo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group"
            >
              <button
                onClick={() => handleSelectAxis(eixo.numericId)}
                className="w-full text-left bg-white rounded-[2.5rem] p-7 md:p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between h-[300px] relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 bg-stone-50 rounded-2xl border border-stone-100 group-hover:scale-110 transition-transform">
                      {eixo.emoji}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                      Eixo 0{eixo.numericId}
                    </span>
                  </div>

                  <h3 className="font-black text-lg md:text-xl text-stone-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors leading-snug mb-2">
                    {eixo.title}
                  </h3>

                  <p className="text-xs md:text-sm text-stone-500 font-medium leading-relaxed line-clamp-3">
                    {eixo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-500">
                  <span className="text-blue-800 font-black">{eixo.terms?.length || 0} conceitos</span>
                  <span className="text-stone-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Consultar Eixo</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-700" />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AMBIENTE BILÍNGUE DO EIXO (VÍDEO E TEXTO EM 3 CAMADAS)
  // =========================================================================
  const isAllView = selectedAxisId === "todos";
  const axisNumber = currentEixo?.numericId || 1;
  const nextAxisNumber = axisNumber === eixosList.length ? 1 : axisNumber + 1;
  const prevAxisNumber = axisNumber === 1 ? eixosList.length : axisNumber - 1;

  return (
    <div className="space-y-6 mb-20 animate-in fade-in duration-500 w-full text-slate-800">
      {/* 1. Barra Superior de Navegação */}
      <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleBackToHub}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs uppercase tracking-wider transition-all w-full sm:w-auto justify-center group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar aos Eixos Temáticos</span>
        </button>

        {!isAllView && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrevAxis}
              className="p-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Eixo Anterior</span>
            </button>

            <div className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="text-blue-800 font-black">Eixo 0{axisNumber}</span>
              <span className="text-stone-300">/</span>
              <span className="text-stone-400">0{eixosList.length}</span>
            </div>

            <button
              onClick={handleNextAxis}
              className="px-4 py-3 rounded-2xl bg-stone-900 hover:bg-blue-700 text-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider"
            >
              <span>Próximo Eixo</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {isAllView && (
          <span className="text-xs font-black uppercase tracking-wider text-stone-500">
            Base Terminológica Completa
          </span>
        )}
      </div>

      {/* 2. Título do Eixo Atual */}
      <div className="bg-white rounded-[2rem] border border-stone-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl p-3 bg-stone-50 rounded-2xl border border-stone-100 shrink-0">
            {isAllView ? "📚" : currentEixo?.emoji}
          </span>
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-800 mb-1">
              <span>{isAllView ? "Visão Abrangente" : `Eixo 0${axisNumber} • Segurança Alimentar`}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tight">
              {isAllView ? "Base Terminológica • 347 conceitos em Libras e Português" : currentEixo?.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-black uppercase tracking-wider">
            {filteredTerms.length} conceitos disponíveis
          </span>
        </div>
      </div>

      {/* 3. ESTRUTURA PRINCIPAL: LISTA LATERAL + CARD DO CONCEITO CIENTÍFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
            COLUNA DA ESQUERDA: LISTA DE TERMOS
            ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-[2.5rem] border border-stone-200 p-5 shadow-sm space-y-4">
          {/* Campo de Busca Inteligente com Suporte a Perguntas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <List className="h-4 w-4 text-blue-700" />
                <span>Conceitos ({filteredTerms.length})</span>
              </span>
              {termSearchQuery && (
                <button 
                  onClick={() => setTermSearchQuery("")}
                  className="text-[10px] font-bold text-blue-700 hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={termSearchQuery}
                onChange={(e) => setTermSearchQuery(e.target.value)}
                placeholder="Busque por termo ou pergunta..."
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Dica de Busca por Perguntas */}
            <p className="text-[10px] text-stone-400 px-1 italic">
              Dica: busque também por dúvidas como "diferença entre alergia e intolerância" ou "leite condensado e mistura láctea".
            </p>
          </div>

          {/* Lista Rolável de Conceitos */}
          <div className="max-h-[760px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-stone-200">
            {filteredTerms.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-stone-400">
                <p className="text-xs font-semibold">Nenhum conceito encontrado.</p>
                <button
                  onClick={() => setTermSearchQuery("")}
                  className="text-[10px] font-black text-blue-700 uppercase"
                >
                  Ver todos
                </button>
              </div>
            ) : (
              filteredTerms.map((t: any, index: number) => {
                const isSelected = index === safeActiveIndex;
                const hasVideo = Boolean(t.videoUrl || t.video_url);
                const codeLabel = t.codeId || `${axisNumber}${String.fromCharCode(65 + (index % 26))}`;

                return (
                  <button
                    key={t.id || t.term || index}
                    onClick={() => setActiveTermIndex(index)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-2.5 border group",
                      isSelected
                        ? "bg-blue-700 text-white border-blue-700 shadow-md"
                        : "bg-stone-50/70 hover:bg-white text-stone-700 border-stone-100 hover:border-blue-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-mono font-black shrink-0 tracking-wider",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-stone-600 border border-stone-200 group-hover:text-blue-700"
                      )}>
                        {codeLabel}
                      </span>

                      <span className={cn(
                        "text-xs font-black uppercase tracking-tight line-clamp-2 leading-snug",
                        isSelected ? "text-white" : "text-stone-800 group-hover:text-blue-700"
                      )}>
                        {t.term}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {hasVideo ? (
                        <span 
                          title="Vídeo demonstrativo disponível"
                          className={cn(
                            "p-1.5 rounded-full flex items-center justify-center",
                            isSelected ? "bg-white text-blue-700" : "bg-blue-100 text-blue-800"
                          )}
                        >
                          <Play className="h-2 w-2 fill-current" />
                        </span>
                      ) : (
                        <span 
                          title="Em gravação técnica"
                          className={cn(
                            "p-1.5 rounded-full flex items-center justify-center",
                            isSelected ? "bg-white/20 text-white" : "bg-stone-200 text-stone-400"
                          )}
                        >
                          <Clock className="h-2 w-2" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================
            COLUNA DA DIREITA: CARD DO CONCEITO EM 3 CAMADAS OU TEMPLATE COMPARE
            ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {enrichedTerm ? (
            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-6 md:p-10 space-y-8">
              
              {/* Barra de Controle do Conceito Ativo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-blue-700 text-white font-mono text-xs font-black tracking-wider shadow-sm">
                    {enrichedTerm.codeId || `${axisNumber}${String.fromCharCode(65 + (safeActiveIndex % 26))}`}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                        {enrichedTerm.isComparison ? "Análise Crítica & Comparação" : "Conceito Científico"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[9px] font-bold uppercase">
                        {enrichedTerm.linguisticStatus}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tight">
                      {enrichedTerm.term}
                    </h3>
                  </div>
                </div>

                {/* Seletores de Modo de Visualização */}
                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl self-start sm:self-auto">
                  <button
                    onClick={() => setDisplayMode("bilang")}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "bilang"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    )}
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Lado a Lado</span>
                  </button>

                  <button
                    onClick={() => setDisplayMode("video_only")}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "video_only"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    )}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Só Vídeo</span>
                  </button>

                  <button
                    onClick={() => setDisplayMode("text_only")}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "text_only"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Só Texto</span>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  TEMPLATE DEDICADO "COMPARE" PARA ANÁLISE CRÍTICA (PONTO 7)
                  ========================================================= */}
              {enrichedTerm.isComparison && enrichedTerm.comparisonData && (
                <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-50 to-blue-50 border border-blue-200/80 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
                        <Scale className="h-4 w-4 text-blue-700" />
                        <span>Tabela de Análise Comparativa e Leitura de Rótulo</span>
                      </div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase">
                        Vigilância Sanitária e Letramento Alimentar
                      </span>
                    </div>

                    {/* Grade Comparativa Lado a Lado */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="py-3 px-4 text-xs font-black uppercase text-stone-500 w-1/4">Critério</th>
                            <th className="py-3 px-4 text-xs font-black uppercase text-blue-900 bg-blue-100/50 rounded-t-xl w-3/8">
                              {enrichedTerm.comparisonData.titleA}
                            </th>
                            <th className="py-3 px-4 text-xs font-black uppercase text-amber-900 bg-amber-100/50 rounded-t-xl w-3/8">
                              {enrichedTerm.comparisonData.titleB}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 text-xs font-medium text-stone-700">
                          {enrichedTerm.comparisonData.rows.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-white/60 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-stone-900">{row.label}</td>
                              <td className="py-3.5 px-4 bg-blue-50/40 leading-relaxed">{row.valA}</td>
                              <td className="py-3.5 px-4 bg-amber-50/40 leading-relaxed">{row.valB}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  ÁREA CENTRAL: VÍDEO + AS 3 CAMADAS CONCEITUAIS
                  ========================================================= */}
              <div className={cn(
                "gap-8",
                displayMode === "bilang" ? "grid grid-cols-1 xl:grid-cols-12 items-stretch" : "block"
              )}>
                {/* LADO ESQUERDO: VÍDEO EM LIBRAS + BLOCO DE MEDIAÇÃO EM LIBRAS */}
                {(displayMode === "bilang" || displayMode === "video_only") && (
                  <div className={cn(
                    "space-y-4 flex flex-col justify-between",
                    displayMode === "bilang" ? "xl:col-span-6" : "w-full"
                  )}>
                    {/* Container do Player de Vídeo */}
                    <div className="rounded-[2rem] overflow-hidden bg-stone-950 aspect-video shadow-md border border-stone-800 flex items-center justify-center relative group">
                      {enrichedTerm.videoUrl || enrichedTerm.video_url ? (
                        <iframe
                          src={getEmbedUrl(enrichedTerm.videoUrl || enrichedTerm.video_url)}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={enrichedTerm.term}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-900 text-white space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                            <Play className="h-7 w-7 fill-blue-500/20" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                              Vídeo em Gravação Técnica
                            </span>
                            <h4 className="text-base font-black uppercase tracking-tight">
                              Laboratório de Libras Científica
                            </h4>
                            <p className="text-xs text-stone-400 leading-relaxed font-medium">
                              A sinalização gravada está sendo refinada. Acompanhe a mediação linguística abaixo.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-black uppercase tracking-wider border border-white/10">
                        {enrichedTerm.codeId || `${axisNumber}${String.fromCharCode(65 + (safeActiveIndex % 26))}`} • Libras
                      </div>
                    </div>

                    {/* BLOCO: MEDIAÇÃO DO CONCEITO EM LIBRAS (PONTO 2 & 10) */}
                    <div className="p-6 rounded-[2rem] bg-stone-50 border border-stone-200 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-800 font-black text-xs uppercase tracking-wider">
                          <Ear className="h-4 w-4 shrink-0" />
                          <span>Mediação do Conceito em Libras</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-stone-700 text-[10px] font-black uppercase border border-stone-200">
                          {enrichedTerm.linguisticStatus}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs leading-relaxed text-stone-700">
                        <div>
                          <strong className="text-stone-900">Forma utilizada neste material: </strong>
                          <span>{enrichedTerm.signStrategy || enrichedTerm.sign_strategy}</span>
                        </div>

                        <div>
                          <strong className="text-stone-900">Observação linguística: </strong>
                          <span>{enrichedTerm.linguisticNote}</span>
                        </div>

                        <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[11px] text-stone-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
                          <span><strong>Validação:</strong> Equipe de mediadores surdos e consultoria linguística do LISSA.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LADO DIREITO: AS 3 CAMADAS DO CONCEITO CIENTÍFICO (PONTO 1 & 3) */}
                {(displayMode === "bilang" || displayMode === "text_only") && (
                  <div className={cn(
                    "p-7 md:p-8 rounded-[2.5rem] bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-6",
                    displayMode === "bilang" ? "xl:col-span-6 mt-4 xl:mt-0" : "w-full"
                  )}>
                    <div className="space-y-5">
                      
                      {/* CAMADA 1: O QUE SIGNIFICA (DEFINIÇÃO CIENTÍFICA) */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                          1. O que significa
                        </span>
                        <p className="text-sm md:text-base font-medium leading-relaxed text-stone-900">
                          {enrichedTerm.definition || enrichedTerm.description}
                        </p>
                      </div>

                      {/* CAMADA 2: NA PRÁTICA (APLICAÇÃO CONCRETA) */}
                      <div className="space-y-1.5 pt-3 border-t border-stone-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-blue-700" />
                          <span>2. Na prática</span>
                        </span>
                        <p className="text-xs md:text-sm font-medium leading-relaxed text-stone-700">
                          {enrichedTerm.practice}
                        </p>
                      </div>

                      {/* CAMADA 3: EXEMPLO DO COTIDIANO (ANCOREGEM REAL) */}
                      <div className="space-y-1.5 pt-3 border-t border-stone-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                          <span>3. Exemplo</span>
                        </span>
                        <p className="text-xs md:text-sm font-medium leading-relaxed text-stone-700 italic bg-white p-3.5 rounded-xl border border-stone-200">
                          "{enrichedTerm.example}"
                        </p>
                      </div>

                      {/* REDE TERMINOLÓGICA: CONCEITOS RELACIONADOS CLICÁVEIS (PONTO 3) */}
                      {enrichedTerm.relatedConcepts && enrichedTerm.relatedConcepts.length > 0 && (
                        <div className="pt-3 border-t border-stone-200 space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                            Conceitos Relacionados na Rede Terminológica
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {enrichedTerm.relatedConcepts.map((relatedName: string, rIdx: number) => (
                              <button
                                key={rIdx}
                                onClick={() => handleNavigateToRelated(relatedName)}
                                className="px-3 py-1 rounded-xl bg-white hover:bg-blue-700 hover:text-white text-stone-700 text-[10px] font-bold transition-all border border-stone-200 shadow-sm flex items-center gap-1 group"
                              >
                                <span>{relatedName}</span>
                                <ArrowRight className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* FONTES E REFERÊNCIAS EXPANSÍVEIS (PONTO 8) */}
                    <div className="pt-4 border-t border-stone-200">
                      <button
                        onClick={() => setShowReferences(!showReferences)}
                        className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-600 hover:text-blue-800 transition-colors"
                      >
                        <span>Fontes e Referências Técnico-Científicas</span>
                        {showReferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      <AnimatePresence>
                        {showReferences && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 space-y-2 text-xs text-stone-600 overflow-hidden"
                          >
                            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                              <div>
                                <strong className="text-stone-800 block text-[10px] uppercase font-black">Base Normativa Oficial:</strong>
                                <span>{enrichedTerm.normativeSource}</span>
                              </div>
                              <div>
                                <strong className="text-stone-800 block text-[10px] uppercase font-black">Referência Científica:</strong>
                                <span>{enrichedTerm.scientificSource}</span>
                              </div>
                              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                                <span>Última revisão do verbete: {enrichedTerm.updatedAt}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-stone-200 p-12 text-center text-stone-400">
              <p>Selecione um conceito na lista ao lado para visualizar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
