"use client";

import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Filter, 
  ArrowRight,
  Info,
  Lock,
  Zap,
  Globe,
  FileCheck,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  ShieldAlert
} from "lucide-react";
import { dataService } from "@/lib/data-service";
import { StrategicPlanMonth, Department } from "@/lib/mock-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { MonthDetailSheet } from "@/components/month-detail-sheet";
import { ProjectReportModal } from "@/components/project-report-modal";

const SECTORS: { id: Department; label: string }[] = [
  { id: 'ALL', label: 'VISÃO GLOBAL' },
  { id: 'CGP', label: 'COORD. GERAL' },
  { id: 'ASCOM', label: 'ASCOM' },
  { id: 'ACESSIBILIDADE', label: 'ACESSIBILIDADE' },
  { id: 'SOCIAL', label: 'SOCIAL / CAMPO' },
  { id: 'REDES', label: 'PARCERIAS' },
  { id: 'CURADORIA', label: 'CIENTÍFICO' },
  { id: 'TECH', label: 'TECNOLOGIA' },
];

export default function PlanejamentoPage() {
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get('sector') as Department;

  const [activeSector, setActiveSector] = useState<Department>('ALL');
  const [plans, setPlans] = useState<StrategicPlanMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<StrategicPlanMonth | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const user = dataService.getCurrentUser();

  const isCoordinator = dataService.isCoordinator() || dataService.isBypass();
  
  // A permissão agora é calculada dinamicamente com base no mês selecionado
  const getIsMonthEditable = (month: StrategicPlanMonth | null) => {
    if (isCoordinator) return true;
    if (!user || !month) return false;
    return user.department === month.sector;
  };

  useEffect(() => {
    if (sectorParam && SECTORS.some(s => s.id === sectorParam)) {
      setActiveSector(sectorParam);
    }
  }, [sectorParam]);

  useEffect(() => {
    const fetchPlanning = async () => {
      setLoading(true);
      const data = await dataService.getPlanningBySector(activeSector);
      setPlans(data);
      setLoading(false);
    };
    fetchPlanning();
  }, [activeSector]);

  const handleToggle = async (monthId: string, taskId: string) => {
    const targetMonth = plans.find(m => m.id === monthId) || null;
    if (!getIsMonthEditable(targetMonth)) return;
    try {
      await dataService.togglePlanningTask(monthId, taskId);
      setPlans(prev => prev.map(m => {
        if (m.id === monthId) {
          const updatedTasks = m.tasks.map(t => {
            if (t.id === taskId) {
              const newCompleted = !t.completed;
              // Sincronizar subtarefas se a tarefa pai for marcada como concluída
              const updatedSubtasks = t.subtasks?.map(s => newCompleted ? { ...s, completed: true } : s);
              return { ...t, completed: newCompleted, subtasks: updatedSubtasks };
            }
            return t;
          });
          const updatedMonth = { ...m, tasks: updatedTasks };
          if (selectedMonth?.id === monthId) setSelectedMonth(updatedMonth);
          return updatedMonth;
        }
        return m;
      }));
    } catch (error) {
       console.error(error);
    }
  };

  const handleToggleSubtask = async (monthId: string, taskId: string, subtaskId: string) => {
    const targetMonth = plans.find(m => m.id === monthId) || null;
    if (!getIsMonthEditable(targetMonth)) return;
    try {
      await dataService.togglePlanningSubtask(monthId, taskId, subtaskId);
      setPlans(prev => prev.map(m => {
        if (m.id === monthId) {
          const updatedTasks = m.tasks.map(t => {
            if (t.id === taskId && t.subtasks) {
               const updatedSubtasks = t.subtasks.map(s => 
                 s.id === subtaskId ? { ...s, completed: !s.completed } : s
               );
               const allDone = updatedSubtasks.every(s => s.completed);
               return { ...t, subtasks: updatedSubtasks, completed: allDone };
            }
            return t;
          });
          const updatedMonth = { ...m, tasks: updatedTasks };
          if (selectedMonth?.id === monthId) setSelectedMonth(updatedMonth);
          return updatedMonth;
        }
        return m;
      }));
    } catch (error) {
       console.error(error);
    }
  };

  const totalTasks = plans.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasksCount = plans.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
  const globalProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const getHealthStatus = (progress: number) => {
    if (progress >= 80) return { label: 'ESTÁVEL', color: 'bg-emerald-500', text: 'text-emerald-500', icon: CheckCircle2 };
    if (progress >= 50) return { label: 'ATENÇÃO', color: 'bg-amber-500', text: 'text-amber-500', icon: Zap };
    return { label: 'CRÍTICO', color: 'bg-red-500', text: 'text-red-500', icon: ShieldAlert };
  };

  const health = getHealthStatus(globalProgress);
  const HealthIcon = health.icon;

  return (
    <div className="min-h-screen space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="relative overflow-hidden p-16 rounded-[4rem] bg-slate-950 text-white shadow-2xl border border-white/5 mx-2">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -mr-32 -mt-32 shrink-0 animate-pulse" />
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 max-w-7xl mx-auto">
            <div className="space-y-8 max-w-2xl text-center lg:text-left">
               <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] italic">
                  <Sparkles size={14} className="text-primary animate-bounce" /> Estratégia e Gestão de Metas
               </div>
               <div className="space-y-4">
                  <h1 className="text-7xl font-headline uppercase italic tracking-tighter leading-none">
                    {activeSector === 'ALL' ? 'Rotas do ' : `Ação Mensal `} <span className="text-primary">{activeSector === 'ALL' ? 'Projeto' : activeSector}</span>
                  </h1>
                  <p className="text-sm font-medium text-white/40 italic shrink-0 max-w-lg leading-relaxed">
                    Acompanhamento de entregas por setor. Clique em cada mês para registrar o relatório de atividades e gerenciar o progresso operacional.
                  </p>
               </div>
               <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button 
                    onClick={() => setReportOpen(true)}
                    className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-slate-950 font-black uppercase tracking-widest px-10 shadow-xl shadow-primary/20 transform hover:scale-105 transition-all"
                  >
                    <FileCheck size={20} className="mr-3" /> Gerar Relatório Anual
                  </Button>
                  <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest px-10 backdrop-blur-xl">
                    <Globe size={18} className="mr-3" /> Metas Globais
                  </Button>
               </div>
            </div>

            {/* Global Stats Dashboard */}
            <div className="w-full lg:w-96 p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl space-y-8 relative group hover:border-primary/30 transition-all duration-500">
               <div className="absolute top-4 right-8 flex gap-2">
                  <Badge className={cn("text-white text-[8px] font-black uppercase tracking-widest px-3 border-none", health.color)}>
                     PMA: {health.label}
                  </Badge>
                  <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 border-none">Online</Badge>
               </div>
               <div className="flex justify-between items-end pt-2">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Progresso de Execução</p>
                     <p className="text-6xl font-headline uppercase italic tracking-tighter text-white leading-none">{globalProgress}%</p>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 transition-transform group-hover:rotate-12">
                     <TrendingUp size={36} strokeWidth={2.5} />
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                     <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-1000" style={{ width: `${globalProgress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                     <span>Início 2026</span>
                     <span>Conclusão 2027</span>
                  </div>
               </div>
               <p className="text-[11px] font-medium text-white/40 italic text-center">
                  Total de {completedTasksCount} marcos alcançados de {totalTasks} planejados
               </p>
            </div>
         </div>
      </section>

      {/* Sector Navigation & Grid View */}
      <div className="px-6 space-y-10">
        <Tabs value={activeSector} onValueChange={(val: any) => setActiveSector(val)} className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="space-y-1 text-center md:text-left">
               <h3 className="text-2xl font-headline uppercase italic tracking-tighter text-slate-800 flex items-center gap-4 justify-center md:justify-start">
                  {activeSector === 'ALL' ? 'Selecione o Setor' : `Cronograma: ${activeSector}`} <ArrowRight className="text-primary hidden md:block" size={24} />
               </h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                 {activeSector === 'ALL' ? 'Clique no mês para gerenciar o relatório' : 'Acompanhamento exclusivo das metas setoriais'}
               </p>
            </div>
            
            {(!sectorParam || sectorParam === 'ALL') && (
              <TabsList className="bg-slate-100/80 p-2 rounded-[2.5rem] h-16 border-none shadow-inner backdrop-blur-sm self-stretch md:self-auto">
                 {SECTORS.map(s => (
                    <TabsTrigger 
                      key={s.id} 
                      value={s.id}
                      className="rounded-[1.8rem] px-8 h-12 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
                    >
                      {s.label}
                    </TabsTrigger>
                 ))}
              </TabsList>
            )}
          </div>

          <TabsContent value={activeSector} className="mt-0 focus-visible:outline-none">
            {loading ? (
               <div className="h-96 flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Carregando Rota...</span>
               </div>
            ) : plans.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {plans.map(month => {
                     const completed = month.tasks.filter(t => t.completed).length;
                     const progress = Math.round((completed / month.tasks.length) * 100);
                     const isDone = progress === 100;
                     const isEditable = getIsMonthEditable(month);

                     return (
                        <div 
                          key={month.id}
                          onClick={() => setSelectedMonth(month)}
                          className={cn(
                            "group relative h-80 rounded-[3.5rem] bg-white border border-slate-100 p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] hover:border-primary/20",
                            isDone && "ring-2 ring-emerald-100 bg-emerald-50/30"
                          )}
                        >
                           <header className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <div className={cn(
                                   "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                   isDone ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white"
                                 )}>
                                    <Calendar size={20} />
                                 </div>
                                 <div className="flex items-center gap-2">
                                    {!isEditable && (
                                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400" title="Somente Leitura">
                                         <Lock size={12} />
                                      </div>
                                    )}
                                    {activeSector === 'ALL' && (
                                      <Badge className="bg-slate-900 text-white text-[7px] font-black px-2 py-1 h-auto uppercase tracking-widest border-none">
                                         {month.sector}
                                      </Badge>
                                    )}
                                    <div className={cn("h-7 w-7 rounded-full flex items-center justify-center border", 
                                          progress >= 80 ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                                          progress >= 50 ? "bg-amber-50 border-amber-100 text-amber-500" :
                                          "bg-red-50 border-red-100 text-red-500"
                                     )} title={`Saúde do Mês: ${getHealthStatus(progress).label}`}>
                                        {progress >= 80 ? <CheckCircle2 size={12} /> : progress >= 50 ? <Zap size={12} /> : <ShieldAlert size={12} />}
                                     </div>
                                    <Badge variant="outline" className={cn(
                                      "rounded-full px-4 py-1.5 h-auto text-[8px] font-black uppercase tracking-widest",
                                      isDone ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-white border-slate-100 text-slate-400"
                                    )}>
                                       {isDone ? "EXECUTADO" : "EM ANDAMENTO"}
                                    </Badge>
                                 </div>
                              </div>
                              <h4 className="text-xl font-headline uppercase italic tracking-tighter text-slate-800 leading-tight">
                                 {month.monthName.split("–")[0].trim()}
                              </h4>
                           </header>
                           
                           <div className="flex-1 py-4 overflow-hidden">
                               <div className="space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  {month.tasks.slice(0, 3).map((task, idx) => (
                                     <div key={idx} className="flex items-start gap-2">
                                        <div className={cn(
                                          "h-1 w-1 rounded-full mt-1.5 shrink-0",
                                          task.completed ? "bg-emerald-500" : "bg-slate-300"
                                        )} />
                                        <span className="text-[9px] font-medium text-slate-500 leading-tight line-clamp-1 italic uppercase tracking-tighter">
                                          {task.label}
                                        </span>
                                     </div>
                                  ))}
                                  {month.tasks.length > 3 && (
                                     <p className="text-[8px] font-black text-primary uppercase ml-3">+ {month.tasks.length - 3} metas</p>
                                  )}
                               </div>
                            </div>

                            <footer className="space-y-6">
                               <div className="space-y-2 pt-2 border-t border-slate-50">
                                  <div className="flex justify-between items-end px-1">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{completed} metas</span>
                                     <span className="text-[10px] font-black text-slate-800 italic">{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-1.5 rounded-full bg-slate-100" />
                               </div>
                               <div className="flex items-center justify-between gap-3 text-slate-900 font-black text-[9px] uppercase tracking-widest px-2 group-hover:text-primary transition-colors">
                                  <span>{isEditable ? "Gerenciar Rota" : "Ver Detalhes"}</span>
                                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </footer>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <div className="h-[450px] flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[5rem] gap-8 animate-in fade-in zoom-in duration-500 bg-slate-50/30">
                  <div className="h-28 w-28 rounded-[3rem] bg-white shadow-xl flex items-center justify-center text-slate-200 border border-slate-50">
                     <LayoutGrid size={48} />
                  </div>
                  <div className="text-center space-y-3">
                     <h3 className="text-3xl font-headline uppercase italic tracking-tighter text-slate-400">Rota Protegida</h3>
                     <p className="text-xs font-medium text-slate-400 italic max-w-sm mx-auto leading-relaxed">
                        O planejamento estratégico para o setor {activeSector} está em fase de estruturação pela coordenação.
                     </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-10 py-3 border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] bg-white shadow-sm">
                     EM DESENVOLVIMENTO
                  </Badge>
               </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Info Legend */}
      <div className="mx-6 p-12 rounded-[5rem] bg-white border border-slate-100 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="h-16 w-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
             <Info size={32} />
          </div>
          <div className="space-y-2 flex-1">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 italic">Central de Inteligência Estratégica</h4>
             <p className="text-[12px] font-medium text-slate-500 italic leading-relaxed max-w-4xl">
                O sistema de Rotas foi redesenhado para garantir total responsividade e foco em resultados. Clique em qualquer mês para registrar novas conclusões. As atividades finalizadas são movidas automaticamente para o histórico do mês, permitindo a geração de relatórios de produtividade em tempo real para a coordenação geral.
             </p>
          </div>
          <Button variant="ghost" className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
             Suporte Integrado
          </Button>
      </div>

      {/* Detail Drawer */}
      <MonthDetailSheet 
        month={selectedMonth}
        isOpen={!!selectedMonth}
        isEditable={getIsMonthEditable(selectedMonth)}
        onClose={() => setSelectedMonth(null)}
        onToggleTask={handleToggle}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Report Modal */}
      <ProjectReportModal 
        plans={plans}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
