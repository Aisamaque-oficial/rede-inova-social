"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  History, 
  ShieldCheck, 
  Navigation, 
  MapPin, 
  CheckCircle,
  Clock,
  LayoutGrid,
  Trash2,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { dataService } from "@/lib/data-service";
import { SectorActivity, Department, ActivityStep } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ActivityTimeline from "@/components/activity-timeline";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RotaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<SectorActivity | null>(null);
  const [loading, setLoading] = useState(true);
  
  const user = dataService.getCurrentUser();
  const isCoordinator = dataService.isCoordinator() || dataService.isBypass();
  const canEdit = isCoordinator || (user?.department === activity?.sectorId);

  useEffect(() => {
    fetchActivity();
  }, [params.id]);

  const fetchActivity = async () => {
    setLoading(true);
    // Usamos um fallback seguro para o setor inicial se o atividade ainda não carregou
    const data = await dataService.getSectorActivities(activity?.sectorId || 'ASCOM');
    const item = data.find(a => a.id === params.id);
    setActivity(item || null);
    setLoading(false);
  };

  const handleAddStep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activity) return;

    const formData = new FormData(e.currentTarget);
    const label = formData.get('label') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as any;

    if (!label) return;

    await dataService.addActivityStep(activity.id, {
      label,
      description,
      status,
      completed: status === 'concluido',
      userName: user?.name || "Membro do Setor"
    });

    fetchActivity();
    (e.target as HTMLFormElement).reset();
  };

  const handleStatusChange = async (status: SectorActivity['status']) => {
    if (!activity) return;
    await dataService.updateActivityStatus(activity.id, status);
    fetchActivity();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
         <div className="h-12 w-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
         <AlertTriangle size={64} className="text-amber-500" />
         <h2 className="text-2xl font-headline uppercase italic tracking-tighter">Atividade não encontrada</h2>
         <Button onClick={() => router.back()} className="rounded-2xl">Voltar para a Lista</Button>
      </div>
    );
  }

  const steps = activity.steps || [];
  const doneSteps = steps.filter((s: any) => s.status === 'concluido').length;
  const progress = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Detail Header */}
      <section className="relative p-12 rounded-[4rem] bg-slate-950 text-white shadow-2xl border border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <LayoutGrid size={800} className="stroke-white/10" />
        </div>
        
        <div className="relative z-10 space-y-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/rotas')}
                className="w-fit h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-6"
              >
                  <ArrowLeft size={16} className="mr-2" /> Voltar ao Painel
              </Button>
              <div className="flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl">
                 <ShieldCheck size={16} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Monitoramento Ativo</span>
              </div>
           </div>

           <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
              <div className="space-y-6 flex-1">
                 <div className="flex flex-wrap gap-3 items-center">
                    <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">
                       {dataService.getSectorSigla(activity.sectorId)}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white/40 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">
                       ID: {activity.id}
                    </Badge>
                 </div>
                 <h1 className="text-7xl font-headline uppercase italic tracking-tighter leading-tight max-w-4xl">
                    {activity.title}
                 </h1>
                 <div className="flex items-center gap-6 text-[11px] font-medium text-white/40 italic">
                    <span className="flex items-center gap-2"><Calendar size={14} /> Criado em {new Date(activity.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><MapPin size={14} /> {dataService.getSectorName(activity.sectorId)}</span>
                 </div>
              </div>

              <div className="w-full lg:w-80 p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl space-y-6">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Execução Global</p>
                       <p className="text-5xl font-headline uppercase italic tracking-tighter text-white leading-none">{progress}%</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                       <History size={28} />
                    </div>
                 </div>
                 <Progress value={progress} className="h-2 rounded-full bg-white/5" />
                 <p className="text-[10px] font-medium text-white/20 italic text-center">
                    {doneSteps} de {steps.length} passos concluídos
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Rota Visualization & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-2">
         {/* Left Side: Timeline */}
         <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-6">
               <h3 className="text-2xl font-headline uppercase italic tracking-tighter text-slate-800 flex items-center gap-4">
                  Trilha de Execução <Navigation size={24} className="text-primary" />
               </h3>
               {canEdit && (
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.15em] text-[10px] h-11 px-8 shadow-xl">
                           <Plus size={16} className="mr-2" /> Registrar Marco
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="rounded-[2.5rem] p-10">
                        <DialogHeader>
                           <DialogTitle className="text-2xl font-headline uppercase italic tracking-tight">Novo Marco na Rota</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddStep} className="space-y-6 pt-6">
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Passo</Label>
                              <Input name="label" placeholder="Ex: Enviar arquivo para revisão" className="h-14 rounded-xl border-slate-100" />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observações (Opcional)</Label>
                              <Textarea name="description" placeholder="Detalhes sobre este marco..." className="rounded-xl border-slate-100 min-h-[100px]" />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Inicial</Label>
                              <select name="status" className="w-full h-14 rounded-xl border border-slate-100 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none">
                                 <option value="pendente">Previsto</option>
                                 <option value="em_progresso">Em Andamento</option>
                                 <option value="concluido">Concluído</option>
                              </select>
                           </div>
                           <DialogFooter>
                              <Button type="submit" className="w-full h-14 rounded-xl font-black uppercase tracking-widest bg-primary text-slate-950 shadow-xl shadow-primary/20">Registrar Passo</Button>
                           </DialogFooter>
                        </form>
                     </DialogContent>
                  </Dialog>
               )}
            </div>
            
            <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-sm">
               <ActivityTimeline steps={steps} />
            </div>
         </div>

         {/* Right Side: Status & Settings */}
         <div className="lg:col-span-4 space-y-10">
            <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm space-y-8">
               <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Controle da Atividade</h4>
                  <div className="space-y-3">
                     {[
                        { id: 'pendente', label: 'Planejado', icon: Calendar, color: 'bg-slate-50 text-slate-500' },
                        { id: 'em_andamento', label: 'Em Execução', icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-100' },
                        { id: 'concluida', label: 'Finalizado', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-100' }
                     ].map(s => (
                        <button
                           key={s.id}
                           onClick={() => handleStatusChange(s.id as any)}
                           disabled={!canEdit}
                           className={cn(
                              "w-full h-16 rounded-2xl flex items-center justify-between px-6 transition-all border border-transparent",
                              activity.status === s.id ? s.color + " ring-2 border-current shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100",
                              !canEdit && "opacity-50 cursor-not-allowed"
                           )}
                        >
                           <div className="flex items-center gap-3">
                              <s.icon size={20} />
                              <span className="font-black text-[10px] uppercase tracking-widest">{s.label}</span>
                           </div>
                           {activity.status === s.id && <CheckCircle size={16} />}
                        </button>
                     ))}
                  </div>
               </div>

               {canEdit && (
                  <div className="pt-8 border-t border-slate-50 space-y-4">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 text-center">Zona Crítica</p>
                     <Button 
                        variant="destructive" 
                        onClick={() => {
                           if (confirm("Excluir esta atividade removerá todo o histórico de rota. Deseja prosseguir?")) {
                              dataService.deleteSectorActivity(activity.id);
                              router.push('/rotas');
                           }
                        }}
                        className="w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest border-red-100 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-all"
                     >
                        <Trash2 size={16} className="mr-2" /> Excluir Atividade Permanentemente
                     </Button>
                  </div>
               )}
            </div>

            <div className="p-10 rounded-[3.5rem] bg-indigo-50/50 border border-indigo-100 space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 italic">
                  <ArrowLeft size={12} className="rotate-90" /> Dica de Produtividade
               </h4>
               <p className="text-[11px] font-medium text-indigo-900/60 leading-relaxed italic">
                  Manter a rota atualizada permite que a coordenação visualize o progresso do setor em tempo real. Cada marco registrado gera um log de histórico para o relatório anual de atividades.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
