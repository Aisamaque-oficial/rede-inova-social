"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { StrategicPlanMonth } from "@/lib/mock-data";
import { SectorSignageHeader } from "@/components/sector-operational-components";
import { 
  CheckCircle2, 
  Plus, 
  FileText, 
  History, 
  TrendingUp,
  X,
  Calendar,
  Edit2,
  Save,
  Trash2,
  PlusCircle,
  ChevronLeft,
  Printer,
  LayoutGrid
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function MonthDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [month, setMonth] = useState<StrategicPlanMonth | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempMonth, setTempMonth] = useState<StrategicPlanMonth | null>(null);
  const [loading, setLoading] = useState(true);

  const user = dataService.getCurrentUser();
  const isCoordinator = dataService.isCoordinator() || dataService.isBypass();

  useEffect(() => {
    const fetchMonth = async () => {
      const allPlans = await dataService.getPlanningBySector('ALL');
      const found = allPlans.find(m => m.id === id);
      if (found) {
        setMonth(found);
        setTempMonth(JSON.parse(JSON.stringify(found)));
      }
      setLoading(false);
    };
    fetchMonth();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando detalhes do planejamento...</div>;
  if (!month || !tempMonth) return <div className="h-screen flex items-center justify-center text-slate-400 uppercase font-black tracking-widest">Planejamento não encontrado.</div>;

  // Permissão: Coordenador Geral ou Coordenador Setorial (para meses ALL ou seu próprio setor)
  const isEditable = isCoordinator || (!!user && (month.sector === 'ALL' || user.department === month.sector));

  const pendingTasks = month.tasks.filter(t => !t.completed);
  const completedTasks = month.tasks.filter(t => t.completed);
  const progress = Math.round((completedTasks.length / (month.tasks.length || 1)) * 100);

  const handleSave = async () => {
    if (tempMonth) {
      await dataService.updatePlanningMonth(month.id, tempMonth);
      setMonth(tempMonth);
      setIsEditing(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (isEditing) return;
    await dataService.togglePlanningTask(month.id, taskId);
    // Refresh local state
    const allPlans = await dataService.getPlanningBySector('ALL');
    const found = allPlans.find(m => m.id === id);
    if (found) {
      setMonth(found);
      setTempMonth(JSON.parse(JSON.stringify(found)));
    }
  };

  // Mock sector for header
  const currentSector = {
    id: month.sector.toLowerCase(),
    name: month.sector === 'ALL' ? 'Planejamento Global' : `Setor ${month.sector}`,
    sigla: month.sector,
    color: 'primary',
    icon: 'Calendar',
    description: 'Acompanhamento detalhado de metas e entregas mensais.'
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="rounded-full h-10 w-10 p-0 hover:bg-slate-100"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">
          Detalhes do Mês
        </h1>
      </div>

      <SectorSignageHeader 
        sector={currentSector as any}
        members={[]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Stats & Header Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-10 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <Badge className="bg-white/10 text-white/50 border-white/5 text-[10px] font-black uppercase tracking-widest px-5 py-2 h-auto">
                RELATÓRIO MENSAL — {month.sector}
              </Badge>
              
              <div className="space-y-3">
                {isEditing ? (
                  <Input 
                    value={tempMonth.monthName}
                    onChange={(e) => setTempMonth({ ...tempMonth, monthName: e.target.value })}
                    className="text-2xl font-headline uppercase italic tracking-tighter bg-white/5 border-white/10 text-white h-auto py-3 focus-visible:ring-primary rounded-2xl"
                  />
                ) : (
                  <h2 className="text-4xl font-headline uppercase italic tracking-tighter leading-[0.9]">
                    {month.monthName}
                  </h2>
                )}
                <p className="text-xs font-medium text-white/40 italic flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> {month.year}
                </p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Atingimento da Rota</span>
                  <span className="text-3xl font-headline uppercase italic text-primary leading-none">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 italic flex items-center gap-3">
               <TrendingUp size={20} className="text-primary" /> Painel de Ações
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Printer size={18} className="mr-3" /> Imprimir Roadmap
              </Button>
              <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all">
                <FileText size={18} className="mr-3" /> Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks Management */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center text-primary">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-800">Metas e Entregas</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoramento e validação de resultados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditable && (
                  <Button 
                    variant={isEditing ? "destructive" : "outline"} 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-full px-8 h-12 text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    {isEditing ? <X className="h-4 w-4 mr-3" /> : <Edit2 className="h-4 w-4 mr-3" />}
                    {isEditing ? "Cancelar Edição" : "Editar Mês"}
                  </Button>
                )}
                {isEditing && (
                  <Button 
                    onClick={handleSave}
                    className="rounded-full px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                  >
                    <Save size={18} className="mr-3" /> Salvar Alterações
                  </Button>
                )}
              </div>
            </div>

            <div className="p-10 space-y-12">
              {/* Add Meta Button */}
              {isEditing && (
                <Button 
                  variant="outline" 
                  className="w-full h-24 rounded-[2.5rem] border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary/50 transition-all group"
                  onClick={() => {
                    const newTask = {
                      id: `task-${Date.now()}`,
                      label: "",
                      responsible: month.sector,
                      status: "pendente" as any,
                      evidence: "",
                      completed: false,
                      sectorId: month.sector.toLowerCase()
                    };
                    setTempMonth({ ...tempMonth, tasks: [...tempMonth.tasks, newTask] });
                  }}
                >
                   <PlusCircle className="mr-4 h-8 w-8 group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-black uppercase tracking-widest">Inserir Nova Atividade Estratégica</span>
                </Button>
              )}

              {/* Tasks List */}
              <div className="space-y-8">
                {tempMonth.tasks.map((task) => (
                  <div key={task.id} className="group relative flex flex-col p-8 rounded-[3rem] bg-white ring-1 ring-slate-100 transition-all hover:shadow-2xl hover:ring-primary/20">
                    <div className="flex items-start gap-8">
                      <div className="pt-2">
                        <Checkbox 
                          id={task.id} 
                          checked={task.completed} 
                          disabled={!isEditable || isEditing}
                          onCheckedChange={() => handleToggleTask(task.id)}
                          className="h-8 w-8 rounded-xl border-2 border-slate-200 transition-all data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                             <Badge className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 h-auto uppercase tracking-widest">
                                {task.responsible || task.sectorId || month.sector}
                             </Badge>
                             <Badge variant="outline" className={cn(
                                "text-[10px] font-bold px-4 py-1.5 h-auto uppercase tracking-widest border-slate-100",
                                task.status === 'atrasada' ? "text-red-500 bg-red-50" :
                                task.status === 'em_andamento' ? "text-blue-500 bg-blue-50" :
                                "text-slate-400 bg-slate-50"
                             )}>
                                {task.status?.replace('_', ' ') || 'pendente'}
                             </Badge>
                          </div>
                          {isEditing && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                const newTasks = tempMonth.tasks.filter(t => t.id !== task.id);
                                setTempMonth({ ...tempMonth, tasks: newTasks });
                              }}
                              className="h-12 w-12 rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                               <Trash2 size={24} />
                            </Button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-5">
                             <Input 
                               value={task.label}
                               onChange={(e) => {
                                 const newTasks = tempMonth.tasks.map(t => t.id === task.id ? { ...t, label: e.target.value } : t);
                                 setTempMonth({ ...tempMonth, tasks: newTasks });
                               }}
                               className="text-xl font-bold h-14 rounded-2xl border-slate-200 focus-visible:ring-primary shadow-inner"
                               placeholder="Descreva a meta..."
                             />
                             <Input 
                               value={task.evidence || ""}
                               onChange={(e) => {
                                 const newTasks = tempMonth.tasks.map(t => t.id === task.id ? { ...t, evidence: e.target.value } : t);
                                 setTempMonth({ ...tempMonth, tasks: newTasks });
                               }}
                               className="text-xs h-12 rounded-xl bg-slate-50 border-transparent focus-visible:ring-primary italic"
                               placeholder="Evidência obrigatória para prestação de contas..."
                             />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <label htmlFor={task.id} className={cn(
                               "text-xl font-bold leading-tight text-slate-800 tracking-tight transition-all block",
                               isEditable ? "cursor-pointer group-hover:text-primary" : "cursor-default",
                               task.completed && "line-through opacity-30 italic"
                            )}>
                               {task.label}
                            </label>
                            {task.evidence && (
                               <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 w-fit max-w-full">
                                  <FileText size={20} className="text-primary shrink-0" />
                                  <div className="min-w-0">
                                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Evidência de Entrega</p>
                                     <p className="text-sm font-medium text-slate-600 italic truncate">{task.evidence}</p>
                                  </div>
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {tempMonth.tasks.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-6 opacity-30">
                  <Calendar size={64} className="text-slate-300" />
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Nenhuma meta definida para este mês</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
