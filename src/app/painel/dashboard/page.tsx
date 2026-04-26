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
 * 🏢 DASHBOARD ADMINISTRATIVO
 * Ponto central de gestão institucional da Rede Inova Social.
 * Caminho: /painel/dashboard
 */
export default function PainelDashboardPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
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

  const overdueTasks = typeof dataService.getOverdueTasks === 'function' 
    ? dataService.getOverdueTasks(currentUser?.id || undefined) 
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
        className="max-w-7xl mx-auto space-y-12 pb-20"
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/painel/relatorio-acessos">
          <Card className="p-8 bg-primary text-slate-950 border-none rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl shadow-primary/20 group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <Activity className="w-24 h-24" />
             </div>
             <div className="relative z-10">
                <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
                    <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight">Monitor de<br/>Acessos Ativos</h3>
                <p className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-widest italic group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    Ver Atividade em Tempo Real <ArrowRight className="w-3 h-3" />
                </p>
             </div>
          </Card>
        </Link>

        <Link href="/gerenciar/usuarios">
          <Card className="p-8 bg-slate-900 text-white border-none rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer shadow-xl group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Users className="w-24 h-24 text-primary" />
             </div>
             <div className="relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6">
                    <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight text-white">Gestão da<br/>Equipe Técnica</h3>
                <p className="text-[10px] font-bold opacity-40 mt-2 uppercase tracking-widest italic group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-primary">
                    Acessar Base de Membros <ArrowRight className="w-3 h-3" />
                </p>
             </div>
          </Card>
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {/* 🚩 TAREFAS CRÍTICAS */}
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-red-600 flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full w-fit">
                    <AlertTriangle className="w-4 h-4" /> Tarefas com Atraso Crítico
                </h2>
                {overdueTasks.length > 0 && (
                    <span className="text-[10px] font-black text-red-600 uppercase bg-red-100 px-3 py-1 rounded-full animate-pulse">
                        {overdueTasks.length} alertas ativos
                    </span>
                )}
            </div>
            
            <div className="grid gap-4">
                {overdueTasks.length > 0 ? (
                    overdueTasks.map(task => (
                        <OperationalTaskCard key={task.id} task={task} isOverdue />
                    ))
                ) : (
                    <div className="p-16 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4 opacity-50" />
                        <h4 className="text-slate-800 font-black uppercase italic mb-1">Tudo em Ordem</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhuma tarefa institucional pendente de prazo.</p>
                    </div>
                )}
            </div>
        </section>

        {/* 🌊 FLUXO DE PRODUÇÃO */}
        <section className="space-y-8 bg-white/40 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-800 italic">Produção Institucional</h2>
                <div className="h-1 w-20 bg-primary/20 rounded-full" />
            </div>
            <WorkflowPipeline tasks={tasks} />
        </section>
      </div>
    </motion.div>
  );
}
