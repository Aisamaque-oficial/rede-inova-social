"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Brain, 
  Sparkles, 
  BookOpen, 
  Ear, 
  Zap, 
  HelpCircle, 
  MapPin, 
  Trophy, 
  RotateCcw,
  Check,
  AlertCircle,
  Film,
  ChevronRight,
  ChevronLeft,
  Plus,
  Volume2,
  Layers,
  Tv,
  Info,
  Share2,
  Bookmark
} from "lucide-react";
import { librasTracks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Aesthetic gradients for cinematic cards
const CARD_GRADIENTS = [
  "from-emerald-950 via-slate-900 to-slate-950",
  "from-cyan-950 via-slate-900 to-slate-950",
  "from-amber-950 via-slate-900 to-slate-950",
  "from-teal-950 via-slate-900 to-slate-950",
  "from-blue-950 via-slate-900 to-slate-950",
  "from-violet-950 via-slate-900 to-slate-950"
];

const ACCENT_COLORS = [
  "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  "text-amber-400 border-amber-500/30 bg-amber-500/10",
  "text-teal-400 border-teal-500/30 bg-teal-500/10",
  "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "text-violet-400 border-violet-500/30 bg-violet-500/10"
];

export function TracksSection() {
  // Active track being viewed/studied (null = catalog view)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  
  // Featured track for the billboard hero (defaults to first track)
  const [billboardTrackId, setBillboardTrackId] = useState<string>(librasTracks[0]?.id || "trilha-1");

  // Track step management (0 to steps.length)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Interactive stage states
  const [selectedCaseOption, setSelectedCaseOption] = useState<string | null>(null);
  const [selectedTerritoryOption, setSelectedTerritoryOption] = useState<number | null>(null);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Completed tracks and Bookmarks in localStorage
  const [completedTrackIds, setCompletedTrackIds] = useState<string[]>([]);
  const [bookmarkedTrackIds, setBookmarkedTrackIds] = useState<string[]>([]);

  // Horizontal carousel scroll ref
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCompleted = localStorage.getItem("lissa_completed_tracks");
        if (storedCompleted) {
          setCompletedTrackIds(JSON.parse(storedCompleted));
        }
        const storedBookmarks = localStorage.getItem("lissa_bookmarked_tracks");
        if (storedBookmarks) {
          setBookmarkedTrackIds(JSON.parse(storedBookmarks));
        }
      } catch (e) {
        console.error("Error reading storage:", e);
      }
    }
  }, []);

  const saveTrackCompletion = (trackId: string) => {
    if (!completedTrackIds.includes(trackId)) {
      const updated = [...completedTrackIds, trackId];
      setCompletedTrackIds(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("lissa_completed_tracks", JSON.stringify(updated));
        } catch (e) {
          console.error("Error saving completed track:", e);
        }
      }
    }
  };

  const toggleBookmark = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = bookmarkedTrackIds.includes(trackId)
      ? bookmarkedTrackIds.filter(id => id !== trackId)
      : [...bookmarkedTrackIds, trackId];
    setBookmarkedTrackIds(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lissa_bookmarked_tracks", JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving bookmark:", err);
      }
    }
  };

  const activeTrack = useMemo(() => {
    return librasTracks.find(t => t.id === activeTrackId) || null;
  }, [activeTrackId]);

  const billboardTrack = useMemo(() => {
    return librasTracks.find(t => t.id === billboardTrackId) || librasTracks[0];
  }, [billboardTrackId]);

  const categories = ["Todas", "Alimentação", "Segurança Alimentar", "Agricultura Familiar", "Saúde", "Ciência"];

  const filteredTracks = useMemo(() => {
    if (activeCategory === "Todas") return librasTracks;
    return librasTracks.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const progressPercentage = Math.round((completedTrackIds.length / librasTracks.length) * 100);

  // Reset steps and questions when entering a track
  const handleStartTrack = (trackId: string, stepIndex = 0) => {
    setActiveTrackId(trackId);
    setCurrentStepIndex(stepIndex);
    setSelectedCaseOption(null);
    setSelectedTerritoryOption(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setIsQuizCompleted(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const handleBackToCatalog = () => {
    setActiveTrackId(null);
    setCurrentStepIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Next step inside track
  const handleNextStep = () => {
    if (!activeTrack) return;
    const totalSteps = activeTrack.steps.length;
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedCaseOption(null);
      setSelectedTerritoryOption(null);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 220, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 220, behavior: "smooth" });
      }
    }
  };

  // Quiz answer submit
  const handleAnswerQuestion = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    const question = activeTrack?.quiz[currentQuestionIndex];
    if (question && optionIndex === question.correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeTrack) return;
    if (currentQuestionIndex < activeTrack.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
      if (activeTrack) {
        saveTrackCompletion(activeTrack.id);
      }
    }
  };

  // Helper for YouTube embed
  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    let base = url.trim();
    if (base.includes("youtu.be/")) {
      const id = base.split("youtu.be/")[1]?.split(/[?&#]/)[0];
      base = `https://www.youtube.com/embed/${id}`;
    } else if (base.includes("watch?v=")) {
      const id = base.split("watch?v=")[1]?.split(/[?&#]/)[0];
      base = `https://www.youtube.com/embed/${id}`;
    }
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
  };

  // Carousel scroll
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // =========================================================
  // VIEW 1: STREAMING CATALOG (ESTILO NETFLIX / PRIME / HBO)
  // =========================================================
  if (!activeTrackId || !activeTrack) {
    return (
      <div className="space-y-12 mb-20 animate-in fade-in duration-700 w-full text-white">
        
        {/* =========================================================
            1. CINEMATIC BILLBOARD HERO (O GRANDE DESTAQUE)
            ========================================================= */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl min-h-[460px] md:min-h-[520px] flex flex-col justify-end p-8 md:p-14">
          {/* Background Ambient Glows & Image Simulation */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-emerald-950/30 z-10" />
          
          {/* Animated decorative cinema background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-cyan-900/20 to-slate-950" />
          <div className="absolute top-0 right-0 w-3/4 h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(16,185,129,0.15),transparent_60%)]" />

          {/* Billboard Content */}
          <div className="relative z-20 max-w-3xl space-y-5">
            {/* Streaming Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <Tv className="h-3 w-3" />
                <span>LISSA ORIGINAL</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-white border border-white/15 font-black text-[10px] uppercase tracking-wider">
                Temporada 1
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">
                {billboardTrack.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-slate-200">
                LIBRAS 100%
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-slate-200">
                CC PT-BR
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                HD
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md leading-[1.05]">
              {billboardTrack.title}
            </h1>

            {/* Subtitle / Synopsis */}
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
              {billboardTrack.description}
            </p>

            {/* Quick Metadata */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="text-emerald-400 font-black">99% de Relevância</span>
              <span>•</span>
              <span>{billboardTrack.duration} de imersão</span>
              <span>•</span>
              <span>{billboardTrack.stepsCount} episódios + quiz</span>
            </div>

            {/* Action Buttons (Play & More Info) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => handleStartTrack(billboardTrack.id)}
                className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Play className="h-5 w-5 fill-slate-950" />
                <span>
                  {completedTrackIds.includes(billboardTrack.id) ? "Reassistir Trilha" : "Assistir Agora"}
                </span>
              </button>

              <button
                onClick={() => toggleBookmark(billboardTrack.id)}
                className={cn(
                  "px-5 py-4 rounded-2xl backdrop-blur-md border font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all",
                  bookmarkedTrackIds.includes(billboardTrack.id)
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <Bookmark className={cn("h-4 w-4", bookmarkedTrackIds.includes(billboardTrack.id) && "fill-emerald-400")} />
                <span>{bookmarkedTrackIds.includes(billboardTrack.id) ? "Na Minha Lista" : "Minha Lista"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. BARRA DE STATUS / RESUMO DO ALUNO (ESTILO STREAMING)
            ========================================================= */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Sua Jornada de Maratonista Científico
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {completedTrackIds.length} de {librasTracks.length} Trilhas Concluídas
              </h3>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Temporada 1</span>
              <span className="text-emerald-400 font-mono">{progressPercentage}% Completo</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-lg shadow-emerald-500/30"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
            3. CARROSSEL HORIZONTAL: EM ALTA NA TEMPORADA 1
            ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                Temporada 1: Alimentação & Território
              </h2>
            </div>

            {/* Setas de rolagem do carrossel */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all hover:scale-105"
                aria-label="Rolar para a esquerda"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all hover:scale-105"
                aria-label="Rolar para a direita"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Fileira Horizontal de Cards Deslizáveis */}
          <div 
            ref={carouselRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          >
            {librasTracks.map((track, i) => {
              const isCompleted = completedTrackIds.includes(track.id);
              const isSelectedBillboard = billboardTrackId === track.id;
              const gradientClass = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
              const accentClass = ACCENT_COLORS[i % ACCENT_COLORS.length];

              return (
                <div
                  key={track.id}
                  onClick={() => setBillboardTrackId(track.id)}
                  className="snap-start shrink-0 w-[290px] sm:w-[320px] md:w-[350px] group cursor-pointer"
                >
                  <div className={cn(
                    "rounded-[2rem] p-6 border transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden bg-gradient-to-b shadow-xl",
                    gradientClass,
                    isSelectedBillboard 
                      ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]" 
                      : "border-slate-800/80 hover:border-slate-600 hover:scale-[1.02]"
                  )}>
                    {/* Background glow hover */}
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-none" />

                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", accentClass)}>
                          {track.category}
                        </span>

                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Visto</span>
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleBookmark(track.id, e)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                          >
                            <Bookmark className={cn("h-3.5 w-3.5", bookmarkedTrackIds.includes(track.id) && "fill-emerald-400 text-emerald-400")} />
                          </button>
                        </div>
                      </div>

                      {/* Episode index / mini-title */}
                      <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">
                        Trilha 0{i + 1} • {track.stepsCount} Etapas
                      </span>

                      {/* Title */}
                      <h3 className="font-black text-xl text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                        {track.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                        {track.description}
                      </p>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{track.duration}</span>
                        </span>
                        <span className="text-emerald-400 font-semibold">Quiz incluso</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTrack(track.id);
                        }}
                        className={cn(
                          "w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg",
                          isCompleted
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 group-hover:shadow-emerald-500/25"
                        )}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{isCompleted ? "Rever Episódios" : "Assistir Agora"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            4. FILTROS POR CATEGORIA & CATÁLOGO COMPLETO
            ========================================================= */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Catálogo da Plataforma
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                Todas as Produções em Libras
              </h2>
            </div>

            {/* Chips de Categorias */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border",
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.03]"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Responsivo de 3 Cards por Linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTracks.map((track, i) => {
              const isCompleted = completedTrackIds.includes(track.id);
              const gradientClass = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
              const accentClass = ACCENT_COLORS[i % ACCENT_COLORS.length];

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group flex flex-col"
                >
                  <div className={cn(
                    "rounded-[2.5rem] p-7 border border-slate-800/80 shadow-xl transition-all duration-300 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 min-h-[350px]",
                    gradientClass
                  )}>
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn("px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", accentClass)}>
                          {track.category}
                        </span>

                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Concluída</span>
                          </span>
                        )}
                      </div>

                      {/* Título */}
                      <h3 className="font-black text-xl text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                        {track.title}
                      </h3>

                      {/* Descrição */}
                      <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3">
                        {track.description}
                      </p>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="space-y-4 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>{track.stepsCount} etapas • {track.duration}</span>
                        <span className="text-emerald-400">Libras • Legendas</span>
                      </div>

                      <button
                        onClick={() => handleStartTrack(track.id)}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg",
                          isCompleted
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-[1.02] shadow-emerald-500/20"
                        )}
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>{isCompleted ? "Reassistir Trilha" : "Assistir Trilha"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW 2: STREAMING THEATRE (MODO CINEMA & EPISÓDIOS)
  // Conecta Trilha → Glossário → Minuto → Caso Real → Quiz
  // =========================================================
  const totalStages = activeTrack.steps.length + 1; // steps + quiz
  const isQuizStage = currentStepIndex === activeTrack.steps.length;
  const currentStep = !isQuizStage ? activeTrack.steps[currentStepIndex] : null;

  return (
    <div className="space-y-8 mb-20 animate-in fade-in duration-500 w-full max-w-6xl mx-auto text-white">
      {/* 1. TOP CINEMA NAV: Voltar ao Catálogo e Status da Série */}
      <div className="bg-slate-950/90 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800 w-full sm:w-auto justify-center group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Catálogo</span>
        </button>

        <div className="text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <span>Temporada 1</span>
            <span>•</span>
            <span>{activeTrack.category}</span>
            <span>•</span>
            <span>{activeTrack.duration}</span>
          </div>
          <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight">
            {activeTrack.title}
          </h2>
        </div>
      </div>

      {/* 2. DRAWER DE EPISÓDIOS / CAPÍTULOS (ESTILO STREAMING EPISODE SELECTOR) */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {activeTrack.steps.map((step, idx) => {
            const isStepActive = currentStepIndex === idx;
            const isStepCompleted = currentStepIndex > idx || isQuizCompleted;

            return (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
                  isStepActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
                    : isStepCompleted
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                {isStepCompleted ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="font-mono text-[11px] opacity-80">0{idx + 1}</span>
                )}
                <span>
                  {step.type === "video" && "Ep. 1: O Vídeo"}
                  {step.type === "concepts" && "Ep. 2: Conceitos"}
                  {step.type === "pill" && "Ep. 3: Minuto"}
                  {step.type === "case" && "Ep. 4: Na Prática"}
                  {step.type === "territory" && "Ep. 5: Território"}
                </span>
              </button>
            );
          })}

          {/* Botão do Quiz */}
          <button
            onClick={() => setCurrentStepIndex(activeTrack.steps.length)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
              isQuizStage
                ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
                : isQuizCompleted
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
            )}
          >
            {isQuizCompleted ? <Check className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
            <span>Ep. 6: Quiz Final</span>
          </button>
        </div>
      </div>

      {/* 3. SALA DE EXIBIÇÃO CINEMA / CONTEÚDO DO CAPÍTULO */}
      <div className="bg-slate-950 rounded-[2.5rem] border border-slate-800/80 shadow-2xl p-6 md:p-12 space-y-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* =========================================================
              ETAPA 1: O VÍDEO PRINCIPAL EM LIBRAS (MODO CINEMA)
              ========================================================= */}
          {currentStep?.type === "video" && (
            <motion.div
              key="step-video"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest">
                    Episódio 01 • O Conceito em Libras
                  </span>
                  <span className="text-xs text-slate-500 font-bold">• Produção LISSA</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Player Cinemático de Alta Qualidade */}
              <div className="rounded-[2.5rem] overflow-hidden bg-black aspect-video shadow-2xl border border-slate-800 relative ring-1 ring-white/10">
                <iframe
                  src={getEmbedUrl(currentStep.videoUrl)}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentStep.title}
                />
              </div>

              {/* Sinopse / Resumo Didático */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Sinopse Didática em Português</span>
                </div>
                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                  {currentStep.content}
                </p>
              </div>

              {/* Botão Próximo Episódio */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
                >
                  <span>Próximo Episódio: Conheça os Conceitos</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 2: OS SINAIS DA CIÊNCIA (GLOSSÁRIO EM CENA)
              ========================================================= */}
          {currentStep?.type === "concepts" && (
            <motion.div
              key="step-concepts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest inline-block">
                  Episódio 02 • Conexão com o Glossário
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {currentStep.subtitle} — Como estes termos são sinalizados e definidos oficialmente na ciência.
                </p>
              </div>

              {/* Cards Escuros Translúcidos dos Termos */}
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {currentStep.conceptTerms?.map((termItem, tidx) => (
                  <div
                    key={tidx}
                    className="p-6 rounded-[2rem] bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono text-[11px] font-black">
                          {termItem.codeId || `#0${tidx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Libras Científica
                        </span>
                      </div>

                      <h4 className="text-base font-black uppercase tracking-tight text-white leading-snug">
                        {termItem.term}
                      </h4>

                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {termItem.definition}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        <Ear className="h-3.5 w-3.5" />
                        <span>Sinal em Libras</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {termItem.signStrategy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800"
                >
                  ← Episódio Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
                >
                  <span>Próximo Episódio: Minuto do Conhecimento</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 3: MINUTO DO CONHECIMENTO (PÍLULA VERTICAL 9:16)
              ========================================================= */}
          {currentStep?.type === "pill" && currentStep.pill && (
            <motion.div
              key="step-pill"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest inline-block">
                  Episódio 03 • Minuto do Conhecimento
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {currentStep.subtitle} — Uma pílula cinematográfica rápida de aplicação direta.
                </p>
              </div>

              {/* Visualizador da Pílula Vertical Estilo Reels/Shorts */}
              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-[340px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-slate-800 relative ring-1 ring-white/10">
                    <iframe
                      src={getEmbedUrl(currentStep.pill.videoUrl)}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentStep.pill.title}
                    />
                  </div>
                </div>

                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                      Duração: {currentStep.pill.duration}
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {currentStep.pill.title}
                    </h4>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Apoio Estratégico
                    </span>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">
                      {currentStep.pill.supportText}
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-emerald-950/60 border border-emerald-500/40 space-y-2 text-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Aplicação Prática no Dia a Dia</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {currentStep.pill.practicalApp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800"
                >
                  ← Episódio Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
                >
                  <span>Próximo Episódio: Na Vida Real</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 4: NA VIDA REAL (SITUAÇÃO-PROBLEMA INTERATIVA)
              ========================================================= */}
          {currentStep?.type === "case" && currentStep.caseStudy && (
            <motion.div
              key="step-case"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest inline-block">
                  Episódio 04 • Na Vida Real (Caso Interativo)
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Card da Situação Problema */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 space-y-4 shadow-xl">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                  <HelpCircle className="h-4 w-4" />
                  <span>O Caso de Estudo</span>
                </div>
                <p className="text-base md:text-lg font-medium text-slate-200 leading-relaxed italic">
                  "{currentStep.caseStudy.context}"
                </p>
                <h4 className="text-base md:text-xl font-black text-white pt-2">
                  {currentStep.caseStudy.question}
                </h4>
              </div>

              {/* Opções Interativas com Feedback */}
              <div className="space-y-4">
                {currentStep.caseStudy.options.map((opt) => {
                  const isSelected = selectedCaseOption === opt.id;

                  return (
                    <div key={opt.id} className="space-y-3">
                      <button
                        onClick={() => setSelectedCaseOption(opt.id)}
                        className={cn(
                          "w-full text-left p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-4",
                          isSelected
                            ? opt.isCorrect
                              ? "bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                              : "bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/30 shadow-lg"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs",
                          isSelected
                            ? opt.isCorrect ? "bg-emerald-500 text-slate-950 font-black" : "bg-rose-500 text-white"
                            : "border border-slate-700 text-slate-400"
                        )}>
                          {isSelected ? (opt.isCorrect ? "✓" : "✕") : ""}
                        </div>
                        <span className="text-sm md:text-base font-semibold text-slate-200 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>

                      {/* Feedback Explicativo */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={cn(
                            "p-5 rounded-2xl text-xs md:text-sm font-medium leading-relaxed border",
                            opt.isCorrect ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200" : "bg-rose-950/70 border-rose-500/40 text-rose-200"
                          )}
                        >
                          <strong className="block mb-1">{opt.isCorrect ? "✓ Decisão Correta: " : "✕ Ponto de Atenção: "}</strong>
                          {opt.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800"
                >
                  ← Episódio Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={selectedCaseOption === null}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2",
                    selectedCaseOption !== null
                      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-105 shadow-emerald-500/20"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  )}
                >
                  <span>Próximo Episódio: No Seu Território</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 5: CONEXÃO COM O TERRITÓRIO (REFLEXÃO)
              ========================================================= */}
          {currentStep?.type === "territory" && currentStep.territoryReflection && (
            <motion.div
              key="step-territory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest inline-block">
                  Episódio 05 • Conexão com o Território
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {currentStep.subtitle} — Como este tema se manifesta onde você vive?
                </p>
              </div>

              {/* Pergunta Reflexiva */}
              <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <MapPin className="h-5 w-5" />
                  <span>Reflexão Territorial</span>
                </div>
                <h4 className="text-lg md:text-2xl font-black text-white leading-snug">
                  {currentStep.territoryReflection.prompt}
                </h4>

                <div className="space-y-3 pt-2">
                  {currentStep.territoryReflection.options.map((opt, oidx) => {
                    const isSelected = selectedTerritoryOption === oidx;
                    return (
                      <button
                        key={oidx}
                        onClick={() => setSelectedTerritoryOption(oidx)}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border transition-all text-sm md:text-base font-semibold leading-relaxed flex items-center justify-between",
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-lg"
                            : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/80"
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="h-5 w-5 text-slate-950" />}
                      </button>
                    );
                  })}
                </div>

                {selectedTerritoryOption !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs md:text-sm text-emerald-200 font-medium leading-relaxed"
                  >
                    <strong className="text-emerald-400 block mb-1">💡 Conexão LISSA:</strong>
                    {currentStep.territoryReflection.insight}
                  </motion.div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800"
                >
                  ← Episódio Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
                >
                  <span>Ir para o Quiz Final</span>
                  <Brain className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA FINAL: QUIZ — TESTE SEUS CONHECIMENTOS
              ========================================================= */}
          {isQuizStage && (
            <motion.div
              key="step-quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {!isQuizCompleted ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                        Episódio 06 • Fixação & Certificação
                      </span>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                        Quiz da Temporada
                      </h3>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-black text-xs font-mono">
                      Questão {currentQuestionIndex + 1} de {activeTrack.quiz.length}
                    </span>
                  </div>

                  {/* Questão Ativa */}
                  {(() => {
                    const q = activeTrack.quiz[currentQuestionIndex];
                    if (!q) return null;

                    return (
                      <div className="space-y-6">
                        <h4 className="text-lg md:text-2xl font-black text-white leading-snug">
                          {q.question}
                        </h4>

                        <div className="space-y-3">
                          {q.options.map((option, optIdx) => {
                            const isChosen = selectedAnswer === optIdx;
                            const isCorrect = optIdx === q.correct;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerQuestion(optIdx)}
                                disabled={selectedAnswer !== null}
                                className={cn(
                                  "w-full text-left p-5 rounded-2xl border transition-all text-sm md:text-base font-semibold leading-relaxed flex items-start gap-4",
                                  selectedAnswer !== null
                                    ? isCorrect
                                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20 shadow-md"
                                      : isChosen
                                      ? "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/20 shadow-md"
                                      : "bg-slate-900 text-slate-500 border-slate-800 opacity-60"
                                    : "bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                                )}
                              >
                                <span className={cn(
                                  "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs",
                                  selectedAnswer !== null
                                    ? isCorrect ? "bg-emerald-500 text-slate-950 font-black" : isChosen ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-500"
                                    : "bg-slate-800 text-slate-300"
                                )}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explicação da Questão */}
                        {selectedAnswer !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed font-medium"
                          >
                            <strong className="text-emerald-400 block mb-1">Explicação Científica:</strong> {q.explanation}
                          </motion.div>
                        )}

                        {/* Botão de Avanço do Quiz */}
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null}
                            className={cn(
                              "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2",
                              selectedAnswer !== null
                                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-105 shadow-emerald-500/20"
                                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            )}
                          >
                            <span>{currentQuestionIndex < activeTrack.quiz.length - 1 ? "Próxima Questão" : "Concluir Trilha"}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* TELA DE CELEBRAÇÃO: TRILHA CONCLUÍDA */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                      Série Concluída com Sucesso ✓
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                      Parabéns! Você completou {activeTrack.title}.
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                      Você maratonou todos os episódios pedagógicos, explorou os sinais da ciência e venceu o desafio territorial.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <Trophy className="h-6 w-6 text-amber-400" />
                    <span className="text-sm font-black text-white">
                      Desempenho no Quiz: {quizScore} de {activeTrack.quiz.length} acertos
                    </span>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleBackToCatalog}
                      className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider transition-all border border-slate-800 w-full sm:w-auto"
                    >
                      Voltar ao Catálogo
                    </button>

                    {(() => {
                      const currentIndex = librasTracks.findIndex(t => t.id === activeTrack.id);
                      const nextTrack = currentIndex < librasTracks.length - 1 ? librasTracks[currentIndex + 1] : null;
                      if (!nextTrack) return null;

                      return (
                        <button
                          onClick={() => handleStartTrack(nextTrack.id)}
                          className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <span>Maratonar Próxima Trilha: {nextTrack.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
