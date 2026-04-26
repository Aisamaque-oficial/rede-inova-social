"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Book, 
  Users, 
  FlaskConical, 
  Sprout, 
  Megaphone, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award,
  Edit3,
  Plus,
  History,
  Trash2,
  Calendar,
  FileCheck
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dataService } from "@/lib/data-service"
import { ProjectObjective } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap = {
  book: Book,
  users: Users,
  flask: FlaskConical,
  sprout: Sprout,
  megaphone: Megaphone
}

const statusConfig = {
  planejado: { label: 'Planejado', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  concluido: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  atencao: { label: 'Em Atenção', color: 'bg-red-500/10 text-red-600 border-red-500/20' }
}

export default function ImpactGoals({ mode = 'auto' }: { mode?: 'auto' | 'public' | 'studio' }) {
  const [objectives, setObjectives] = useState<ProjectObjective[]>([])
  const [activeTab, setActiveTab] = useState("obj1")
  const [canEdit, setCanEdit] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Edit Modals State
  const [isEditingObjective, setIsEditingObjective] = useState(false)
  const [editingObj, setEditingObj] = useState<any>(null)

  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [editingGoalParentId, setEditingGoalParentId] = useState<string>("")

  // Dynamic Add State
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalTargetValue, setNewGoalTargetValue] = useState<number>(0)
  const [newGoalUnit, setNewGoalUnit] = useState("")

  // Monthly Log State
  const [isLoggingMonth, setIsLoggingMonth] = useState(false)
  const [activeGoalForLog, setActiveGoalForLog] = useState<any>(null)
  const [logMonth, setLogMonth] = useState("")
  const [logDescription, setLogDescription] = useState("")
  const [logProgress, setLogProgress] = useState(0)
  const [logValue, setLogValue] = useState<number>(0)

  const loadData = async () => {
    try {
        const data = await dataService.getProjectObjectives()
        if (data) setObjectives(data)
        
        // 🛡️ Lógica de Ouro para Edição
        const isStudio = mode === 'studio' || (mode === 'auto' && dataService.isStudioContext());
        const hasPermission = dataService.canEditStrategicInfo();
        
        setCanEdit(isStudio && hasPermission);
    } catch (e) {
        console.warn("ImpactGoals load error:", e);
    }
  }

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [mode])

  // 🛡️ Proteção de Hidratação
  if (!mounted) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1,2,3].map(i => <Card key={i} className="h-64 animate-pulse bg-slate-50 border-slate-100" />)}
        </div>
    )
  }

  const handleSaveObjective = async () => {
    if (editingObj) {
      const { id, title, description, impact, products } = editingObj;
      await dataService.updateProjectObjective(id, { title, description, impact, products });
      setIsEditingObjective(false);
      loadData();
    }
  }

  const handleSaveGoal = async () => {
    if (editingGoal) {
      await dataService.updateProjectObjectiveGoal(editingGoalParentId, editingGoal.id, editingGoal);
      setIsEditingGoal(false);
      loadData();
    }
  }

  const handleAddGoal = async () => {
    if (newGoalDescription.trim()) {
      await dataService.addProjectGoalToObjective(activeTab, {
        description: newGoalDescription,
        progress: 0,
        status: 'planejado',
        targetValue: newGoalTargetValue > 0 ? newGoalTargetValue : undefined,
        unit: newGoalUnit || undefined
      });
      setNewGoalDescription("");
      setNewGoalTargetValue(0);
      setNewGoalUnit("");
      setIsAddingGoal(false);
      loadData();
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm("Deseja realmente remover esta atividade?")) {
      await dataService.deleteProjectGoalFromObjective(activeTab, goalId);
      loadData();
    }
  }

  const handleAddLog = async () => {
    if (logDescription.trim() && logMonth.trim()) {
      await dataService.addProjectGoalLog(activeTab, activeGoalForLog.id, {
        month: logMonth,
        description: logDescription,
        progressPercent: logProgress,
        value: logValue
      });
      setIsLoggingMonth(false);
      setLogDescription("");
      setLogMonth("");
      setLogProgress(0);
      setLogValue(0);
      loadData();
    }
  }

  const handleProgressChange = async (objectiveId: string, goalId: string, newProgress: number) => {
    try {
      await dataService.updateProjectObjectiveProgress(objectiveId, goalId, newProgress)
      // Update local state without full reload for smoothness
      setObjectives(prev => prev.map(obj => {
        if (obj.id === objectiveId) {
          return {
            ...obj,
            goals: (obj.goals || []).map(g => g.id === goalId ? { ...g, progress: newProgress } : g)
          }
        }
        return obj
      }))
    } catch (error) {
      console.error(error)
    }
  }

  if (objectives.length === 0) return null

  return (
    <section className="w-full py-20 bg-background overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
          >
            <Target className="w-3 h-3" />
            Transparência e Resultados
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black italic tracking-tighter text-primary font-headline"
          >
            Objetivos de Impacto
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl text-muted-foreground text-lg leading-relaxed font-medium capitalize"
          >
            Nosso compromisso social traduzido em metas concretas, acompanhado em tempo real pela nossa equipe.
          </motion.p>
        </div>

        <Tabs defaultValue="obj1" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-muted/50 p-2 h-auto gap-2 rounded-2xl border border-border/50 flex-wrap justify-center sm:flex-nowrap">
              {objectives.map((obj) => {
                const Icon = iconMap[obj.iconName]
                return (
                  <TabsTrigger
                    key={obj.id}
                    value={obj.id}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-sm border border-transparent data-[state=active]:border-primary/20"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{obj.title.split(' ')[0]} {obj.id.slice(-1)}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {objectives.map(obj => (
              <TabsContent key={obj.id} value={obj.id} className="mt-0 outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="grid lg:grid-cols-12 gap-8 items-stretch"
                >
                  {/* Left Column: Info */}
                  <div className="lg:col-span-5 flex flex-col space-y-8">
                    <div className="bg-secondary/10 p-10 rounded-[3.5rem] border border-primary/5 h-full flex flex-col shadow-inner">
                      <CardHeader className="p-0 mb-8 flex flex-row items-start justify-between">
                        <div className="w-16 h-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 ring-1 ring-primary/5">
                          {React.createElement(iconMap[obj.iconName] || Target, { className: "w-8 h-8 text-primary" })}
                        </div>
                        {mounted && canEdit && (
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="rounded-full hover:bg-primary/10 text-primary/40 hover:text-primary transition-all"
                             onClick={() => {
                               setEditingObj({...obj});
                               setIsEditingObjective(true);
                             }}
                           >
                             <Edit3 className="w-4 h-4" />
                           </Button>
                        )}
                      </CardHeader>
                      <div className="space-y-2 mb-8">
                        <CardTitle className="text-4xl font-headline italic uppercase tracking-tighter text-primary leading-[0.9]">
                          {obj.title}
                        </CardTitle>
                      </div>
                      <CardContent className="p-0 space-y-6 flex-grow">
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                          {obj.description}
                        </p>

                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
                          <h4 className="font-black text-xs uppercase tracking-widest text-primary/70 flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-primary" />
                             Contribuição Esperada
                          </h4>
                          <p className="italic text-slate-600 font-bold leading-relaxed">
                            "{obj.impact}"
                          </p>
                        </div>
                      </CardContent>
                    </div>
                  </div>

                  {/* Right Column: Progress & Products */}
                  <div className="lg:col-span-7 flex flex-col space-y-8">
                    <Card className="rounded-[2.5rem] border-2 border-primary/5 shadow-xl overflow-hidden shadow-primary/5">
                      <CardHeader className="bg-muted/30 px-8 py-6 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                            Status das Atividades
                          </CardTitle>
                          <CardDescription className="font-medium">Progresso verificado pela coordenação</CardDescription>
                        </div>
                        {mounted && canEdit && (
                          <Button 
                            onClick={() => setIsAddingGoal(true)}
                            className="rounded-xl bg-primary text-white uppercase font-black text-[10px] gap-2"
                          >
                            <Plus className="w-3 h-3" /> Adicionar Atividade
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-8 space-y-10">
                        {(obj.goals || []).length > 0 ? (
                          (obj.goals || []).map((goal) => (
                            <div key={goal.id} className="space-y-4">
                              <div className="flex justify-between items-start group/goaldesc">
                                <div className="flex flex-col gap-2 max-w-[80%]">
                                  <div className="flex items-center gap-2">
                                    {goal.status && (
                                      <Badge 
                                        variant="outline" 
                                        className={cn("text-[9px] font-black uppercase py-0 px-2 rounded-full border h-5 flex items-center shrink-0", statusConfig[goal.status as keyof typeof statusConfig]?.color)}
                                      >
                                        {statusConfig[goal.status as keyof typeof statusConfig]?.label}
                                      </Badge>
                                    )}
                                    <span className="font-bold text-slate-700 leading-snug">
                                      {goal.description}
                                    </span>
                                  </div>
                                  {mounted && canEdit && (
                                    <div className="flex items-center gap-3">
                                      <button 
                                        className="text-[9px] font-black uppercase text-primary/40 hover:text-primary transition-colors flex items-center gap-1 opacity-0 group-hover/goaldesc:opacity-100"
                                        onClick={() => {
                                          setEditingGoal({...goal});
                                          setEditingGoalParentId(obj.id);
                                          setIsEditingGoal(true);
                                        }}
                                      >
                                        <Edit3 className="w-2.5 h-2.5" /> Editar
                                      </button>
                                      <button 
                                        className="text-[9px] font-black uppercase text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-1 opacity-0 group-hover/goaldesc:opacity-100"
                                        onClick={() => handleDeleteGoal(goal.id)}
                                      >
                                        <Trash2 className="w-2.5 h-2.5" /> Excluir
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-black text-primary italic text-xl">
                                    {goal.progress}%
                                  </span>
                                  {goal.targetValue && (
                                     <span className="text-[10px] font-bold text-slate-400">
                                        {goal.logs?.reduce((acc: number, l: any) => acc + (l.value || 0), 0)} / {goal.targetValue} {goal.unit}
                                     </span>
                                  )}
                                  {goal.logs && goal.logs.length > 0 && (
                                    <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <FileCheck className="w-2 h-2" /> {goal.logs.length} registros
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="relative pt-2">
                                 <Progress value={goal.progress} className="h-4 rounded-full bg-slate-100 shadow-inner group-hover/goal:scale-[1.01] transition-transform" />
                                 
                                 {/* Administrative Control Mode */}
                                 {mounted && canEdit && (
                                   <div className="mt-4 flex items-center gap-2">
                                      <Button 
                                        variant="outline"
                                        onClick={() => {
                                          setActiveGoalForLog(goal);
                                          setIsLoggingMonth(true);
                                        }}
                                        className="rounded-xl border-dashed border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 text-[9px] font-black uppercase tracking-widest h-8 px-4 flex items-center gap-2 transition-all flex-grow justify-start"
                                      >
                                        <Plus className="w-3 h-3" /> Registrar Execução Mensal
                                      </Button>
                                      <Button 
                                        variant="ghost"
                                        onClick={() => {
                                          setActiveGoalForLog(goal);
                                          setIsLoggingMonth(true);
                                        }}
                                        className="rounded-xl text-slate-400 hover:text-primary text-[9px] font-black uppercase tracking-widest h-8 px-4 flex items-center gap-2 transition-all"
                                      >
                                        <History className="w-3 h-3" /> Histórico
                                      </Button>
                                   </div>
                                 )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center space-y-4 opacity-50 border-2 border-dashed border-primary/10 rounded-[2rem]">
                             <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-primary/40" />
                             </div>
                             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhuma atividade registrada para este pilar.</p>
                             {mounted && canEdit && (
                               <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsAddingGoal(true)}
                                  className="rounded-xl font-black uppercase text-[10px] tracking-widest"
                               >
                                  <Plus className="w-3 h-3 mr-2" /> Começar Agora
                               </Button>
                             )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="grid sm:grid-cols-2 gap-6">
                       <Card className="rounded-3xl border-2 border-primary/5">
                          <CardHeader className="px-6 py-4 border-b border-primary/5">
                            <h4 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Produtos Entregáveis
                            </h4>
                          </CardHeader>
                          <CardContent className="p-6">
                             <ul className="space-y-3">
                                {(obj.products || []).map((product, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm font-bold text-muted-foreground/80 lowercase">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                    {product}
                                  </li>
                                ))}
                             </ul>
                          </CardContent>
                       </Card>

                       <div className="bg-primary p-8 rounded-3xl text-white flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10">
                            <h4 className="font-black italic text-xl mb-2">Próximos Passos</h4>
                            <p className="text-white/80 text-sm font-medium leading-relaxed">
                              Acompanhe os bastidores desta iniciativa e veja o impacto real em nossas comunidades.
                            </p>
                          </div>
                          <div className="relative z-10 flex items-center justify-between mt-6">
                            <Badge variant="outline" className="text-white border-white/20 px-3 py-1 bg-white/5 rounded-full font-bold">Ver Bastidores</Badge>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        {/* Global Stats bar at the bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12"
        >
          {(() => {
            const stats = dataService.getStrategicImpactStats();
            return [
              { label: 'Municípios', value: stats.municipalities, icon: Target },
              { label: 'Comunidades', value: stats.communities, icon: Users },
              { label: 'Pesquisadores', value: stats.researchers, icon: Award },
              { label: 'Inovações', value: stats.innovations, icon: FlaskConical },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <span className="text-4xl font-black italic tracking-tighter text-primary">{stat.value}</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
            ));
          })()}
        </motion.div>
      </div>

      {/* MODAL: EDITAR OBJETIVO ESTRATÉGICO */}
      <Dialog open={isEditingObjective} onOpenChange={setIsEditingObjective}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline italic uppercase tracking-tighter text-primary">Editar Pilar Estratégico</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Objetivo</label>
              <Input 
                value={editingObj?.title} 
                onChange={(e) => setEditingObj({...editingObj, title: e.target.value})}
                className="rounded-xl border-slate-200 font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição Institucional</label>
              <Textarea 
                value={editingObj?.description} 
                onChange={(e) => setEditingObj({...editingObj, description: e.target.value})}
                className="rounded-2xl border-slate-200 font-medium min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Declaração de Impacto</label>
              <Textarea 
                value={editingObj?.impact} 
                onChange={(e) => setEditingObj({...editingObj, impact: e.target.value})}
                className="rounded-2xl border-slate-200 font-medium min-h-[80px] italic"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Produtos Entregáveis (Um por linha)</label>
              <Textarea 
                value={editingObj?.products.join('\n')} 
                onChange={(e) => setEditingObj({...editingObj, products: e.target.value.split('\n')})}
                className="rounded-2xl border-slate-200 font-medium min-h-[120px]"
                placeholder="Ex: Oficinas técnicas&#10;Relatórios de campo"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditingObjective(false)} className="rounded-xl uppercase font-black text-[10px]">Cancelar</Button>
            <Button onClick={handleSaveObjective} className="rounded-xl bg-primary uppercase font-black text-[10px]">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: EDITAR META INDIVIDUAL */}
      <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Editar Meta Específica</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status da Atividade</label>
              <Select 
                value={editingGoal?.status} 
                onValueChange={(val: any) => setEditingGoal({...editingGoal, status: val})}
              >
                <SelectTrigger className="w-full rounded-xl border-slate-200 font-bold">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="font-bold uppercase text-[10px] tracking-widest">
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição da Meta</label>
              <Textarea 
                value={editingGoal?.description} 
                onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                className="rounded-2xl border-slate-200 font-bold min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Numérica (Opcional)</label>
                <Input 
                  type="number"
                  placeholder="Ex: 13"
                  value={editingGoal?.targetValue || 0}
                  onChange={(e) => setEditingGoal({...editingGoal, targetValue: parseInt(e.target.value) || 0})}
                  className="rounded-xl border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unidade (Ex: Municípios)</label>
                <Input 
                  placeholder="Ex: Municípios"
                  value={editingGoal?.unit || ""}
                  onChange={(e) => setEditingGoal({...editingGoal, unit: e.target.value})}
                  className="rounded-xl border-slate-200 font-bold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progresso Atual (%)</label>
                <span className="text-sm font-black text-primary">{editingGoal?.progress}%</span>
              </div>
              {!editingGoal?.targetValue && (
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={editingGoal?.progress || 0}
                  onChange={(e) => setEditingGoal({...editingGoal, progress: parseInt(e.target.value)})}
                  className="w-full accent-primary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              )}
              {editingGoal?.targetValue > 0 && (
                <p className="text-[10px] text-slate-400 italic">O progresso será calculado automaticamente com base nos registros de cada mês.</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditingGoal(false)} className="rounded-xl uppercase font-black text-[10px]">Descartar</Button>
            <Button onClick={handleSaveGoal} className="rounded-xl bg-slate-950 text-white uppercase font-black text-[10px]">Confirmar Edição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADICIONAR NOVA ATIVIDADE */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Nova Atividade Estratégica</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição da Atividade</label>
              <Textarea 
                placeholder="Ex: Realização de oficinas de biocombustíveis..."
                value={newGoalDescription} 
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="rounded-2xl border-slate-200 font-bold min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Numérica (Opcional)</label>
                <Input 
                  type="number"
                  placeholder="Ex: 13"
                  value={newGoalTargetValue} 
                  onChange={(e) => setNewGoalTargetValue(parseInt(e.target.value) || 0)}
                  className="rounded-xl border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unidade (Ex: Municípios)</label>
                <Input 
                  placeholder="Ex: Municípios"
                  value={newGoalUnit} 
                  onChange={(e) => setNewGoalUnit(e.target.value)}
                  className="rounded-xl border-slate-200 font-bold"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsAddingGoal(false)} className="rounded-xl uppercase font-black text-[10px]">Cancelar</Button>
            <Button onClick={handleAddGoal} className="rounded-xl bg-primary text-white uppercase font-black text-[10px]">Criar Atividade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: REGISTRO E HISTÓRICO MENSAL */}
      <Dialog open={isLoggingMonth} onOpenChange={setIsLoggingMonth}>
        <DialogContent className="rounded-[3rem] border-none shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter text-primary">Histórico de Execução</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-8">
            {/* Seção de Novo Registro */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Plus className="w-3 h-3 text-primary" /> Registrar Nova Evidência
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mês de Referência</label>
                  <Input 
                    placeholder="Ex: Maio 2026" 
                    value={logMonth}
                    onChange={(e) => setLogMonth(e.target.value)}
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {activeGoalForLog?.targetValue ? `Quantidade (${activeGoalForLog.unit})` : 'Progresso Contribuído (%)'}
                  </label>
                  <Input 
                    type="number"
                    placeholder={activeGoalForLog?.targetValue ? "Valor absoluto" : "Subida no total"} 
                    value={activeGoalForLog?.targetValue ? logValue : logProgress}
                    onChange={(e) => activeGoalForLog?.targetValue 
                      ? setLogValue(parseFloat(e.target.value) || 0) 
                      : setLogProgress(parseInt(e.target.value) || 0)}
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição da Realização</label>
                <Textarea 
                  placeholder="Descreva o que foi feito neste período..."
                  value={logDescription}
                  onChange={(e) => setLogDescription(e.target.value)}
                  className="rounded-xl border-slate-200 font-bold min-h-[80px]"
                />
              </div>
              <Button onClick={handleAddLog} className="w-full rounded-xl bg-slate-900 text-white uppercase font-black text-[10px]">
                Validar e Registrar
              </Button>
            </div>

            {/* Listagem de registros anteriores */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
                <History className="w-3 h-3 text-primary" /> Linha do Tempo de Realizações
              </h4>
              
              <div className="space-y-3">
                {activeGoalForLog?.logs && activeGoalForLog.logs.length > 0 ? (
                  activeGoalForLog.logs.map((log: any) => (
                    <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-[10px] uppercase tracking-tighter text-slate-800">{log.month}</span>
                          <Badge className="text-[9px] font-black bg-primary/10 text-primary border-none">
                            {activeGoalForLog?.targetValue ? `+${log.value} ${activeGoalForLog.unit}` : `+${log.progressPercent}%`}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{log.description}"</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2 opacity-40">
                    <History className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum registro ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLoggingMonth(false)} className="rounded-xl uppercase font-black text-[10px]">Fechar Histórico</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
