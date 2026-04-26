"use client";

import React, { useState, useEffect } from "react";
import { dataService, ScientificMetrics } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { TaskWorkflowManager } from "./task-workflow-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  History,
  FileSearch,
  Layers,
  Sparkle,
  Plus,
  FilePlus,
  Microscope,
  BookMarked,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCreationModal } from "./task-creation-modal";

export function ScientificProductionBoard() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [metrics, setMetrics] = useState<ScientificMetrics | null>(null);
  const [view, setView] = useState<'pipeline' | 'produtos'>('pipeline');
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const data = await dataService.getTasks();
      // Filtrar por setor de Curadoria (Ciência)
      const sciTasks = data.filter(t => t.sectorId === 'curadoria' || t.sector === 'CURADORIA');
      setTasks(sciTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      const m = await dataService.getScientificMetrics();
      setMetrics(m);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching scientific data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="h-40 flex items-center justify-center">Carregando processador científico...</div>;

  return (
    <div className="space-y-12">
      {/* 🔬 Scientific Intelligence Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none bg-emerald-50/50 p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Insumos Territoriais</span>
            <span className="text-4xl font-black text-emerald-600">{metrics?.totalInsumosRecebidos || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Database size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-500">Dados Brutos Recebidos</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-blue-50/50 p-6 shadow-sm ring-1 ring-blue-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Itens em Análise</span>
            <span className="text-4xl font-black text-blue-600">{metrics?.emAnalise || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Microscope size={12} className="text-blue-500" />
                <span className="text-[9px] font-bold text-blue-500">Processamento em Curso</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-indigo-50/50 p-6 shadow-sm ring-1 ring-indigo-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Produtos Técnicos</span>
            <span className="text-4xl font-black text-indigo-600">{metrics?.produtosDesenvolvidos || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <BookOpen size={12} className="text-indigo-500" />
                <span className="text-[9px] font-bold text-indigo-500">Artigos e Relatórios</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-violet-50/50 p-6 shadow-sm ring-1 ring-violet-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">Validação Científica</span>
            <span className="text-4xl font-black text-violet-600">{metrics?.taxaValidacao || 0}%</span>
            <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 size={12} className="text-violet-500" />
                <span className="text-[9px] font-bold text-violet-500">Conformidade e Rigor</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 🚀 Pipeline de Produção */}
      <div className="bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                    <Layers className="h-6 w-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Pipeline de Curadoria</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Fluxo de transformação: Dados Territorial → Conhecimento Científico</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button 
                    onClick={() => setIsSubmissionModalOpen(true)}
                    className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] gap-2 shadow-lg"
                >
                    <Plus size={14} /> Submeter para Curadoria
                </Button>
                
                <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
                    <Button 
                        variant={view === 'pipeline' ? 'default' : 'ghost'} 
                        size="sm" 
                        className={cn("rounded-xl text-[9px] font-black uppercase tracking-widest px-4 h-8", view === 'pipeline' ? "bg-white text-slate-800 shadow-sm hover:bg-white" : "text-slate-500")}
                        onClick={() => setView('pipeline')}
                    >
                        Fluxo de Produção
                    </Button>
                    <Button 
                        variant={view === 'produtos' ? 'default' : 'ghost'} 
                        size="sm" 
                        className={cn("rounded-xl text-[9px] font-black uppercase tracking-widest px-4 h-8", view === 'produtos' ? "bg-white text-slate-800 shadow-sm hover:bg-white" : "text-slate-500")}
                        onClick={() => setView('produtos')}
                    >
                        Produtos Finais
                    </Button>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {tasks.map((task) => {
                const isConcluded = task.status === 'concluida';
                const isTrigger = task.dependencyId?.startsWith('trig-');

                return (
                    <Card 
                        key={task.id} 
                        className={cn(
                            "group border-none shadow-sm hover:shadow-md transition-all rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden cursor-pointer"
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
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                        isConcluded ? "bg-emerald-100 text-emerald-600" : 
                                        isTrigger ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-blue-100 text-blue-600"
                                    )}>
                                        {isConcluded ? <BookMarked size={24} /> : isTrigger ? <Sparkle size={24} /> : <FileSearch size={24} />}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn(
                                                "rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-tighter border-none",
                                                isTrigger ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {isTrigger ? 'Insumo Territorial' : 'Produção Técnica'}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">{task.identifier || task.publicId}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase group-hover:text-emerald-600 transition-colors">{task.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                                <TrendingUp size={12} /> {isConcluded ? 'Sistematizado' : 'Aguardando Análise'}
                                            </div>
                                            {task.findingsSummary && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase">
                                                    <FileSpreadsheet size={12} /> Dados Vinculados
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Responsável</span>
                                        <span className="text-[10px] font-bold text-slate-700">{task.assignedToName}</span>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
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
                    <BookOpen className="h-12 w-12 text-slate-300" />
                    <p className="text-sm font-black uppercase italic tracking-widest">Nenhuma tarefa científica em curso.</p>
                </div>
            )}
        </div>
      </div>

      {selectedTask && (
        <TaskWorkflowManager 
           task={selectedTask}
           open={isWorkflowOpen}
           onOpenChange={setIsWorkflowOpen}
           onTaskUpdated={() => {
              fetchData();
              setSelectedTask(null);
           }}
        />
      )}

      <TaskCreationModal 
        open={isSubmissionModalOpen}
        onOpenChange={setIsSubmissionModalOpen}
        onTaskCreated={() => {
           fetchData();
           setIsSubmissionModalOpen(false);
        }}
        mode="action"
        initialSector="COORD_GERAL"
        initialType="tt-curadoria"
      />
    </div>
  );
}
