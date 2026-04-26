"use client";

import { ProjectTask } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
    Clock, 
    ArrowRight, 
    UserPlus, 
    Calendar,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface OperationalTaskCardProps {
    task: ProjectTask;
    isOverdue?: boolean;
}

export function OperationalTaskCard({ task, isOverdue }: OperationalTaskCardProps) {
    const overdueInfo = typeof dataService.getOverdueDifference === 'function' 
        ? dataService.getOverdueDifference(task.deadline)
        : { label: 'Atrasada', days: 0 };
    
    const priorityColors = {
        urgente: "bg-red-500 text-white",
        alta: "bg-orange-500 text-white",
        media: "bg-amber-500 text-white",
        baixa: "bg-slate-400 text-white"
    };

    return (
        <Card className={cn(
            "group relative overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md",
            isOverdue 
                ? "bg-red-50/50 ring-1 ring-red-100 hover:ring-red-200" 
                : "bg-white ring-1 ring-slate-100 hover:ring-primary/30"
        )}>
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                priorityColors[(task.priority as keyof typeof priorityColors)] || "bg-slate-200"
            )} />

            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            {task.publicId && (
                                <Badge variant="secondary" className="text-[9px] font-black tracking-tighter bg-slate-100 text-slate-600 border-none px-2 h-5">
                                    {task.publicId}
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-white/50 h-5">
                                {task.type}
                            </Badge>
                            <Badge className={cn("text-[8px] font-black uppercase tracking-widest border-none px-2 h-5", priorityColors[(task.priority as keyof typeof priorityColors)] || "bg-slate-200")}>
                                {task.priority || 'media'}
                            </Badge>
                            {task.status === 'bloqueado' && (
                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-amber-200 text-amber-600 bg-amber-50 flex items-center gap-1 h-5">
                                    <Clock className="w-2.5 h-2.5" />
                                    Tarefa Bloqueada
                                </Badge>
                            )}
                            {isOverdue && (
                                <Badge variant="destructive" className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse h-5">
                                    <AlertCircle className="w-2.5 h-2.5" />
                                    {overdueInfo.label}
                                </Badge>
                            )}
                        </div>
                        
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                            {task.title}
                        </h3>
                        {task.status === 'bloqueado' ? (
                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Aguardando dependência externa para iniciar
                            </p>
                        ) : (
                            <p className="text-[10px] font-bold text-slate-500 line-clamp-1 uppercase tracking-wider">
                                {task.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                            isOverdue ? "text-red-600" : "text-slate-400"
                        )}>
                            <Clock className="w-3 h-3" />
                            {(() => {
                                if (!task.deadline) return "SEM PRAZO";
                                try {
                                    const d = new Date(task.deadline);
                                    return isNaN(d.getTime()) ? "PRAZO INVÁLIDO" : d.toLocaleDateString('pt-BR');
                                } catch (e) { return "S/D"; }
                            })()}
                        </span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                            Prazo Final
                        </span>
                    </div>
                </div>

                {/* Horizontal Workflow Progress Bar (High-Tech) */}
                <div className="mt-6 space-y-2.5">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse inline-block" />
                            Progresso do Workflow
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-primary italic bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                {task.workflowStage === 'producao' ? 'Produção' : 
                                 task.workflowStage === 'acessibilizacao' ? 'Acessibilização' :
                                 task.workflowStage === 'revisao' ? 'Revisão' : 'Finalizado'}
                            </span>
                        </div>
                    </div>
                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[2px] shadow-inner">
                        <div className="absolute inset-0 flex gap-1 px-[2px] py-[2px]">
                            <div className={cn(
                                "flex-1 rounded-full transition-all duration-700 delay-100",
                                ['producao', 'acessibilizacao', 'revisao', 'publicacao'].indexOf(task.workflowStage || '') >= 0 
                                    ? "bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                                    : "bg-transparent"
                            )} />
                            <div className={cn(
                                "flex-1 rounded-full transition-all duration-700 delay-200",
                                ['acessibilizacao', 'revisao', 'publicacao'].indexOf(task.workflowStage || '') >= 0 
                                    ? "bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]" 
                                    : "bg-transparent"
                            )} />
                            <div className={cn(
                                "flex-1 rounded-full transition-all duration-700 delay-300",
                                ['revisao', 'publicacao'].indexOf(task.workflowStage || '') >= 0 
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                                    : "bg-transparent"
                            )} />
                            <div className={cn(
                                "flex-1 rounded-full transition-all duration-700 delay-400",
                                task.workflowStage === 'publicacao' || task.status === 'concluida'
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.4)]" 
                                    : "bg-transparent"
                            )} />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                                {(task.sector || '?').charAt(0)}
                             </div>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {task.sector || 'Geral'}
                             </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 sm:flex-none text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 h-8 px-4"
                        >
                            <UserPlus className="w-3 h-3 mr-2" />
                            Delegar
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 sm:flex-none text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 h-8 px-4"
                        >
                            <Calendar className="w-3 h-3 mr-2" />
                            Prorrogar
                        </Button>
                        <Button 
                            asChild
                            size="sm" 
                            className={cn(
                                "flex-1 sm:flex-none text-[9px] font-black uppercase tracking-widest h-9 px-8 shadow-lg group/btn transition-all duration-500",
                                isOverdue 
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5" 
                                    : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                            )}
                        >
                            <Link href={`/gerenciar/tarefas?taskId=${task.id}`}>
                                Resolver Agora
                                <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
