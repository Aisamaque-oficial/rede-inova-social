"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileLock2, 
  ScrollText, 
  ArrowRightLeft, 
  Download, 
  PieChart, 
  Clock, 
  Users,
  Activity,
  History,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dataService, ExecutiveBriefing, ExceptionRequest } from '@/lib/data-service';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskMonitor } from './risk-monitor';

export default function CoordinationBoard() {
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionRequest[]>([]);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedException, setSelectedException] = useState<ExceptionRequest | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [reportSnapshot, setReportSnapshot] = useState<any>(null);
  const [concludedTasks, setConcludedTasks] = useState<any[]>([]);
  const [taskToReopen, setTaskToReopen] = useState<any | null>(null);
  const [reopenJustification, setReopenJustification] = useState('');
  const [reopenStatus, setReopenStatus] = useState<'em_andamento' | 'em_revisao' | 'bloqueado'>('em_andamento');
  const [isReopening, setIsReopening] = useState(false);
  
  // States for Institutional Generator
  const [reportMonth, setReportMonth] = useState('2026-04');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [currentMonthTasks, setCurrentMonthTasks] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBriefing(dataService.getExecutiveBriefing());
    setExceptions(dataService.getExceptionRequests());
    setConcludedTasks(dataService.getProcessedTasks().filter(t => t.status === 'concluida'));
  };

  const handleReopen = async () => {
    if (!taskToReopen || !reopenJustification || reopenJustification.length < 10) return;
    
    setIsReopening(true);
    try {
      await dataService.reopenTask(taskToReopen.id, reopenJustification, reopenStatus);
      setTaskToReopen(null);
      setReopenJustification('');
      loadData();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsReopening(false);
    }
  };

  const handleDecision = async (status: 'aprovada' | 'rejeitada') => {
    if (!selectedException) return;
    
    await dataService.processException(selectedException.id, status, decisionNotes);
    setSelectedException(null);
    setDecisionNotes('');
    loadData();
  };

  const openActivitySelector = () => {
    const tasks = dataService.getProcessedTasks().filter(t => {
      const createMonth = t.createdAt?.slice(0, 7);
      const completeMonth = t.completedAt?.slice(0, 7);
      return createMonth === reportMonth || completeMonth === reportMonth;
    });
    setCurrentMonthTasks(tasks);
    // Auto-select all by default
    setSelectedTaskIds(new Set(tasks.map(t => t.id)));
    setIsActivityModalOpen(true);
  };

  const generateReport = () => {
    setReportSnapshot(dataService.generateProjectSnapshot({
      month: reportMonth,
      taskIds: Array.from(selectedTaskIds)
    }));
    setIsActivityModalOpen(false);
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSet = new Set(selectedTaskIds);
    if (newSet.has(taskId)) newSet.delete(taskId);
    else newSet.add(taskId);
    setSelectedTaskIds(newSet);
  };

  const toggleAllTasks = () => {
    if (selectedTaskIds.size === currentMonthTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(currentMonthTasks.map(t => t.id)));
    }
  };

  if (!briefing) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Executive Quick Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-none rounded-[2rem] shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <Activity className="h-4 w-4 text-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-white">
                {briefing.globalHealthScore}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1 italic">Health Core Index</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm group hover:ring-2 hover:ring-orange-500/20 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-100">
                <FileLock2 className="h-5 w-5 text-orange-600" />
              </div>
              <Badge variant="outline" className="border-orange-200 text-orange-600 font-bold bg-orange-50/50">
                PENDENTE
              </Badge>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-slate-800">
                {String(briefing.pendingExceptionsCount).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Exceções em Análise</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-red-50 border border-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex -space-x-2">
                {briefing.highRiskSectors.map((s, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-slate-800">
                {String(briefing.totalOverdue).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Atrasos de Alto Risco</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <PieChart className="h-4 w-4 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black italic tracking-tighter text-slate-800">
                {briefing.goalCompliance}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Conformidade Institucional</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbox" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 px-1">
          <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.8rem] border border-slate-200/50 h-auto">
            <TabsTrigger 
              value="inbox" 
              className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Inbox de Governança
            </TabsTrigger>
            <TabsTrigger 
              value="riscos" 
              className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Monitor de Riscos
            </TabsTrigger>
            <TabsTrigger 
              value="relatorios" 
              className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Relatórios Oficiais
            </TabsTrigger>
            <TabsTrigger 
              value="concluidas" 
              className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Histórico de Conclusão
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inbox">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 mb-6">
                <ArrowRightLeft className="h-4 w-4" /> Solicitações Pendentes
              </h3>
              
              <AnimatePresence mode="popLayout">
                {exceptions.filter(e => e.status === 'pendente').length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                  >
                    <ShieldCheck className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tudo em conformidade. Nenhuma exceção pendente.</p>
                  </motion.div>
                ) : (
                  exceptions.filter(e => e.status === 'pendente').map((exc) => (
                    <motion.div
                      key={exc.id}
                      layout
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className={cn(
                        "group p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer",
                        selectedException?.id === exc.id ? "bg-primary/5 border-primary shadow-lg" : "bg-white border-slate-50 hover:border-slate-200 hover:shadow-md"
                      )}
                      onClick={() => setSelectedException(exc)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white transition-colors">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Solicitado em {new Date(exc.createdAt).toLocaleDateString()} às {new Date(exc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[8px] tracking-widest px-3 py-1">
                          {exc.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <h4 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase mb-2">
                        {exc.taskTitle}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full uppercase italic tracking-tighter">
                          <Users className="h-3 w-3" /> {exc.requesterName}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full uppercase italic tracking-tighter">
                          <Activity className="h-3 w-3" /> Setor: {dataService.getSectorSigla(exc.sectorId)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedException ? (
                  <motion.div
                    key="decision-active"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                  >
                    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-slate-900 text-white">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Painel de Decisão CGP</span>
                        </div>
                        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter leading-tight">
                          Analisar <span className="text-primary italic">Solicitação</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-4 space-y-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                          <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Justificativa do Membro:</span>
                            <p className="text-sm font-medium italic mt-2 text-slate-300">"{selectedException.justification}"</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nota de Decisão Executiva:</label>
                          <Textarea 
                            placeholder="Descreva o motivo da aprovação ou rejeição técnica..."
                            className="bg-slate-800 border-white/5 rounded-2xl text-[11px] font-medium text-white placeholder:text-slate-600 focus:ring-primary h-32"
                            value={decisionNotes}
                            onChange={(e) => setDecisionNotes(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            className="h-14 rounded-2xl bg-white text-slate-900 border-none hover:bg-slate-100 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => handleDecision('rejeitada')}
                          >
                            <XCircle className="h-4 w-4 mr-2 text-red-600" /> Rejeitar
                          </Button>
                          <Button 
                            className="h-14 rounded-2xl bg-primary text-white border-none shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => handleDecision('aprovada')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Aprovar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
                    <MessageSquare className="h-10 w-10 mb-6 opacity-30" />
                    <h5 className="text-[11px] font-black uppercase tracking-widest mb-2 italic">Análise de Governança</h5>
                    <p className="text-[10px] font-medium leading-relaxed">Selecione uma solicitação para processar a aprovação estratégica.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="riscos">
           <RiskMonitor briefing={briefing} />
        </TabsContent>

        <TabsContent value="relatorios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[3rem] bg-white group overflow-hidden">
                <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
                        Gerador <span className="text-primary italic">Institucional</span>
                    </CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 leading-relaxed mt-2">
                        Consolide todos os dados e evidências do projeto para prestação de contas formal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-primary/20 transition-all">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Período de Referência</span>
                            <div className="mt-2">
                                <Select value={reportMonth} onValueChange={setReportMonth}>
                                    <SelectTrigger className="h-8 bg-transparent border-none p-0 text-[10px] font-bold text-slate-800 uppercase italic focus:ring-0 shadow-none">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-primary" />
                                            <SelectValue placeholder="Selecione o Mês" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                        <SelectItem value="2026-01" className="text-[10px] font-black uppercase italic">Janeiro / 2026</SelectItem>
                                        <SelectItem value="2026-02" className="text-[10px] font-black uppercase italic">Fevereiro / 2026</SelectItem>
                                        <SelectItem value="2026-03" className="text-[10px] font-black uppercase italic">Março / 2026</SelectItem>
                                        <SelectItem value="2026-04" className="text-[10px] font-black uppercase italic">Abril / 2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-primary/20 transition-colors">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Status de Auditoria</span>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-800 tracking-tighter uppercase italic">100% Verificado</span>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={openActivitySelector}
                        className="w-full h-16 rounded-[1.8rem] bg-slate-900 hover:bg-black text-white border-none shadow-2xl font-black uppercase tracking-[0.2em] text-[11px] group"
                    >
                        <ScrollText className="h-4 w-4 mr-3 transition-transform group-hover:rotate-12" /> Gerar Relatório de Governança
                    </Button>
                </CardContent>
            </Card>

            <AnimatePresence>
                {reportSnapshot && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden print:shadow-none print:border-none"
                    >
                        <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Snapshot Institucional</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">Gerado em {reportSnapshot.timestamp}</p>
                                </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="rounded-full hover:bg-slate-200"
                              onClick={() => window.print()}
                            >
                                <Download className="h-4 w-4 text-slate-600" />
                            </Button>
                        </div>
                        <div className="p-10 space-y-8 max-h-[500px] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Sumário Executivo</span>
                                    <ul className="mt-4 space-y-3">
                                        <li className="flex items-center justify-between py-2 border-b border-slate-50">
                                            <span className="text-[10px] font-bold uppercase italic text-slate-600">Total de Atividades</span>
                                            <span className="text-sm font-black italic">{reportSnapshot.totalTasks}</span>
                                        </li>
                                        <li className="flex items-center justify-between py-2 border-b border-slate-50">
                                            <span className="text-[10px] font-bold uppercase italic text-slate-600">Concluídas (Mês)</span>
                                            <span className="text-sm font-black italic text-emerald-600">{reportSnapshot.concludedTasks}</span>
                                        </li>
                                        <li className="flex items-center justify-between py-2 border-b border-slate-50">
                                            <span className="text-[10px] font-bold uppercase italic text-slate-600">Atrasos Críticos</span>
                                            <span className="text-sm font-black italic text-red-600">{reportSnapshot.criticalDelays}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Desempenho por Núcleo</span>
                                    <div className="mt-4 space-y-2">
                                        {reportSnapshot.sectorPerformance.map((s: any, i: number) => (
                                            <div key={i} className="flex flex-col p-3 bg-slate-50 rounded-xl">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[9px] font-black uppercase italic tracking-tighter">{s.sector}</span>
                                                    <span className="text-[9px] font-black text-primary">{s.eficiencia}</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: s.eficiencia }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Observação Institucional</p>
                                <p className="text-[10px] italic leading-relaxed opacity-80">
                                    "Os dados acima refletem a conformidade técnica conforme os parâmetros do motor de workflow da Rede Inova, com rastreabilidade total de evidências e prazos de SLA por setor."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </TabsContent>
        <TabsContent value="concluidas">
          <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="p-10 border-b border-slate-50">
               <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <History className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Audit Trail: Entregas Finalizadas</span>
               </div>
               <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
                  Controle de <span className="text-primary">Conformidade Final</span>
               </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
               <div className="space-y-4">
                  {concludedTasks.length === 0 ? (
                    <div className="p-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                       <CheckCircle2 className="h-10 w-10 text-slate-200 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Nenhuma tarefa concluída no momento.</p>
                    </div>
                  ) : (
                    concludedTasks.map((task) => (
                      <div key={task.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between hover:shadow-md transition-all group">
                         <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                               <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[8px] font-black bg-slate-50 text-slate-400 border-slate-100">{task.identifier}</Badge>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase italic">Concluído em: {new Date(task.completedAt).toLocaleDateString()}</span>
                               </div>
                               <h5 className="text-sm font-black italic uppercase tracking-tighter text-slate-800">{task.title}</h5>
                               <p className="text-[10px] font-medium text-slate-400 italic line-clamp-1">{task.completionReport}</p>
                            </div>
                         </div>
                         <Button 
                           variant="outline" 
                           className="rounded-xl h-10 text-[9px] font-black uppercase tracking-widest px-6 border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                           onClick={() => setTaskToReopen(task)}
                         >
                            Reabrir Demanda
                         </Button>
                      </div>
                    ))
                  )}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reopen Justification Modal */}
      <AnimatePresence>
        {taskToReopen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                 <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                          <AlertTriangle size={24} />
                       </div>
                       <div className="space-y-0.5">
                          <h4 className="text-lg font-black italic uppercase tracking-tighter text-slate-800">Ação de Reabertura</h4>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Governança Institucional Rede Inova</p>
                       </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tarefa Alvo:</p>
                        <p className="text-xs font-black italic uppercase text-slate-700">{taskToReopen.title}</p>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">
                          Justificativa Técnica (Obrigatória):
                       </label>
                       <Textarea 
                          placeholder="Descreva o motivo pelo qual esta demanda precisa ser reaberta..."
                          className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 font-medium text-xs p-4 focus:ring-amber-500/20"
                          value={reopenJustification}
                          onChange={(e) => setReopenJustification(e.target.value)}
                       />
                       {reopenJustification.length > 0 && reopenJustification.length < 10 && (
                          <p className="text-[9px] font-bold text-red-500 italic ml-1">Mínimo de 10 caracteres necessário.</p>
                       )}
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">
                          Status de Retorno (Obrigatório):
                       </label>
                       <div className="grid grid-cols-3 gap-2">
                          <Button
                             type="button"
                             variant={reopenStatus === 'em_andamento' ? 'default' : 'outline'}
                             className={cn("h-10 text-[9px] font-black uppercase tracking-widest", reopenStatus === 'em_andamento' ? "bg-amber-600 hover:bg-amber-700" : "border-slate-200 text-slate-500")}
                             onClick={() => setReopenStatus('em_andamento')}
                          >
                             Em Andamento
                          </Button>
                          <Button
                             type="button"
                             variant={reopenStatus === 'em_revisao' ? 'default' : 'outline'}
                             className={cn("h-10 text-[9px] font-black uppercase tracking-widest", reopenStatus === 'em_revisao' ? "bg-amber-600 hover:bg-amber-700" : "border-slate-200 text-slate-500")}
                             onClick={() => setReopenStatus('em_revisao')}
                          >
                             Em Revisão
                          </Button>
                          <Button
                             type="button"
                             variant={reopenStatus === 'bloqueado' ? 'default' : 'outline'}
                             className={cn("h-10 text-[9px] font-black uppercase tracking-widest", reopenStatus === 'bloqueado' ? "bg-amber-600 hover:bg-amber-700" : "border-slate-200 text-slate-500")}
                             onClick={() => setReopenStatus('bloqueado')}
                          >
                             Bloqueada
                          </Button>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                       <Button 
                         variant="ghost" 
                         className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest h-12"
                         onClick={() => { setTaskToReopen(null); setReopenJustification(''); }}
                       >
                          Cancelar
                       </Button>
                       <Button 
                         className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest h-12 shadow-lg shadow-amber-200"
                         disabled={reopenJustification.length < 10 || isReopening}
                         onClick={handleReopen}
                       >
                          Confirmar Reabertura
                       </Button>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Activity Selector Modal */}
      <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-slate-900 text-white">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ScrollText className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Seletor de Atividades</span>
            </div>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter leading-tight">
              Escolha as <span className="text-primary italic">Atividades</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Selecione quais itens devem compor o relatório institucional de {reportMonth}
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
             <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {currentMonthTasks.length} atividades encontradas
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleAllTasks}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
                >
                  {selectedTaskIds.size === currentMonthTasks.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                </Button>
             </div>

             <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {currentMonthTasks.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nenhuma atividade registrada neste período.</p>
                  </div>
                ) : (
                  currentMonthTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                        selectedTaskIds.has(task.id) ? "bg-primary/5 border-primary/20" : "bg-white border-slate-50 hover:border-slate-100"
                      )}
                      onClick={() => toggleTaskSelection(task.id)}
                    >
                      <Checkbox 
                        checked={selectedTaskIds.has(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                        className="rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="outline" className="text-[8px] font-black px-1.5 py-0 border-slate-200 text-slate-400">
                             {task.identifier || task.publicId}
                           </Badge>
                           <Badge className={cn(
                             "text-[7px] font-black uppercase tracking-[0.1em]",
                             task.status === 'concluida' ? "bg-emerald-500" : "bg-amber-500"
                           )}>
                             {task.status.replace('_', ' ')}
                           </Badge>
                        </div>
                        <h5 className="text-[11px] font-black italic uppercase text-slate-800 leading-tight">
                          {task.title}
                        </h5>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">
                          {task.sector}
                        </p>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex-col sm:flex-row gap-4">
             <Button 
               variant="ghost" 
               className="rounded-2xl h-14 text-[11px] font-black uppercase tracking-widest px-8"
               onClick={() => setIsActivityModalOpen(false)}
             >
                Cancelar
             </Button>
             <Button 
               className="flex-1 rounded-2xl h-14 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 text-[11px] font-black uppercase tracking-widest"
               disabled={selectedTaskIds.size === 0}
               onClick={generateReport}
             >
                Gerar Relatório Final ({selectedTaskIds.size})
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
