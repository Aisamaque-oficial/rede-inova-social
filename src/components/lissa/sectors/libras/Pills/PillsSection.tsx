"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Play, 
  Pause,
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Volume2, 
  VolumeX,
  Sparkles,
  Info,
  ExternalLink,
  Flame,
  ArrowRight
} from "lucide-react";
import { useLibras } from "../LibrasContext";
import { cn } from "@/lib/utils";

export function PillsSection() {
  const { minutes } = useLibras();
  const [selectedPillIndex, setSelectedPillIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open to ensure clean centered view
  useEffect(() => {
    if (selectedPillIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedPillIndex]);

  // Reset showInfo when switching video
  useEffect(() => {
    setShowInfo(false);
  }, [selectedPillIndex]);

  const handleOpenPill = (index: number) => {
    setSelectedPillIndex(index);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleShare = (url?: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Background gradients for thumbnails (Colorblind-safe: Blues, Indigos, Cyans, Ambers)
  const gradients = [
    "from-blue-950 via-slate-900 to-primary/40",
    "from-indigo-950 via-slate-900 to-blue-950/60",
    "from-slate-950 via-slate-900 to-slate-900",
    "from-amber-950 via-slate-900 to-orange-950/60",
    "from-cyan-950 via-slate-900 to-blue-950/60",
    "from-slate-950 via-slate-900 to-primary/30",
    "from-blue-900 via-slate-900 to-slate-950",
  ];

  // Carousel scroll functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const total = minutes.length;

  // Keyboard navigation for the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPillIndex === null) return;
      if (e.key === "Escape") {
        setSelectedPillIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevVideo();
      } else if (e.key === "ArrowRight") {
        handleNextVideo();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => !prev);
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPillIndex, total]);

  const handlePrevVideo = () => {
    if (selectedPillIndex === null || total === 0) return;
    setSelectedPillIndex(prev => (prev !== null && prev > 0 ? prev - 1 : total - 1));
  };

  const handleNextVideo = () => {
    if (selectedPillIndex === null || total === 0) return;
    setSelectedPillIndex(prev => (prev !== null && prev < total - 1 ? prev + 1 : 0));
  };

  // Helper for YouTube embed (supports regular, shorts and youtu.be)
  const getEmbedUrl = (url: string, muted: boolean) => {
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
    const muteParam = muted ? "1" : "0";
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}autoplay=1&mute=${muteParam}&loop=1&controls=1&rel=0&modestbranding=1&playsinline=1`;
  };

  const currentPill = selectedPillIndex !== null ? minutes[selectedPillIndex] : null;

  const getPillAt = (offset: number) => {
    if (selectedPillIndex === null || total === 0) return null;
    const idx = (selectedPillIndex + offset + total) % total;
    return { pill: minutes[idx], index: idx };
  };

  const prev2 = total > 4 ? getPillAt(-2) : null;
  const prev1 = total > 1 ? getPillAt(-1) : null;
  const next1 = total > 1 ? getPillAt(1) : null;
  const next2 = total > 4 ? getPillAt(2) : null;

  return (
    <div 
      ref={sectionRef}
      className="space-y-8 pt-4 pb-20 animate-in fade-in duration-700 w-full"
    >
      {/* =========================================================
          CABEÇALHO COM CONTROLES DE NAVEGAÇÃO DO CARROSSEL
          ========================================================= */}
      <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="h-3.5 w-3.5" />
            <span>Ciência em Libras</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Minuto do Conhecimento
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Vídeos objetivos em Libras e português sobre conceitos fundamentais de alimentação e nutrição. Clique em qualquer vídeo para assistir em tamanho ampliado.
          </p>
          <p className="text-[11px] md:text-xs text-slate-500 font-medium italic pt-1">
            * A capa de cada vídeo foi gerada por Inteligência Artificial.
          </p>
        </div>

        {/* Botões de Avanço do Carrossel */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={scrollLeft}
            title="Rolar vídeos para esquerda"
            className="p-3.5 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-700 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            title="Rolar vídeos para direita"
            className="p-3.5 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-700 transition-all shadow-sm active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* =========================================================
          CARROSSEL HORIZONTAL DE VÍDEOS EM FORMATO VERTICAL 9:16 (SHORTS/REELS)
          Capas limpas sem badges de tempo, formato, número ou categorias
          ========================================================= */}
      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-3 px-2 scrollbar-none snap-x scroll-smooth w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {minutes.map((pill, i) => {
          const grad = gradients[i % gradients.length];

          return (
            <motion.div
              key={pill.id || i}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleOpenPill(i)}
              className="relative w-64 sm:w-72 lg:w-80 aspect-[9/16] shrink-0 snap-start rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-200/80 select-none bg-slate-950"
            >
              {/* Background gradient or thumbnail image */}
              {pill.thumbnail ? (
                <div className="absolute inset-0 bg-slate-950">
                  <img 
                    src={pill.thumbnail} 
                    alt={pill.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                </div>
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity duration-300", grad)}>
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,transparent_65%)]" />
                </div>
              )}

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-115 group-hover:bg-primary group-hover:border-primary transition-all duration-300 opacity-90 group-hover:opacity-100">
                  <Play className="h-7 w-7 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Título exibido apenas em cards sem capa ilustrada própria */}
              {!pill.thumbnail && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-16 flex flex-col justify-end pointer-events-none">
                  <h3 className="font-black text-base sm:text-lg leading-snug text-white drop-shadow-md line-clamp-3">
                    {pill.title}
                  </h3>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Observação informativa da seção */}
      <div className="px-3 -mt-4">
        <p className="text-[11px] md:text-xs text-slate-500 font-medium italic">
          * A capa de cada vídeo foi gerada por Inteligência Artificial.
        </p>
      </div>

      {/* =========================================================
          MODAL FULL SCREEN EM FORMATO STORIES / G1
          Vídeo vertical 9:16 ocupa quase 100% da altura da tela (h-[92vh]/[95vh]),
          com cards adjacentes nas laterais e botões circulares flutuantes.
          ========================================================= */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedPillIndex !== null && currentPill && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center select-none w-screen h-screen overflow-hidden bg-black/95 backdrop-blur-2xl">
              {/* Dark immersive backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPillIndex(null)}
                className="fixed inset-0 bg-black/90"
              />

              {/* Main Stories Flex Row */}
              <div className="relative z-40 flex items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full h-full max-h-screen px-2 md:px-6">
                
                {/* 1. Preview Card: 2 atrás (visível em telas 2xl) */}
                {prev2 && (
                  <div
                    onClick={() => setSelectedPillIndex(prev2.index)}
                    className="hidden 2xl:flex flex-col justify-end opacity-25 hover:opacity-75 transition-all cursor-pointer scale-90 shrink-0 h-[74vh] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative shadow-2xl group"
                  >
                    {prev2.pill.thumbnail ? (
                      <img
                        src={prev2.pill.thumbnail}
                        alt={prev2.pill.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                      <h5 className="text-xs font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                        {prev2.pill.title}
                      </h5>
                    </div>
                  </div>
                )}

                {/* 2. Preview Card: 1 atrás (visível em telas lg+) */}
                {prev1 && (
                  <div
                    onClick={() => setSelectedPillIndex(prev1.index)}
                    className="hidden lg:flex flex-col justify-end opacity-40 hover:opacity-85 transition-all cursor-pointer scale-95 shrink-0 h-[84vh] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/15 relative shadow-2xl group"
                  >
                    {prev1.pill.thumbnail ? (
                      <img
                        src={prev1.pill.thumbnail}
                        alt={prev1.pill.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5 flex flex-col justify-end">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                        <ChevronLeft className="h-3.5 w-3.5" /> Anterior
                      </span>
                      <h5 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                        {prev1.pill.title}
                      </h5>
                    </div>
                  </div>
                )}

                {/* 3. Botão Seta Esquerda (Navegação) */}
                <button
                  onClick={handlePrevVideo}
                  className="p-3 sm:p-4 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all shrink-0 z-30"
                  title="Vídeo Anterior (Seta Esquerda)"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>

                {/* 4. VÍDEO CENTRAL ATIVO (9:16 FULL HEIGHT, FORMATO G1) */}
                <motion.div
                  key={currentPill.id || selectedPillIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-[92vh] sm:h-[95vh] max-h-[96vh] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/20 bg-black flex flex-col shrink-0 z-20 group"
                >
                  {/* Player de Vídeo em Full Bleed (ocupa 100% da altura e largura da moldura 9:16) */}
                  <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
                    {currentPill.videoUrl ? (
                      <iframe
                        src={getEmbedUrl(currentPill.videoUrl, isMuted)}
                        className="w-full h-full object-cover border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentPill.title}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary/30 text-white space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-2xl">
                          <Play className="h-8 w-8 fill-primary/30" />
                        </div>
                        <div className="space-y-1.5 max-w-xs">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Minuto do Conhecimento
                          </span>
                          <h4 className="text-base font-black uppercase tracking-tight">
                            {currentPill.title}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Vídeo em produção técnica.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gradiente Superior com Indicador de Vídeo */}
                  <div className="absolute inset-x-0 top-0 pt-4 pb-12 px-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10 flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-lg">
                      Minuto do Conhecimento • {selectedPillIndex + 1} de {total}
                    </span>
                  </div>

                  {/* Gradiente Inferior com Título e Acesso à Aplicação Prática */}
                  <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 space-y-2 pointer-events-auto">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug drop-shadow-md">
                      {currentPill.title}
                    </h3>

                    {(currentPill.supportText || currentPill.practicalApp) && (
                      <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all border border-white/20 shadow-md"
                      >
                        <Info className="h-3.5 w-3.5 text-amber-300" />
                        <span>{showInfo ? "Ocultar detalhes" : "Ver aplicação prática"}</span>
                      </button>
                    )}

                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium italic pt-1">
                      * A capa de cada vídeo foi gerada por Inteligência Artificial.
                    </p>
                  </div>

                  {/* Drawer de Detalhes / Aplicação Prática (slide-up) */}
                  <AnimatePresence>
                    {showInfo && (
                      <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-x-0 bottom-0 max-h-[75%] bg-slate-950/95 backdrop-blur-xl border-t border-white/20 p-5 rounded-t-3xl z-20 overflow-y-auto space-y-3.5 shadow-2xl text-slate-200"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" /> Mediação & Aplicação Prática
                          </span>
                          <button
                            onClick={() => setShowInfo(false)}
                            className="p-1 rounded-full text-slate-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {currentPill.supportText && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Conceito & Contexto:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {currentPill.supportText}
                            </p>
                          </div>
                        )}

                        {currentPill.practicalApp && (
                          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100 font-medium space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Como aplicar no dia a dia:
                            </span>
                            <p className="text-xs leading-relaxed">{currentPill.practicalApp}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* 5. Botões Flutuantes de Ação no Lado Direito (G1 Style) */}
                <div className="flex flex-col items-center gap-3 shrink-0 z-30">
                  {/* Botão Fechar */}
                  <button
                    onClick={() => setSelectedPillIndex(null)}
                    className="p-3 sm:p-3.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-95"
                    title="Fechar (Esc)"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Botão Áudio Mute / Unmute */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 sm:p-3.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-95"
                    title={isMuted ? "Ativar som" : "Desativar som"}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5 text-amber-400" /> : <Volume2 className="h-5 w-5 text-white" />}
                  </button>

                  {/* Botão Detalhes / Info */}
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={cn(
                      "p-3 sm:p-3.5 rounded-full backdrop-blur-md border shadow-2xl transition-all active:scale-95",
                      showInfo 
                        ? "bg-amber-400 text-slate-950 border-amber-300" 
                        : "bg-white/20 hover:bg-white/35 text-white border-white/25"
                    )}
                    title="Ver aplicação prática e contexto"
                  >
                    <Info className="h-5 w-5" />
                  </button>

                  {/* Botão Compartilhar */}
                  <button
                    onClick={() => handleShare(currentPill.videoUrl)}
                    className="p-3 sm:p-3.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-95 relative"
                    title="Compartilhar vídeo"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Share2 className="h-5 w-5 text-white" />}
                  </button>
                </div>

                {/* 6. Botão Seta Direita (Navegação) */}
                <button
                  onClick={handleNextVideo}
                  className="p-3 sm:p-4 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all shrink-0 z-30"
                  title="Próximo Vídeo (Seta Direita)"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>

                {/* 7. Preview Card: 1 à frente (visível em telas lg+) */}
                {next1 && (
                  <div
                    onClick={() => setSelectedPillIndex(next1.index)}
                    className="hidden lg:flex flex-col justify-end opacity-40 hover:opacity-85 transition-all cursor-pointer scale-95 shrink-0 h-[84vh] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/15 relative shadow-2xl group"
                  >
                    {next1.pill.thumbnail ? (
                      <img
                        src={next1.pill.thumbnail}
                        alt={next1.pill.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5 flex flex-col justify-end">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary mb-1 flex items-center justify-end gap-1">
                        Próximo <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                      <h5 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                        {next1.pill.title}
                      </h5>
                    </div>
                  </div>
                )}

                {/* 8. Preview Card: 2 à frente (visível em telas 2xl) */}
                {next2 && (
                  <div
                    onClick={() => setSelectedPillIndex(next2.index)}
                    className="hidden 2xl:flex flex-col justify-end opacity-25 hover:opacity-75 transition-all cursor-pointer scale-90 shrink-0 h-[74vh] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative shadow-2xl group"
                  >
                    {next2.pill.thumbnail ? (
                      <img
                        src={next2.pill.thumbnail}
                        alt={next2.pill.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                      <h5 className="text-xs font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                        {next2.pill.title}
                      </h5>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
