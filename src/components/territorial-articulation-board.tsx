"use client";

import React, { useState, useEffect } from "react";
import { dataService, TerritorialMetrics } from "@/lib/data-service";
import { ProjectTask, territories } from "@/lib/mock-data";
import { TaskWorkflowManager } from "./task-workflow-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Filter,
  BarChart3,
  History,
  FileSearch,
  MessageSquareShare,
  Share2,
  Camera,
  Activity,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TerritorialArticulationBoard({ tasks: initialTasks, onTaskUpdated }: { tasks?: ProjectTask[], onTaskUpdated?: () => void }) {
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks || []);
  const [isLoading, setIsLoading] = useState(!initialTasks);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [metrics, setMetrics] = useState<TerritorialMetrics | null>(null);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'concluidos' | 'pendentes' | 'sem_evidencia'>('todos');

  const fetchTasks = async () => {
    if (initialTasks) {
      setTasks(initialTasks);
      setIsLoading(false);
      return;
    }
    try {
      const data = await dataService.getTasks();
      const artTasks = data.filter(t => t.sectorId === 'social');
      setTasks(artTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching territorial tasks:", error);
    }
  };

  const fetchMetrics = async () => {
    const m = await dataService.getTerritorialMetrics();
    setMetrics(m);
  };

  useEffect(() => {
    fetchTasks();
    fetchMetrics();
    const interval = setInterval(() => {
        fetchTasks();
        fetchMetrics();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'concluidos') return t.status === 'concluida';
    if (activeFilter === 'pendentes') return t.status !== 'concluida';
    if (activeFilter === 'sem_evidencia') return t.status === 'concluida' && (!t.attachments || t.attachments.length === 0);
    return true;
  });

  if (isLoading) return <div className="h-40 flex items-center justify-center">Carregando dados territoriais...</div>;

  return (
    <div className="space-y-12">
      {/* 📊 Territorial Status Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none bg-slate-50/50 p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ações Realizadas</span>
            <span className="text-4xl font-black text-slate-800">{metrics?.totalActions || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={12} className="text-primary" />
                <span className="text-[9px] font-bold text-slate-500">
                    {Object.keys(metrics?.byMunicipality || {}).length} Municípios Cobertos
                </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-emerald-50/50 p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Público Alcançado</span>
            <span className="text-4xl font-black text-emerald-600">{metrics?.participantsReached || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Users size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-500">Engajamento Comunitário</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-blue-50/50 p-6 shadow-sm ring-1 ring-blue-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Conformidade (Evidência)</span>
            <span className="text-4xl font-black text-blue-600">{Math.round(metrics?.evidenceComplianceRate || 0)}%</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Camera size={12} className="text-blue-500" />
                <span className="text-[9px] font-bold text-blue-500">Rastreabilidade Documental</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-amber-50/50 p-6 shadow-sm ring-1 ring-amber-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Encaminhamentos</span>
            <span className="text-4xl font-black text-amber-600">{metrics?.pendingForwardings || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Share2 size={12} className="text-amber-500" />
                <span className="text-[9px] font-bold text-amber-500">Ações Intersetoriais Ativas</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 🚀 Linha do Tempo e Ações */}
      <div className="bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <History className="h-6 w-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Linha do Tempo Territorial</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Rastreabilidade de ações e escutas de campo</p>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 justify-center">
                {(['todos', 'concluidos', 'pendentes', 'sem_evidencia'] as const).map((f) => (
                    <Button 
                        key={f}
                        variant={activeFilter === f ? 'default' : 'ghost'} 
                        size="sm" 
                        className="rounded-full text-[9px] font-black uppercase tracking-widest px-4 h-8"
                        onClick={() => setActiveFilter(f)}
                    >
                        {f.replace('_', ' ')}
                    </Button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            {filteredTasks.map((task) => {
                const isConcluded = task.status === 'concluida';
                const hasEvidence = task.attachments && task.attachments.length > 0;
                const hasForwarding = !!task.dependencyId && task.id.startsWith('ART-'); // Ações originais com dependência

                return (
                    <Card 
                        key={task.id} 
                        className={cn(
                            "group border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white ring-1 ring-slate-100 overflow-hidden cursor-pointer",
                            !hasEvidence && isConcluded && "ring-2 ring-red-100 bg-red-50/5"
                        )}
                        onClick={() => {
                            setSelectedTask(task);
                            setIsWorkflowOpen(true);
                        }}
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                        isConcluded ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                        <MapPin size={24} />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-tighter border-slate-200 text-slate-500">
                                                {task.actionType || 'Ação'}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase italic">{task.municipality} • {task.communityGroup}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase group-hover:text-primary transition-colors">{task.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                                <Users size={12} /> {task.participantCount || 0} Part.
                                            </div>
                                            {isConcluded && !hasEvidence && (
                                                <div className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase animate-pulse">
                                                    <AlertCircle size={12} /> Sem Evidência
                                                </div>
                                            )}
                                            {task.dependencyId && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase">
                                                    <Share2 size={12} /> Encaminhado
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Data Ação</span>
                                        <span className="text-[10px] font-bold text-slate-700">{new Date(task.createdAt).toLocaleDateString()}</span>
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

            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                    <ClipboardList className="h-12 w-12 text-slate-300" />
                    <p className="text-sm font-black uppercase italic tracking-widest">Nenhuma ação encontrada para este filtro.</p>
                </div>
            )}
        </div>
      </div>

      {/* MODAL DE WORKFLOW (Que incluirá o formulário territorial) */}
      {selectedTask && (
        <TaskWorkflowManager 
           task={selectedTask}
           open={isWorkflowOpen}
           onOpenChange={setIsWorkflowOpen}
           onTaskUpdated={() => {
              if (onTaskUpdated) onTaskUpdated();
              fetchTasks();
              setSelectedTask(null);
           }}
        />
      )}
    </div>
  );
}
