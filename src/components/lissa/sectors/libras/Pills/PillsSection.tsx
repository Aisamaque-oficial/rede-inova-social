import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { useLibras } from "../LibrasContext";
import { cn } from "@/lib/utils";

export function PillsSection() {
  const { minutes } = useLibras();
  const [activePillId, setActivePillId] = useState<string | null>(null);

  const activePill = minutes.find(p => p.id === activePillId);

  return (
    <div className="space-y-12 pt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Lista de Pílulas */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3 px-4 mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Minuto do Conhecimento</h3>
          </div>
          
          <div className="space-y-3">
            {minutes.map((pill, i) => {
              const isActive = activePillId === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActivePillId(prev => prev === pill.id ? null : pill.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-[2.5rem] transition-all duration-300 border group flex items-center justify-between",
                    isActive 
                      ? "bg-white border-primary shadow-2xl scale-105" 
                      : "bg-white/40 border-slate-100 hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center font-black",
                      isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className={cn("font-black uppercase tracking-tight text-lg", isActive ? "text-primary" : "text-slate-800")}>
                        {pill.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pill.category}</p>
                    </div>
                  </div>
                  <Play className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-200 group-hover:text-primary")} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Player e Microexplicação */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activePill && activePill.videoUrl ? (
              <motion.div
                key={activePill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[4rem] shadow-2xl p-10 md:p-16 space-y-12 overflow-hidden relative border border-primary/5"
              >
                {/* O Núcleo: Vídeo Protagonista */}
                <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-900 ring-4 ring-primary/5 shadow-2xl">
                  <iframe
                    src={`${activePill.videoUrl.includes('watch?v=') 
                      ? activePill.videoUrl.replace('watch?v=', 'embed/') 
                      : activePill.videoUrl}?autoplay=1&mute=1&loop=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                  />
                  
                  {/* Reforço Visual Dinâmico (Imagem/Setas) */}
                  {activePill.visualReinforcementUrl ? (
                    <div className="absolute top-8 right-8 animate-pulse">
                      <img 
                        src={activePill.visualReinforcementUrl} 
                        className="h-24 w-24 object-contain drop-shadow-2xl"
                        alt="Reforço Visual"
                      />
                    </div>
                  ) : (
                    <div className="absolute top-8 right-8 animate-bounce">
                      <div className="bg-primary text-white p-3 rounded-2xl shadow-xl ring-2 ring-white/20">
                        <ArrowRight className="h-6 w-6 rotate-90" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Microexplicação Conceitual */}
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                      Apoio Estratégico (Não Redundante)
                    </div>
                    {/* Regra de Ouro: Máximo 3 linhas */}
                    <p className="text-xl font-medium text-slate-600 leading-relaxed italic line-clamp-3">
                      "{activePill.supportText || 'Aguardando microexplicação técnica...'}"
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aplicação Prática (Vida Real)</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase tracking-tight line-clamp-3">
                      {activePill.practicalApp || 'Onde isso aparece na indústria ou laboratório?'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Zap className="h-16 w-16 mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest">Selecione uma pílula</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
