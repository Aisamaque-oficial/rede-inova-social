"use client";

import React, { useState, useEffect } from "react";
import { dataService, PartnershipMetrics } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { TaskWorkflowManager } from "./task-workflow-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  Handshake, 
  FileSignature, 
  Search, 
  ShieldCheck, 
  Zap, 
  BarChart,
  ArrowRight, 
  History,
  Target,
  Users2,
  MapPin,
  Link2,
  ClipboardCheck,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PartnershipsBoard() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [metrics, setMetrics] = useState<PartnershipMetrics | null>(null);
  const [activeStage, setActiveStage] = useState<string>('todos');

  const fetchData = async () => {
    try {
      const data = await dataService.getTasks();
      // Filtrar por setor de Parcerias (Redes)
      const portTasks = data.filter(t => t.sectorId === 'redes' || t.sector === 'REDES');
      setTasks(portTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      const m = await dataService.getPartnershipMetrics();
      setMetrics(m);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching partnership data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (activeStage === 'todos') return true;
    return t.partnershipStage === activeStage;
  });

  if (isLoading) return <div className="h-40 flex items-center justify-center">Carregando painel de parcerias...</div>;

  const stages = [
    { id: 'todos', label: 'Todos', icon: Network },
    { id: 'prospecção', label: 'Prospecção', icon: Search, color: 'text-slate-500' },
    { id: 'validação', label: 'Validação', icon: ShieldCheck, color: 'text-blue-500' },
    { id: 'negociação', label: 'Negociação', icon: Handshake, color: 'text-amber-500' },
    { id: 'formalização', label: 'Formalização', icon: FileSignature, color: 'text-indigo-500' },
    { id: 'execução', label: 'Execução', icon: Zap, color: 'text-emerald-500' },
    { id: 'avaliação', label: 'Avaliação', icon: BarChart, color: 'text-violet-500' },
  ];

  return (
    <div className="space-y-12">
      {/* 🤝 Partnership Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none bg-slate-50/50 p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prospecções Ativas</span>
            <span className="text-4xl font-black text-slate-800">{metrics?.totalEmProspeccao || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Search size={12} className="text-primary" />
                <span className="text-[9px] font-bold text-slate-500">Oportunidades Identificadas</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-emerald-50/50 p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Parcerias em Execução</span>
            <span className="text-4xl font-black text-emerald-600">{metrics?.ativas || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Zap size={12} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-500">Formalizadas e Ativas</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-blue-50/50 p-6 shadow-sm ring-1 ring-blue-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Impacto Mensurável</span>
            <span className="text-4xl font-black text-blue-600">{metrics?.totalParticipantesImpactados || 0}</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Users2 size={12} className="text-blue-500" />
                <span className="text-[9px] font-bold text-blue-500">Beneficiários Diretos</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-none bg-indigo-50/50 p-6 shadow-sm ring-1 ring-indigo-100">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Taxa de Conversão</span>
            <span className="text-4xl font-black text-indigo-600">{Math.round(metrics?.taxaConversao || 0)}%</span>
            <div className="flex items-center gap-1.5 mt-2">
                <Target size={12} className="text-indigo-500" />
                <span className="text-[9px] font-bold text-indigo-500">Eficiência Institucional</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 🚀 Partnership Pipeline */}
      <div className="bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-600">
                    <Network className="h-6 w-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">Pipeline de Parcerias</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gestão institucional e articulação de redes</p>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
                {stages.map((s) => (
                    <Button 
                        key={s.id}
                        variant={activeStage === s.id ? 'default' : 'ghost'} 
                        size="sm" 
                        className={cn("rounded-full text-[9px] font-black uppercase tracking-widest px-4 h-8")}
                        onClick={() => setActiveStage(s.id)}
                    >
                        <s.icon size={12} className={cn("mr-2", activeStage === s.id ? "text-white" : s.color)} />
                        {s.label}
                    </Button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            {filteredTasks.map((task) => {
                const isConcluded = task.status === 'concluida';
                const demandOrigin = task.dependencyId?.startsWith('trig-social') ? 'Territorial' : 
                                   task.dependencyId?.startsWith('trig-curadoria') ? 'Científica' : 'Coordenação';
                
                return (
                    <Card 
                        key={task.id} 
                        className={cn(
                            "group border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white ring-1 ring-slate-100 overflow-hidden cursor-pointer"
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
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                                        isConcluded ? "bg-emerald-100 text-emerald-600" : "bg-cyan-50 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white"
                                    )}>
                                        <Building2 size={24} />
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-tighter border-slate-200 text-slate-500">
                                                {task.partnershipStage || 'Articulação'}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">Demanda {demandOrigin} • {task.territorialImpactArea || 'Geral'}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase group-hover:text-cyan-600 transition-colors">{task.partnerName || task.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                                <ClipboardCheck size={12} /> {isConcluded ? 'Acordo Finalizado' : 'Em Negociação'}
                                            </div>
                                            {task.dependencyId && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-500 uppercase">
                                                    <Link2 size={12} /> Demanda Vinculada
                                                </div>
                                            )}
                                            {task.territorialImpactArea && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase">
                                                    <MapPin size={12} /> {task.territorialImpactArea}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-700">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-cyan-600 group-hover:text-white transition-all">
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
                    <Handshake className="h-12 w-12 text-slate-300" />
                    <p className="text-sm font-black uppercase italic tracking-widest">Nenhuma parceria encontrada para este estágio.</p>
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
    </div>
  );
}
