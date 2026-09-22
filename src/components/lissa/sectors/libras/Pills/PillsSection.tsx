"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const carouselRef = useRef<HTMLDivElement>(null);

  // Background gradients for thumbnails (Colorblind-safe: Blues, Indigos, Cyans, Ambers)
  const gradients = [
    "from-blue-950 via-slate-900 to-primary/40",
    "from-indigo-950 via-slate-900 to-blue-950/60",
    "from-slate-950 via-slate-900 to-slate-900",
    "from-amber-950 via-slate-900 to-orange-950/60",
    "from-cyan-950 via-slate-900 to-blue-950/60",
    "from-slate-900 via-indigo-950 to-blue-950/60",
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPillIndex, minutes.length]);

  const handlePrevVideo = () => {
    if (selectedPillIndex === null || minutes.length === 0) return;
    setSelectedPillIndex(prev => (prev !== null && prev > 0 ? prev - 1 : minutes.length - 1));
  };

  const handleNextVideo = () => {
    if (selectedPillIndex === null || minutes.length === 0) return;
    setSelectedPillIndex(prev => (prev !== null && prev < minutes.length - 1 ? prev + 1 : 0));
  };

  // Helper for YouTube embed
  const getEmbedUrl = (url: string, muted: boolean) => {
    if (!url) return "";
    let base = url.trim();
    if (base.includes("youtu.be/")) {
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
  const prevPill = selectedPillIndex !== null ? (selectedPillIndex > 0 ? minutes[selectedPillIndex - 1] : minutes[minutes.length - 1]) : null;
  const nextPill = selectedPillIndex !== null ? (selectedPillIndex < minutes.length - 1 ? minutes[selectedPillIndex + 1] : minutes[0]) : null;

  return (
    <div className="space-y-8 pt-4 pb-20 animate-in fade-in duration-700 w-full">
      {/* =========================================================
          CABEÇALHO COM CONTROLES DE NAVEGAÇÃO DO CARROSSEL
          ========================================================= */}
      <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="h-3.5 w-3.5" />
            <span>Ciência em Libras • Formato 4:5</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Minuto do Conhecimento
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Vídeos objetivos em Libras e português sobre conceitos fundamentais de segurança alimentar no formato vertical 4:5. Clique em qualquer vídeo para assistir em tamanho ampliado.
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
          CARROSSEL HORIZONTAL DE VÍDEOS EM FORMATO 4:5
          Proporção ideal para visualização em cards e players verticais
          ========================================================= */}
      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-3 px-2 scrollbar-none snap-x scroll-smooth w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {minutes.map((pill, i) => {
          const grad = gradients[i % gradients.length];
          const duration = pill.duration || (i % 2 === 0 ? "1 min" : "2 min");

          return (
            <motion.div
              key={pill.id || i}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedPillIndex(i)}
              className="relative w-72 sm:w-80 lg:w-[340px] aspect-[4/5] shrink-0 snap-start rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-200/80 select-none bg-slate-950"
            >
              {/* Background gradient */}
              <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity duration-300", grad)}>
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,transparent_65%)]" />
              </div>

              {/* Top Row: Duration badge + Format badge + Pill number */}
              <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-sm border border-white/10 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{duration}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-black tracking-wider border border-amber-400/30">
                    4:5
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">
                    Pílula 0{i + 1}
                  </span>
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-115 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Play className="h-7 w-7 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Details with gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-16 flex flex-col justify-end pointer-events-none">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 drop-shadow-sm">
                  {pill.category || "Segurança Alimentar"}
                </span>
                <h3 className="font-black text-base sm:text-lg leading-snug text-white drop-shadow-md line-clamp-2">
                  {pill.title}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================
          MODAL EM FORMATO MAIOR (AMPLIADO PARA PREENCHER O ESPAÇO)
          Inspirado no print 3, mas preenchendo generosamente a tela
          ========================================================= */}
      <AnimatePresence>
        {selectedPillIndex !== null && currentPill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none">
            {/* Dark immersive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPillIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />

            {/* Top Close Button */}
            <button
              onClick={() => setSelectedPillIndex(null)}
              className="absolute top-6 right-6 z-50 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl"
              title="Fechar (Esc)"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Top Audio toggle */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl"
                title={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? <VolumeX className="h-6 w-6 text-amber-400" /> : <Volume2 className="h-6 w-6 text-white" />}
              </button>
            </div>

            {/* Container Principal de Visualização Ampliado (Formato 4:5) */}
            <div className="relative z-40 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-[1700px] h-full max-h-[94vh]">
              {/* VÍDEO ANTERIOR (Preview translúcido em 4:5 à esquerda) */}
              {prevPill && (
                <div 
                  onClick={handlePrevVideo}
                  className="hidden xl:flex flex-col justify-end opacity-40 hover:opacity-90 transition-all cursor-pointer scale-95 shrink-0 w-60 2xl:w-72 aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/15 relative shadow-2xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 flex items-center gap-1">
                      <ChevronLeft className="h-3.5 w-3.5" /> Vídeo Anterior
                    </span>
                    <h4 className="text-sm font-black text-white leading-snug line-clamp-2">{prevPill.title}</h4>
                    <span className="text-[10px] font-bold text-amber-300/80 mt-1">Formato 4:5</span>
                  </div>
                </div>
              )}

              {/* Botão de Navegação Esquerda */}
              <button
                onClick={handlePrevVideo}
                className="p-3.5 sm:p-4 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-95 shrink-0"
                title="Vídeo Anterior (Seta Esquerda)"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>

              {/* VÍDEO CENTRAL EM FORMATO 4:5 */}
              <motion.div
                key={currentPill.id || selectedPillIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-[480px] sm:max-w-[520px] 2xl:max-w-[560px] max-h-[92vh] rounded-[2.5rem] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/20 bg-slate-950 flex flex-col justify-between"
              >
                {/* Top Overlay inside card */}
                <div className="relative z-30 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-950/90 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                      Pílula 0{selectedPillIndex + 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black tracking-wider">
                      4:5
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-wider border border-white/15">
                      {currentPill.category || "SAN"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-white/75">
                    {selectedPillIndex + 1} de {minutes.length}
                  </span>
                </div>

                {/* Player Central (Frame rigorosamente em formato 4:5 com encaixe perfeito) */}
                <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-hidden">
                  <div className="relative w-full aspect-[4/5] max-h-[54vh] sm:max-h-[58vh] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 flex items-center justify-center mx-auto">
                    {currentPill.videoUrl ? (
                      <iframe
                        src={getEmbedUrl(currentPill.videoUrl, isMuted)}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentPill.title}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary/30 text-white space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-2xl">
                          <Play className="h-8 w-8 fill-primary/30" />
                        </div>
                        <div className="space-y-1.5 max-w-xs">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Minuto do Conhecimento • 4:5
                          </span>
                          <h4 className="text-base font-black uppercase tracking-tight">
                            {currentPill.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                            Vídeo em produção. Confira a aplicação prática abaixo.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Details com Título, Explicação e Aplicação Prática */}
                <div className="relative z-30 px-6 py-4 md:px-7 md:py-5 bg-slate-950/95 border-t border-white/10 space-y-3 shrink-0 overflow-y-auto max-h-[30vh]">
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-sm">
                    {currentPill.title}
                  </h3>

                  {currentPill.supportText && (
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {currentPill.supportText}
                    </p>
                  )}

                  {currentPill.practicalApp && (
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200 font-medium flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 font-black">Aplicação Prática:</strong>{" "}
                        <span>{currentPill.practicalApp}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Botão de Navegação Direita */}
              <button
                onClick={handleNextVideo}
                className="p-3.5 sm:p-4 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-95 shrink-0"
                title="Próximo Vídeo (Seta Direita)"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>

              {/* PRÓXIMO VÍDEO (Preview translúcido em 4:5 à direita) */}
              {nextPill && (
                <div 
                  onClick={handleNextVideo}
                  className="hidden xl:flex flex-col justify-end opacity-40 hover:opacity-90 transition-all cursor-pointer scale-95 shrink-0 w-60 2xl:w-72 aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/15 relative shadow-2xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 flex items-center justify-end gap-1">
                      Próximo Vídeo <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-sm font-black text-white leading-snug line-clamp-2">{nextPill.title}</h4>
                    <span className="text-[10px] font-bold text-amber-300/80 mt-1 text-right">Formato 4:5</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
