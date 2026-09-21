"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  AlertCircle
} from "lucide-react";
import { librasTracks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TracksSection() {
  // Active track being viewed/studied (null = view all tracks list)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  
  // Track step management
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Interactive stage states
  const [selectedCaseOption, setSelectedCaseOption] = useState<string | null>(null);
  const [selectedTerritoryOption, setSelectedTerritoryOption] = useState<number | null>(null);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Completed tracks in localStorage
  const [completedTrackIds, setCompletedTrackIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("lissa_completed_tracks");
        if (stored) {
          setCompletedTrackIds(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading completed tracks:", e);
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

  const activeTrack = useMemo(() => {
    return librasTracks.find(t => t.id === activeTrackId) || null;
  }, [activeTrackId]);

  const categories = ["Todas", "Alimentação", "Segurança Alimentar", "Agricultura Familiar", "Saúde", "Ciência"];

  const filteredTracks = useMemo(() => {
    if (activeCategory === "Todas") return librasTracks;
    return librasTracks.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const progressPercentage = Math.round((completedTrackIds.length / librasTracks.length) * 100);

  // Reset steps and questions when entering a track
  const handleStartTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    setCurrentStepIndex(0);
    setSelectedCaseOption(null);
    setSelectedTerritoryOption(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setIsQuizCompleted(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  const handleBackToTracks = () => {
    setActiveTrackId(null);
    setCurrentStepIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 320, behavior: "smooth" });
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
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    }
  };

  // Quiz answer submit
  const handleAnswerQuestion = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // already answered
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
      // Finished quiz!
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

  // =========================================================
  // VIEW 1: HUB DE TRILHAS (GRADE COM 3 CARDS POR LINHA)
  // =========================================================
  if (!activeTrackId || !activeTrack) {
    return (
      <div className="space-y-10 mb-20 animate-in fade-in duration-500 w-full">
        {/* Banner de Apresentação das Trilhas */}
        <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <Compass className="h-3.5 w-3.5" />
                <span>Temporada 1 • Alimentação e Território</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">
                Trilhas de Conhecimento
              </h2>
              <p className="text-base md:text-lg text-primary font-bold">
                Percursos curtos para aprender conceitos de alimentação, segurança alimentar e ciência em Libras.
              </p>
              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                Escolha uma trilha, avance pelas etapas e teste seus conhecimentos. Os conteúdos combinam Libras, recursos visuais, textos em linguagem clara e atividades rápidas.
              </p>
            </div>

            {/* Barra de Progresso Simples e Amigável */}
            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200/80 min-w-[280px] space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">Seu Progresso</span>
                <span className="text-xs font-black text-primary">
                  {completedTrackIds.length} de {librasTracks.length} concluídas
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-primary rounded-full shadow-sm"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 block text-right">
                {progressPercentage}% do percurso completo
              </span>
            </div>
          </div>

          {/* Filtros de Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none border-t border-slate-100">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade de 3 Cards por Linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredTracks.map((track, i) => {
            const isCompleted = completedTrackIds.includes(track.id);

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col"
              >
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between flex-1 relative overflow-hidden group-hover:ring-4 group-hover:ring-primary/5 min-h-[340px]">
                  <div>
                    {/* Topo: Categoria + Status Concluído */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                        {track.category}
                      </span>

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Concluída</span>
                        </span>
                      )}
                    </div>

                    {/* Título da Trilha */}
                    <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug mb-3">
                      {track.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                      {track.description}
                    </p>
                  </div>

                  {/* Rodapé do Card com badges mínimos e Ação */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>{track.stepsCount} etapas • {track.duration}</span>
                      <span>Libras • Legendas • Texto</span>
                    </div>

                    <button
                      onClick={() => handleStartTrack(track.id)}
                      className={cn(
                        "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg",
                        isCompleted
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-primary text-white hover:bg-primary/90 group-hover:scale-[1.02]"
                      )}
                    >
                      <span>{isCompleted ? "Rever Trilha" : "Iniciar Trilha"}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW 2: AMBIENTE DA TRILHA POR DENTRO (JORNADA INTERATIVA)
  // Conecta Trilha → Glossário → Minuto → Caso Real → Quiz
  // =========================================================
  const totalStages = activeTrack.steps.length + 1; // steps + quiz
  const isQuizStage = currentStepIndex === activeTrack.steps.length;
  const currentStep = !isQuizStage ? activeTrack.steps[currentStepIndex] : null;

  return (
    <div className="space-y-8 mb-20 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      {/* 1. Barra Superior com Voltar e Título */}
      <div className="bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleBackToTracks}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-black text-xs uppercase tracking-wider transition-all shadow-sm group w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Trilhas</span>
        </button>

        <div className="text-center sm:text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
            {activeTrack.category} • {activeTrack.duration}
          </span>
          <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">
            {activeTrack.title}
          </h2>
        </div>
      </div>

      {/* 2. Stepper Visual das Etapas */}
      <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {activeTrack.steps.map((step, idx) => {
            const isStepActive = currentStepIndex === idx;
            const isStepCompleted = currentStepIndex > idx || isQuizCompleted;

            return (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
                  isStepActive
                    ? "bg-primary text-white border-primary shadow-md scale-105"
                    : isStepCompleted
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                )}
              >
                {isStepCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
                <span>
                  {step.type === "video" && "Vídeo"}
                  {step.type === "concepts" && "Conceitos"}
                  {step.type === "pill" && "Minuto"}
                  {step.type === "case" && "Na Prática"}
                  {step.type === "territory" && "Território"}
                </span>
              </button>
            );
          })}

          {/* Botão do Quiz */}
          <button
            onClick={() => setCurrentStepIndex(activeTrack.steps.length)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border",
              isQuizStage
                ? "bg-primary text-white border-primary shadow-md scale-105"
                : isQuizCompleted
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
            )}
          >
            {isQuizCompleted ? <Check className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
            <span>Quiz Final</span>
          </button>
        </div>
      </div>

      {/* 3. CONTEÚDO DINÂMICO DA ETAPA ATIVA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-12 space-y-8">
        <AnimatePresence mode="wait">
          {/* =========================================================
              ETAPA 1: VÍDEO PRINCIPAL & APRESENTAÇÃO EM LIBRAS
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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Etapa 01 • Introdução Visual
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Player do Vídeo Principal */}
              <div className="rounded-[2.5rem] overflow-hidden bg-slate-950 aspect-video shadow-2xl border border-slate-800 relative">
                <iframe
                  src={getEmbedUrl(currentStep.videoUrl)}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentStep.title}
                />
              </div>

              {/* Texto explicativo em linguagem clara */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Resumo Didático em Português
                </span>
                <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                  {currentStep.content}
                </p>
              </div>

              {/* Ação: Próxima Etapa */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 2: Conheça os Conceitos</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 2: CONHEÇA OS CONCEITOS (CONEXÃO COM O GLOSSÁRIO)
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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Etapa 02 • Conexão com o Glossário Científico
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStep.subtitle} — Veja como estes termos são sinalizados e definidos oficialmente.
                </p>
              </div>

              {/* Cards Interativos dos Termos do Glossário */}
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {currentStep.conceptTerms?.map((termItem, tidx) => (
                  <div
                    key={tidx}
                    className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-primary text-white font-mono text-[11px] font-black">
                          {termItem.codeId || `#0${tidx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Libras Científica
                        </span>
                      </div>

                      <h4 className="text-base font-black uppercase tracking-tight text-slate-900 leading-snug">
                        {termItem.term}
                      </h4>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {termItem.definition}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-wider">
                        <Ear className="h-3.5 w-3.5" />
                        <span>Sinal em Libras</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {termItem.signStrategy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 3: Minuto do Conhecimento</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 3: MINUTO DO CONHECIMENTO (CONEXÃO COM PÍLULAS)
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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Etapa 03 • Conexão com o Minuto do Conhecimento
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStep.subtitle} — Uma pílula em vídeo explicando uma questão prática.
                </p>
              </div>

              {/* Visualizador da Pílula */}
              <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-[340px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 relative">
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
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                      Duração: {currentStep.pill.duration}
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {currentStep.pill.title}
                    </h4>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Apoio Estratégico
                    </span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {currentStep.pill.supportText}
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-emerald-800">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Aplicação Prática no Dia a Dia</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {currentStep.pill.practicalApp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Avançar para Etapa 4: Na Vida Real</span>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Etapa 04 • Na Vida Real (Situação-Problema)
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Card da Situação Problema */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-primary/5 border border-slate-200/80 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>O Caso de Estudo</span>
                </div>
                <p className="text-base md:text-lg font-medium text-slate-800 leading-relaxed italic">
                  "{currentStep.caseStudy.context}"
                </p>
                <h4 className="text-base md:text-xl font-black text-slate-900 pt-2">
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
                              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                              : "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-md"
                            : "bg-white border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs",
                          isSelected
                            ? opt.isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                            : "border border-slate-300 text-slate-400"
                        )}>
                          {isSelected ? (opt.isCorrect ? "✓" : "✕") : ""}
                        </div>
                        <span className="text-sm md:text-base font-semibold text-slate-800 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>

                      {/* Feedback Explicativo */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={cn(
                            "p-5 rounded-2xl text-xs md:text-sm font-medium leading-relaxed",
                            opt.isCorrect ? "bg-emerald-100/70 text-emerald-900" : "bg-rose-100/70 text-rose-900"
                          )}
                        >
                          <strong>{opt.isCorrect ? "Correto! " : "Atenção: "}</strong>
                          {opt.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={selectedCaseOption === null}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2",
                    selectedCaseOption !== null
                      ? "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <span>Avançar para Etapa 5: No Seu Território</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              ETAPA 5: O QUE ACONTECE NO SEU TERRITÓRIO? (REFLEXÃO)
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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Etapa 05 • Conexão Territorial
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {currentStep.subtitle} — A ciência aplicada à sua vivência.
                </p>
              </div>

              {/* Pergunta Reflexiva */}
              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/80 space-y-5">
                <div className="flex items-center gap-2.5 text-primary text-xs font-black uppercase tracking-wider">
                  <MapPin className="h-5 w-5" />
                  <span>Pergunta Reflexiva Territorial</span>
                </div>
                <h4 className="text-lg md:text-2xl font-black text-slate-800 leading-snug">
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
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
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
                    className="p-5 rounded-2xl bg-white border border-primary/20 text-xs md:text-sm text-slate-600 font-medium leading-relaxed"
                  >
                    <strong className="text-primary block mb-1">💡 Conexão LISSA:</strong>
                    {currentStep.territoryReflection.insight}
                  </motion.div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all"
                >
                  ← Etapa Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:scale-[1.02] flex items-center gap-2"
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
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                        Avaliação de Fixação
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Teste seus Conhecimentos
                      </h3>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-black text-xs">
                      Questão {currentQuestionIndex + 1} de {activeTrack.quiz.length}
                    </span>
                  </div>

                  {/* Questão Ativa */}
                  {(() => {
                    const q = activeTrack.quiz[currentQuestionIndex];
                    if (!q) return null;

                    return (
                      <div className="space-y-6">
                        <h4 className="text-lg md:text-2xl font-black text-slate-800 leading-snug">
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
                                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm"
                                      : isChosen
                                      ? "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm"
                                      : "bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                                )}
                              >
                                <span className={cn(
                                  "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs",
                                  selectedAnswer !== null
                                    ? isCorrect ? "bg-emerald-600 text-white" : isChosen ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-500"
                                    : "bg-slate-100 text-slate-600"
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
                            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed font-medium"
                          >
                            <strong>Explicação:</strong> {q.explanation}
                          </motion.div>
                        )}

                        {/* Botão de Avanço do Quiz */}
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null}
                            className={cn(
                              "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2",
                              selectedAnswer !== null
                                ? "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                          >
                            <span>{currentQuestionIndex < activeTrack.quiz.length - 1 ? "Próxima Questão" : "Finalizar Trilha"}</span>
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
                  <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xl border-4 border-white">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                      Trilha Concluída ✓
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                      Parabéns! Você concluiu {activeTrack.title}.
                    </h3>
                    <p className="text-sm md:text-base text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                      Você avançou por todas as etapas pedagógicas, explorou os termos em Libras e aplicou os conceitos na prática territorial.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <span className="text-sm font-black text-slate-700">
                      Acertos no Quiz: {quizScore} de {activeTrack.quiz.length}
                    </span>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleBackToTracks}
                      className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-all w-full sm:w-auto"
                    >
                      Voltar para as Trilhas
                    </button>

                    {(() => {
                      const currentIndex = librasTracks.findIndex(t => t.id === activeTrack.id);
                      const nextTrack = currentIndex < librasTracks.length - 1 ? librasTracks[currentIndex + 1] : null;
                      if (!nextTrack) return null;

                      return (
                        <button
                          onClick={() => handleStartTrack(nextTrack.id)}
                          className="px-8 py-4 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto"
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
    </div>
  );
}
