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
  Info
} from "lucide-react";
import { useLibras } from "../LibrasContext";
import { cn } from "@/lib/utils";

export function PillsSection() {
  const { minutes } = useLibras();
  const [selectedPillIndex, setSelectedPillIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Background gradients for thumbnails
  const gradients = [
    "from-purple-950 via-slate-900 to-primary/40",
    "from-blue-950 via-slate-900 to-emerald-950/60",
    "from-emerald-950 via-slate-900 to-teal-900/60",
    "from-amber-950 via-slate-900 to-orange-950/60",
    "from-indigo-950 via-slate-900 to-cyan-950/60",
    "from-rose-950 via-slate-900 to-purple-950/60",
    "from-slate-950 via-slate-900 to-primary/30",
    "from-teal-950 via-slate-900 to-blue-950/60",
  ];

  // Carousel scroll functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
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
    <div className="space-y-8 pt-6 pb-16 animate-in fade-in duration-700">
      {/* =========================================================
          CABEÇALHO COM CONTROLES DE NAVEGAÇÃO DO CARROSSEL
          ========================================================= */}
      <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap className="h-3.5 w-3.5" />
            <span>Pílulas Rápidas • Formato Vertical</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Minuto do Conhecimento
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Vídeos curtos e objetivos em Libras e português sobre conceitos fundamentais de segurança alimentar. Clique em qualquer vídeo para assistir em formato ampliado.
          </p>
        </div>

        {/* Botões de Avanço do Carrossel (Idênticos ao print do g1) */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={scrollLeft}
            title="Rolar vídeos para esquerda"
            className="p-3 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-700 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            title="Rolar vídeos para direita"
            className="p-3 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-700 transition-all shadow-sm active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* =========================================================
          CARROSSEL HORIZONTAL DE VÍDEOS VERTICAIS (SHORTS/REELS)
          Inspirado diretamente na disposição do print 1 (G1 Vídeos Curtos)
          ========================================================= */}
      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none snap-x scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {minutes.map((pill, i) => {
          const grad = gradients[i % gradients.length];
          const duration = pill.duration || (i % 2 === 0 ? "1 min" : "2 min");

          return (
            <motion.div
              key={pill.id || i}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedPillIndex(i)}
              className="relative w-56 sm:w-64 aspect-[9/16] shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 group border border-slate-200/80 select-none bg-slate-950"
            >
              {/* Background gradient / simulated frame */}
              <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity duration-300", grad)}>
                {/* Visual accents */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,transparent_60%)]" />
              </div>

              {/* Top Row: Duration badge + Topic badge */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/10 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span>{duration}</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                  #{i + 1}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-115 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Play className="h-6 w-6 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Details with gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 pt-16 flex flex-col justify-end pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 drop-shadow-sm">
                  {pill.category || "Segurança Alimentar"}
                </span>
                <h3 className="font-black text-sm sm:text-base leading-snug text-white drop-shadow-md line-clamp-3">
                  {pill.title}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================
          MODAL EM FORMATO MAIOR (EXATAMENTE COMO NO PRINT 3)
          Player imersivo 9:16 com navegação pelos vídeos vizinhos
          ========================================================= */}
      <AnimatePresence>
        {selectedPillIndex !== null && currentPill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 select-none">
            {/* Dark immersive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPillIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            {/* Top Close Button */}
            <button
              onClick={() => setSelectedPillIndex(null)}
              className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/20 shadow-xl"
              title="Fechar (Esc)"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Controles de Som e Info no Topo */}
            <div className="absolute top-5 left-5 z-50 flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/20 shadow-xl"
                title={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setShowInfoOverlay(!showInfoOverlay)}
                className={cn(
                  "p-3 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-xl",
                  showInfoOverlay ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20 text-white"
                )}
                title="Alternar legenda/informações"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>

            {/* Container Principal de Visualização e Navegação */}
            <div className="relative z-40 flex items-center justify-center gap-4 md:gap-8 w-full max-w-6xl h-full max-h-[92vh]">
              {/* VÍDEO ANTERIOR (Preview translúcido à esquerda, como no print 3) */}
              {prevPill && (
                <div 
                  onClick={handlePrevVideo}
                  className="hidden lg:flex flex-col items-center justify-center opacity-30 hover:opacity-75 transition-all cursor-pointer scale-90 shrink-0 w-44 aspect-[9/16] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 relative shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Anterior</span>
                    <h4 className="text-xs font-black text-white line-clamp-2">{prevPill.title}</h4>
                  </div>
                </div>
              )}

              {/* Botão de Navegação Esquerda */}
              <button
                onClick={handlePrevVideo}
                className="p-3.5 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all active:scale-95 shrink-0"
                title="Vídeo Anterior (Seta Esquerda)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* VÍDEO CENTRAL EM FORMATO MAIOR (O Protagonista em 9:16) */}
              <motion.div
                key={currentPill.id || selectedPillIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-[420px] aspect-[9/16] max-h-[85vh] rounded-[2.5rem] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/20 bg-slate-950 flex flex-col justify-between"
              >
                {/* Player do Vídeo */}
                <div className="absolute inset-0 bg-slate-950">
                  {currentPill.videoUrl ? (
                    <iframe
                      src={getEmbedUrl(currentPill.videoUrl, isMuted)}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentPill.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary/30 text-white space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-xl">
                        <Play className="h-8 w-8 fill-primary/30" />
                      </div>
                      <div className="space-y-1 max-w-xs">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                          Minuto do Conhecimento
                        </span>
                        <h4 className="text-lg font-black uppercase tracking-tight">
                          {currentPill.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Vídeo em produção. Confira a aplicação prática abaixo.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Overlay Badge */}
                <div className="relative z-20 p-5 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      Pílula 0{selectedPillIndex + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">
                      {currentPill.category || "SAN"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-white/70">
                    {selectedPillIndex + 1} de {minutes.length}
                  </span>
                </div>

                {/* Bottom Overlay com Título e Microexplicação (como no print 3) */}
                {showInfoOverlay && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-20 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-3 pointer-events-auto"
                  >
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-md">
                      {currentPill.title}
                    </h3>

                    {currentPill.supportText && (
                      <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                        {currentPill.supportText}
                      </p>
                    )}

                    {currentPill.practicalApp && (
                      <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-emerald-300 font-semibold flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Aplicação:</strong> {currentPill.practicalApp}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Botão de Navegação Direita */}
              <button
                onClick={handleNextVideo}
                className="p-3.5 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all active:scale-95 shrink-0"
                title="Próximo Vídeo (Seta Direita)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* PRÓXIMO VÍDEO (Preview translúcido à direita, como no print 3) */}
              {nextPill && (
                <div 
                  onClick={handleNextVideo}
                  className="hidden lg:flex flex-col items-center justify-center opacity-30 hover:opacity-75 transition-all cursor-pointer scale-90 shrink-0 w-44 aspect-[9/16] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 relative shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Próximo</span>
                    <h4 className="text-xs font-black text-white line-clamp-2">{nextPill.title}</h4>
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
