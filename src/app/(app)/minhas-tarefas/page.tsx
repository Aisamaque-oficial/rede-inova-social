
"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  FileText,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";
import { TaskDetailsModal } from "@/components/task-details-modal";

export default function MinhasTarefasPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<ProjectTask | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await dataService.getTasks();
      setTasks(data);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  const refreshTasks = async () => {
    const data = await dataService.getTasks();
    setTasks(data);
  };

  const handleComplete = async (taskId: string) => {
    if (!report.trim()) {
      toast({
        title: "⚠️ Relato Obrigatório",
        description: "Por favor, descreva as atividades realizadas antes de concluir.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dataService.completarTarefa(taskId, { report });
      
      // Update local state for immediate feedback
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'concluida', completionReport: report, completedAt: new Date().toISOString() } : t
      ));
      
      setSelectedTaskId(null);
      setReport("");
      
      toast({
        title: "✅ Tarefa Concluída!",
        description: "Seu relato foi enviado e a tarefa marcada como finalizada.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida': return <Badge className="bg-green-100 text-green-700 border-green-200">Concluída</Badge>;
      case 'em_progresso': return <Badge className="bg-blue-100 text-blue-700 border-blue-200 uppercase text-[9px]">Em Progresso</Badge>;
      case 'atrasada': return <Badge className="bg-red-100 text-red-700 border-red-200">Atrasada</Badge>;
      default: return <Badge variant="outline" className="uppercase text-[9px]">Pendente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const tasksPendentes = tasks.filter(t => t.status !== 'concluida');
  const tasksConcluidas = tasks.filter(t => t.status === 'concluida');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Minhas Atribuições
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas responsabilidades e relate o progresso das suas atividades.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* COLUNA DE TAREFAS PENDENTES */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-orange-500" />
            Tarefas em Aberto ({tasksPendentes.length})
          </h2>
          
          {tasksPendentes.length === 0 ? (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mb-4 opacity-20" />
                <p>Você não tem tarefas pendentes no momento.</p>
              </CardContent>
            </Card>
          ) : (
            tasksPendentes.map((task) => (
              <Card key={task.id} className={`transition-all ${selectedTaskId === task.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setViewingTask(task)}>
                      <CardTitle className="text-xl hover:text-primary transition-colors flex items-center gap-2">
                        {task.title}
                        <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Prazo: {format(new Date(task.deadline), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewingTask(task)}
                      className="rounded-full hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground italic text-sm leading-relaxed">
                    "{task.description}"
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-slate-50/50 rounded-b-lg flex flex-col items-stretch gap-4">
                  {selectedTaskId === task.id ? (
                    <div className="space-y-4 py-2 w-full animate-in slide-in-from-top-2">
                      <Label htmlFor="report" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Relato de Conclusão (Obrigatório)
                      </Label>
                      <Textarea
                        id="report"
                        placeholder="Descreva o que foi realizado, dificuldades encontradas e resultados alcançados..."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        className="bg-white min-h-[120px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleComplete(task.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Relato e Concluir
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedTaskId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setReport("");
                      }}
                    >
                      <span>Finalizar esta tarefa</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* COLUNA DE HISTÓRICO / CONCLUÍDAS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Histórico Recent ({tasksConcluidas.length})
          </h2>
          
          <div className="space-y-4">
            {tasksConcluidas.map((task) => (
              <Card key={task.id} className="opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all border-l-4 border-l-green-500">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs">
                   <p className="line-clamp-2 text-muted-foreground mb-2 italic">
                     {task.completionReport || "Concluída sem relato detalhado."}
                   </p>
                   <div className="flex justify-between items-center text-[10px] font-bold text-green-600">
                     <span>CONCLUÍDA EM</span>
                     <span>{task.completedAt ? format(new Date(task.completedAt), "dd/MM/yyyy") : "-"}</span>
                   </div>
                </CardContent>
              </Card>
            ))}
            
            {tasksConcluidas.length === 0 && (
              <p className="text-sm text-center text-muted-foreground py-8 italic">
                Nenhuma tarefa concluída neste período.
              </p>
            )}
          </div>
        </div>
      </div>

      {viewingTask && (
        <TaskDetailsModal 
          task={viewingTask}
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          onUpdate={refreshTasks}
        />
      )}
    </div>
  );
}
