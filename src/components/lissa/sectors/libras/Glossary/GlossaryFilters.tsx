"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLibras } from "../LibrasContext";
import { librasGlossary } from "@/lib/mock-data";

import { Sparkles, CheckCircle2, ChevronRight, Layers } from "lucide-react";

export function GlossaryFilters() {
  const { activeModuleId, setActiveModuleId, setTermSearch } = useLibras();

  const totalTermsCount = librasGlossary.reduce((acc, curr) => acc + (curr.terms?.length || 0), 0);

  return (
    <div className="space-y-6 mb-10">
      {/* Header do Grid de Eixos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Layers className="h-3.5 w-3.5" />
            <span>Navegação por Eixos Temáticos</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Selecione um Eixo para Explorar
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Clique em qualquer um dos 6 eixos abaixo para ver os termos científicos, vídeos e definições técnicas.
          </p>
        </div>

        {/* Botão para Todos os Termos */}
        <button
          onClick={() => {
            setActiveModuleId('todos');
            setTermSearch('');
          }}
          className={cn(
            "px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2.5 shrink-0",
            activeModuleId === 'todos'
              ? "bg-[#0b1421] text-white border-[#0b1421] shadow-lg shadow-black/10 scale-105"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Ver Todos os Termos ({totalTermsCount})</span>
        </button>
      </div>

      {/* Grid de Cards dos 6 Eixos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {librasGlossary.map((eixo, i) => {
          const axisNum = eixo.numericId || (i + 1);
          const isActive = 
            String(activeModuleId) === String(axisNum) ||
            String(activeModuleId).toLowerCase() === String(eixo.id).toLowerCase();

          const termCount = eixo.terms?.length || 0;
          const displayTitle = (eixo.title.split('—')[1] || eixo.title).trim();

          return (
            <motion.button
              key={eixo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                setActiveModuleId(String(axisNum));
                setTermSearch('');
              }}
              className={cn(
                "p-6 rounded-[2.5rem] text-left transition-all duration-300 border flex flex-col justify-between relative overflow-hidden group min-h-[190px]",
                isActive
                  ? "bg-white border-primary shadow-xl ring-2 ring-primary/20 scale-[1.02]"
                  : "bg-white/80 border-slate-100 hover:bg-white hover:border-primary/30 hover:shadow-lg"
              )}
            >
              {/* Top Row: Emoji, Eixo Number Badge, and Term Count */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                      {eixo.emoji}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      Eixo 0{axisNum}
                    </span>
                  </div>

                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                    isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {termCount} termos
                  </span>
                </div>

                {/* Title */}
                <h4 className={cn(
                  "font-black text-base uppercase tracking-tight leading-tight mb-2",
                  isActive ? "text-primary" : "text-slate-800 group-hover:text-primary transition-colors"
                )}>
                  {displayTitle}
                </h4>

                {/* Short Description */}
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                  {eixo.description}
                </p>
              </div>

              {/* Bottom Row: Action / Selection Status */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5",
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  {isActive ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Eixo Selecionado
                    </>
                  ) : (
                    <>
                      <span>Explorar termos</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
