"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { librasGlossary } from "@/lib/mock-data";
import { useLibras } from "./LibrasContext";

export function CategoryGrid() {
  const { activeModuleId, setActiveModuleId, setTermSearch } = useLibras();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
      {librasGlossary.map((eixo, i) => {
        const isActive = activeModuleId === eixo.id;
        return (
          <motion.button
            key={eixo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => { setActiveModuleId(eixo.id); setTermSearch(''); }}
            className={cn(
              "group p-6 rounded-[2rem] text-left transition-all duration-500 border h-full flex flex-col justify-between overflow-hidden relative",
              isActive 
                ? "bg-primary border-primary shadow-[0_20px_40px_rgba(44,210,193,0.3)] scale-105" 
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
            )}
          >
            {isActive && (
              <motion.div 
                layoutId="activeGlow"
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              />
            )}
            <span className="text-3xl mb-4 block group-hover:scale-125 transition-transform relative z-10">{eixo.emoji}</span>
            <div className="relative z-10">
              <h4 className={cn(
                "font-black text-[10px] uppercase tracking-widest leading-tight",
                isActive ? "text-white" : "text-white/40"
              )}>
                {eixo.title.split('—')[1] || eixo.title}
              </h4>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
