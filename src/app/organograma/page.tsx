"use client";

import React, { useState } from "react";
import MainHeader from "@/components/main-header";
import { TeamGrid } from "@/components/team-grid";
import TeamFlowchart from "@/components/team-flowchart";
import LogoCarousel from "@/components/logo-carousel";
import { Network, Users, ChevronRight, LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OrganogramaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
      <MainHeader />
      
      <main className="flex-1 pt-32 pb-20">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden mb-16">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-citrus/5 rounded-full blur-3xl" />
           
           <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center text-center space-y-6">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
                 >
                    <Users size={12} className="text-primary" /> Equipe de Inovação Social
                 </motion.div>
                 
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black font-headline tracking-tighter italic uppercase text-slate-900 max-w-4xl leading-[1.05]"
                 >
                    Unidos pela <span className="text-primary">Inovação</span> e Equidade
                 </motion.h1>
                 
                 <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-[700px] text-slate-400 font-medium text-lg italic"
                 >
                    Conheça a equipe multidisciplinar que trabalha para transformar a realidade da agricultura familiar e segurança alimentar.
                 </motion.p>

                 {/* View Toggle */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex p-1 bg-slate-100 rounded-2xl shadow-inner mt-4"
                 >
                    <Button 
                       variant={viewMode === 'grid' ? "default" : "ghost"}
                       onClick={() => setViewMode('grid')}
                       className={cn(
                          "rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 h-10 px-6",
                          viewMode === 'grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                       )}
                    >
                       <LayoutGrid size={14} /> Galeria
                    </Button>
                    <Button 
                       variant={viewMode === 'map' ? "default" : "ghost"}
                       onClick={() => setViewMode('map')}
                       className={cn(
                          "rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 h-10 px-6",
                          viewMode === 'map' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                       )}
                    >
                       <Map size={14} /> Mapa da Rede
                    </Button>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Content Display */}
        <section className="container px-4 md:px-6">
           <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                 <motion.div
                    key="grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                 >
                    <TeamGrid />
                 </motion.div>
              ) : (
                 <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="h-[80vh] w-full rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden relative"
                 >
                    <div className="absolute top-6 left-6 z-20">
                        <Badge variant="outline" className="bg-white/80 backdrop-blur font-black uppercase text-[10px] tracking-widest px-4 py-2 border-slate-100 shadow-sm">
                           Visualização Hierárquica Técnica
                        </Badge>
                    </div>
                    <TeamFlowchart />
                 </motion.div>
              )}
           </AnimatePresence>
        </section>

        <section className="mt-32">
           <LogoCarousel />
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center md:text-left">
              © 2026. Rede de Inovação Social | IF Baiano/CNPq
           </p>
           <nav className="flex gap-8">
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Termos</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Privacidade</a>
           </nav>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold overflow-hidden", className)}>
        {children}
    </div>
  );
}
