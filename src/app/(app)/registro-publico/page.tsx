"use client";

import React, { useState, useEffect } from "react";
import { 
  FileCheck, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Download,
  Calendar,
  User,
  ExternalLink,
  MessageSquare,
  History,
  X,
  Clock,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function RegistroPublicoPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await dataService.getTasks();
      // Apenas tarefas concluídas aparecem no registro público de transparência
      const publicTasks = allTasks.filter(t => t.status === 'concluida');
      setTasks(publicTasks);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.identifier?.toLowerCase().includes(search.toLowerCase()) ||
    t.sector.toLowerCase().includes(search.toLowerCase())
  );

  const metrics = {
    total: tasks.length,
    sectors: new Set(tasks.map(t => t.sector)).size,
    audited: tasks.filter(t => t.evidenceConfirmed || t.conclusionLink).length,
    impact: tasks.reduce((acc, t) => acc + (t.participantCount || 0), 0)
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
       {/* Header Estilizado (Print 3 Style) */}
       <section className="relative overflow-hidden p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
             <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                <ShieldCheck size={40} />
             </div>
             <div className="space-y-4">
                <h1 className="text-5xl font-headline uppercase italic tracking-tighter leading-none">
                  Registro Público de <span className="text-primary">Transparência</span>
                </h1>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <div className="px-6 py-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center min-w-[140px]">
                      <span className="text-3xl font-black italic text-primary leading-none mb-1">{metrics.total}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none">Ações Finalizadas</span>
                   </div>
                   <div className="px-6 py-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center min-w-[140px]">
                      <span className="text-3xl font-black italic text-teal-400 leading-none mb-1">{metrics.sectors}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none">Setores Ativos</span>
                   </div>
                   <div className="px-6 py-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center min-w-[140px]">
                      <span className="text-3xl font-black italic text-indigo-400 leading-none mb-1">{metrics.audited}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none">Auditados com Link</span>
                   </div>
                   <div className="px-6 py-4 rounded-[2rem] bg-white/10 border border-primary/30 backdrop-blur-xl flex flex-col items-center min-w-[140px] ring-2 ring-primary/20">
                      <span className="text-3xl font-black italic text-white leading-none mb-1">{metrics.impact || '---'}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary leading-none">Pessoas Alcançadas</span>
                   </div>
                </div>
             </div>
             <p className="text-xs font-medium text-slate-400 italic max-w-2xl leading-relaxed">
                Repositório oficial de ações, metas e evidências da Rede Inova Social. Todos os registros abaixo possuem validade jurídica institucional e cadeia de custódia verificada.
             </p>
          </div>
       </section>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
         <div className="relative flex-1 w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <Input 
               placeholder="Buscar por identificador, assunto ou setor..." 
               className="h-14 pl-12 rounded-2xl border-slate-100 bg-white font-bold text-sm shadow-sm focus:ring-primary/10 transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 bg-white font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-slate-50">
               <Filter size={16} className="mr-2" /> Filtrar Período
            </Button>
            <Button className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-lg">
               <Download size={16} className="mr-2" /> Exportar Dados
            </Button>
         </div>
      </div>

      {/* Tabela de Transparência (Layout Print 3) */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white ring-1 ring-slate-100">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">#ID / Identificador</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Setor Dono</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Tipo</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Assunto / Descrição</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Situação</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Data / Autor</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, idx) => (
                           <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                              <td className="p-6">
                                 <span className="text-xs font-black font-mono text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                    {task.identifier || task.id}
                                 </span>
                              </td>
                              <td className="p-6">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">INOVA SOCIAL</span>
                                    <span className="text-xs font-bold text-slate-700 uppercase italic leading-none">{task.sector}</span>
                                 </div>
                              </td>
                              <td className="p-6">
                                 <Badge variant="outline" className="bg-slate-50 border-slate-200 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                    {task.type || 'Ação'}
                                 </Badge>
                              </td>
                              <td className="p-6">
                                 <div className="flex flex-col max-w-[300px]">
                                    <span className="text-sm font-bold text-slate-800 leading-tight italic truncate uppercase">{task.title}</span>
                                    <span className="text-[9px] text-slate-400 font-medium truncate italic">Fase: {task.workflowStage || 'N/A'}</span>
                                 </div>
                              </td>
                              <td className="p-6">
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 w-fit">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Finalizado / Assinado</span>
                                 </div>
                              </td>
                              <td className="p-6">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-800 italic leading-none">{task.assignedToName}</span>
                                    <span className="text-[9px] text-slate-400 font-medium">{task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : '...'}</span>
                                 </div>
                              </td>
                              <td className="p-6 text-center">
                                 <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
                                       onClick={() => setSelectedTask(task)}
                                       title="Ver Trâmites"
                                    >
                                       <History size={16} />
                                    </Button>
                                    {task.conclusionLink && (
                                       <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-50"
                                          onClick={() => window.open(task.conclusionLink, '_blank')}
                                          title="Ver Resultado"
                                       >
                                          <ExternalLink size={14} />
                                       </Button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={7} className="p-20 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-40">
                                 <FileCheck size={64} className="text-slate-300" />
                                 <div className="space-y-1">
                                    <p className="text-sm font-black uppercase italic text-slate-600">Nenhum registro encontrado</p>
                                    <p className="text-xs font-medium text-slate-400">As ações assinadas aparecerão automaticamente aqui.</p>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      {/* Cadeia de Custódia Modal (Trâmites) */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
         <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl">
            {selectedTask && (
               <div className="flex flex-col h-[80vh]">
                  <DialogHeader className="p-10 bg-slate-900 text-white border-none shrink-0">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                           <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                              <ShieldCheck size={28} />
                           </div>
                           <div className="space-y-1">
                              <Badge variant="outline" className="text-[8px] font-black border-white/20 text-white/40 uppercase tracking-widest">{selectedTask.identifier}</Badge>
                              <DialogTitle className="text-xl font-headline uppercase italic tracking-tighter leading-none">Cadeia de Custódia</DialogTitle>
                              <DialogDescription className="text-[9px] font-black uppercase tracking-widest text-white/30">Histórico completo de trâmites e assinaturas</DialogDescription>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/40 hover:bg-white/5" onClick={() => setSelectedTask(null)}>
                           <X size={20} />
                        </Button>
                     </div>
                  </DialogHeader>

                  <ScrollArea className="flex-1 bg-white p-10">
                     <div className="relative space-y-12 ml-4">
                        <div className="absolute left-[-17px] top-6 bottom-6 w-[2px] bg-slate-100" />

                        {selectedTask.history && selectedTask.history.slice().reverse().map((h, i) => (
                           <div key={i} className="relative space-y-3">
                              {/* Dot Indicator */}
                              <div className={cn(
                                 "absolute left-[-25px] top-1.5 h-4 w-4 rounded-full border-4 border-white shadow-sm ring-4 ring-white",
                                 h.status === 'concluida' ? "bg-emerald-500" : "bg-primary"
                              )} />

                              <div className="space-y-2">
                                 <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-slate-300" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                       {format(new Date(h.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </p>
                                 </div>
                                 
                                 <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                                    <p className="text-sm font-black text-slate-800 uppercase italic leading-tight">
                                       {h.action}
                                    </p>
                                    {h.comment && (
                                       <div className="flex gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                          <MessageSquare size={14} className="text-primary shrink-0 mt-0.5" />
                                          <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed">
                                             "{h.comment}"
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </ScrollArea>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                           <ShieldAlert size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase italic text-emerald-800 leading-none">Integridade Auditada</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Este documento possui validade jurídica institucional</p>
                        </div>
                        {selectedTask.conclusionLink && (
                           <Button 
                              className="ml-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] h-10 px-6 italic tracking-widest shadow-lg shadow-emerald-200"
                              onClick={() => window.open(selectedTask.conclusionLink!, '_blank')}
                           >
                              Abrir Resultado Final
                           </Button>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>

      {/* Footer Informacional */}
      <div className="flex items-start gap-4 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
         <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <MessageSquare size={18} />
         </div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Aviso de Integridade</h4>
            <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed">
               Todos os registros listados acima possuem validade institucional plena. As assinaturas digitais são processadas via autenticação interna de dois fatores, garantindo que o autor listado é de fato o responsável pela conclusão da demanda no sistema Rede Inova Social.
            </p>
         </div>
      </div>
    </div>
  );
}
