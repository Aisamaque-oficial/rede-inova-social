"use client";

import React from "react";
import { motion } from "framer-motion";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { useLibras } from "./LibrasContext";

interface LibrasHeroProps {
  isStudio: boolean;
}

export function LibrasHero({ isStudio }: LibrasHeroProps) {
  const { termSearch, setTermSearch } = useLibras();

  return (
    <div className="bg-[#0b1421] text-white px-8 md:px-16 pt-24 pb-48 relative overflow-hidden">
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 opacity-40"/>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 opacity-30"/>
        
        {['🤟','👋','🖐️','✌️','🤙'].map((sign, i) => (
          <motion.span 
            key={i} 
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.01, 0.04, 0.01]
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute text-[15rem] font-serif" 
            style={{
              top: `${[10,50,20,80,40][i]}%`,
              left: `${[5, 15, 60, 80, 90][i]}%`,
            }}
          >
            {sign}
          </motion.span>
        ))}
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
          }
        }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Laboratório Virtual de Libras do LISSA</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none flex flex-wrap gap-x-6">
                Libras <span className="text-primary">Científica</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
                A democratização da ciência começa pela língua. Explore nosso sistema de tradução terminológica para Segurança Alimentar.
              </p>
            </motion.div>

            {/* Immersive Search */}
            <motion.div 
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
              className="relative max-w-xl group pt-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-3 flex items-center backdrop-blur-xl ring-1 ring-white/10">
                <div className="pl-6 text-white/40">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Busque por um termo ou conceito..."
                  value={termSearch}
                  onChange={e => setTermSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-white/20 text-xl font-medium px-4 py-3 focus:ring-0"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
