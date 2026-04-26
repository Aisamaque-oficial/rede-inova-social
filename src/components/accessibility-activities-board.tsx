"use client";

import React, { useState, useEffect } from "react";
import { dataService, AccessibilityMetrics } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { TaskWorkflowManager } from "./task-workflow-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  Zap,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Filter,
  Activity,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityActivitiesBoard() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await dataService.getTasks();
      // Filtrar apenas tarefas da Acessibilidade que não estão concluídas (Fila Ativa)
      const queueTasks = data.filter(t => t.sectorId === 'acessibilidade' && t.status !== 'concluida');
      setTasks(queueTasks.sort((a, b) => {
        // Ordenar por prioridade (Garantindo que Urgente venha primeiro)
        const prioMap: any = { urgente: 0, alta: 1, media: 2, baixa: 3 };
        return prioMap[a.priority] - prioMap[b.priority];
      }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching accessibility tasks:", error);
    }
  };

  const fetchMetrics = async () => {
    const m = await dataService.getAccessibilityMetrics();
    setMetrics(m);
  };

  useEffect(() => {
    fetchTasks();
    fetchMetrics();
    
    // Refresh automático para simular tempo real
    const interval = setInterval(() => {
        fetchTasks();
        fetchMetrics();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getSLADetails = (task: ProjectTask) => {
    const now = new Date();
    const started = new Date(task.waitingTimeStartedAt || task.createdAt);
    const diffHrs = (now.getTime() - started.getTime()) / (1000 * 60 * 60);
    
    let limit = 2; // Simples
    if (task.slaCategory === 'tecnico') limit = 24;
    if (task.slaCategory === 'critico') limit = 48;

    const isOverdue = diffHrs > limit;
    const remaining = Math.max(0, limit - diffHrs);

    return {
      isOverdue,
      remaining: remaining.toFixed(1),
      limit,
      color: isOverdue ? "text-red-500" : remaining < 2 ? "text-amber-500" : "text-emerald-500"
    };
  };

  const handleRunStressTest = async () => {
    await dataService.runAccessibilityStressTest();
    fetchTasks();
    fetchMetrics();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Sincronizando fila de acessibilidade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 📊 Dashboard de Operações (Accessibility Hub) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none bg-slate-50/50 p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total na Fila</span>
            <span className="text-4xl font-black text-slate-800">{metrics?.totalQueue || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Activity size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500">Operação Normal</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-red-50/50 p-6 shadow-sm ring-1 ring-red-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">SLA Estourado</span>
            <span className="text-4xl font-black text-red-600">{metrics?.overdueSLA || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <ShieldAlert size={12} className="text-red-500" />
                <span className="text-[9px] font-bold text-red-500">Requer Ação Imediata</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-amber-50/50 p-6 shadow-sm ring-1 ring-amber-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Bloqueando Setores</span>
            <span className="text-4xl font-black text-amber-600">{metrics?.blockingTasksCount || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Zap size={12} className="text-amber-500" />
                <span className="text-[9px] font-bold text-amber-500">Impacto na Publicidade</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-blue-50/50 p-6 shadow-sm ring-1 ring-blue-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Resposta Média</span>
            <span className="text-4xl font-black text-blue-600">{metrics?.avgResponseTime || '...'}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Timer size={12} className="text-blue-500" />
                <span className="text-[9px] font-bold text-blue-500">Atendimento Setorial</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 🚀 Fila de Trabalho Ativa */}
      <div className="bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Layers className="h-6 w-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Fila de Acessibilidade Comunicacional</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gestão de prioridades e impacto intersetorial</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full text-[9px] font-black uppercase tracking-widest gap-2" onClick={handleRunStressTest}>
                    <Zap size={14} className="text-amber-500 animate-pulse" /> Teste de Estresse
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[9px] font-black uppercase tracking-widest gap-2">
                    <Filter size={14} /> Filtros
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => {
                const sla = getSLADetails(task);
                const isUrgent = task.priority === 'urgente';

                return (
                    <Card 
                        key={task.id} 
                        className={cn(
                            "group border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white ring-1 ring-slate-100 overflow-hidden cursor-pointer",
                            isUrgent && "ring-2 ring-red-100 bg-red-50/5"
                        )}
                        onClick={() => {
                            setSelectedTask(task);
                            setIsWorkflowOpen(true);
                        }}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={cn(
                                        "w-1 h-12 rounded-full",
                                        isUrgent ? "bg-red-500 animate-pulse" : task.priority === 'alta' ? "bg-amber-500" : "bg-slate-200"
                                    )} />
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn(
                                                "rounded-full px-2 py-0.5 text-[7px] font-black uppercase tracking-tighter",
                                                isUrgent ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {task.priority}
                                            </Badge>
                                            <span className="text-[9px] font-black text-slate-300">#{task.publicId || task.id}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase group-hover:text-primary transition-colors">{task.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase italic">Origem: {task.originSectorId || 'Interno'}</span>
                                            {task.impactsPublication && (
                                                <Badge variant="outline" className="text-[7px] font-black border-amber-200 text-amber-600 uppercase bg-amber-50">
                                                    Bloqueia Publicação
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 text-right">
                                    <div>
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Categoria SLA</span>
                                        <span className="text-[10px] font-bold text-slate-700 uppercase">{task.slaCategory}</span>
                                    </div>
                                    
                                    <div className="w-24">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Status SLA</span>
                                        <span className={cn("text-[10px] font-black uppercase", sla.color)}>
                                            {sla.isOverdue ? `ATRASADA (${sla.remaining}h)` : `NO PRAZO (${sla.remaining}h)`}
                                        </span>
                                    </div>

                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    <p className="text-sm font-black uppercase italic tracking-widest">Fila Zerada! Todas as acessibilizações concluídas.</p>
                </div>
            )}
        </div>
      </div>

      {/* 🛠️ Modal de Fluxo Avançado */}
      {selectedTask && (
        <TaskWorkflowManager 
           task={selectedTask}
           open={isWorkflowOpen}
           onOpenChange={setIsWorkflowOpen}
           onTaskUpdated={() => {
              fetchTasks();
              setSelectedTask(null);
           }}
        />
      )}
    </div>
  );
}
