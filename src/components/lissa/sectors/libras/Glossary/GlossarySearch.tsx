"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLibras } from "../LibrasContext";

export function GlossarySearch() {
  const { glossaryTerms, isGlossaryLoading, activeTermKey, setActiveTermKey } = useLibras();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {isGlossaryLoading ? 'Carregando...' : `${glossaryTerms.length} Termos no Eixo`}
        </span>
        <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isGlossaryLoading ? '30%' : '100%' }}
            className={cn("h-full bg-primary", isGlossaryLoading && "animate-pulse")}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] pr-2 overflow-y-auto scrollbar-hide">
        {isGlossaryLoading ? (
          // Skeleton Loading
          [...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-24 bg-slate-50 animate-pulse rounded-[2.5rem]" />
          ))
        ) : (
          glossaryTerms.map((term: any, i: number) => {
            const isActive = activeTermKey === term.term;
            const videoLink = term.videoUrl || term.video_url || '';
            const hasVideo = Boolean(videoLink && videoLink.trim() !== '' && videoLink !== '#');

            return (
              <motion.button
                key={term.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 8 }}
                onClick={() => setActiveTermKey(term.term)}
                className={cn(
                  "w-full text-left p-6 rounded-[2.5rem] transition-all duration-300 border flex items-center justify-between group relative overflow-hidden",
                  isActive 
                    ? (hasVideo ? "bg-white border-blue-500 shadow-2xl ring-1 ring-blue-500/20" : "bg-white border-primary shadow-2xl ring-1 ring-primary/20")
                    : "bg-white/40 border-slate-100 hover:bg-white hover:shadow-xl"
                )}
              >
                {hasVideo && !isActive && (
                  <div className="absolute inset-0 bg-blue-50/30 pointer-events-none" />
                )}
                <div className="flex items-center gap-5 relative z-10">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-colors",
                    isActive 
                      ? (hasVideo ? "bg-blue-500 text-white" : "bg-primary text-white") 
                      : (hasVideo ? "bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary")
                  )}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-black uppercase tracking-tight text-lg leading-none flex items-center gap-2",
                      isActive 
                        ? (hasVideo ? "text-blue-600" : "text-primary") 
                        : "text-slate-800"
                    )}>
                      {term.term}
                      {hasVideo && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
                    </h4>
                    <p className={cn(
                      "text-[10px] font-bold mt-1 uppercase tracking-widest",
                      hasVideo ? "text-blue-500" : "text-slate-400"
                    )}>
                      {hasVideo ? "Vídeo Disponível" : "Em breve"}
                    </p>
                  </div>
                </div>
                <ArrowRight className={cn(
                  "h-5 w-5 transition-all relative z-10",
                  isActive 
                    ? (hasVideo ? "text-blue-500 translate-x-2" : "text-primary translate-x-2") 
                    : (hasVideo ? "text-blue-300 group-hover:text-blue-500" : "text-slate-200 group-hover:text-primary")
                )} />
              </motion.button>
            );
          })
      )}
      </div>
    </div>
  );
}
