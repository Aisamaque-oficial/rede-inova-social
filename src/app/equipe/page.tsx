"use client";

import React, { useState, useEffect } from "react";
import MainHeader from "@/components/main-header";
import { TeamGrid } from "@/components/team-grid";
import TeamFlowchart from "@/components/team-flowchart";
import LogoCarousel from "@/components/logo-carousel";
import { Users, LayoutGrid, Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { dataService } from "@/lib/data-service";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { CMSBlock } from "@/lib/cms-schema";

export default function TeamPage({ params }: { params?: { estudio?: string } }) {
  const isStudio = !!params?.estudio; // Check if we are in studio mode
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = dataService.getCurrentUserId();
    const hasPermission = userId ? dataService.podeEditar(userId) : false;
    // REGRA DE OURO: Editor visual (lápis) só aparece no Estúdio
    setCanEdit(hasPermission && isStudio);
    setIsLoading(false);
  }, [isStudio]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
      <MainHeader />
      
      <main className="flex-1 pt-32 pb-20">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden mb-16">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-citrus/5 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center text-center space-y-6">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary"
                 >
                    <Sparkles size={12} /> Nossa Equipe
                 </motion.div>
                 
                 <CMSPageRenderer 
                    pageId="equipe_hero"
                    isStudio={isStudio}
                    defaultBlocks={[
                        { id: "equipe_hero_title", type: 'header', content: "Conheça quem faz acontecer" },
                        { id: "equipe_hero_subtitle", type: 'text', content: "Pessoas apaixonadas e dedicadas a construir um futuro mais justo e sustentável através da inovação social." }
                    ]}
                    className="flex flex-col items-center gap-6"
                 />

                 {/* View Toggle */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl shadow-inner mt-4 ring-1 ring-slate-200"
                 >
                    <Button 
                       variant={viewMode === 'grid' ? "default" : "ghost"}
                       onClick={() => setViewMode('grid')}
                       className={cn(
                          "rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 h-10 px-6 transition-all duration-500",
                          viewMode === 'grid' ? "bg-white text-slate-900 shadow-lg ring-1 ring-slate-200" : "text-slate-500 hover:text-primary"
                       )}
                    >
                       <LayoutGrid size={14} /> Galeria Moderna
                    </Button>
                    <Button 
                       variant={viewMode === 'map' ? "default" : "ghost"}
                       onClick={() => setViewMode('map')}
                       className={cn(
                          "rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 h-10 px-6 transition-all duration-500",
                          viewMode === 'map' ? "bg-white text-slate-900 shadow-lg ring-1 ring-slate-200" : "text-slate-500 hover:text-primary"
                       )}
                    >
                       <Map size={14} /> Mapa Técnico
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
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                 >
                    <TeamGrid />
                 </motion.div>
              ) : (
                 <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 1.02, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-[80vh] w-full rounded-[4rem] border border-slate-100 bg-white shadow-3xl overflow-hidden relative ring-1 ring-slate-200"
                 >
                    <div className="absolute top-8 left-8 z-20">
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-xl font-black uppercase text-[10px] tracking-widest px-5 py-2.5 border-slate-100 shadow-xl text-primary ring-1 ring-primary/5">
                           Visualização Estrutural
                        </Badge>
                    </div>
                    <TeamFlowchart />
                 </motion.div>
              )}
           </AnimatePresence>
        </section>

        <section className="mt-32">
           <div className="flex flex-col items-center justify-center text-center space-y-6 mb-12">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Parceiros & Realizadores</span>
               <LogoCarousel />
           </div>
        </section>
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                 © 2026. Rede de Inovação Social | IF Baiano/CNPq
              </p>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2 italic">
                 Tecnologia e Inovação para o Médio Sudoeste Baiano
              </p>
           </div>
           <nav className="flex gap-10">
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors decoration-primary/30 hover:underline underline-offset-8">Termos</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors decoration-primary/30 hover:underline underline-offset-8">Privacidade</a>
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
