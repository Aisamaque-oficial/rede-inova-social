"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Search, 
  Filter, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { TaskDetailsModal } from "@/components/task-details-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MinhasDemandasPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sessao = dataService.obterSessaoAtual();
      if (!sessao) return;
      
      const data = await dataService.getTasksRequestedBy(sessao.userId);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar demandas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.sector.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'concluida': 
        return { label: 'Concluída', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle2 };
      case 'atrasada': 
        return { label: 'Atrasada', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle };
      case 'em_progresso': 
        return { label: 'Em Progresso', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      default: 
        return { label: 'Pendente', color: 'text-slate-500 bg-slate-50 border-slate-200', icon: Clock };
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 leading-none">
                Minhas <span className="text-primary">Demandas</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Rastreamento informacional de solicitações enviadas a outros setores
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Pesquisar por título ou setor..." 
              className="pl-12 h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-primary/20 font-medium"
              value={search}
              onChange={(e) => setSearch(e)}
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando solicitações...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-40 space-y-6 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm mx-auto">
            <Send className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400">Nenhuma demanda encontrada</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
              Você ainda não atribuiu tarefas para outros setores ou sua busca não retornou resultados.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => {
              const status = getStatusInfo(task.status);
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5", status.color)}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter opacity-50 px-2 py-0.5 rounded-lg">
                      {task.priority || 'NORMAL'}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-black italic tracking-tighter uppercase text-slate-800 leading-tight group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
                      "{task.description}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Setor Destino</p>
                        <p className="text-xs font-black text-primary uppercase tracking-tighter">{task.sector}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Prazo</p>
                        <p className="text-xs font-bold text-slate-700">{task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                       <div className="flex -space-x-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                              <History className="w-3 h-3 text-slate-400" />
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center">
                             <span className="text-[8px] font-black text-primary">+{task.history?.length || 0}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-primary font-black uppercase italic text-[10px] tracking-tighter group-hover:translate-x-1 transition-transform">
                          Ver Detalhes
                          <ArrowRight className="w-3 h-3" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
