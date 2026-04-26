"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  GraduationCap, 
  Users, 
  Activity, 
  FileText, 
  CheckCircle2, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp, 
  Target,
  BarChart3,
  Search,
  MessageSquare,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataService } from '@/lib/data-service';
import { ScientificProductionBoard } from './scientific-production-board';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Utilitário para converter strings de métricas (%, k, etc) em números reais para cálculo
const parseMetricValue = (val: string): number => {
  if (!val) return 0;
  let clean = val.toString().replace('%', '').replace('+', '').toLowerCase().trim();
  let multiplier = 1;
  
  if (clean.endsWith('k')) {
    multiplier = 1000;
    clean = clean.slice(0, -1);
  } else if (clean.endsWith('m')) {
    multiplier = 1000000;
    clean = clean.slice(0, -1);
  }
  
  return (parseFloat(clean) || 0) * multiplier;
};

export default function ExtensionCoordinationBoard() {
  const [activeTab, setActiveTab] = useState('governanca');
  const [tasks, setTasks] = useState<any[]>(dataService.getProcessedTasks());
  const [indicators, setIndicators] = useState<any[]>(dataService.getExtensionIndicators());
  const [pareceres, setPareceres] = useState<any[]>(dataService.getStrategicPareceres());
  
  // Modais
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [newValue, setNewValue] = useState("");

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [comment, setComment] = useState("");

  const [isParecerModalOpen, setIsParecerModalOpen] = useState(false);
  const [parecerContent, setParecerContent] = useState("");

  // Radar Analysis State
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    materialInfo: "",
    meetsExpectations: true,
    exceedsExpectations: false,
    activityNotPerformed: false
  });

  const refreshData = () => {
    setIndicators(dataService.getExtensionIndicators());
    setPareceres(dataService.getStrategicPareceres());
    setTasks(dataService.getProcessedTasks());
  };

  const handleIndicatorUpdate = () => {
    if (selectedIndicator) {
      dataService.updateExtensionIndicator(selectedIndicator.id, newValue);
      setIsIndicatorModalOpen(false);
      refreshData();
    }
  };

  const handleTaskComment = () => {
    if (selectedTask && comment) {
      dataService.addExtensionTaskComment(selectedTask.id, comment);
      setIsCommentModalOpen(false);
      setComment("");
      refreshData();
    }
  };

  const handleNewGeneralParecer = () => {
    if (parecerContent) {
      dataService.addStrategicParecer(parecerContent);
      setIsParecerModalOpen(false);
      setParecerContent("");
      refreshData();
    }
  };

  const handleTaskAnalysis = async () => {
    if (selectedTask) {
      await dataService.addExtensionRadarAnalysis(selectedTask.id, analysisData);
      setIsAnalysisModalOpen(false);
      setAnalysisData({
        materialInfo: "",
        meetsExpectations: true,
        exceedsExpectations: false,
        activityNotPerformed: false
      });
      refreshData();
    }
  };

  const relations = [
    { sector: "Coordenação Geral", relation: "Subordinação estratégica", purpose: "Direcionamento institucional" },
    { sector: "Coordenação Executiva", relation: "Alinhamento e validação", purpose: "Conformidade e governança" },
    { sector: "ASCOM", relation: "Articulação operacional", purpose: "Divulgação das ações extensionistas" },
    { sector: "Acessibilidade", relation: "Integração técnica", purpose: "Garantia de inclusão" },
    { sector: "Eng. de Alimentos", relation: "Assessoramento científico", purpose: "Validação técnica" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <Tabs defaultValue="governanca" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8 overflow-x-auto pb-4 px-1">
          <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.8rem] border border-slate-200/50 h-auto">
            <TabsTrigger value="governanca" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg">Diretrizes Extensionistas</TabsTrigger>
            <TabsTrigger value="indicadores" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg">Monitor de Impacto</TabsTrigger>
            <TabsTrigger value="curadoria" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg">Curadoria Científica</TabsTrigger>
            <TabsTrigger value="radar" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg">Radar Transversal</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="governanca">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[3rem] bg-slate-950 text-white overflow-hidden group">
               <CardHeader className="p-10 border-b border-white/5 relative bg-gradient-to-br from-primary/20 to-transparent">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Missão & Valores</span>
                  </div>
                  <CardTitle className="text-4xl font-headline italic uppercase tracking-tighter">Missão <span className="text-primary">Institucional</span></CardTitle>
               </CardHeader>
               <CardContent className="p-10 space-y-6">
                  <p className="text-lg font-medium text-slate-300 italic leading-relaxed">
                    "Atuar como elo entre a produção acadêmica e sua aplicação social, assegurando que o conhecimento gerado pelo projeto seja acessível, relevante e transformador para a comunidade."
                  </p>
                  
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Objetivo Geral</h4>
                    <p className="text-sm font-medium text-slate-400">
                      Planejar, articular e assegurar que todas as ações desenvolvidas no âmbito interno do projeto sejam transformadas em práticas extensionistas viáveis.
                    </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
               <CardHeader className="p-10 pb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Matriz de Relações</h4>
                  <CardTitle className="text-3xl font-headline italic uppercase tracking-tighter text-slate-800">Interação <span className="text-primary">Setorial</span></CardTitle>
               </CardHeader>
               <CardContent className="p-10 pt-0">
                  <div className="space-y-4">
                    {relations.map((rel, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-primary/20 transition-all">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rel.sector}</span>
                          <p className="text-xs font-black italic uppercase text-slate-800">{rel.relation}</p>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400 py-1">{rel.purpose}</Badge>
                      </div>
                    ))}
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="indicadores">
          <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-headline italic uppercase tracking-tighter text-slate-800">
                  Indicadores de <span className="text-primary italic">Desempenho</span>
                </CardTitle>
                <CardDescription className="uppercase text-[9px] font-black tracking-widest text-slate-400 mt-2">Métricas de impacto e viabilidade extensionista (Clique para editar)</CardDescription>
              </div>
              <BarChart3 className="h-12 w-12 text-slate-100" />
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Indicador</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Período</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Progresso</th>
                       <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Meta</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {indicators.map((ind) => {
                       const currentNum = parseMetricValue(ind.value);
                       const goalNum = parseMetricValue(ind.goal);
                       const progressPercent = goalNum > 0 ? (currentNum / goalNum) * 100 : 0;
                       
                       return (
                        <tr 
                          key={ind.id} 
                          className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedIndicator(ind);
                            setNewValue(ind.value);
                            setIsIndicatorModalOpen(true);
                          }}
                        >
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-black italic uppercase tracking-tighter text-slate-800 group-hover:text-primary transition-colors">{ind.name}</span>
                              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                <Target size={8} className="text-primary/50" />
                                {ind.formula}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex flex-col gap-1">
                               <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">{ind.period}</span>
                               <Badge variant="outline" className="w-fit text-[7px] font-black uppercase border-slate-200 text-slate-400 px-1 py-0 h-4">
                                 {ind.unit}
                               </Badge>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex flex-col gap-1.5 min-w-[140px]">
                                 <div className="flex justify-between items-center px-0.5">
                                     <span className="text-[9px] font-black text-slate-400 italic uppercase">Estado Atual</span>
                                     <span className="text-[10px] font-black text-slate-800 italic uppercase tracking-wide">{ind.value}</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                                       className="h-full bg-primary"
                                     />
                                 </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right font-black italic text-slate-800">{ind.goal}</td>
                        </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curadoria">
           <ScientificProductionBoard />
        </TabsContent>

        <TabsContent value="radar" className="space-y-8">
           {/* Seção de Pareceres Estratégicos Ativos */}
           {pareceres.length > 0 && (
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Diretrizes Estratégicas Ativas
                 </h4>
                 <div className="grid gap-4 md:grid-cols-2">
                    {pareceres.map((p) => (
                       <div key={p.id} className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                             <Target size={40} className="text-primary" />
                          </div>
                          <p className="text-xs font-medium text-slate-600 leading-relaxed italic mb-4">"{p.content}"</p>
                          <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                             <span className="text-[8px] font-black uppercase tracking-widest text-primary">{p.author}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{new Date(p.date).toLocaleDateString()}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           <div className="flex items-center justify-between mb-2">
             <div className="space-y-1">
                <h3 className="text-2xl font-headline italic uppercase tracking-tighter text-slate-800">Visão <span className="text-primary italic">Transversal</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monitoramento e pareceres estratégicos do projeto</p>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar tarefa..." 
                        className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[10px] font-medium focus:ring-2 focus:ring-primary/20 outline-none w-64"
                    />
                </div>
                <Button 
                  onClick={() => setIsParecerModalOpen(true)}
                  className="rounded-xl h-10 px-4 flex gap-2 bg-slate-900 font-bold text-[10px] uppercase hover:bg-primary transition-colors hover:shadow-lg"
                >
                    <Edit3 size={14} /> Novo Parecer Geral
                </Button>
             </div>
           </div>

           <div className="grid gap-4">
              {tasks.slice(0, 10).map((task) => (
                <div key={task.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                   <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Activity className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400">{task.sector}</Badge>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            task.status === 'concluida' ? "text-emerald-500" : "text-amber-500"
                          )}>{task.status}</span>
                        </div>
                        <h4 className="text-sm font-black italic uppercase tracking-tighter text-slate-800">{task.title}</h4>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      {task.radarAnalyzed && (
                        <Badge variant="outline" className="text-[7px] font-black uppercase bg-emerald-50 text-emerald-600 border-emerald-200">
                          Analise Ok
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary gap-2"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsCommentModalOpen(true);
                        }}
                      >
                        <MessageSquare size={12} /> Comentário
                      </Button>
                      <Button 
                        variant={task.status === 'concluida' ? "ghost" : "outline"} 
                        size="sm" 
                        disabled={task.status === 'concluida'}
                        className={cn(
                          "rounded-xl px-6 h-9 text-[9px] font-black uppercase tracking-widest transition-colors",
                          task.status === 'concluida' ? "text-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-primary"
                        )}
                        onClick={() => {
                          setSelectedTask(task);
                          setAnalysisData({
                            materialInfo: "",
                            meetsExpectations: true,
                            exceedsExpectations: false,
                            activityNotPerformed: false
                          });
                          setIsAnalysisModalOpen(true);
                        }}
                      >
                        {task.status === 'concluida' ? "Analisada" : "Analisar"}
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </TabsContent>
      </Tabs>

      {/* MODAIS DE INTERAÇÃO */}
      
      {/* Modal: Editar Indicador */}
      <Dialog open={isIndicatorModalOpen} onOpenChange={setIsIndicatorModalOpen}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Ajustar Indicador</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Indicador</label>
              <p className="text-sm font-bold text-slate-700">{selectedIndicator?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novo Valor Atual</label>
              <Input 
                value={newValue} 
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: 85% ou 12"
                className="rounded-xl border-slate-200 font-bold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsIndicatorModalOpen(false)} className="rounded-xl uppercase font-black text-[10px]">Cancelar</Button>
            <Button onClick={handleIndicatorUpdate} className="rounded-xl bg-primary uppercase font-black text-[10px]">Salvar Indicador</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Comentário Extensionista */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Parecer Técnico de Extensão</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Tarefa Alvo</span>
               <p className="text-sm font-bold text-slate-700">{selectedTask?.title}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seu Parecer / Recomendação</label>
              <Textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Insira sua análise extensionista para este setor..."
                className="rounded-2xl border-slate-200 font-medium min-h-[120px]"
              />
              <p className="text-[9px] text-slate-400 italic">
                 * Este comentário será anexado ao histórico oficial da tarefa e o setor responsável será notificado.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCommentModalOpen(false)} className="rounded-xl uppercase font-black text-[10px]">Descartar</Button>
            <Button onClick={handleTaskComment} className="rounded-xl bg-primary uppercase font-black text-[10px]">Enviar ao Setor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Novo Parecer Geral */}
      <Dialog open={isParecerModalOpen} onOpenChange={setIsParecerModalOpen}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Diretriz Estratégica</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nova Instrução Geral</label>
              <Textarea 
                value={parecerContent} 
                onChange={(e) => setParecerContent(e.target.value)}
                placeholder="Defina uma diretriz ou recomendação transversal para todo o projeto..."
                className="rounded-2xl border-slate-200 font-medium min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsParecerModalOpen(false)} className="rounded-xl uppercase font-black text-[10px]">Cancelar</Button>
            <Button onClick={handleNewGeneralParecer} className="rounded-xl bg-slate-950 uppercase font-black text-[10px]">Publicar no Radar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Análise Estruturada do Radar */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl max-w-2xl bg-white overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Análise de Impacto Extensionista</DialogTitle>
          </DialogHeader>
          <div className="p-8 bg-slate-950 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Target size={80} />
             </div>
             <Badge className="bg-primary text-black font-black text-[8px] uppercase tracking-widest mb-4">Radar Transversal</Badge>
             <h2 className="text-3xl font-headline italic uppercase tracking-tighter leading-none mb-2">Análise de <span className="text-primary">Impacto Extensionista</span></h2>
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Avaliação qualitativa e técnica institucional</p>
          </div>

          <div className="p-10 space-y-8">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tarefa sob análise</span>
                  <p className="text-sm font-black italic uppercase text-slate-800">{selectedTask?.title}</p>
               </div>
               <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400">{selectedTask?.sector}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <FileText size={12} className="text-primary" /> Análise do Material Desenvolvido
                    </label>
                    <Textarea 
                      value={analysisData.materialInfo}
                      onChange={(e) => setAnalysisData({ ...analysisData, materialInfo: e.target.value })}
                      placeholder="Descreva como o material se atenta aos princípios extensionistas..."
                      className="rounded-2xl border-slate-200 font-medium min-h-[150px] focus:ring-primary/20"
                    />
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <ShieldCheck size={12} className="text-primary" /> Critérios de Expectativa
                    </label>
                    
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-600 uppercase italic">Corresponde às expectativas?</span>
                          <div className="flex gap-2">
                             <Button 
                               variant={analysisData.meetsExpectations ? "default" : "outline"}
                               size="sm" 
                               className="h-7 text-[8px] font-black rounded-lg px-3"
                               onClick={() => setAnalysisData({ ...analysisData, meetsExpectations: true })}
                             >SIM</Button>
                             <Button 
                               variant={!analysisData.meetsExpectations ? "destructive" : "outline"}
                               size="sm" 
                               className="h-7 text-[8px] font-black rounded-lg px-3"
                               onClick={() => setAnalysisData({ ...analysisData, meetsExpectations: false })}
                             >NÃO</Button>
                          </div>
                       </div>

                       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-600 uppercase italic">Ultrapassou as expectativas?</span>
                          <div className="flex gap-2">
                             <Button 
                               variant={analysisData.exceedsExpectations ? "default" : "outline"}
                               size="sm" 
                               className="h-7 text-[8px] font-black rounded-lg px-3"
                               onClick={() => setAnalysisData({ ...analysisData, exceedsExpectations: true })}
                             >SIM</Button>
                             <Button 
                               variant={!analysisData.exceedsExpectations ? "outline" : "outline"}
                               size="sm" 
                               className="h-7 text-[8px] font-black rounded-lg px-3"
                               onClick={() => setAnalysisData({ ...analysisData, exceedsExpectations: false })}
                             >NÃO</Button>
                          </div>
                       </div>

                       <div className={cn(
                         "flex items-center justify-between p-3 rounded-xl border transition-all",
                         analysisData.activityNotPerformed ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"
                       )}>
                          <span className={cn(
                            "text-[10px] font-bold uppercase italic",
                            analysisData.activityNotPerformed ? "text-red-600" : "text-slate-600"
                          )}>A atividade não foi realizada?</span>
                          <Button 
                            variant={analysisData.activityNotPerformed ? "destructive" : "outline"}
                            size="sm" 
                            className="h-7 text-[8px] font-black rounded-lg px-3"
                            onClick={() => setAnalysisData({ ...analysisData, activityNotPerformed: !analysisData.activityNotPerformed })}
                          >
                             {analysisData.activityNotPerformed ? "MARCADO" : "MARCAR"}
                          </Button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-[9px] text-amber-700 leading-relaxed italic">
                       * Ao confirmar esta análise, a tarefa será movida automaticamente para o estado <strong>CONCLUÍDA</strong> e o setor será notificado sobre o parecer técnico institucional.
                    </p>
                 </div>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={() => setIsAnalysisModalOpen(false)} 
                className="rounded-xl uppercase font-black text-[10px] px-8"
              >Cancelar</Button>
              <Button 
                onClick={handleTaskAnalysis} 
                className="rounded-xl bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20 uppercase font-black text-[10px] px-8"
              >Finalizar Análise & Concluir</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
