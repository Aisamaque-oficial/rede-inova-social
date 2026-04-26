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
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OperationalTaskCard } from "@/components/operational-task-card";
import { WorkflowPipeline } from "@/components/workflow-pipeline";

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
