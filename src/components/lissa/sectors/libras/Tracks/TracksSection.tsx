"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Play, CheckCircle, Brain, Trophy } from "lucide-react";
import { librasTracks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useLibras } from "../LibrasContext";
import { QuizContainer } from "./Quiz/QuizContainer";

export function TracksSection() {
  const { tracks, activeTrackId, setActiveTrackId } = useLibras();
  const [showQuiz, setShowQuiz] = useState(false);
  const activeTrack = tracks.find(t => t.id === activeTrackId);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {!activeTrackId ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setActiveTrackId(track.id); setShowQuiz(false); }}
              className="bg-white rounded-[3rem] p-10 text-left border border-slate-100 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-tight mb-4">{track.title}</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed line-clamp-2">{track.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Play className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Iniciar Trilha</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Brain className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">1 Quiz</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header da Trilha Ativa */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveTrackId(null)}
              className="group flex items-center gap-3 text-slate-400 hover:text-primary transition-colors"
            >
              <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Map className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Voltar para Trilhas</span>
            </button>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{activeTrack?.title}</h2>
                <div className="flex items-center justify-end gap-2 mt-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Em andamento</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-primary/5">
            <AnimatePresence mode="wait">
              {!showQuiz ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-12 space-y-10"
                >
                  <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-900 ring-8 ring-slate-50">
                    <iframe
                      src={`${activeTrack?.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; encrypted-media"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-10">
                    <div className="max-w-xl">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Instruções</h4>
                      <p className="text-lg text-slate-600 font-medium italic">
                        Assista ao vídeo atentamente para se preparar para o desafio técnico ao final da aula.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-105 hover:bg-primary/90 transition-all flex items-center gap-4"
                    >
                      <Brain className="h-5 w-5" />
                      Ir para o Quiz
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-12"
                >
                  <QuizContainer 
                    trackId={activeTrackId} 
                    questions={activeTrack?.quiz_data || (activeTrack as any)?.questions || []} 
                    onComplete={() => setActiveTrackId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
