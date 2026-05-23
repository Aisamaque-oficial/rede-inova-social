"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  Eye, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  Languages,
  ArrowLeft,
  Skull,
  Waves,
  Zap,
  Leaf,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Configurações de Narrativa ---
const PLOT = {
  intro: [
    "O silêncio do território não é vazio. É memória.",
    "Mas a terra está parando de respirar.",
    "Cercas avançam. Sementes morrem. O cinza devora o verde.",
    "Você ouve com os olhos. Você sente com os pés.",
    "Sua missão é reconectar o que foi partido."
  ],
  village_conflict: "A Vila das Palmeiras resiste, mas a fonte de água foi cercada por máquinas que não entendem a linguagem da terra."
};

export function SementesGame({ onClose }: { onClose?: () => void }) {
  const [gameState, setGameState] = useState<'intro' | 'exploring' | 'dialogue' | 'event' | 'cinematic'>('intro');
  const [introStep, setIntroStep] = useState(0);
  const [playerX, setPlayerX] = useState(10);
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [inventory, setInventory] = useState<string[]>([]);
  const [hasSkill, setHasSkill] = useState(false);
  const [worldState, setWorldState] = useState<'degraded' | 'restoring' | 'healed'>('degraded');

  // --- Sistema de Vibração Visual (Substituto para Áudio) ---
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    if (gameState === 'intro') {
      const timer = setTimeout(() => {
        if (introStep < PLOT.intro.length - 1) {
          setIntroStep(prev => prev + 1);
        } else {
          setGameState('exploring');
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState, introStep]);

  // Controles de movimento com feedback visual
  useEffect(() => {
    if (gameState !== 'exploring') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPlayerX(prev => Math.min(prev + 2, 95));
        triggerVibration();
      } else if (e.key === "ArrowLeft") {
        setPlayerX(prev => Math.max(prev - 2, 5));
        triggerVibration();
      } else if (e.key === "v" || e.key === " ") {
        setIsVisionActive(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 100);
  };

  return (
    <div className={cn(
      "relative w-full h-[650px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] border-8 border-slate-900 selection:bg-none transition-all duration-500",
      isVibrating ? "translate-y-1" : "translate-y-0"
    )}>
      
      {/* --- CENA DE INTRODUÇÃO (NARRATIVA VISUAL) --- */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div
              key={introStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="space-y-8"
            >
              <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none max-w-4xl">
                {PLOT.intro[introStep]}
              </p>
              <div className="flex justify-center gap-2">
                {PLOT.intro.map((_, i) => (
                  <div key={i} className={cn("h-1 w-12 rounded-full transition-all duration-1000", i === introStep ? "bg-primary" : "bg-white/10")} />
                ))}
              </div>
            </motion.div>

            {/* Elementos visuais de fundo na intro */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MUNDO DO JOGO --- */}
      <div className="relative w-full h-full bg-[#050505] overflow-hidden">
        
        {/* Parallax Background - Degradado vs Vivo */}
        <div className={cn(
          "absolute inset-0 transition-all duration-[2000ms]",
          isVisionActive ? "scale-105" : "scale-100"
        )}>
          {/* Fundo Distante - Máquinas e Degradado */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black">
             <div className="absolute bottom-40 left-0 w-full h-64 bg-slate-900/40 opacity-50" />
             {/* Máquinas Cinzas (Conflito) */}
             <div className="absolute bottom-40 right-20 flex gap-4 opacity-30">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-32 h-64 bg-slate-800 rounded-t-full border-r-8 border-slate-700 relative">
                     <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-20 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.5}s` }} />
                  </div>
                ))}
             </div>
          </div>

          {/* Chão e Elementos de Resistência */}
          <div className={cn(
            "absolute bottom-0 w-full h-40 transition-colors duration-1000",
            worldState === 'degraded' ? "bg-[#1a1c1a]" : "bg-emerald-900"
          )}>
            <div className="absolute top-0 w-full h-1 bg-white/5" />
            
            {/* Solo Rachado (Só visível se degradado) */}
            {worldState === 'degraded' && (
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/criss-cross.png')] rotate-12" />
            )}
          </div>
        </div>

        {/* --- PERSONAGEM (PROTAGONISTA) --- */}
        <motion.div 
          animate={{ x: `${playerX}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute bottom-40 -translate-x-1/2 z-50 group"
        >
          {/* O Protagonista - Design focado em expressão corporal */}
          <div className="relative">
            {/* Círculo de Sensibilidade (Acessibilidade Visual) */}
            <AnimatePresence>
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -inset-12 border border-primary/20 rounded-full pointer-events-none" 
               />
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0, 0.2, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -inset-20 border border-primary/10 rounded-full pointer-events-none" 
               />
            </AnimatePresence>

            <div className={cn(
              "w-16 h-24 bg-white rounded-[2rem] shadow-2xl relative transition-all duration-700 overflow-hidden",
              isVisionActive ? "ring-8 ring-primary ring-offset-4 ring-offset-black" : ""
            )}>
              {/* Cabelo / Cabeça */}
              <div className="absolute top-0 left-0 w-full h-8 bg-slate-200" />
              {/* Olhos (Única fonte de informação) */}
              <div className="absolute top-10 left-3 right-3 flex justify-between">
                <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
              </div>
              {/* Roupa (Poncho territorial) */}
              <div className="absolute bottom-0 w-full h-10 bg-emerald-600" />
            </div>

            {/* Sombra de impacto visual */}
            <div className="w-16 h-4 bg-black/60 rounded-full mt-4 blur-md" />
          </div>
        </motion.div>

        {/* --- INTERAÇÕES AMBIENTAIS (TRAMA) --- */}
        
        {/* A Água Cercada (Conflito do Nível 1) */}
        <div className="absolute bottom-40 left-[80%] -translate-x-1/2 flex flex-col items-center">
            <div className="w-40 h-20 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <div className="w-1 h-32 bg-slate-700/80 mb-[-10px] z-20" />
            <div className="bg-slate-800 p-4 border-t-4 border-red-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Skull className="w-4 h-4 text-red-500" /> Território Cercado
            </div>
        </div>

        {/* O Mestre da Terra (Memória do Povo) */}
        <div className="absolute bottom-40 left-[40%] -translate-x-1/2 flex flex-col items-center group">
            <div className="w-20 h-28 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 flex flex-col items-center justify-center gap-2">
               <User className="w-8 h-8 text-white/20" />
            </div>
            <div className="mt-4 flex flex-col items-center">
               <Badge className="bg-emerald-500/20 text-emerald-400 border-none uppercase font-black text-[9px] px-4 py-1">Guardião da Memória</Badge>
               {Math.abs(playerX - 40) < 10 && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-2 bg-white text-black font-black text-[9px] px-3 py-2 rounded-full shadow-2xl"
                 >
                   [E] OBSERVAR SINAL
                 </motion.div>
               )}
            </div>
        </div>

        {/* --- MECÂNICA DE LEITURA DA TERRA (PLOT DEVICE) --- */}
        <AnimatePresence>
          {isVisionActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-[60]"
            >
              {/* Filtro de Percepção Visual */}
              <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
              
              {/* Sementes Crioulas Ocultas (Drama: Elas estão aqui, mas invisíveis ao sistema predatório) */}
              <div className="absolute bottom-44 left-[20%] flex flex-col items-center gap-2">
                 <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-4 bg-primary rounded-full blur-md shadow-[0_0_20px_#2cd2c1]" />
                 <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Memória de Solo</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- UI E NAVEGAÇÃO --- */}
        <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-[70]">
           <div className="flex flex-col gap-4">
              <Button onClick={onClose} variant="ghost" className="text-white/40 hover:text-white uppercase font-black text-[10px] tracking-widest px-0">
                <ArrowLeft className="w-4 h-4 mr-2" /> Abandonar Território
              </Button>
              <div className={cn(
                "px-6 py-3 rounded-full border-2 transition-all flex items-center gap-3",
                isVisionActive ? "bg-primary text-black border-primary shadow-[0_0_40px_rgba(44,210,193,0.4)]" : "bg-black/40 text-white/40 border-white/10 backdrop-blur-md"
              )}>
                <Eye className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Leitura da Terra</span>
              </div>
           </div>

           <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 text-right space-y-2 max-w-sm">
              <div className="flex items-center justify-end gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
                <MapPin className="w-3 h-3" /> Vila das Palmeiras
              </div>
              <p className="text-[11px] font-bold text-white/90 leading-snug uppercase tracking-tight italic">
                {PLOT.village_conflict}
              </p>
           </div>
        </div>

        {/* Interface de "Som Visual" (Acessibilidade) */}
        <div className="absolute bottom-12 left-12 flex gap-4 items-end z-[70]">
           <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden">
              <motion.div 
                animate={{ height: isVibrating ? [4, 20, 4] : [4, 8, 4] }}
                transition={{ duration: 0.2 }}
                className="w-1 bg-primary rounded-full mx-0.5"
              />
              <motion.div 
                animate={{ height: isVibrating ? [4, 30, 4] : [4, 12, 4] }}
                transition={{ duration: 0.2 }}
                className="w-1 bg-primary rounded-full mx-0.5"
              />
              <motion.div 
                animate={{ height: isVibrating ? [4, 15, 4] : [4, 6, 4] }}
                transition={{ duration: 0.2 }}
                className="w-1 bg-primary rounded-full mx-0.5"
              />
           </div>
           <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Percepção de Vibração</div>
        </div>

        {/* Botão de Ajuda Contextual */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-[70]">
           <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                 {['Movimento', 'Percepção', 'Interação'].map(k => (
                   <div key={k} className="px-3 py-1 bg-white/10 rounded-full text-[7px] font-black text-white/60 uppercase tracking-widest border border-white/5">
                     {k}
                   </div>
                 ))}
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">A terra responde aos seus passos</p>
           </div>
        </div>

      </div>
    </div>
  );
}
