"use client";

import React from "react";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  ArrowRight, 
  FileText, 
  History, 
  TrendingUp,
  LayoutGrid,
  ChevronRight,
  Printer,
  X,
  Calendar
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StrategicPlanMonth } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MonthDetailSheetProps {
  month: StrategicPlanMonth | null;
  isOpen: boolean;
  isEditable: boolean;
  onClose: () => void;
  onToggleTask: (monthId: string, taskId: string) => void;
  onToggleSubtask: (monthId: string, taskId: string, subtaskId: string) => void;
}

export function MonthDetailSheet({ month, isOpen, isEditable, onClose, onToggleTask, onToggleSubtask }: MonthDetailSheetProps) {
  if (!month) return null;

  const pendingTasks = month.tasks.filter(t => !t.completed);
  const completedTasks = month.tasks.filter(t => t.completed);
  const progress = Math.round((completedTasks.length / month.tasks.length) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-none bg-slate-50/95 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Custom Header */}
          <SheetHeader className="p-8 pb-12 bg-slate-900 text-white relative overflow-hidden text-left space-y-0">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <Badge className="bg-white/10 text-white/50 border-white/5 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 h-auto">
                      RELATÓRIO MENSAL - {month.sector}
                   </Badge>
                   <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 text-white/50">
                      <X className="h-4 w-4" />
                   </Button>
                </div>
                <div className="space-y-2">
                   <SheetTitle className="text-4xl font-headline uppercase italic tracking-tighter leading-none text-white border-none p-0">
                      {month.monthName}
                   </SheetTitle>
                   <SheetDescription className="text-xs font-medium text-white/40 italic flex items-center gap-2">
                      <Calendar size={12} /> Acompanhamento de metas e entregas estratégicas
                      {!isEditable && (
                        <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-400 border-red-500/20 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                          Somente Leitura
                        </Badge>
                      )}
                   </SheetDescription>
                </div>
                {/* Stats Card */}
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between gap-6">
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Atingimento da Rota</span>
                         <span className="text-2xl font-headline uppercase italic text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-white/5" />
                   </div>
                   <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                      <TrendingUp size={24} />
                   </div>
                </div>
             </div>
          </SheetHeader>

          <ScrollArea className="flex-1 -mt-6 rounded-t-[3rem] bg-slate-50 p-8 pt-10">
             <div className="space-y-12 pb-20">
                {/* Pending Tasks Section */}
                <section className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                            <History size={18} />
                         </div>
                         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 italic">Metas em Aberto</h3>
                      </div>
                      <Badge variant="outline" className="rounded-full border-orange-100 text-orange-600 font-bold px-4 py-1.5 h-auto text-[9px] uppercase tracking-widest shadow-sm">
                         {pendingTasks.length} PENDENTES
                      </Badge>
                   </div>

                   {pendingTasks.length > 0 ? (
                      <div className="space-y-4">
                         {pendingTasks.map((task) => (
                            <div key={task.id} className="group flex flex-col p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
                               <div className="flex items-start gap-5">
                                  <div className="pt-0.5 shrink-0">
                                     <Checkbox 
                                        id={task.id} 
                                        checked={task.completed} 
                                        disabled={!isEditable}
                                        onCheckedChange={() => isEditable && onToggleTask(month.id, task.id)}
                                        className="h-6 w-6 rounded-lg border-2 border-slate-200 transition-all data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                     />
                                  </div>
                                  <div className="flex-1 space-y-4">
                                     <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                           <div className="flex items-center gap-2">
                                              <Badge className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 h-auto uppercase tracking-widest leading-none">
                                                 {task.responsible || task.sectorId || month.sector}
                                              </Badge>
                                              <Badge variant="outline" className={cn(
                                                 "text-[8px] font-bold px-2 py-0.5 h-auto uppercase tracking-widest border-slate-200",
                                                 task.status === 'atrasada' ? "text-red-500 bg-red-50 border-red-100" :
                                                 task.status === 'em_andamento' ? "text-blue-500 bg-blue-50 border-blue-100" :
                                                 "text-slate-400 bg-slate-50"
                                              )}>
                                                 {task.status?.replace('_', ' ') || 'pendente'}
                                              </Badge>
                                           </div>
                                           {task.stageId && (
                                             <Badge variant="ghost" className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                               {task.stageId}
                                             </Badge>
                                           )}
                                        </div>
                                        <label htmlFor={task.id} className={cn(
                                           "text-[15px] font-bold leading-snug text-slate-800 tracking-tight transition-all",
                                           isEditable ? "cursor-pointer group-hover:text-primary" : "cursor-default",
                                           task.completed && "line-through opacity-50"
                                        )}>
                                           {task.label}
                                        </label>

                                        {/* Evidence Section */}
                                        {task.evidence && (
                                          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                             <FileText size={14} className="text-slate-400" />
                                             <div className="space-y-0.5">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Evidência Obrigatória</p>
                                                <p className="text-[10px] font-medium text-slate-600 italic">{task.evidence}</p>
                                             </div>
                                          </div>
                                        )}
                                     </div>

                                     {/* Subtasks Section */}
                                     {task.subtasks && task.subtasks.length > 0 && (
                                        <div className="pl-2 pt-2 space-y-3 border-l-2 border-slate-100 ml-1">
                                           {task.subtasks.map((sub) => (
                                              <div key={sub.id} className="flex items-center gap-3 group/sub">
                                                 <Checkbox 
                                                    id={sub.id} 
                                                    checked={sub.completed}
                                                    disabled={!isEditable}
                                                    onCheckedChange={() => isEditable && onToggleSubtask(month.id, task.id, sub.id)}
                                                    className="h-4 w-4 rounded-md border-slate-200 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                                 />
                                                 <label htmlFor={sub.id} className={cn(
                                                    "text-[11px] font-semibold text-slate-500 group-hover/sub:text-indigo-600 transition-colors",
                                                    isEditable ? "cursor-pointer" : "cursor-default",
                                                    sub.completed && "line-through italic opacity-50"
                                                 )}>
                                                    {sub.label}
                                                 </label>
                                              </div>
                                           ))}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="p-10 rounded-[3rem] bg-emerald-50 border border-emerald-100/50 flex flex-col items-center justify-center gap-4 text-center">
                         <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
                            <CheckCircle2 size={24} />
                         </div>
                         <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Meta Mensal Batida!</p>
                      </div>
                   )}
                </section>

                {/* Completed Tasks Section */}
                <section className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={18} />
                         </div>
                         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 italic">Atividades Realizadas</h3>
                      </div>
                      <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 font-bold px-4 py-1.5 h-auto text-[9px] uppercase tracking-widest shadow-sm border-emerald-100">
                        {completedTasks.length} CONCLUÍDAS
                      </Badge>
                   </div>

                   <div className="space-y-3">
                      {completedTasks.map((task) => (
                         <div key={task.id} className="flex flex-col p-5 rounded-3xl bg-slate-100/50 border border-transparent opacity-60">
                            <div className="flex items-start gap-5">
                               <div className="pt-0.5">
                                  <Checkbox 
                                     id={task.id} 
                                     checked={true} 
                                     disabled={!isEditable}
                                     onCheckedChange={() => isEditable && onToggleTask(month.id, task.id)}
                                     className="h-6 w-6 rounded-lg border-emerald-500 bg-emerald-500 text-white"
                                  />
                               </div>
                               <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                     <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 h-auto uppercase tracking-widest leading-none">
                                           {task.responsible || task.sectorId}
                                        </Badge>
                                        <Badge variant="outline" className="text-[7px] font-bold px-2 py-0.5 h-auto uppercase tracking-widest border-emerald-100 bg-emerald-50 text-emerald-700 leading-none">
                                           concluído
                                        </Badge>
                                     </div>
                                  </div>
                                  <span className="text-[13px] font-medium leading-relaxed text-slate-500 tracking-tight line-through italic">
                                     {task.label}
                                  </span>
                               </div>
                            </div>
                         </div>
                      ))}
                      {completedTasks.length === 0 && (
                         <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-300 py-10 border-2 border-dashed border-slate-100 rounded-[3rem]">
                            Nenhuma atividade concluída ainda
                         </p>
                      )}
                   </div>
                </section>
             </div>
          </ScrollArea>

          {/* Footer with Report Button */}
          <footer className="p-8 bg-white border-t border-slate-100 flex gap-4">
             <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50">
                <Printer size={18} className="mr-3" /> Imprimir Mês
             </Button>
             <Button className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                <FileText size={18} className="mr-3" /> Gerar Relatório de Execução
             </Button>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
