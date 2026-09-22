"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Brain, 
  BookOpen, 
  Ear, 
  HelpCircle, 
  MapPin, 
  Trophy, 
  Check, 
  Bookmark, 
  Smartphone, 
  X, 
  Share2, 
  CheckCheck,
  Leaf,
  HeartHandshake,
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
  Flame,
  Coffee
} from "lucide-react";
import { librasTracks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Warm, organic editorial palettes inspired by Brazilian soil, agriculture & harvest
const TRACK_THEMES = [
  {
    bgGradient: "from-[#1E3A8A] via-[#1D4ED8] to-[#172554]",
    badgeBg: "bg-blue-100/90 text-blue-900 border-blue-300/40",
    accentLight: "bg-blue-50 text-blue-800 border-blue-200",
    tag: "Comida de Verdade",
    icon: Leaf
  },
  {
    bgGradient: "from-[#3D251E] via-[#482E25] to-[#2E1B15]",
    badgeBg: "bg-amber-100/90 text-amber-900 border-amber-300/40",
    accentLight: "bg-orange-50 text-orange-800 border-orange-200",
    tag: "Direito Humano à Alimentação",
    icon: HeartHandshake
  },
  {
    bgGradient: "from-[#3D301E] via-[#473823] to-[#2D2315]",
    badgeBg: "bg-yellow-100/90 text-yellow-900 border-yellow-300/40",
    accentLight: "bg-amber-50 text-amber-800 border-amber-200",
    tag: "Agricultura Familiar",
    icon: Sprout
  },
  {
    bgGradient: "from-[#213835] via-[#2A4440] to-[#192E2B]",
    badgeBg: "bg-teal-100/90 text-teal-900 border-teal-300/40",
    accentLight: "bg-teal-50 text-teal-800 border-teal-200",
    tag: "Classificação dos Alimentos",
    icon: AppleIcon
  },
  {
    bgGradient: "from-[#2D2622] via-[#38302B] to-[#221C18]",
    badgeBg: "bg-stone-200/90 text-stone-900 border-stone-300/40",
    accentLight: "bg-stone-100 text-stone-800 border-stone-200",
    tag: "Rotulagem e Lupa Frontal",
    icon: BookOpen
  },
  {
    bgGradient: "from-[#1F2F3D] via-[#283A4A] to-[#17242E]",
    badgeBg: "bg-sky-100/90 text-sky-900 border-sky-300/40",
    accentLight: "bg-sky-50 text-sky-800 border-sky-200",
    tag: "Mediação e Sinais da Ciência",
    icon: Ear
  }
];

function AppleIcon(props: any) {
  return <Leaf {...props} />;
}

interface TrackProgressItem {
  trackId: string;
  currentStepIndex: number;
  totalSteps: number;
  completed: boolean;
  updatedAt: number;
}

export function TracksSection() {
  // Active track being viewed/studied (null = catalog view)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  
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

  // Track progress map: { [trackId]: TrackProgressItem }
  const [trackProgressMap, setTrackProgressMap] = useState<Record<string, TrackProgressItem>>({});
  
  // Last active track for the billboard hero
  const [lastActiveTrackId, setLastActiveTrackId] = useState<string>(librasTracks[0]?.id || "trilha-1");

  // QR Code Continuity Modal
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrSyncUrl, setQrSyncUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Horizontal carousel scroll ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load & URL Sync Check
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

        const storedProgress = localStorage.getItem("lissa_track_progress_v2");
        let parsedProgress: Record<string, TrackProgressItem> = {};
        if (storedProgress) {
          parsedProgress = JSON.parse(storedProgress);
          setTrackProgressMap(parsedProgress);
        }

        const storedLastActive = localStorage.getItem("lissa_last_active_track");
        if (storedLastActive) {
          setLastActiveTrackId(storedLastActive);
        } else {
          const entries = Object.values(parsedProgress).sort((a, b) => b.updatedAt - a.updatedAt);
          if (entries.length > 0 && entries[0].trackId) {
            setLastActiveTrackId(entries[0].trackId);
          }
        }

        // Sync via URL if shared
        const params = new URLSearchParams(window.location.search);
        const syncTrack = params.get("syncTrack");
        const syncStep = params.get("syncStep");
        if (syncTrack && librasTracks.some(t => t.id === syncTrack)) {
          const stepNum = syncStep ? parseInt(syncStep, 10) : 0;
          handleStartTrack(syncTrack, isNaN(stepNum) ? 0 : stepNum);
        }
      } catch (e) {
        console.error("Error reading storage:", e);
      }
    }
  }, []);

  // Save progress
  const updateProgress = (trackId: string, stepIndex: number, completed = false) => {
    const track = librasTracks.find(t => t.id === trackId);
    if (!track) return;

    const total = track.steps.length + 1;
    const updatedItem: TrackProgressItem = {
      trackId,
      currentStepIndex: stepIndex,
      totalSteps: total,
      completed,
      updatedAt: Date.now()
    };

    const newMap = {
      ...trackProgressMap,
      [trackId]: updatedItem
    };

    setTrackProgressMap(newMap);
    setLastActiveTrackId(trackId);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lissa_track_progress_v2", JSON.stringify(newMap));
        localStorage.setItem("lissa_last_active_track", trackId);
      } catch (e) {
        console.error("Error saving track progress:", e);
      }
    }
  };

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
    updateProgress(trackId, 6, true);
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

  // Tracks in progress
  const tracksInProgress = useMemo(() => {
    return librasTracks.filter(track => {
      const prog = trackProgressMap[track.id];
      const isCompleted = completedTrackIds.includes(track.id);
      return prog && prog.currentStepIndex > 0 && !isCompleted;
    }).sort((a, b) => {
      const progA = trackProgressMap[a.id]?.updatedAt || 0;
      const progB = trackProgressMap[b.id]?.updatedAt || 0;
      return progB - progA;
    });
  }, [trackProgressMap, completedTrackIds]);

  // Billboard track
  const billboardTrack = useMemo(() => {
    if (tracksInProgress.length > 0) {
      return tracksInProgress[0];
    }
    return librasTracks.find(t => t.id === lastActiveTrackId) || librasTracks[0];
  }, [tracksInProgress, lastActiveTrackId]);

  const billboardProgress = billboardTrack ? trackProgressMap[billboardTrack.id] : null;

  const categories = ["Todas", "Alimentação", "Segurança Alimentar", "Agricultura Familiar", "Saúde", "Ciência"];

  const filteredTracks = useMemo(() => {
    if (activeCategory === "Todas") return librasTracks;
    return librasTracks.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const progressPercentage = Math.round((completedTrackIds.length / librasTracks.length) * 100);

  // Open track
  const handleStartTrack = (trackId: string, stepIndex?: number) => {
    const savedProg = trackProgressMap[trackId];
    const resumeStep = stepIndex !== undefined 
      ? stepIndex 
      : (savedProg && !completedTrackIds.includes(trackId) ? savedProg.currentStepIndex : 0);

    setActiveTrackId(trackId);
    setCurrentStepIndex(resumeStep);
    setSelectedCaseOption(null);
    setSelectedTerritoryOption(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setIsQuizCompleted(false);

    updateProgress(trackId, resumeStep, completedTrackIds.includes(trackId));

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleBackToCatalog = () => {
    setActiveTrackId(null);
    setCurrentStepIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 260, behavior: "smooth" });
    }
  };

  // Next step inside track
  const handleNextStep = () => {
    if (!activeTrack) return;
    const totalSteps = activeTrack.steps.length;
    if (currentStepIndex < totalSteps) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setSelectedCaseOption(null);
      setSelectedTerritoryOption(null);
      updateProgress(activeTrack.id, nextIdx);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (activeTrack) {
        updateProgress(activeTrack.id, prevIdx);
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    }
  };

  const handleJumpToStep = (stepIdx: number) => {
    setCurrentStepIndex(stepIdx);
    if (activeTrack) {
      updateProgress(activeTrack.id, stepIdx);
    }
  };

  // Quiz
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

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.75;
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleOpenQrSync = (trackId: string, stepIndex = 0) => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const url = `${origin}${pathname}?syncTrack=${encodeURIComponent(trackId)}&syncStep=${stepIndex}#trilhas`;
      setQrSyncUrl(url);
      setCopiedLink(false);
      setShowQrModal(true);
    }
  };

  const handleCopySyncLink = () => {
    if (typeof navigator !== "undefined" && qrSyncUrl) {
      navigator.clipboard.writeText(qrSyncUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getStepName = (stepIdx: number, track: any) => {
    if (stepIdx >= track.steps.length) return "Quiz de Fixação";
    const st = track.steps[stepIdx];
    if (st.type === "video") return "Etapa 1: Apresentação em Libras";
    if (st.type === "concepts") return "Etapa 2: Sinais da Terra (Glossário)";
    if (st.type === "pill") return "Etapa 3: Minuto do Conhecimento";
    if (st.type === "case") return "Etapa 4: Na Vida Real (Dilema)";
    if (st.type === "territory") return "Etapa 5: Conexão com o Território";
    return `Etapa ${stepIdx + 1}`;
  };

  // Find index for color theme
  const getTrackTheme = (trackId: string) => {
    const idx = librasTracks.findIndex(t => t.id === trackId);
    return TRACK_THEMES[Math.max(0, idx) % TRACK_THEMES.length];
  };

  // =========================================================
  // VIEW 1: CATALOGO ACOLHEDOR & EDITORIAL
  // =========================================================
  if (!activeTrackId || !activeTrack) {
    const billboardTheme = getTrackTheme(billboardTrack.id);

    return (
      <div className="space-y-10 mb-20 animate-in fade-in duration-500 w-full text-slate-800">
        
        {/* =========================================================
            1. HERO DOCUMENTAL EDITORIAL: ACOLHEDOR E HUMANO
            ========================================================= */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-8 md:p-14 shadow-xl border border-stone-800/40">
          
          {/* Subtle Organic Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-5">
            {/* Humanized Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sprout className="h-3.5 w-3.5" />
                <span>Temporada 1 • Alimentação e Território</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-stone-200 border border-white/20 font-bold text-[11px] uppercase">
                {billboardTrack.category}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-stone-200 border border-white/20 font-bold text-[11px]">
                Em Libras com Legendas
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-stone-50 drop-shadow-sm leading-tight">
              {billboardTrack.title}
            </h1>

            {/* Synopsis */}
            <p className="text-base md:text-lg text-stone-300 font-medium leading-relaxed max-w-2xl">
              {billboardTrack.description}
            </p>

            {/* Human Metas */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold text-stone-300">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>{billboardTrack.duration} de percurso</span>
              </span>
              <span>•</span>
              <span>{billboardTrack.stepsCount} etapas com atividades práticas</span>
              {billboardProgress && billboardProgress.currentStepIndex > 0 && !completedTrackIds.includes(billboardTrack.id) && (
                <>
                  <span>•</span>
                  <span className="text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Você parou na {getStepName(billboardProgress.currentStepIndex, billboardTrack)}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                onClick={() => handleStartTrack(billboardTrack.id)}
                className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-all"
              >
                <Play className="h-4 w-4 fill-stone-950" />
                <span>
                  {completedTrackIds.includes(billboardTrack.id)
                    ? "Rever Percurso Completo"
                    : billboardProgress && billboardProgress.currentStepIndex > 0
                    ? `Continuar: ${getStepName(billboardProgress.currentStepIndex, billboardTrack)}`
                    : "Iniciar Percurso em Libras"}
                </span>
              </button>

              <button
                onClick={() => toggleBookmark(billboardTrack.id)}
                className={cn(
                  "px-5 py-4 rounded-2xl backdrop-blur-md border font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all",
                  bookmarkedTrackIds.includes(billboardTrack.id)
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <Bookmark className={cn("h-4 w-4", bookmarkedTrackIds.includes(billboardTrack.id) && "fill-amber-400")} />
                <span>{bookmarkedTrackIds.includes(billboardTrack.id) ? "Salvo na Minha Lista" : "Salvar na Lista"}</span>
              </button>

              {/* Botão de continuidade no celular */}
              <button
                onClick={() => handleOpenQrSync(billboardTrack.id, billboardProgress?.currentStepIndex || 0)}
                className="px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                title="Continuar no celular via QR Code"
              >
                <Smartphone className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">Levar para o Celular</span>
                <span className="sm:hidden">Celular</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. FILEIRA ACOLHEDORA: CONTINUAR DE ONDE PAROU
            ========================================================= */}
        {tracksInProgress.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-stone-900">
                    Continuar de onde você parou
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Seu percurso fica salvo automaticamente neste aparelho, sem precisar de cadastro.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel(continueRef, "left")}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
                  aria-label="Rolar para a esquerda"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollCarousel(continueRef, "right")}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
                  aria-label="Rolar para a direita"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Carrossel de Continuidade */}
            <div 
              ref={continueRef}
              className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
            >
              {tracksInProgress.map((track) => {
                const prog = trackProgressMap[track.id];
                const stepIdx = prog?.currentStepIndex || 0;
                const total = track.steps.length + 1;
                const stepPercent = Math.round((stepIdx / total) * 100);
                const stepTitle = getStepName(stepIdx, track);

                return (
                  <div
                    key={track.id}
                    onClick={() => handleStartTrack(track.id, stepIdx)}
                    className="snap-start shrink-0 w-[300px] sm:w-[350px] group cursor-pointer"
                  >
                    <div className="rounded-[2rem] p-6 border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[270px]">
                      
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                          {track.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenQrSync(track.id, stepIdx);
                          }}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                          title="Passar para o celular"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Info */}
                      <div>
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block mb-1">
                          Próximo passo: {stepTitle}
                        </span>
                        <h3 className="font-black text-lg text-stone-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors leading-snug">
                          {track.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium line-clamp-2 mt-1">
                          {track.description}
                        </p>
                      </div>

                      {/* Barra de Progresso Orgânica */}
                      <div className="space-y-2 pt-2 border-t border-amber-100">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-stone-500">Etapa {stepIdx + 1} de {total}</span>
                          <span className="text-amber-800 font-bold">{stepPercent}% concluído</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                          <div 
                            style={{ width: `${stepPercent}%` }}
                            className="h-full bg-gradient-to-r from-amber-500 to-blue-600 rounded-full"
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTrack(track.id, stepIdx);
                          }}
                          className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-sm"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Continuar de Onde Parou</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            3. BARRA DE PROGRESSO DO ALUNO (ESTILO CADERNO DE CAMPO)
            ========================================================= */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                Seu Caderno de Aprendizagem • Salvo no seu navegador
              </span>
              <h3 className="text-lg md:text-xl font-black text-stone-800 uppercase tracking-tight">
                {completedTrackIds.length} de {librasTracks.length} Trilhas Concluídas
              </h3>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-500">Temporada 1</span>
              <span className="text-blue-700 font-bold">{progressPercentage}% do Percurso</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
            4. CATÁLOGO DAS 6 TRILHAS: DESIGN EDITORIAL EM GRID
            ========================================================= */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 block">
                Série Completa
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-stone-900">
                Trilhas de Aprendizagem em Libras
              </h2>
            </div>

            {/* Chips de Categorias Naturais */}
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
                        ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de 3 Cards por Linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTracks.map((track, i) => {
              const isCompleted = completedTrackIds.includes(track.id);
              const theme = getTrackTheme(track.id);
              const prog = trackProgressMap[track.id];
              const hasProgress = prog && prog.currentStepIndex > 0 && !isCompleted;
              const IconComp = theme.icon;

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group flex flex-col"
                >
                  <div className="rounded-[2.5rem] p-7 md:p-8 border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between flex-1 relative bg-white hover:border-blue-300/80 min-h-[360px]">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn("px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", theme.accentLight)}>
                          {track.category}
                        </span>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                            <span>Concluída</span>
                          </span>
                        ) : hasProgress ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            Parou na Etapa {prog.currentStepIndex + 1}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                            <IconComp className="h-3.5 w-3.5 text-stone-400" />
                            <span>{theme.tag}</span>
                          </span>
                        )}
                      </div>

                      {/* Título da Trilha */}
                      <h3 className="font-black text-xl text-stone-900 uppercase tracking-tight group-hover:text-blue-800 transition-colors leading-snug mb-3">
                        {track.title}
                      </h3>

                      {/* Descrição */}
                      <p className="text-xs md:text-sm text-stone-600 font-medium leading-relaxed mb-6 line-clamp-3">
                        {track.description}
                      </p>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="space-y-4 pt-4 border-t border-stone-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{track.stepsCount} etapas • {track.duration}</span>
                        </span>
                        <span className="text-blue-800 font-semibold">Libras e Legendas</span>
                      </div>

                      <button
                        onClick={() => handleStartTrack(track.id)}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm",
                          isCompleted
                            ? "bg-stone-100 hover:bg-stone-200 text-stone-700"
                            : hasProgress
                            ? "bg-amber-400 hover:bg-amber-300 text-stone-950 font-black shadow-md shadow-amber-900/10"
                            : "bg-stone-900 hover:bg-emerald-800 text-white group-hover:scale-[1.02]"
                        )}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>
                          {isCompleted
                            ? "Rever Conteúdo"
                            : hasProgress
                            ? `Continuar (Etapa ${prog.currentStepIndex + 1})`
                            : "Explorar Trilha"}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            MODAL: CONTINUAR NO CELULAR VIA QR CODE
            ========================================================= */}
        <AnimatePresence>
          {showQrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-stone-200 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative"
              >
                <button
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 mx-auto">
                  <Smartphone className="h-7 w-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase text-stone-900 tracking-tight">
                    Continuar no Celular
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Aponte a câmera do seu smartphone para o QR Code abaixo para abrir exatamente de onde você parou, sem criar conta nem digitar senha.
                  </p>
                </div>

                {/* QR Code */}
                <div className="p-4 bg-stone-50 rounded-3xl inline-block shadow-inner border border-stone-200 mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrSyncUrl)}&color=1c1917`}
                    alt="QR Code de Continuidade"
                    className="w-48 h-48 rounded-xl"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleCopySyncLink}
                    className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    {copiedLink ? <CheckCheck className="h-4 w-4 text-blue-400" /> : <Share2 className="h-4 w-4" />}
                    <span>{copiedLink ? "Link Copiado com Sucesso!" : "Copiar Link de Acesso"}</span>
                  </button>

                  <p className="text-[11px] text-stone-400">
                    Seu progresso fica salvo com total privacidade.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================
  // VIEW 2: SALA DE ESTUDO E PERCURSO PEDAGÓGICO
  // Conecta Trilha → Glossário → Minuto → Caso Real → Quiz
  // =========================================================
  const totalStages = activeTrack.steps.length + 1;
  const isQuizStage = currentStepIndex === activeTrack.steps.length;
  const currentStep = !isQuizStage ? activeTrack.steps[currentStepIndex] : null;

  return (
    <div className="space-y-8 mb-20 animate-in fade-in duration-500 w-full max-w-5xl mx-auto text-slate-800">
      
      {/* 1. BARRA SUPERIOR: VOLTAR AO CATÁLOGO E STATUS */}
      <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs uppercase tracking-wider transition-all w-full sm:w-auto justify-center group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para as Trilhas</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenQrSync(activeTrack.id, currentStepIndex)}
            className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors flex items-center gap-2 text-xs font-bold"
            title="Levar para o celular via QR Code"
          >
            <Smartphone className="h-4 w-4 text-blue-700" />
            <span className="hidden sm:inline">Levar ao Celular</span>
          </button>

          <div className="text-center sm:text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 block">
              {activeTrack.category} • {activeTrack.duration}
            </span>
            <h2 className="text-lg md:text-xl font-black text-stone-900 uppercase tracking-tight">
              {activeTrack.title}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. ROTEIRO DE CAPÍTULOS / STEPPER EDITORIAL */}
      <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {activeTrack.steps.map((step, idx) => {
            const isStepActive = currentStepIndex === idx;
            const isStepCompleted = currentStepIndex > idx || isQuizCompleted;

            return (
              <button
                key={idx}
                onClick={() => handleJumpToStep(idx)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
                  isStepActive
                    ? "bg-emerald-800 text-white border-blue-800 shadow-sm scale-105"
                    : isStepCompleted
                    ? "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                    : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 hover:text-stone-700"
                )}
              >
                {isStepCompleted ? (
                  <Check className="h-3.5 w-3.5 text-blue-700" />
                ) : (
                  <span className="font-mono text-[11px] opacity-80">0{idx + 1}</span>
                )}
                <span>
                  {step.type === "video" && "Apresentação"}
                  {step.type === "concepts" && "Sinais da Terra"}
                  {step.type === "pill" && "Minuto Prático"}
                  {step.type === "case" && "Na Vida Real"}
                  {step.type === "territory" && "Território"}
                </span>
              </button>
            );
          })}

          {/* Botão do Quiz */}
          <button
            onClick={() => handleJumpToStep(activeTrack.steps.length)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
              isQuizStage
                ? "bg-emerald-800 text-white border-blue-800 shadow-sm scale-105"
                : isQuizCompleted
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
            )}
          >
            {isQuizCompleted ? <Check className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
            <span>Quiz de Fixação</span>
          </button>
        </div>
      </div>

      {/* 3. AMBIENTE DE CONTEÚDO */}
      <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-6 md:p-12 space-y-8">
        <AnimatePresence mode="wait">
          
          {/* =========================================================
              ETAPA 1: O VÍDEO PRINCIPAL EM LIBRAS
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
                <span className="px-3 py-1 rounded-full bg-blue-100 text-emerald-900 font-black text-[10px] uppercase tracking-wider inline-block">
                  Etapa 01 • Introdução em Libras
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-stone-500 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Player com contraste limpo e foco total na sinalização */}
              <div className="rounded-[2.5rem] overflow-hidden bg-stone-950 aspect-video shadow-xl border border-stone-800 relative">
                <iframe
                  src={getEmbedUrl(currentStep.videoUrl)}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentStep.title}
                />
              </div>

              {/* Resumo Didático em Português Claro */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 text-xs font-black uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Resumo Didático em Português Claro</span>
                </div>
                <p className="text-sm md:text-base text-stone-700 font-medium leading-relaxed">
                  {currentStep.content}
                </p>
              </div>

              {/* Ação */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 2: Sinais da Terra</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 2: OS SINAIS DA TERRA (GLOSSÁRIO EM CENA)
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
                <span className="px-3 py-1 rounded-full bg-blue-100 text-emerald-900 font-black text-[10px] uppercase tracking-wider inline-block">
                  Etapa 02 • Conexão com o Glossário
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-stone-500 font-medium">
                  {currentStep.subtitle} — Como estes conceitos ganham vida em Libras e na ciência.
                </p>
              </div>

              {/* Cards Acolhedores dos Termos */}
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {currentStep.conceptTerms?.map((termItem, tidx) => (
                  <div
                    key={tidx}
                    className="p-6 rounded-[2rem] bg-stone-50 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-emerald-800 text-white font-mono text-[11px] font-black">
                          {termItem.codeId || `#0${tidx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Libras Científica
                        </span>
                      </div>

                      <h4 className="text-base font-black uppercase tracking-tight text-stone-900 leading-snug">
                        {termItem.term}
                      </h4>

                      <p className="text-xs text-stone-600 font-medium leading-relaxed">
                        {termItem.definition}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                        <Ear className="h-3.5 w-3.5" />
                        <span>Sinal em Libras</span>
                      </div>
                      <p className="text-xs text-stone-700 font-medium leading-relaxed">
                        {termItem.signStrategy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 3: Minuto Prático</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 3: MINUTO PRÁTICO (PÍLULA VERTICAL)
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] uppercase tracking-wider inline-block">
                    Etapa 03 • Minuto do Conhecimento
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black tracking-wider">
                    Formato 4:5
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-stone-500 font-medium">
                  {currentStep.subtitle} — Uma pílula em vídeo de aplicação direta no cotidiano.
                </p>
              </div>

              {/* Visualizador da Pílula */}
              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-[380px] aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-stone-950 shadow-xl border border-stone-800 relative">
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
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                      Duração: {currentStep.pill.duration}
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tight">
                      {currentStep.pill.title}
                    </h4>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-stone-50 border border-stone-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                      Apoio Estratégico
                    </span>
                    <p className="text-sm text-stone-700 font-medium leading-relaxed">
                      {currentStep.pill.supportText}
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-200 space-y-2 text-emerald-900">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800">
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
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 4: Na Vida Real</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 4: NA VIDA REAL (DILEMA / SITUAÇÃO-PROBLEMA)
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
                <span className="px-3 py-1 rounded-full bg-blue-100 text-emerald-900 font-black text-[10px] uppercase tracking-wider inline-block">
                  Etapa 04 • Na Vida Real (Caso de Estudo)
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-stone-500 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Card da Situação Problema */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-50/70 to-stone-50 border border-amber-200/80 space-y-4 shadow-sm">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                  <HelpCircle className="h-4 w-4" />
                  <span>O Dilema Real</span>
                </div>
                <p className="text-base md:text-lg font-medium text-stone-800 leading-relaxed italic">
                  "{currentStep.caseStudy.context}"
                </p>
                <h4 className="text-base md:text-xl font-black text-stone-900 pt-2">
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
                              ? "bg-blue-50 border-blue-500 ring-2 ring-emerald-500/20 shadow-md"
                              : "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-md"
                            : "bg-white border-stone-200 hover:border-blue-300 hover:bg-stone-50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs",
                          isSelected
                            ? opt.isCorrect ? "bg-blue-700 text-white" : "bg-amber-700 text-white"
                            : "border border-stone-300 text-stone-400"
                        )}>
                          {isSelected ? (opt.isCorrect ? "✓" : "✕") : ""}
                        </div>
                        <span className="text-sm md:text-base font-semibold text-stone-800 leading-relaxed">
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
                            opt.isCorrect ? "bg-blue-100/70 border-blue-200 text-emerald-900" : "bg-rose-100/70 border-rose-200 text-rose-900"
                          )}
                        >
                          <strong className="block mb-1">{opt.isCorrect ? "✓ Decisão Correta: " : "✕ Ponto de Reflexão: "}</strong>
                          {opt.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={selectedCaseOption === null}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2",
                    selectedCaseOption !== null
                      ? "bg-blue-700 hover:bg-blue-800 text-white hover:scale-[1.02]"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  )}
                >
                  <span>Avançar para Etapa 5: No Seu Território</span>
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
                <span className="px-3 py-1 rounded-full bg-blue-100 text-emerald-900 font-black text-[10px] uppercase tracking-wider inline-block">
                  Etapa 05 • Conexão Territorial
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-stone-500 font-medium">
                  {currentStep.subtitle} — Como este tema se manifesta onde você vive?
                </p>
              </div>

              {/* Pergunta Reflexiva */}
              <div className="p-8 rounded-[2.5rem] bg-stone-50 border border-stone-200 space-y-5 shadow-sm">
                <div className="flex items-center gap-2.5 text-blue-800 text-xs font-black uppercase tracking-wider">
                  <MapPin className="h-5 w-5" />
                  <span>Reflexão Territorial</span>
                </div>
                <h4 className="text-lg md:text-2xl font-black text-stone-800 leading-snug">
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
                            ? "bg-emerald-800 text-white border-blue-800 font-bold shadow-sm"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="h-5 w-5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {selectedTerritoryOption !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs md:text-sm text-stone-700 font-medium leading-relaxed"
                  >
                    <strong className="text-emerald-900 block mb-1">💡 Conexão LISSA:</strong>
                    {currentStep.territoryReflection.insight}
                  </motion.div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Ir para o Quiz de Fixação</span>
                  <Brain className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA FINAL: QUIZ DE FIXAÇÃO
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
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 block">
                        Avaliação Didática
                      </span>
                      <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight">
                        Quiz de Fixação dos Saberes
                      </h3>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 font-black text-xs font-mono">
                      Questão {currentQuestionIndex + 1} de {activeTrack.quiz.length}
                    </span>
                  </div>

                  {/* Questão Ativa */}
                  {(() => {
                    const q = activeTrack.quiz[currentQuestionIndex];
                    if (!q) return null;

                    return (
                      <div className="space-y-6">
                        <h4 className="text-lg md:text-2xl font-black text-stone-800 leading-snug">
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
                                      ? "bg-blue-50 border-blue-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm"
                                      : isChosen
                                      ? "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm"
                                      : "bg-stone-50 text-stone-400 border-stone-200 opacity-60"
                                    : "bg-white text-stone-700 border-stone-200 hover:border-blue-300 hover:bg-stone-50"
                                )}
                              >
                                <span className={cn(
                                  "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs",
                                  selectedAnswer !== null
                                    ? isCorrect ? "bg-blue-700 text-white" : isChosen ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-500"
                                    : "bg-stone-100 text-stone-600"
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
                            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs md:text-sm text-stone-700 leading-relaxed font-medium"
                          >
                            <strong className="text-emerald-900 block mb-1">Explicação Científica:</strong> {q.explanation}
                          </motion.div>
                        )}

                        {/* Botão de Avanço do Quiz */}
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null}
                            className={cn(
                              "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2",
                              selectedAnswer !== null
                                ? "bg-blue-700 hover:bg-blue-800 text-white hover:scale-[1.02]"
                                : "bg-stone-200 text-stone-400 cursor-not-allowed"
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
                  <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-700 border-2 border-blue-200 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">
                      Trilha Concluída com Sucesso ✓
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
                      Parabéns! Você completou {activeTrack.title}.
                    </h3>
                    <p className="text-sm md:text-base text-stone-600 font-medium max-w-lg mx-auto leading-relaxed">
                      Você percorreu todos os passos pedagógicos, compreendeu os sinais científicos em Libras e conectou o saber com o território.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <Trophy className="h-6 w-6 text-amber-600" />
                    <span className="text-sm font-black text-stone-800">
                      Seu resultado no Quiz: {quizScore} de {activeTrack.quiz.length} acertos
                    </span>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleBackToCatalog}
                      className="px-8 py-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider transition-all border border-stone-200 w-full sm:w-auto"
                    >
                      Voltar para as Trilhas
                    </button>

                    {(() => {
                      const currentIndex = librasTracks.findIndex(t => t.id === activeTrack.id);
                      const nextTrack = currentIndex < librasTracks.length - 1 ? librasTracks[currentIndex + 1] : null;
                      if (!nextTrack) return null;

                      return (
                        <button
                          onClick={() => handleStartTrack(nextTrack.id, 0)}
                          className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <span>Iniciar Próxima Trilha: {nextTrack.title}</span>
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

      {/* MODAL QR CODE NA SALA DE EXIBIÇÃO */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 mx-auto">
                <Smartphone className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-stone-900 tracking-tight">
                  Continuar no Celular
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  Aponte a câmera do seu smartphone para o QR Code abaixo para abrir exatamente de onde você parou, sem criar conta nem digitar senha.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-3xl inline-block shadow-inner border border-stone-200 mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrSyncUrl)}&color=1c1917`}
                  alt="QR Code de Continuidade"
                  className="w-48 h-48 rounded-xl"
                />
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleCopySyncLink}
                  className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  {copiedLink ? <CheckCheck className="h-4 w-4 text-blue-400" /> : <Share2 className="h-4 w-4" />}
                  <span>{copiedLink ? "Link Copiado com Sucesso!" : "Copiar Link de Acesso"}</span>
                </button>

                <p className="text-[11px] text-stone-400">
                  Seu progresso fica salvo com total privacidade.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
