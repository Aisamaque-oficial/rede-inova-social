"use client";

import React from "react";
import { 
  FileCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Calendar,
  Zap,
  Globe,
  TrendingUp,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { StrategicPlanMonth } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectReportModalProps {
  plans: StrategicPlanMonth[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectReportModal({ plans, isOpen, onClose }: ProjectReportModalProps) {
  const completedAny = plans.some(p => p.tasks.some(t => t.completed));
  const totalTasks = plans.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasksCount = plans.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
  const globalProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 border-none bg-slate-50/98 backdrop-blur-3xl h-[90vh] flex flex-col overflow-hidden">
        {/* Report Header */}
        <DialogHeader className="p-12 bg-white border-b border-slate-100 relative shrink-0 text-left space-y-0">
           <div className="absolute top-0 right-0 p-8">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-50">
                 <X className="h-5 w-5" />
              </Button>
           </div>
           <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] italic">
                 <FileCheck size={14} /> Relatório Consolidado de Execução
              </div>
              <div className="space-y-2">
                 <DialogTitle className="text-5xl font-headline uppercase italic tracking-tighter leading-tight text-slate-900 border-none p-0">
                    Roadmap <span className="text-indigo-600">Institucional</span>
                 </DialogTitle>
                 <DialogDescription className="text-sm font-medium text-slate-400 italic max-w-2xl">
                    Este documento apresenta de forma cronológica todas as metas atingidas pelos setores vinculados ao projeto Rede Inova Social. O registro serve como evidência de impacto e produtividade.
                 </DialogDescription>
              </div>

              {/* Progress Bar Summary */}
              <div className="flex items-center gap-8 pt-4">
                 <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total de Marcos Concluídos</span>
                       <span className="text-2xl font-black text-slate-800">{globalProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                       <div className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{ width: `${globalProgress}%` }} />
                    </div>
                 </div>
                 <div className="h-14 w-px bg-slate-100" />
                 <div className="flex flex-col text-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">Status Geral</span>
                    <span className={cn(
                      "text-xl font-headline uppercase italic",
                      globalProgress > 50 ? "text-emerald-500" : "text-amber-500"
                    )}>{globalProgress > 50 ? "Em Expansão" : "Fase de Estruturação"}</span>
                 </div>
              </div>
           </div>
        </DialogHeader>

        {/* Report Content */}
        <ScrollArea className="flex-1 p-12 bg-white/50 backdrop-blur-xl">
           <div className="max-w-3xl mx-auto space-y-16 pb-20">
              {!completedAny ? (
                 <div className="h-[400px] flex flex-col items-center justify-center gap-6 text-center text-slate-300">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center">
                       <Zap size={40} className="text-slate-100" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] italic">Nenhuma atividade concluída para reportar</p>
                 </div>
              ) : (
                 plans.map((month) => {
                    const completed = month.tasks.filter(t => t.completed);
                    if (completed.length === 0) return null;

                    return (
                       <section key={month.id} className="relative pl-10 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-200 last:before:bg-gradient-to-b last:before:from-slate-200 last:before:to-transparent">
                          {/* Chronological Indicator */}
                          <div className="absolute left-[-6px] top-1.5 h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] border-2 border-white" />
                          
                          <div className="flex items-center justify-between gap-4">
                             <div className="space-y-1">
                                <h3 className="text-xl font-headline uppercase italic tracking-tighter text-slate-800 leading-none">
                                   {month.monthName}
                                </h3>
                                <div className="flex items-center gap-3">
                                   <Badge variant="outline" className="bg-white border-slate-100 text-[10px] text-slate-500 font-bold px-3 py-1 uppercase tracking-widest h-auto">SETOR: {month.sector}</Badge>
                                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">{completed.length} Entregas</span>
                                </div>
                             </div>
                             <CheckCircle2 className="text-emerald-500" size={20} strokeWidth={3} />
                          </div>

                          <div className="grid gap-3">
                             {completed.map((task) => (
                                <div key={task.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 border border-slate-100 shadow-sm group hover:border-indigo-200 hover:bg-white transition-all">
                                   <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                   <span className="text-[12px] font-semibold text-slate-600 tracking-tight leading-relaxed">
                                      {task.label}
                                   </span>
                                </div>
                             ))}
                          </div>
                       </section>
                    );
                 })
              )}
           </div>
        </ScrollArea>

        {/* Action Bar */}
        <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between gap-6 shrink-0">
           <p className="text-[10px] font-medium text-slate-400 italic">Este relatório foi gerado automaticamente pelo sistema em {new Date().toLocaleDateString('pt-BR')}.</p>
           <div className="flex gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest px-8">
                 <Download size={18} className="mr-3" /> Baixar Excel
              </Button>
              <Button className="h-14 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest px-10 shadow-xl shadow-indigo-500/20">
                 <Printer size={18} className="mr-3" /> Imprimir Relatório Completo
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
