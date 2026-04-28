"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { useLibras } from "../LibrasContext";

export function TermDefinition() {
  const { activeTermObj, activeTermKey, currentModule } = useLibras();

  if (!activeTermObj) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTermKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black tracking-[0.2em] px-4 py-1.5 uppercase">
              {currentModule?.title || 'Conceito Técnico'}
            </Badge>
            <span className="h-px flex-1 bg-slate-100" />
          </div>
          <h2 className="text-5xl font-black text-primary tracking-tighter uppercase italic">{activeTermObj.term}</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Definição Científica</h4>
            <p className="text-xl font-medium text-slate-600 leading-relaxed italic">
              "{activeTermObj.description}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeTermObj.context && (
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-3xl">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Contexto de Aplicação</h4>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                  {activeTermObj.context}
                </p>
              </div>
            )}

            {activeTermObj.signStrategy && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estratégia de Sinalização</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {activeTermObj.signStrategy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tags para Busca Inteligente */}
        {activeTermObj.tags && activeTermObj.tags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tags:</span>
            {activeTermObj.tags.map((tag: string, idx: number) => (
              <span key={idx} className="bg-white border border-slate-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
