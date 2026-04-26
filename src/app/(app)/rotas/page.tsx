"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  MoreHorizontal, 
  LayoutGrid, 
  Search, 
  Filter, 
  Activity, 
  Calendar,
  AlertCircle,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Map,
  Layers,
  Settings2
} from "lucide-react";
import { dataService } from "@/lib/data-service";
import { SectorActivity, Department, ActivityStep } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function RotasPage() {
  const [activities, setActivities] = useState<SectorActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'pendente' | 'em_andamento' | 'concluida'>('all');
  
  const searchParams = useSearchParams();
  const user = dataService.getCurrentUser();
  const role = dataService.getUserRole();
  
  // 1. Identificar o setor ativo (pela URL ou pelo departamento do usuário)
  const sectorParam = searchParams.get('sector') as Department;
  const sector = sectorParam || user?.department || 'ASCOM';
  
  // 2. Refinar Permissões de Edição
  const isGlobalCoordinator = role === 'admin' || role === 'coordinator';
  const isSectorEditor = user?.department === sector && (role === 'member_editor' || role === 'coordinator_internal' || role === 'coordinator_extension');
  const canManage = isGlobalCoordinator || isSectorEditor || dataService.isBypass();

  useEffect(() => {
    fetchActivities();
  }, [sector]);

  const fetchActivities = async () => {
    setLoading(true);
    const data = await dataService.getSectorActivities(sector);
    setActivities(data);
    setLoading(false);
  };

  const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;

    if (!title) return;

    await dataService.addSectorActivity({
      title,
      description: "Nova atividade adicionada via painel de rotas",
      sectorId: sector as any,
      status: 'pendente',
      priority: 'media',
      assignedToId: user?.id || '',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      steps: []
    });

    fetchActivities();
    (e.target as HTMLFormElement).reset();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta atividade da rota?")) return;
    await dataService.deleteSectorActivity(id);
    fetchActivities();
  };

  const filtered = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: activities.length,
    executing: activities.filter(a => a.status === 'em_andamento').length,
    completed: activities.filter(a => a.status === 'concluida').length,
    progress: activities.length > 0 ? Math.round((activities.filter(a => a.status === 'concluida').length / activities.length) * 100) : 0
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Dashboard Styled */}
      <section className="relative overflow-hidden p-12 rounded-[3.5rem] bg-slate-950 text-white shadow-2xl border border-white/5 mx-2">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20 animate-pulse" />
        
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
          <div className="space-y-8 max-w-3xl">
             <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[9px] italic">
                <Navigation size={14} className="text-primary" /> Rota do Setor: {dataService.getSectorSigla(sector)}
             </div>
             <div className="space-y-4">
                <h1 className="text-6xl font-headline uppercase italic tracking-tighter leading-none">
                  Painel de <span className="text-primary">Rotas</span>
                </h1>
                <p className="text-sm font-medium text-white/40 italic leading-relaxed max-w-xl">
                  Gerencie o fluxo de trâmites e atividades operacionais. Membros da {sector} têm autonomia para editar a trilha de execução.
                </p>
             </div>
             
             <div className="flex flex-wrap gap-4 pt-4">
                {canManage && (
                  <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-slate-950 font-black uppercase tracking-widest px-8 shadow-xl shadow-primary/20">
                          <Plus size={18} className="mr-2" /> Nova Atividade
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] border-slate-100 p-8">
                       <DialogHeader>
                          <DialogTitle className="text-2xl font-headline uppercase italic tracking-tight">Nova Atividade na Rota</DialogTitle>
                       </DialogHeader>
                       <form onSubmit={handleAddActivity} className="space-y-6 pt-4">
                          <div className="space-y-2">
                             <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título da Atividade / Procedimento</Label>
                             <Input id="title" name="title" placeholder="Ex: Produzir relatório de mídia" className="h-14 rounded-xl border-slate-100" />
                          </div>
                          <DialogFooter>
                             <Button type="submit" className="w-full h-14 rounded-xl font-black uppercase tracking-widest bg-primary text-slate-950">Confirmar Inserção</Button>
                          </DialogFooter>
                       </form>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest px-8">
                   <Map size={18} className="mr-2" /> Ver Mapa Completo
                </Button>
             </div>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
             <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 min-w-[200px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Executando</p>
                <div className="flex items-end gap-3">
                   <h4 className="text-4xl font-headline italic tracking-tighter text-white leading-none">{stats.executing}</h4>
                   <TrendingUp size={20} className="text-emerald-400 mb-1" />
                </div>
                <Progress value={(stats.executing / stats.total) * 100} className="h-1 bg-white/5 rounded-full" />
             </div>
             <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 min-w-[200px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Taxa de Sucesso</p>
                <div className="flex items-end gap-3">
                   <h4 className="text-4xl font-headline italic tracking-tighter text-white leading-none">{stats.progress}%</h4>
                   <CheckCircle2 size={20} className="text-primary mb-1" />
                </div>
                <Progress value={stats.progress} className="h-1 bg-white/5 rounded-full" />
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <div className="px-6 space-y-8">
        {/* Filters & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center p-1.5 bg-slate-100 rounded-3xl w-fit">
              {[
                { id: 'all', label: 'TUDO' },
                { id: 'pendente', label: 'PLANEJADO' },
                { id: 'em_andamento', label: 'EM EXECUÇÃO' },
                { id: 'concluida', label: 'FINALIZADO' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "px-6 h-10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeTab === t.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t.label}
                </button>
              ))}
           </div>
           
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="BUSCAR ATIVIDADE" 
                className="h-12 pl-12 rounded-2xl bg-white border-slate-100 text-[10px] uppercase font-bold"
              />
           </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <AnimatePresence mode="popLayout">
              {filtered.map((activity, index) => {
                 const stepCount = activity.steps?.length || 0;
                 const doneSteps = (activity.steps || []).filter((s: any) => s.status === 'concluido').length;
                 const progress = stepCount > 0 ? Math.round((doneSteps / stepCount) * 100) : 0;
                 
                 return (
                   <motion.div
                     key={activity.id}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ delay: index * 0.05 }}
                     className="group relative bg-white rounded-[3rem] border border-slate-100 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-default"
                   >
                      <div className="flex items-center justify-between mb-8">
                         <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                            activity.status === 'concluida' ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white"
                         )}>
                            <Activity size={20} />
                         </div>
                         <div className="flex gap-2">
                            {canManage && (
                               <button 
                                 onClick={() => handleDelete(activity.id)}
                                 className="h-10 w-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                            )}
                         </div>
                      </div>

                      <div className="space-y-4 mb-8">
                         <Badge variant="outline" className={cn(
                            "rounded-full px-3 py-1 text-[8px] font-black tracking-widest uppercase border-none",
                            activity.status === 'em_andamento' ? "bg-amber-100 text-amber-700" : 
                            activity.status === 'concluida' ? "bg-emerald-100 text-emerald-700" :
                            "bg-slate-100 text-slate-500"
                         )}>
                            {activity.status.replace('_', ' ')}
                         </Badge>
                         <h3 className="text-xl font-headline uppercase italic tracking-tighter text-slate-800 leading-tight group-hover:text-primary transition-colors">
                            {activity.title}
                         </h3>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Fluxo Executado</span>
                                <span className={cn(activity.status === 'concluida' ? "text-emerald-500" : "text-slate-600")}>{progress}%</span>
                             </div>
                             <Progress value={progress} className="h-1.5 rounded-full bg-slate-100" />
                         </div>

                         <Link href={`/rotas/${activity.id}`}>
                            <Button className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 font-black uppercase tracking-widest text-[9px] group/btn transition-all">
                               Ver Caminho da Rota <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                         </Link>
                      </div>
                   </motion.div>
                 );
              })}
           </AnimatePresence>

           {/* Empty State */}
           {filtered.length === 0 && (
             <div className="col-span-full py-32 flex flex-col items-center gap-6 opacity-40">
                <div className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 text-slate-200">
                   <Layers size={64} />
                </div>
                <div className="text-center space-y-2">
                   <h3 className="text-2xl font-headline uppercase italic tracking-tighter">Nenhuma Rota traçada</h3>
                   <p className="text-xs font-medium italic">Tente mudar o filtro ou adicione uma nova atividade.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
