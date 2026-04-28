"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLibras } from "../LibrasContext";
import { librasGlossary } from "@/lib/mock-data";

export function GlossaryFilters() {
  const { activeModuleId, setActiveModuleId, setTermSearch } = useLibras();


  const filters = [
    { id: 'todos', title: 'TODOS', emoji: null },
    { id: '1', title: 'FUNDAMENTAÇÃO', emoji: '🤟' },
    { id: '2', title: 'IMUNOLÓGICO-DIGESTIVO', emoji: '🧬' },
    { id: '3', title: 'ROTULAGEM TÉCNICA', emoji: '🏷️' },
    { id: '4', title: 'ANÁLISE CRÍTICA', emoji: '⚖️' },
    { id: '5', title: 'SOBERANIA ALIMENTAR', emoji: '🌽' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8 items-center">
      <div className="p-3 bg-white/40 rounded-2xl mr-2">
        <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15z" />
        </svg>
      </div>
      
      {filters.map((filter) => {
        const isActive = activeModuleId === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => { setActiveModuleId(filter.id); setTermSearch(''); }}
            className={cn(
              "px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-3",
              isActive
                ? "bg-[#1a2332] text-white border-[#1a2332] shadow-lg scale-105"
                : "bg-white/40 text-slate-500 border-slate-100 hover:bg-white hover:border-primary/20"
            )}
          >
            {filter.emoji && <span className="text-sm opacity-70">{filter.emoji}</span>}
            {filter.title}
          </button>
        );
      })}
    </div>
  );
}
