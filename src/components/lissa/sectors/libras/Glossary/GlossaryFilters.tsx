"use client";

import React, { useState, useMemo } from "react";
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
  HelpCircle,
  FileText,
  Clock,
  Compass,
  CheckCircle2
} from "lucide-react";

export function GlossaryFilters() {
  // selectedAxisId: null = Hub view (shows ONLY the 6 grid cards)
  // string (e.g. "1", "2", "todos") = Dedicated axis view with terms grid
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);
  const [termQuery, setTermQuery] = useState("");
  const [videoOnlyFilter, setVideoOnlyFilter] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<any | null>(null);

  const totalTermsCount = useMemo(() => {
    return librasGlossary.reduce((acc, curr) => acc + (curr.terms?.length || 0), 0);
  }, []);

  // Ordered eixos list
  const eixosList = useMemo(() => {
    return librasGlossary.map((e, index) => ({
      ...e,
      numericId: e.numericId || (index + 1)
    }));
  }, []);

  // Current active axis object
  const currentEixo = useMemo(() => {
    if (!selectedAxisId || selectedAxisId === "todos") return null;
    return eixosList.find(e => String(e.numericId) === String(selectedAxisId) || String(e.id).toLowerCase() === String(selectedAxisId).toLowerCase()) || null;
  }, [selectedAxisId, eixosList]);

  // Current terms list
  const currentTerms = useMemo(() => {
    if (!selectedAxisId) return [];
    if (selectedAxisId === "todos") {
      return eixosList.flatMap(e => (e.terms || []).map(t => ({ ...t, axisTitle: e.title, axisEmoji: e.emoji, axisNum: e.numericId })));
    }
    if (!currentEixo) return [];
    return (currentEixo.terms || []).map(t => ({ ...t, axisTitle: currentEixo.title, axisEmoji: currentEixo.emoji, axisNum: currentEixo.numericId }));
  }, [selectedAxisId, currentEixo, eixosList]);

  // Filtered terms based on query and video filter
  const filteredTerms = useMemo(() => {
    return currentTerms.filter(t => {
      if (videoOnlyFilter && !t.videoUrl && !t.video_url) return false;
      if (!termQuery.trim()) return true;
      const q = termQuery.toLowerCase().trim();
      const termName = (t.term || "").toLowerCase();
      const def = (t.definition || t.description || "").toLowerCase();
      const tags = (t.tags || []).join(" ").toLowerCase();
      const strat = (t.signStrategy || t.sign_strategy || "").toLowerCase();
      return termName.includes(q) || def.includes(q) || tags.includes(q) || strat.includes(q);
    });
  }, [currentTerms, termQuery, videoOnlyFilter]);

  // Count terms with video
  const termsWithVideoCount = useMemo(() => {
    return currentTerms.filter(t => Boolean(t.videoUrl || t.video_url)).length;
  }, [currentTerms]);

  // Axis navigation handlers
  const handleSelectAxis = (axisId: string) => {
    setSelectedAxisId(axisId);
    setTermQuery("");
    setVideoOnlyFilter(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const handleBackToHub = () => {
    setSelectedAxisId(null);
    setTermQuery("");
    setVideoOnlyFilter(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 350, behavior: "smooth" });
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

  // Helper for YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.includes("youtu.be/")) {
      const id = trimmed.split("youtu.be/")[1]?.split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=1&rel=0&modestbranding=1`;
    }
    if (trimmed.includes("watch?v=")) {
      const id = trimmed.split("watch?v=")[1]?.split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=1&rel=0&modestbranding=1`;
    }
    if (trimmed.includes("youtube.com/embed/")) {
      const sep = trimmed.includes("?") ? "&" : "?";
      return `${trimmed}${sep}autoplay=1&mute=1&loop=1&controls=1&rel=0&modestbranding=1`;
    }
    return trimmed;
  };

  // Term modal navigation
  const handleNextTerm = () => {
    if (!selectedTerm || filteredTerms.length === 0) return;
    const currentIndex = filteredTerms.findIndex(t => t.term === selectedTerm.term);
    if (currentIndex !== -1 && currentIndex < filteredTerms.length - 1) {
      setSelectedTerm(filteredTerms[currentIndex + 1]);
    } else if (currentIndex === filteredTerms.length - 1) {
      setSelectedTerm(filteredTerms[0]);
    }
  };

  const handlePrevTerm = () => {
    if (!selectedTerm || filteredTerms.length === 0) return;
    const currentIndex = filteredTerms.findIndex(t => t.term === selectedTerm.term);
    if (currentIndex > 0) {
      setSelectedTerm(filteredTerms[currentIndex - 1]);
    } else if (currentIndex === 0) {
      setSelectedTerm(filteredTerms[filteredTerms.length - 1]);
    }
  };

  // ==========================================
  // VIEW 1: HUB COM OS 6 GRIDS (CLEAN E DIRETO)
  // ==========================================
  if (!selectedAxisId) {
    return (
      <div className="space-y-8 mb-16 animate-in fade-in duration-500">
        {/* Banner do Hub */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Layers className="h-3.5 w-3.5" />
              <span>Mediação em Libras • Inocuidade dos Alimentos</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
              Eixos Temáticos do Glossário
            </h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
              Clique em qualquer um dos 6 eixos abaixo para acessar a página exclusiva de seus termos científicos, estratégias linguísticas e vídeos de mediação em Libras.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSelectAxis("todos")}
              className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-primary transition-all flex items-center gap-2.5 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Ver Todos os Termos ({totalTermsCount})</span>
            </button>
          </div>
        </div>

        {/* Grade dos 6 Eixos */}
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
                  className="w-full text-left bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between min-h-[260px] relative overflow-hidden group-hover:ring-4 group-hover:ring-primary/5"
                >
                  {/* Decorative background glow */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  <div>
                    {/* Top row: Emoji, Axis Badge, Count */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3.5">
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

                    {/* Axis Title */}
                    <h4 className="font-black text-xl text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug mb-3">
                      {displayTitle}
                    </h4>

                    {/* Axis Description */}
                    <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                      {eixo.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary flex items-center gap-2 transition-colors">
                      <span>Acessar Eixo 0{axisNum}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary">
                      {termCount} termos científicos
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
  // VIEW 2: PÁGINA EXCLUSIVA DO RESPECTIVO GRID (COM VOLTAR E PRÓXIMO GRID)
  // =========================================================================
  const isAllView = selectedAxisId === "todos";
  const axisNumber = currentEixo?.numericId || 1;
  const nextAxisNumber = axisNumber === eixosList.length ? 1 : axisNumber + 1;
  const nextAxisObj = eixosList.find(e => e.numericId === nextAxisNumber);

  return (
    <div className="space-y-8 mb-20 animate-in fade-in duration-500">
      {/* Barra de Navegação Superior: Voltar + Navegação entre Grids */}
      <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Botão de Voltar para Libras Científica */}
        <button
          onClick={handleBackToHub}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-black text-xs uppercase tracking-wider transition-all shadow-sm group w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Libras Científica</span>
        </button>

        {/* Controles de Próximo Grid / Grid Anterior */}
        {!isAllView && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrevAxis}
              title="Ir para o Eixo Anterior"
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Anterior</span>
            </button>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="text-primary">Eixo 0{axisNumber}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">0{eixosList.length}</span>
            </div>

            <button
              onClick={handleNextAxis}
              title={`Ir para o próximo grid: Eixo 0${nextAxisNumber}`}
              className="px-4 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <span>Próximo Grid (Eixo 0{nextAxisNumber})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {isAllView && (
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Exibindo todos os 347 termos
          </span>
        )}
      </div>

      {/* Header do Grid Selecionado */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-4xl p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                {isAllView ? "📚" : currentEixo?.emoji}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {isAllView ? "Visão Global" : `Eixo Temático 0${axisNumber}`}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                {currentTerms.length} termos cadastrados
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-snug">
              {isAllView ? "Todos os Termos da Mediação em Libras" : currentEixo?.title}
            </h2>

            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
              {isAllView
                ? "Catálogo completo com todos os 347 termos científicos aprovados de inocuidade dos alimentos com definições técnicas e estratégias de mediação em Libras."
                : currentEixo?.description}
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[130px]">
              <span className="text-2xl font-black text-slate-800 block">{currentTerms.length}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total no Eixo</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center min-w-[130px]">
              <span className="text-2xl font-black text-emerald-600 block">{termsWithVideoCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Com Vídeo</span>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros do Eixo */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={termQuery}
              onChange={(e) => setTermQuery(e.target.value)}
              placeholder={`Buscar termo em ${isAllView ? 'todos' : 'Eixo 0' + axisNumber}...`}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {termQuery && (
              <button 
                onClick={() => setTermQuery("")} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setVideoOnlyFilter(!videoOnlyFilter)}
              className={cn(
                "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-2",
                videoOnlyFilter
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              )}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Apenas com Vídeo ({termsWithVideoCount})</span>
            </button>
            <span className="text-xs font-bold text-slate-400 px-2">
              Mostrando {filteredTerms.length} de {currentTerms.length} termos
            </span>
          </div>
        </div>
      </div>

      {/* GRID DOS TERMOS DO RESPECTIVO EIXO */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            Nenhum termo encontrado
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não encontramos termos correspondentes a "{termQuery}". Tente outro termo ou limpe os filtros de busca.
          </p>
          <button
            onClick={() => { setTermQuery(""); setVideoOnlyFilter(false); }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all"
          >
            Limpar Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTerms.map((termItem: any, idx: number) => {
            const hasVideo = Boolean(termItem.videoUrl || termItem.video_url);
            const termNumber = String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={termItem.id || termItem.term || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.4), duration: 0.3 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedTerm(termItem)}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                <div>
                  {/* Topo do Card do Termo */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] font-black uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      #{termNumber}
                    </span>

                    {hasVideo ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-black uppercase tracking-widest shadow-sm">
                        <Play className="h-2.5 w-2.5 fill-emerald-600 text-emerald-600" />
                        <span>Vídeo Disponível</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[9px] font-black uppercase tracking-widest">
                        <Clock className="h-2.5 w-2.5" />
                        <span>Em gravação</span>
                      </span>
                    )}
                  </div>

                  {/* Nome do Termo */}
                  <h4 className="font-black text-base md:text-lg text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug mb-2.5">
                    {termItem.term}
                  </h4>

                  {/* Snippet da Definição */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed mb-4">
                    {termItem.definition || termItem.description}
                  </p>

                  {/* Tags */}
                  {termItem.tags && termItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {termItem.tags.slice(0, 3).map((tag: string, tidx: number) => (
                        <span 
                          key={tidx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodapé do Card */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary flex items-center gap-1.5 transition-colors">
                    <Ear className="h-3.5 w-3.5 text-primary" />
                    <span>Ver Mediação em Libras</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Navegação Inferior: Voltar ou Próximo Grid */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
        <button
          onClick={handleBackToHub}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Libras Científica</span>
        </button>

        {!isAllView && nextAxisObj && (
          <button
            onClick={handleNextAxis}
            className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] w-full sm:w-auto justify-center"
          >
            <span>Ver Próximo Grid: Eixo 0{nextAxisNumber} ({(nextAxisObj.title.split("—")[1] || nextAxisObj.title).trim()})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* =======================================================
          MODAL DE DETALHES DO TERMO & MEDIAÇÃO EM LIBRAS
          ======================================================= */}
      <AnimatePresence>
        {selectedTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTerm(null)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-slate-100 p-6 md:p-10 space-y-8"
            >
              {/* Header do Modal */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      Mediação em Libras
                    </span>
                    {selectedTerm.axisTitle && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {selectedTerm.axisEmoji} {selectedTerm.axisTitle}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {selectedTerm.term}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedTerm(null)}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Área do Vídeo */}
              <div className="rounded-[2.5rem] overflow-hidden bg-slate-950 aspect-video relative shadow-inner border border-slate-800">
                {selectedTerm.videoUrl || selectedTerm.video_url ? (
                  <iframe
                    src={getEmbedUrl(selectedTerm.videoUrl || selectedTerm.video_url)}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedTerm.term}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                      <Play className="h-8 w-8 fill-primary/40" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Vídeo em Produção
                      </span>
                      <h4 className="text-lg font-black uppercase tracking-tight">
                        Gravação do Sinal em Libras
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        O vídeo demonstrativo deste termo está sendo preparado pela equipe de mediação em Libras. Veja a estratégia linguística e a definição técnica abaixo.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Blocos de Informação */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Estratégia em Libras */}
                <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Ear className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Estratégia Linguística em Libras
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {selectedTerm.signStrategy || selectedTerm.sign_strategy || "Sinalização técnica acompanhada de soletração datilológica quando necessário e expressão facial compatível com o conceito sanitário."}
                  </p>
                </div>

                {/* Contexto de Aplicação */}
                <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Compass className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Contexto e Aplicação
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                    {selectedTerm.context || "Aplicado nos procedimentos operacionais padronizados (POP), fiscalizações e rotinas de controle de qualidade na cadeia de alimentos."}
                  </p>
                </div>
              </div>

              {/* Definição Técnica */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Definição Técnica Oficial (ANVISA / MAPA / Legislação)
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                  {selectedTerm.definition || selectedTerm.description}
                </p>
              </div>

              {/* Tags */}
              {selectedTerm.tags && selectedTerm.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Classificação Temática
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navegação entre Termos no Modal */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handlePrevTerm}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Termo Anterior</span>
                </button>

                <button
                  onClick={() => setSelectedTerm(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider transition-all"
                >
                  Fechar
                </button>

                <button
                  onClick={handleNextTerm}
                  className="px-5 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                  <span>Próximo Termo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
