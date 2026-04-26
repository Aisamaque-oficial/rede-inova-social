"use client";

import React, { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  FileText,
  ShieldCheck,
  Instagram,
  Timer,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskWorkflowManager } from "./task-workflow-manager";

export function ASCOMTaskTable({ forcedSectorId, externalFilter = "todos" }: { 
  forcedSectorId?: string,
  externalFilter?: string 
}) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [search, setSearch] = useState("");
  const [localFilter, setLocalFilter] = useState<string>("todos");
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  const fetchTasks = async () => {
    const data = await dataService.getTasks();
    const sectorId = forcedSectorId || 'ascom';
    const sectorTasks = data.filter(t => 
      t.sectorId === sectorId || 
      t.sector?.toUpperCase() === sectorId.toUpperCase()
    );
    setTasks(sectorTasks);
  };

  useEffect(() => {
    // 📡 Inscrição Real-time para atualizações (Firestore + Local)
    const unsubscribe = dataService.subscribeToTasks((allTasks) => {
      const sectorId = forcedSectorId || 'ascom';
      const sectorTasks = allTasks.filter(t => 
        t.sectorId === sectorId || 
        t.sector?.toUpperCase() === sectorId.toUpperCase()
      );
      setTasks(sectorTasks);
    });

    return () => unsubscribe();
  }, [forcedSectorId]);

  const filteredTasks = tasks.filter(t => {
    // Busca textual
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.assignedToName.toLowerCase().includes(search.toLowerCase()) ||
                          t.publicId?.toLowerCase().includes(search.toLowerCase());
    
    // Filtro (Local ou Externo)
    const activeFilter = externalFilter !== "todos" ? externalFilter : localFilter;
    
    let matchesStatus = true;
    if (activeFilter !== "todos") {
      switch (activeFilter) {
        case 'atrasada':
          matchesStatus = t.status === 'atrasada';
          break;
        case 'pendente':
          matchesStatus = t.status === 'nao_iniciado' || t.status === 'em_andamento' || t.status === 'aguardando_recebimento';
          break;
        case 'hoje':
          const today = new Date().toISOString().split('T')[0];
          matchesStatus = t.deadline.startsWith(today) && t.status !== 'concluida';
          break;
        case 'em_andamento':
          matchesStatus = t.status === 'em_andamento';
          break;
        case 'aguardando_outro_setor':
          matchesStatus = t.status === 'aguardando_outro_setor';
          break;
        case 'concluida':
          matchesStatus = t.status === 'concluida';
          break;
        case 'acessibilizacao':
          matchesStatus = t.workflowStage === 'acessibilizacao' && t.status === 'aguardando_outro_setor';
          break;
        case 'bloqueado':
          matchesStatus = t.status === 'bloqueado';
          break;
        default:
          matchesStatus = t.status === activeFilter;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string, color: string, icon: any }> = {
      'atrasada': { label: 'Atrasada', color: 'bg-red-50 text-red-600 border-red-100', icon: AlertCircle },
      'em_andamento': { label: 'Andamento', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Timer },
      'concluida': { label: 'Concluída', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
      'aguardando_outro_setor': { label: 'Em Fluxo', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
      'revisao': { label: 'Revisão', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: ShieldCheck }
    };
    const config = configs[status] || { label: status, color: 'bg-slate-50 text-slate-500', icon: FileText };
    return (
      <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 gap-1.5 border-none shadow-none", config.color)}>
        <config.icon size={10} /> {config.label}
      </Badge>
    );
  };

  const getWorkflowBadge = (stage: string) => {
    const labels: Record<string, string> = {
      'producao': 'DIFUSÃO/ASCOM',
      'acessibilizacao': 'ACESS-INOVA',
      'revisao': 'REVISÃO',
      'publicacao': 'PUBLICADO'
    };
    return (
      <span className="text-[10px] font-black italic text-slate-400 group-hover:text-primary transition-colors">
        {labels[stage] || stage.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
                placeholder="Buscar por ID, título ou responsável..." 
                className="pl-12 h-12 rounded-2xl border-none shadow-inner bg-slate-100/50 text-xs font-bold ring-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3">
            {['todos', 'atrasada', 'em_andamento', 'concluida'].map((s) => (
                <Button 
                    key={s}
                    variant={(externalFilter !== "todos" ? externalFilter : localFilter) === s ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setLocalFilter(s)}
                    className={cn(
                        "rounded-xl text-[9px] font-black uppercase tracking-widest h-9 px-4",
                        (externalFilter !== "todos" ? externalFilter : localFilter) === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-800"
                    )}
                >
                    {s === 'todos' ? 'Ver Tudo' : s.replace('_', ' ')}
                </Button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">ID Operacional</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Atividade</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Responsável</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Etapa Fluxo</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Prazo</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <tr 
                key={task.id} 
                className={cn(
                  "group transition-colors cursor-pointer border-l-4",
                  task.isExtra 
                    ? "bg-blue-50/30 hover:bg-blue-50/60 border-l-primary border-y border-y-primary/20 border-r border-r-primary/20 m-2 rounded-xl border-dashed" 
                    : "hover:bg-slate-50/80 border-l-transparent border-b border-b-slate-50"
                )}
                onClick={() => {
                    setSelectedTask(task);
                    setIsWorkflowOpen(true);
                }}
              >
                <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-800 tracking-widest">{task.publicId || (task.id ? `#${task.id.slice(-4)}` : '---')}</span>
                </td>
                <td className="px-8 py-6">
                    <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                            {task.isExtra && (
                              <Badge className="bg-primary text-white text-[8px] font-black tracking-widest px-1.5 h-4 border-none">EXTRA</Badge>
                            )}
                            {task.hasIntervention && (
                              <div className="flex items-center gap-1 animate-pulse">
                                <ShieldCheck size={12} className="text-rose-500" />
                                <span className="text-[8px] font-black text-rose-500 tracking-tighter uppercase italic">Intervenção</span>
                              </div>
                            )}
                        <div className="flex items-center gap-2 mt-1">
                            {task.isFeed && <Instagram size={10} className="text-pink-500" />}
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                              {task.isExtra ? `Impacto: ${task.extraQuantity || 1} ${task.extraImpact || 'ações'}` : task.type}
                            </span>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <User size={12} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">{task.assignedToName}</span>
                    </div>
                </td>
                <td className="px-8 py-6">
                    {getWorkflowBadge(task.workflowStage || 'producao')}
                </td>
                <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={12} className={cn(task.status === 'atrasada' ? "text-red-500" : "text-slate-300")} />
                        <span className={cn(
                            "text-[10px] font-black tracking-widest",
                            task.status === 'atrasada' ? "text-red-600 font-black" : "text-slate-500"
                        )}>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase() : 'S/ DATA'}
                        </span>
                    </div>
                </td>
                <td className="px-8 py-6">
                    {getStatusBadge(task.status)}
                </td>
                <td className="px-8 py-6 text-right">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">
                  Nenhuma atividade encontrada neste critério
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
