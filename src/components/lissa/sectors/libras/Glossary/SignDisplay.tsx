"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ear } from "lucide-react";
import { useLibras } from "../LibrasContext";

export function SignDisplay() {
  const { activeTermObj, activeTermKey } = useLibras();

  if (!activeTermObj) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTermKey}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative aspect-video rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group ring-1 ring-primary/10"
      >
        {/* Glow perolado no container quando atualiza */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-white via-primary/20 to-white/10 pointer-events-none z-20"
        />

        <iframe
          src={`${activeTermObj.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0`}
          className="absolute inset-0 w-full h-full scale-[1.02]"
          allow="autoplay; encrypted-media"
          title={`Sinal de ${activeTermObj.term} em Libras`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-30">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
            <Ear className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sinal em Tempo Real</span>
          </div>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite">
          Iniciando vídeo do sinal em Libras para o termo: {activeTermObj.term}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
