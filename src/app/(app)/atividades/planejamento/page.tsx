"use client";

import React from "react";
import { OperationalDashboardLayout } from "@/components/operational-dashboard-layout";
import { 
  Target, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  AlertTriangle,
  Zap,
  Globe,
  Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanningBoard } from "@/components/planning-board";
import ImpactGoals from "@/components/impact-goals";
import { SectorHealthHeatmap } from "@/components/sector-health-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlanejamentoPage() {
  const stats = [
    { label: "Progresso Global", value: "84%", icon: Target, color: "text-primary" },
    { label: "Setores Estáveis", value: "08/10", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Ações Corretivas", value: "03", icon: AlertTriangle, color: "text-amber-500" },
    { label: "Índice de Impacto", value: "9.2", icon: Award, color: "text-blue-500" },
  ];

  return (
    <OperationalDashboardLayout
      title="Núcleo Estratégico (PMA)"
      subtitle="Monitoramento de Desempenho, Avaliação de Impacto e Planejamento Global"
      sector="PLANEJAMENTO / PMA"
      stats={stats}
    >
      <Tabs defaultValue="radar" className="w-full space-y-10">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-slate-100 w-full rounded-none justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="radar" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
          >
            Radar Institucional
          </TabsTrigger>
          <TabsTrigger 
            value="impacto" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
          >
            Objetivos de Impacto
          </TabsTrigger>
          <TabsTrigger 
            value="cronograma" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-slate-800 transition-all font-headline"
          >
            Cronograma Global
          </TabsTrigger>
        </TabsList>

        <TabsContent value="radar" className="mt-0 space-y-12 outline-none">
          {/* Header Estratégico do Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                      PMA – <span className="text-primary italic">Planejamento e Avaliação</span>
                   </h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary fill-primary/20" /> Gestão Orientada por Dados e Resultados
                   </p>
                </div>
                
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <Globe size={160} />
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4">Missão Estratégica</h3>
                   <p className="text-xl font-medium text-slate-600 leading-relaxed italic relative z-10">
                      "Consolidar a inteligência operacional do projeto, transformando metas em impacto social real através do monitoramento contínuo de performance e alinhamento institucional entre todos os núcleos."
                   </p>
                </div>
             </div>

             <Card className="rounded-[3rem] border-none ring-1 ring-slate-100 shadow-xl shadow-slate-100 bg-white overflow-hidden group">
                <CardHeader className="p-8 bg-slate-950 text-white relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 block">Maturidade Institucional</span>
                   <CardTitle className="text-2xl font-headline italic uppercase tracking-tighter">Estado PMA</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black text-slate-300 uppercase italic">Nível de Governança</span>
                         <h5 className="text-lg font-black text-slate-800 uppercase italic">Nível 4 (Otimizado)</h5>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                         <TrendingUp size={20} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400 italic">Meta de Integridade</span>
                         <span className="text-primary">100%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-[95%] rounded-full" />
                      </div>
                   </div>
                   <p className="text-xs leading-relaxed text-slate-500 font-medium italic">
                      Todos os gatilhos automáticos e fluxos de conformidade estão configurados e ativos.
                   </p>
                </CardContent>
             </Card>
          </div>

          {/* Radar Health Heatmap Integration */}
          <SectorHealthHeatmap />

          {/* Quick Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-6">
             {[
               { label: 'Eficiência de Fluxo', value: '94.2%', trend: 'up' },
               { label: 'Adesão ao Cronograma', value: '88.1%', trend: 'stable' },
               { label: 'Consistência de Dados', value: '100%', trend: 'up' },
               { label: 'Sinergia Intersetorial', value: '92%', trend: 'up' },
             ].map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] ring-1 ring-slate-100 flex flex-col items-center justify-center text-center gap-2 hover:shadow-xl transition-all group">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-primary transition-colors">{m.label}</span>
                   <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">{m.value}</span>
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] uppercase tracking-widest">{m.trend === 'up' ? '↑ crescente' : '↔ estável'}</Badge>
                </div>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="impacto" className="mt-0 outline-none">
           <div className="w-full bg-white rounded-[3rem] ring-1 ring-slate-100 shadow-sm overflow-hidden">
             <ImpactGoals />
           </div>
        </TabsContent>

        <TabsContent value="cronograma" className="mt-0 outline-none border-t border-slate-100 pt-10">
           <PlanningBoard />
        </TabsContent>
      </Tabs>
    </OperationalDashboardLayout>
  );
}
