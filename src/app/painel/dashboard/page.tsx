"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { 
    LayoutDashboard,
    Clock,
    Activity,
    Zap,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { OperationalTaskCard } from "@/components/operational-task-card";
import { WorkflowPipeline } from "@/components/workflow-pipeline";
import Link from "next/link";

/**
 * 🏢 NOVO DASHBOARD ADMINISTRATIVO
 * Este é o ponto central de gestão institucional da Rede Inova Social.
 * Caminho: /painel/dashboard
 */
export default function PainelDashboardPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  // 🛡️ Prevenção de Hydration Mismatch
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = dataService.getCurrentUser();
  
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const loadData = async () => {
        try {
            const tasksData = await dataService.getTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  // 🛡️ Função utilitária para formatação segura de datas (evita RangeError)
  const formatSafeTime = (timestamp: any) => {
    if (!timestamp) return "--:--";
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "--:--";
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return "--:--"; }
  };

  const myTasks = tasks.filter(t => t.assignedToId === currentUser?.id && t.status !== 'concluida');
  
  const overdueTasks = typeof dataService.getOverdueTasks === 'function' 
    ? dataService.getOverdueTasks(currentUser?.id || undefined) 
    : [];
    
  const todayTasks = typeof dataService.getTasksDueToday === 'function' 
    ? dataService.getTasksDueToday(currentUser?.id || undefined) 
    : [];

  if (loading || !mounted) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
             <div className="relative">
                <LayoutDashboard className="w-12 h-12 text-slate-100 animate-pulse" />
                <Activity className="w-6 h-6 text-primary animate-spin absolute bottom-0 right-0" />
             </div>
        </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8 pb-20"
    >
      <div className="space-y-2">
         <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-800">
            Painel <span className="text-primary">Administrativo</span>
         </h1>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Coordenação Geral do Projeto • {currentUser?.name}
         </p>
      </div>

      {/* 🚀 QUICK ACTIONS - ACESSO RÁPIDO */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/planejamento/relatorio-acessos">
          <Card className="p-6 bg-primary text-slate-950 border-none rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl shadow-primary/20 group border-b-4 border-slate-900/10">
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                    <Activity className="w-6 h-6" />
                </div>
                <Zap className="w-4 h-4 opacity-40" />
             </div>
             <h3 className="text-sm font-black uppercase tracking-tight leading-tight">Relatório de<br/>Acessos Ativos</h3>
             <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest italic group-hover:translate-x-1 transition-transform">Ver agora →</p>
          </Card>
        </Link>

        <Link href="/gerenciar/usuarios">
          <Card className="p-6 bg-slate-900 text-white border-none rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl group">
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-primary" />
                </div>
                <Clock className="w-4 h-4 opacity-40 text-primary" />
             </div>
             <h3 className="text-sm font-black uppercase tracking-tight leading-tight">Gerenciar<br/>Equipe e Cargos</h3>
             <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest italic">Acessar base →</p>
          </Card>
        </Link>
      </section>

      <div className="space-y-4">
        {/* 🚀 QUICK ACTIONS - ACESSO RÁPIDO */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/planejamento/relatorio-acessos">
            <Card className="p-6 bg-primary text-slate-950 border-none rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl shadow-primary/20 group border-b-4 border-slate-900/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight leading-tight">Relatório de<br/>Acessos Ativos</h3>
                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest italic group-hover:translate-x-1 transition-transform">Ver agora →</p>
            </Card>
            </Link>

            <Link href="/gerenciar/usuarios">
            <Card className="p-6 bg-slate-900 text-white border-none rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl group overflow-hidden relative">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight leading-tight relative z-10">Gerenciar<br/>Equipe e Cargos</h3>
                <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest italic relative z-10">Acessar base →</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
            </Card>
            </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Tarefas Críticas
                </h2>
                <div className="grid gap-3">
                    {overdueTasks.length > 0 ? (
                        overdueTasks.map(task => (
                            <OperationalTaskCard key={task.id} task={task} isOverdue />
                        ))
                    ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed">
                            <CheckCircle2 className="w-8 h-8 text-emerald-200 mx-auto mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Nenhuma tarefa atrasada</p>
                        </div>
                    )}
                </div>
            </section>

        <section className="space-y-6 pt-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 italic">Fluxo de Produção</h2>
            <WorkflowPipeline tasks={tasks} />
        </section>
      </div>
    </motion.div>
  );
}
