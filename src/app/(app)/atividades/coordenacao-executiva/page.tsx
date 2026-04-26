"use client";

import React from "react";
import { OperationalDashboardLayout } from "@/components/operational-dashboard-layout";
import { 
  Target, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  Database, 
  Activity, 
  CheckCircle2, 
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Clock,
  Info,
  LayoutGrid,
  Zap,
  CheckCircle,
  BarChart,
  Repeat,
  RefreshCcw,
  Search,
  ArrowRight,
  FolderArchive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectWorkflowVisualizer } from "@/components/project-workflow-visualizer";
import { SituationRoomMonitor } from "@/components/situation-room-monitor";
import { ExecutiveAttributionsFlow } from "@/components/executive-attributions-flow";
import { ExecutiveBriefing, dataService, InstitutionalRisk } from "@/lib/data-service";
import { RiskMonitor } from "@/components/risk-monitor";
import { BottleneckHistoryView } from "@/components/bottleneck-history-view";
import { BottleneckRegistrationModal } from "@/components/bottleneck-registration-modal";

export default function CoordExecutivePage() {
  const [briefing, setBriefing] = React.useState<ExecutiveBriefing | null>(null);
  const [isBottleneckModalOpen, setIsBottleneckModalOpen] = React.useState(false);
  const [bottleneckInitialData, setBottleneckInitialData] = React.useState<any>(null);

  const loadBriefing = () => {
    setBriefing(dataService.getExecutiveBriefing());
  };

  React.useEffect(() => {
    loadBriefing();

    const handleOpenModal = (e: any) => {
        setBottleneckInitialData(e.detail);
        setIsBottleneckModalOpen(true);
    };

    window.addEventListener('openBottleneckModal', handleOpenModal);
    return () => window.removeEventListener('openBottleneckModal', handleOpenModal);
  }, []);

  const stats = [
    { label: "Saúde Global", value: briefing ? `${briefing.globalHealthScore}%` : "...", icon: Activity, color: "text-emerald-500" },
    { label: "Alertas Ativos", value: briefing ? (briefing.totalOverdue + briefing.totalBlocked).toString() : "...", icon: AlertTriangle, color: "text-rose-500" },
    { label: "Metas PMA", value: briefing ? `${briefing.goalCompliance}%` : "...", icon: Target, color: "text-blue-500" },
    { label: "Exceções", value: briefing ? briefing.pendingExceptionsCount.toString() : "...", icon: ShieldCheck, color: "text-amber-500" },
  ];

  const dimensions = [
    { label: "Estratégica", task: "Garantir alinhamento com a Coordenação Geral.", icon: Target, color: "text-blue-500" },
    { label: "Operacional", task: "Acompanhar a execução das atividades dos setores.", icon: Activity, color: "text-amber-500" },
    { label: "Gerencial", task: "Monitorar metas, prazos e indicadores.", icon: BarChart, color: "text-emerald-500" },
    { label: "Institucional", task: "Registrar decisões e assegurar transparência.", icon: ShieldCheck, color: "text-indigo-500" },
    { label: "Intersetorial", task: "Promover diálogo e integração entre os setores.", icon: Users, color: "text-purple-500" },
    { label: "Avaliativa", task: "Identificar riscos e propor ajustes estratégicos.", icon: AlertTriangle, color: "text-rose-500" },
  ];

  return (
    <OperationalDashboardLayout
      title="Sala de Situação"
      subtitle="Coordenação Executiva, Governança Estratégica e Monitoramento em Tempo Real"
      sector="COORD. EXECUTIVA"
      stats={stats}
    >
      <Tabs defaultValue="monitor" className="w-full space-y-12">
        <TabsList className="bg-transparent h-auto p-0 gap-10 border-b border-slate-100 w-full rounded-none justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger 
            value="monitor" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.25em] text-slate-400 data-[state=active]:text-slate-800 transition-all"
          >
            War Room (Real-Time)
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.25em] text-slate-400 data-[state=active]:text-slate-800 transition-all"
          >
            Matriz de Responsabilidades
          </TabsTrigger>
          <TabsTrigger 
            value="eixos" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.25em] text-slate-400 data-[state=active]:text-slate-800 transition-all"
          >
            Eixos de Atuação
          </TabsTrigger>
          <TabsTrigger 
            value="riscos" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.25em] text-slate-400 data-[state=active]:text-slate-800 transition-all"
          >
            Monitor de Riscos
          </TabsTrigger>
          <TabsTrigger 
            value="historico" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-2 pb-5 h-auto text-sm font-black uppercase tracking-[0.25em] text-slate-400 data-[state=active]:text-slate-800 transition-all"
          >
            <FolderArchive className="h-4 w-4 mr-2 inline-block -mt-1" />
            Pasta de Gargalos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="mt-0 space-y-16 outline-none">
           {briefing ? (
             <SituationRoomMonitor briefing={briefing} />
           ) : (
             <div className="flex h-[40vh] items-center justify-center">
               <Zap className="h-10 w-10 animate-pulse text-primary/20" />
             </div>
           )}
        </TabsContent>

        <TabsContent value="dashboard" className="mt-0 space-y-16 outline-none">
          
          {/* Sessão Estratégica Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
               <div className="space-y-4">
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                    Acompanhamento Estratégico – <span className="text-primary italic">Dayane Lopes</span>
                 </h2>
                 <div className="flex flex-wrap gap-3">
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 flex items-center gap-1.5 rounded-full">
                       <CheckCircle size={12} /> Supervisão Ativa
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 flex items-center gap-1.5 rounded-full">
                       <ShieldCheck size={12} /> Governança Estratégica
                    </Badge>
                 </div>
               </div>

               <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <Target size={240} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-2">
                    <Zap size={16} className="fill-primary" /> Objetivo Institucional
                  </h3>
                  <p className="text-2xl font-medium text-slate-600 leading-relaxed italic relative z-10">
                    "Assegurar que todos os setores do projeto cumpram as atividades planejadas, em conformidade com as diretrizes da Coordenação Geral, garantindo alinhamento estratégico, transparência e eficiência institucional."
                  </p>
               </div>
            </div>

            <Card className="rounded-[3.5rem] border-none ring-1 ring-slate-100 shadow-2xl shadow-slate-100 bg-white overflow-hidden group">
               <CardHeader className="p-10 bg-slate-950 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 block">Natureza da Atuação</span>
                  <CardTitle className="text-3xl font-headline italic uppercase tracking-tighter relative z-10">Coordenação Executiva</CardTitle>
               </CardHeader>
               <CardContent className="p-10 space-y-8">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1 border-b border-slate-50 pb-5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Responsável Direto</span>
                      <span className="text-base font-black text-slate-800 uppercase tracking-[0.05em]">Dayane Lopes</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-50 pb-5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Setores Supervisionados</span>
                      <span className="text-sm font-bold text-primary uppercase tracking-widest">Todos os Setores do Projeto</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 font-medium italic">
                    Garantir a conformidade intersetorial através do monitoramento contínuo de riscos, prazos e diretrizes estratégicas.
                  </p>
               </CardContent>
            </Card>
          </div>

          {/* Matriz de Dimensões de Responsabilidade */}
          <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Matriz de Responsabilidades</h3>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-700 ml-2">Dimensões de Atuação</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {dimensions.map((dim, i) => (
                 <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-[2.5rem] group hover:shadow-xl transition-all duration-500 bg-white relative overflow-hidden">
                    <div className={cn("absolute top-0 left-0 w-1.5 h-full opacity-60", "bg-" + dim.color.split("-")[1] + "-500")} />
                    <CardContent className="p-8 flex flex-col gap-6">
                       <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:scale-110 transition-transform", dim.color)}>
                          <dim.icon size={28} />
                       </div>
                       <div className="space-y-2">
                             <h5 className="text-lg font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                               {dim.label}
                             </h5>
                             <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-tight">
                               {dim.task}
                             </p>
                       </div>
                    </CardContent>
                 </Card>
               ))}
            </div>
          </div>

        </TabsContent>

        <TabsContent value="eixos" className="mt-0 outline-none">
           <ExecutiveAttributionsFlow />
        </TabsContent>

        <TabsContent value="riscos" className="mt-0 outline-none">
           {briefing && <RiskMonitor briefing={briefing} />}
        </TabsContent>

        <TabsContent value="historico" className="mt-0 outline-none space-y-12">
            <div className="space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
                    Pasta de Arquivos – <span className="text-rose-600">Gargalos e Anotações</span>
                </h3>
                <p className="text-slate-500 font-medium italic">Histórico de impasses operacionais e decisões estratégicas arquivados mensalmente.</p>
            </div>
            <BottleneckHistoryView />
        </TabsContent>
      </Tabs>

      <BottleneckRegistrationModal 
        open={isBottleneckModalOpen} 
        onOpenChange={setIsBottleneckModalOpen}
        onSuccess={() => {
            loadBriefing();
            setBottleneckInitialData(null);
        }}
        initialData={bottleneckInitialData}
      />
    </OperationalDashboardLayout>
  );
}
