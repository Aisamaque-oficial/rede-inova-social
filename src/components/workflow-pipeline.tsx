"use client";

import { ProjectTask } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    Megaphone, 
    Accessibility, 
    ShieldCheck, 
    CheckCircle2
} from "lucide-react";

interface WorkflowPipelineProps {
    tasks: ProjectTask[];
}

export function WorkflowPipeline({ tasks }: WorkflowPipelineProps) {
    const stages = [
        { 
            id: 'producao', 
            label: 'Em Produção', 
            icon: Megaphone,
            stage: 'producao'
        },
        { 
            id: 'acessibilizacao', 
            label: 'Acessibilização', 
            icon: Accessibility,
            stage: 'acessibilizacao'
        },
        { 
            id: 'revisao', 
            label: 'Em Revisão', 
            icon: ShieldCheck,
            stage: 'revisao'
        },
        { 
            id: 'publicacao', 
            label: 'Pronto / Publicado', 
            icon: CheckCircle2,
            stage: 'publicacao'
        }
    ];

    const getCount = (stage: string) => tasks.filter(t => t.workflowStage === stage && t.status !== 'concluida').length;
    const getFinishedCount = () => tasks.filter(t => t.status === 'concluida').length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, i) => {
                const count = stage.id === 'publicacao' ? getFinishedCount() : getCount(stage.stage);
                const Icon = stage.icon;
                
                return (
                    <div key={stage.id} className="relative flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white border border-slate-100 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className={cn(
                            "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 relative z-10",
                            count > 0 
                                ? "bg-primary text-white shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0" 
                                : "bg-slate-50 text-slate-300 ring-1 ring-slate-100"
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="text-center relative z-10">
                            <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 italic">
                                Estágio 0{i + 1}
                            </span>
                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-800 leading-tight">
                                {stage.label}
                            </span>
                        </div>

                        <div className={cn(
                            "px-4 py-1 rounded-full text-[11px] font-black transition-all relative z-10 shadow-sm",
                            count > 0 ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-50 text-slate-300 border border-slate-100"
                        )}>
                            {count} {count === 1 ? 'Tarefa' : 'Tarefas'}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
