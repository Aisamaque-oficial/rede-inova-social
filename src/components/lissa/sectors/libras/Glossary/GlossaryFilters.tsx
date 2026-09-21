"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Maximize2
} from "lucide-react";

export function GlossaryFilters() {
  // selectedAxisId: null = Hub view (shows 6 Eixo cards)
  // "1", "2", ... "6" or "todos" = Dedicated Eixo view
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);
  const [activeTermIndex, setActiveTermIndex] = useState<number>(0);
  const [termSearchQuery, setTermSearchQuery] = useState("");
  const [displayMode, setDisplayMode] = useState<"bilang" | "video_only" | "text_only">("bilang");

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

  // Filtered terms by search inside this axis
  const filteredTerms = useMemo(() => {
    if (!termSearchQuery.trim()) return rawTerms;
    const q = termSearchQuery.toLowerCase().trim();
    return rawTerms.filter(t => {
      const name = (t.term || "").toLowerCase();
      const def = (t.definition || t.description || "").toLowerCase();
      const strat = (t.signStrategy || t.sign_strategy || "").toLowerCase();
      const tags = (t.tags || []).join(" ").toLowerCase();
      return name.includes(q) || def.includes(q) || strat.includes(q) || tags.includes(q);
    });
  }, [rawTerms, termSearchQuery]);

  // Reset active term index when changing axis
  useEffect(() => {
    setActiveTermIndex(0);
    setDisplayMode("bilang");
  }, [selectedAxisId]);

  // Keep index valid
  const safeActiveIndex = (activeTermIndex >= 0 && activeTermIndex < filteredTerms.length) ? activeTermIndex : 0;
  const activeTerm = filteredTerms[safeActiveIndex] || null;

  // Axis selection
  const handleSelectAxis = (axisId: string) => {
    setSelectedAxisId(axisId);
    setTermSearchQuery("");
    setActiveTermIndex(0);
    setDisplayMode("bilang");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  const handleBackToHub = () => {
    setSelectedAxisId(null);
    setTermSearchQuery("");
    setActiveTermIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handlePrevAxis = () => {
    if (!selectedAxisId || selectedAxisId === "todos") return;
    const currentNum = currentEixo?.numericId || 1;
    const prevNum = currentNum === 1 ? eixosList.length : currentNum - 1;
    handleSelectAxis(String(prevNum));
  };

  const handleNextAxis = () => {
    if (!selectedAxisId || selectedAxisId === "todos") return;
    const currentNum = currentEixo?.numericId || 1;
    const nextNum = currentNum === eixosList.length ? 1 : currentNum + 1;
    handleSelectAxis(String(nextNum));
  };

  const handleNextTerm = () => {
    if (filteredTerms.length <= 1) return;
    setActiveTermIndex(prev => (prev < filteredTerms.length - 1 ? prev + 1 : 0));
  };

  const handlePrevTerm = () => {
    if (filteredTerms.length <= 1) return;
    setActiveTermIndex(prev => (prev > 0 ? prev - 1 : filteredTerms.length - 1));
  };

  // Helper for YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.includes("youtu.be/")) {
      const id = trimmed.split("youtu.be/")[1]?.split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
    if (trimmed.includes("watch?v=")) {
      const id = trimmed.split("watch?v=")[1]?.split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
    if (trimmed.includes("youtube.com/embed/")) {
      const sep = trimmed.includes("?") ? "&" : "?";
      return `${trimmed}${sep}autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
    return trimmed;
  };

  // ==========================================
  // VIEW 1: HUB PRINCIPAL COM OS 6 GRIDS
  // ==========================================
  if (!selectedAxisId) {
    return (
      <div className="space-y-8 mb-16 animate-in fade-in duration-500">
        {/* Banner Didático de Boas-Vindas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
              Glossário em Libras para Segurança Alimentar
            </h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
              Para iniciar, clique em um dos 6 eixos temáticos abaixo. Dentro de cada eixo você encontrará a lista de termos com a sinalização em Libras e o texto didático explicativo em português lado a lado.
            </p>
          </div>

          <button
            onClick={() => handleSelectAxis("todos")}
            className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-primary transition-all flex items-center gap-2.5 shadow-sm shrink-0"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Todos os Termos ({totalTermsCount})</span>
          </button>
        </div>

        {/* Grade dos 6 Eixos Temáticos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eixosList.map((eixo, i) => {
            const axisNum = eixo.numericId || (i + 1);
            const termCount = eixo.terms?.length || 0;
            const displayTitle = (eixo.title.split("—")[1] || eixo.title).trim();

            return (
              <motion.div
                key={eixo.id || axisNum}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <button
                  onClick={() => handleSelectAxis(String(axisNum))}
                  className="w-full text-left bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between min-h-[250px] relative overflow-hidden group-hover:ring-4 group-hover:ring-primary/5"
                >
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  <div>
                    {/* Topo: Emoji + Badge + Contador */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl p-3 rounded-2xl bg-slate-50 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                          {eixo.emoji}
                        </span>
                        <span className="px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                          Eixo 0{axisNum}
                        </span>
                      </div>

                      <span className="text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        {termCount} termos
                      </span>
                    </div>

                    {/* Título do Eixo */}
                    <h4 className="font-black text-xl text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug mb-2.5">
                      {displayTitle}
                    </h4>

                    {/* Descrição */}
                    <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                      {eixo.description}
                    </p>
                  </div>

                  {/* Ação */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary flex items-center gap-2 transition-colors">
                      <span>Abrir Eixo 0{axisNum}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {termCount} termos
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AMBIENTE BILÍNGUE DO EIXO (VÍDEO E TEXTO EM PORTUGUÊS LADO A LADO)
  // =========================================================================
  const isAllView = selectedAxisId === "todos";
  const axisNumber = currentEixo?.numericId || 1;
  const nextAxisNumber = axisNumber === eixosList.length ? 1 : axisNumber + 1;
  const prevAxisNumber = axisNumber === 1 ? eixosList.length : axisNumber - 1;
  const nextAxisObj = eixosList.find(e => e.numericId === nextAxisNumber);

  return (
    <div className="space-y-6 mb-20 animate-in fade-in duration-500">
      {/* 1. Barra Superior de Navegação */}
      <div className="bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Botão de Voltar para os Eixos */}
        <button
          onClick={handleBackToHub}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-black text-xs uppercase tracking-wider transition-all shadow-sm group w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar aos Eixos Temáticos</span>
        </button>

        {/* Navegação entre Eixos */}
        {!isAllView && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrevAxis}
              title={`Eixo anterior: Eixo 0${prevAxisNumber}`}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Eixo Anterior</span>
            </button>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="text-primary font-black">Eixo 0{axisNumber}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">0{eixosList.length}</span>
            </div>

            <button
              onClick={handleNextAxis}
              title={`Próximo grid: Eixo 0${nextAxisNumber}`}
              className="px-4 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.02]"
            >
              <span>Próximo Grid (Eixo 0{nextAxisNumber})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {isAllView && (
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Catálogo Geral de Termos
          </span>
        )}
      </div>

      {/* 2. Título do Eixo Atual */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl p-3 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
            {isAllView ? "📚" : currentEixo?.emoji}
          </span>
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-1">
              <span>{isAllView ? "Visão Global" : `Eixo 0${axisNumber} • Segurança Alimentar`}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {isAllView ? "Todos os 347 Termos Científicos" : currentEixo?.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
            {rawTerms.length} termos no eixo
          </span>
        </div>
      </div>

      {/* 3. ESTRUTURA PRINCIPAL: LISTA À ESQUERDA + ÁREA BILÍNGUE LADO A LADO À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================
            COLUNA DA ESQUERDA: LISTA DE TERMOS DO EIXO (Menu Lateral)
            ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-5 shadow-sm space-y-4">
          {/* Topo da lista: Busca interna */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                <span>Lista ({filteredTerms.length})</span>
              </span>
              {termSearchQuery && (
                <button 
                  onClick={() => setTermSearchQuery("")}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={termSearchQuery}
                onChange={(e) => setTermSearchQuery(e.target.value)}
                placeholder="Filtrar termo..."
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Lista Rolável de Termos */}
          <div className="max-h-[660px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredTerms.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <p className="text-xs font-semibold">Nenhum termo encontrado.</p>
                <button
                  onClick={() => setTermSearchQuery("")}
                  className="text-[10px] font-black text-primary uppercase"
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
                      "w-full text-left p-3 rounded-2xl transition-all duration-200 flex items-center justify-between gap-2.5 border group",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md scale-[1.01]"
                        : "bg-slate-50/70 hover:bg-white text-slate-700 border-slate-100 hover:border-primary/30 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Código Estilizado (1A, 1B, 1C...) */}
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-mono font-black shrink-0 tracking-wider",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-600 border border-slate-200 group-hover:border-primary/40 group-hover:text-primary"
                      )}>
                        {codeLabel}
                      </span>

                      {/* Nome do Termo */}
                      <span className={cn(
                        "text-xs font-black uppercase tracking-tight truncate leading-tight",
                        isSelected ? "text-white" : "text-slate-800 group-hover:text-primary"
                      )}>
                        {t.term}
                      </span>
                    </div>

                    {/* Indicador de Vídeo */}
                    <div className="shrink-0 flex items-center">
                      {hasVideo ? (
                        <span 
                          title="Vídeo demonstrativo disponível"
                          className={cn(
                            "p-1.5 rounded-full flex items-center justify-center",
                            isSelected ? "bg-white text-emerald-600" : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          <Play className="h-2 w-2 fill-current" />
                        </span>
                      ) : (
                        <span 
                          title="Em gravação"
                          className={cn(
                            "p-1.5 rounded-full flex items-center justify-center",
                            isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-400"
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
            COLUNA DA DIREITA: VISUALIZADOR BILÍNGUE LADO A LADO
            Vídeo de Libras e Texto em Português convivendo em harmonia
            ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {activeTerm ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              {/* Barra de Controle do Termo Ativo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-mono text-xs font-black tracking-wider shadow-sm">
                    {activeTerm.codeId || `${axisNumber}${String.fromCharCode(65 + (safeActiveIndex % 26))}`}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      Termo Científico
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      {activeTerm.term}
                    </h3>
                  </div>
                </div>

                {/* Seletores de Modo de Visualização */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
                  <button
                    onClick={() => setDisplayMode("bilang")}
                    title="Ver Vídeo em Libras e Texto em Português lado a lado"
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "bilang"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Lado a Lado</span>
                  </button>

                  <button
                    onClick={() => setDisplayMode("video_only")}
                    title="Expandir Vídeo em Libras"
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "video_only"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Só Vídeo</span>
                  </button>

                  <button
                    onClick={() => setDisplayMode("text_only")}
                    title="Expandir Texto em Português"
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      displayMode === "text_only"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Só Texto</span>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  ÁREA CENTRAL: LADO A LADO OU EXPANDIDA CONFORME ESCOLHA
                  ========================================================= */}
              <div className={cn(
                "gap-6",
                displayMode === "bilang" ? "grid grid-cols-1 xl:grid-cols-12 items-stretch" : "block"
              )}>
                {/* LADO ESQUERDO: VÍDEO EM LIBRAS */}
                {(displayMode === "bilang" || displayMode === "video_only") && (
                  <div className={cn(
                    "space-y-4 flex flex-col justify-between",
                    displayMode === "bilang" ? "xl:col-span-6" : "w-full"
                  )}>
                    {/* Container do Player de Vídeo */}
                    <div className="rounded-[2rem] overflow-hidden bg-slate-950 aspect-video shadow-inner border border-slate-800 flex items-center justify-center relative group">
                      {activeTerm.videoUrl || activeTerm.video_url ? (
                        <iframe
                          src={getEmbedUrl(activeTerm.videoUrl || activeTerm.video_url)}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={activeTerm.term}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-md">
                            <Play className="h-7 w-7 fill-primary/30" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                              Vídeo em Produção
                            </span>
                            <h4 className="text-base font-black uppercase tracking-tight">
                              Mediação em Libras
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                              O sinal gravado está sendo preparado para este termo. Acompanhe a estratégia de sinalização abaixo.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tag do Código no Player */}
                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-black uppercase tracking-wider border border-white/10">
                        {activeTerm.codeId || `${axisNumber}${String.fromCharCode(65 + (safeActiveIndex % 26))}`} • Libras
                      </div>
                    </div>

                    {/* Box da Estratégia em Libras */}
                    <div className="p-4 md:p-5 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                        <Ear className="h-4 w-4 shrink-0" />
                        <span>Estratégia Linguística em Libras</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {activeTerm.signStrategy || activeTerm.sign_strategy || "Sinalização técnica acompanhada de datilologia e expressão facial condizente com a gravidade sanitária."}
                      </p>
                    </div>
                  </div>
                )}

                {/* LADO DIREITO: TEXTO EM PORTUGUÊS (LIMPO, ESTRUTURADO E DIRETO) */}
                {(displayMode === "bilang" || displayMode === "text_only") && (
                  <div className={cn(
                    "p-6 md:p-7 rounded-[2rem] bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between space-y-5",
                    displayMode === "bilang" ? "xl:col-span-6 mt-4 xl:mt-0" : "w-full"
                  )}>
                    <div className="space-y-4">
                      {/* Cabeçalho do Texto em Português */}
                      <div className="flex items-center justify-between pb-3 border-b-2 border-primary/20">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                            Definição em Português
                          </span>
                          <h4 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
                            {activeTerm.term}
                          </h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shadow-sm">
                          ANVISA / MAPA
                        </span>
                      </div>

                      {/* Definição Técnica */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Conceito Oficial
                        </span>
                        <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-800">
                          {activeTerm.definition || activeTerm.description}
                        </p>
                      </div>

                      {/* Contexto e Aplicação */}
                      {activeTerm.context && (
                        <div className="space-y-1.5 pt-3 border-t border-slate-200/60">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                            <Compass className="h-3 w-3 text-primary" />
                            <span>Contexto Sanitário e Aplicação</span>
                          </span>
                          <p className="text-xs font-medium leading-relaxed text-slate-600">
                            {activeTerm.context}
                          </p>
                        </div>
                      )}

                      {/* Tags Temáticas */}
                      {activeTerm.tags && activeTerm.tags.length > 0 && (
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {activeTerm.tags.map((tag: string, tidx: number) => (
                              <span 
                                key={tidx}
                                className="px-2.5 py-1 rounded-lg bg-white text-slate-600 text-[9px] font-bold uppercase tracking-wider border border-slate-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                      <span>Inocuidade e Segurança dos Alimentos</span>
                      <span>Rede Inova Social</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Controles Inferiores: Termo Anterior e Próximo Termo */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handlePrevTerm}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Termo Anterior</span>
                </button>

                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {safeActiveIndex + 1} de {filteredTerms.length}
                </span>

                <button
                  onClick={handleNextTerm}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Próximo Termo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center text-slate-400">
              <p className="text-sm font-semibold">Selecione um termo na lista à esquerda para visualizar.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Rodapé de Navegação entre Eixos */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <button
          onClick={handleBackToHub}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar aos Eixos Temáticos</span>
        </button>

        {!isAllView && nextAxisObj && (
          <button
            onClick={handleNextAxis}
            className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] w-full sm:w-auto justify-center"
          >
            <span>Ir para o Próximo Grid: Eixo 0{nextAxisNumber} ({(nextAxisObj.title.split("—")[1] || nextAxisObj.title).trim()})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
