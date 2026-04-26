"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ASCOMNewsBoard } from "@/components/ascom-news-board";
import { ASCOMActivitiesBoard } from "@/components/ascom-activities-board";
import { ASCOMSocialBoard } from "@/components/ascom-social-board";
import { ScientificProductionBoard } from "@/components/scientific-production-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Newspaper, 
  CheckSquare, 
  Share2, 
  BookOpen,
  Zap,
  ShieldCheck,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OperationalDashboardLayout } from "@/components/operational-dashboard-layout";

export default function ASCOMDashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(dataService.getUserRole());
  }, []);

  const stats = [
    { label: "Postagens Ativas", value: "12", icon: Newspaper, color: "text-emerald-500" },
    { label: "Curadoria Pendente", value: "03", icon: BookOpen, color: "text-amber-500" },
    { label: "Alcance Redes", value: "24.5k", icon: Share2, color: "text-blue-500" },
    { label: "Membros Ativos", value: "05", icon: Zap, color: "text-purple-500" },
  ];

  return (
    <OperationalDashboardLayout
      title="Hub de Comunicação ASCOM"
      subtitle="Gestão Integrada: Site, Redes Sociais e Curadoria Científica"
      sector="ASCOM"
      stats={stats}
    >

      <Tabs defaultValue="noticias" className="w-full space-y-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
             <TabsTrigger 
                value="noticias" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 pb-4 h-auto text-xs font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
             >
                <Newspaper className="h-4 w-4 mr-2" /> Notícias do Site
             </TabsTrigger>
             <TabsTrigger 
                value="atividades" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 pb-4 h-auto text-xs font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
             >
                <CheckSquare className="h-4 w-4 mr-2" /> Tarefas e Membros
             </TabsTrigger>
             <TabsTrigger 
                value="social" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 pb-4 h-auto text-xs font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
             >
                <Share2 className="h-4 w-4 mr-2" /> Gestão de Redes
             </TabsTrigger>
             <TabsTrigger 
                value="curadoria" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 pb-4 h-auto text-xs font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
             >
                <BookOpen className="h-4 w-4 mr-2" /> Curadoria Científica
             </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="noticias" className="mt-0 outline-none">
           <ASCOMNewsBoard />
        </TabsContent>

        <TabsContent value="atividades" className="mt-0 outline-none">
           <ASCOMActivitiesBoard />
        </TabsContent>

        <TabsContent value="social" className="mt-0 outline-none">
           <ASCOMSocialBoard />
        </TabsContent>

        <TabsContent value="curadoria" className="mt-0 outline-none space-y-8">
           <div className="bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <ShieldCheck size={140} />
              </div>
              <div className="space-y-4 max-w-2xl relative z-10">
                 <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Fluxo de Validação Técnica</Badge>
                 <h3 className="text-3xl font-headline italic uppercase tracking-tighter">Curadoria Científica</h3>
                 <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                    Conteúdos científicos produzidos pela ASCOM que aguardam a validação da <span className="text-white">Coordenação Geral de Projetos (CGP)</span>. Somente após a curadoria técnica estes materiais são liberados para publicação oficial.
                 </p>
              </div>
              <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-3xl bg-white/5 border border-white/5 relative z-10 shrink-0">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Curador Responsável</span>
                 <span className="text-sm font-black uppercase tracking-tighter text-primary italic">Coord. Geral (CGP)</span>
              </div>
           </div>
           
           <ScientificProductionBoard />
        </TabsContent>
      </Tabs>
    </OperationalDashboardLayout>
  );
}
