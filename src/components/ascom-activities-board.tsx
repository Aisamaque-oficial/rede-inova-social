"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask, Department } from "@/lib/mock-data";
import { TaskWorkflowManager } from "./task-workflow-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Calendar,
  User,
  AlertCircle,
  MoreHorizontal,
  Loader2,
  Instagram,
  Youtube,
  Globe,
  Check,
  XCircle,
  MessageSquare,
  FileText,
  ArrowRight,
  ShieldCheck,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { AscomWorkflowBanner } from "./ascom-workflow-banner";

interface SectorActivitiesBoardProps {
  sector?: Department;
  forcedSectorId?: string;
  isGlobal?: boolean;
}

export function ASCOMActivitiesBoard({ sector, forcedSectorId, isGlobal = false }: SectorActivitiesBoardProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [strategicMetas, setStrategicMetas] = useState<any[]>([]);
  
  const currentUser = dataService.getCurrentUser();

  const fetchStrategicMetas = async () => {
    // Buscar metas de Abril/2026 para a ASCOM
    const planning = await (dataService as any).getStrategicPlanning();
    const april = planning.find((m: any) => m.id === 'meta-2026-04');
    if (april) {
      setStrategicMetas(april.tasks.filter((t: any) => t.sectorId === 'ascom'));
    }
  };

  const fetchMetrics = async () => {
    if (forcedSectorId === 'ascom') {
      const m = await dataService.getAscomMetrics();
      setMetrics(m);
    }
  };

  useEffect(() => {
    fetchStrategicMetas();
    fetchMetrics();

    // 🔄 LISTENER EM TEMPO REAL — recebe tarefas de outros setores automaticamente
    const unsubscribe = dataService.subscribeToTasks((allTasks) => {
      let filteredData = allTasks;
      
      // Filtro por ID Forçado (para navegação dinâmica)
      if (forcedSectorId) {
        filteredData = allTasks.filter(t => t.sectorId === forcedSectorId);
      } else if (sector && !isGlobal) {
        filteredData = allTasks.filter(t => t.sector === sector);
      }
      if (!isGlobal && sector) {
        filteredData = allTasks.filter(t => t.sector === sector);
      }
      
      setTasks(filteredData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [sector, isGlobal, forcedSectorId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente': return { label: 'Pendente', color: 'bg-slate-100 text-slate-600', icon: Clock };
      case 'recebido_ascom': return { label: 'Rec. ASCOM', color: 'bg-blue-100 text-blue-600', icon: Clock };
      case 'em_progresso': return { label: 'Em Produção', color: 'bg-indigo-100 text-indigo-600', icon: AlertCircle };
      case 'enviado_acessibilidade': return { label: 'Env. Acessibilidade', color: 'bg-pink-100 text-pink-600', icon: MessageSquare };
      case 'recebido_acessibilidade': return { label: 'Rec. Acessibilidade', color: 'bg-orange-100 text-orange-600', icon: FileText };
      case 'aguardando_validacao': return { label: 'Validar p/ Coord.', color: 'bg-cyan-100 text-cyan-600', icon: ShieldCheck };
      case 'concluida': return { label: 'Concluída', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 };
      default: return { label: status, color: 'bg-slate-100 text-slate-600', icon: Clock };
    }
  };

  const handleCardClick = (task: ProjectTask) => {
    setSelectedTask(task);
    setIsWorkflowOpen(true);
  };

  const handleActivateGoal = async (goalId: string) => {
    try {
      await dataService.activateStrategicGoal('meta-2026-04', goalId);
      fetchTasks();
      fetchStrategicMetas();
      fetchMetrics();
    } catch (error: any) {
      console.error("Erro ao ativar meta:", error);
    }
  };

  const columns = [
    { id: 'pendente', label: 'Monitoramento & Execução', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50/10' },
    { id: 'concluida', label: 'Validação & Conclusão', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/10' }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Sincronizando atividades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 🚀 Banner do Fluxo Institucional (Dayane Lopes -> ASCOM -> Acessibilidade -> etc) */}
      <AscomWorkflowBanner />

      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-800">
            {isGlobal ? "Acompanhamento " : "Quadro de Atividades "}
            <span className="text-primary italic">
              {isGlobal ? "Global" : sector ? dataService.getSectorSigla(sector) : "Setorial"}
            </span>
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {isGlobal 
              ? "Monitoramento de produtividade de todos os setores" 
              : `Gerenciamento de demandas exclusivas do setor ${sector ? dataService.getSectorName(sector) : ""}`}
          </p>
        </div>

        {/* 📊 Métricas de Governança (Somente ASCOM) */}
        {!isGlobal && forcedSectorId === 'ascom' && (
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Atrasos', val: metrics?.overdue || 0, color: 'text-red-500' },
              { label: 'Bloqueios', val: metrics?.blocked || 0, color: 'text-amber-500' },
              { label: 'Pendente Acessib.', val: metrics?.waitingAccessibility || 0, color: 'text-pink-500' },
              { label: 'SLA Médio', val: metrics?.avgDeliveryTime || '...', color: 'text-blue-500' }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-end">
                <span className={cn("text-xl font-black leading-none", m.color)}>{m.val}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎯 Seção de Ativação de Metas (Somente ASCOM/Coordenação) */}
      {!isGlobal && forcedSectorId === 'ascom' && (
        <div className="bg-slate-50/50 rounded-[2.5rem] p-8 ring-1 ring-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Metas Estratégicas do Mês</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Converta metas de planejamento em workflows operacionais</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategicMetas.map((meta: any) => (
              <Card key={meta.id} className="border-none shadow-sm bg-white rounded-2xl p-4 flex flex-col justify-between hover:ring-2 hover:ring-primary/20 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter">
                      Meta Abril/2026
                    </Badge>
                    {meta.status === 'previsto' && <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />}
                  </div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-700 leading-tight mb-2Line">{meta.label}</h4>
                </div>
                <Button 
                  size="sm" 
                  className="mt-4 w-full h-8 text-[9px] font-black uppercase tracking-widest gap-2 disabled:bg-emerald-50 disabled:text-emerald-500"
                  variant={meta.status === 'em_andamento' ? 'ghost' : 'default'}
                  disabled={meta.status === 'em_andamento'}
                  onClick={() => handleActivateGoal(meta.id)}
                >
                  {meta.status === 'em_andamento' ? (
                    <><Check size={12} /> Já Ativado</>
                  ) : (
                    <><ArrowRight size={12} /> Ativar Workflow</>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {columns.map((column) => {
          const columnTasks = tasks.filter(t => {
            if (column.id === 'pendente') {
              return [
                'pendente', 
                'recebido_ascom', 
                'em_progresso', 
                'enviado_acessibilidade', 
                'recebido_acessibilidade'
              ].includes(t.status);
            }
            return ['aguardando_validacao', 'concluida', 'em_revisao', 'assinado'].includes(t.status);
          });
          
          return (
            <div key={column.id} className={cn(
              "flex flex-col min-h-[400px] rounded-[2.5rem] p-6 ring-1 ring-slate-100",
              column.bg
            )}>
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-xl bg-white shadow-sm", column.color)}>
                     <column.icon className="h-5 w-5" />
                   </div>
                   <div>
                     <span className="font-black text-[12px] uppercase tracking-wider text-slate-700 block leading-none">
                        {column.label}
                     </span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{columnTasks.length} Atividades</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                {columnTasks.map((task) => {
                  const statusCfg = getStatusConfig(task.status);
                  return (
                    <Card 
                      key={task.id} 
                      className="group relative border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => handleCardClick(task)}
                    >
                      <CardContent className="p-8">
                        <div className="flex flex-col h-full space-y-6">
                          <div className="flex justify-between items-start">
                            <Badge variant="secondary" className={cn("rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest gap-1.5", statusCfg.color)}>
                              <statusCfg.icon size={10} /> {statusCfg.label}
                            </Badge>
                             <div className="flex items-center gap-3">
                               {task.dependencyId && task.status !== 'concluida' && (
                                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-pink-50 text-pink-500 animate-pulse">
                                     <Timer size={10} />
                                     <span className="text-[7px] font-black uppercase tracking-tighter">Fila: 4.2h</span>
                                  </div>
                               )}
                               <div className="flex -space-x-2">
                                 {(task as any).isStories || (task as any).isReels || (task as any).isFeed ? (
                                    <div className="flex gap-1 pr-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                       {(task as any).isStories && <Instagram size={12} className="text-pink-500" />}
                                       {(task as any).isReels && <Instagram size={12} className="text-indigo-500" />}
                                       {(task as any).isFeed && <Instagram size={12} className="text-blue-500" />}
                                    </div>
                                 ) : null}
                                 <span className="text-[9px] font-black text-slate-300">#{task.id}</span>
                               </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-headline italic uppercase tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{task.assignedToName}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Calendar size={12} />
                              <span className="text-[9px] font-bold uppercase tracking-widest">{task.deadline}</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                               <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {columnTasks.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-16 opacity-30">
                      <column.icon className="h-10 w-10 mb-2" />
                      <span className="text-[10px] font-bold uppercase italic">Sem atividades nesta etapa</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🛠️ Novo Modal de Fluxo Avançado */}
      {selectedTask && (
        <TaskWorkflowManager 
           task={selectedTask}
           open={isWorkflowOpen}
           onOpenChange={setIsWorkflowOpen}
           onTaskUpdated={() => {
              // Tarefas se atualizam automaticamente via subscribeToTasks()
              fetchMetrics();
              setSelectedTask(null);
           }}
        />
      )}
    </div>
  );
}
